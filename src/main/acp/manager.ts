import { spawn, type ChildProcess } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Readable, Writable } from 'node:stream'
import type { BrowserWindow } from 'electron'
import * as acp from '@agentclientprotocol/sdk'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import type {
  AgentConfig, AgentInfo, AgentStatus, SessionInfo,
  StreamChunk, PromptResult, AgentError,
  PermissionRequest, PermissionResponse,
} from '@shared/types/acp'
import {
  assertPermissionAllowed,
  assertPromptAllowed,
  createAgentSandbox,
  resolveSandboxCwd,
  type AgentSandboxScope,
} from '../security/sandbox'

interface RunningAgent {
  id: string
  config: AgentConfig
  status: AgentStatus
  process: ChildProcess | null
  connection: acp.ClientSideConnection | null
  sessions: Map<string, SessionState>
  sandbox: AgentSandboxScope
  error?: string
}

interface SessionState {
  sessionId: string
  cwd: string
  createdAt: number
}

interface PendingPermission {
  resolve: (value: acp.RequestPermissionResponse) => void
  reject: (reason: Error) => void
  timeout: ReturnType<typeof setTimeout>
}

class AcpManager {
  private agents = new Map<string, RunningAgent>()
  private pendingPermissions = new Map<string, PendingPermission>()
  private window: BrowserWindow | null = null
  private agentCounter = 0
  private readonly PERMISSION_TIMEOUT_MS = 60_000

  setWindow(win: BrowserWindow) {
    this.window = win
  }

  private send<T>(channel: string, data: T) {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send(channel, data)
    }
  }

  private getAgent(agentId: string): RunningAgent {
    const agent = this.agents.get(agentId)
    if (!agent) throw new Error(`Agent not found: ${agentId}`)
    return agent
  }

  // ---- Agent lifecycle ----

  async spawnAgent(config: AgentConfig): Promise<AgentInfo> {
    const agentId = `agent-${++this.agentCounter}`
    const sandbox = createAgentSandbox(config)

    const proc = spawn(sandbox.command, sandbox.args, {
      cwd: sandbox.cwd,
      env: sandbox.env,
      shell: false,
      stdio: ['pipe', 'pipe', 'inherit'],
      windowsHide: true,
    })

    const agent: RunningAgent = {
      id: agentId,
      config: sandbox.config,
      status: 'starting',
      process: proc,
      connection: null,
      sessions: new Map(),
      sandbox,
    }

    proc.on('exit', (code) => {
      if (code !== 0 && agent.status === 'running') {
        agent.status = 'error'
        agent.error = `Agent process exited with code ${code}`
        agent.connection = null
        this.send<AgentError>(IPC_CHANNELS.acp.agentError, {
          agentId,
          code: 'PROCESS_EXIT',
          message: agent.error,
        })
        this.send<AgentInfo>(IPC_CHANNELS.acp.agentStatusChange, this.toAgentInfo(agent))
      }
    })

    proc.on('error', (err) => {
      agent.status = 'error'
      agent.error = err.message
      agent.connection = null
      this.send<AgentError>(IPC_CHANNELS.acp.agentError, {
        agentId,
        code: 'PROCESS_ERROR',
        message: err.message,
      })
      this.send<AgentInfo>(IPC_CHANNELS.acp.agentStatusChange, this.toAgentInfo(agent))
    })

    this.agents.set(agentId, agent)
    this.send<AgentInfo>(IPC_CHANNELS.acp.agentStatusChange, this.toAgentInfo(agent))

    return this.toAgentInfo(agent)
  }

  async initialize(agentId: string): Promise<AgentInfo> {
    const agent = this.getAgent(agentId)
    if (!agent.process || !agent.process.stdin || !agent.process.stdout) {
      throw new Error('Agent process has no stdio pipes')
    }

    const output = Writable.toWeb(agent.process.stdin) as WritableStream<Uint8Array>
    const input = Readable.toWeb(agent.process.stdout) as ReadableStream<Uint8Array>
    const stream = acp.ndJsonStream(output, input)

    const clientHandler: acp.Client = {
      sessionUpdate: (params) => {
        const update = params.update
        switch (update.sessionUpdate) {
          case 'agent_message_chunk':
          case 'user_message_chunk':
          case 'agent_thought_chunk': {
            const chunk = update as { type?: string; text?: string }
            if (chunk.type === 'text' && chunk.text) {
              this.send<StreamChunk>(IPC_CHANNELS.acp.streamChunk, {
                sessionId: params.sessionId,
                type: 'text',
                text: chunk.text,
              })
            }
            break
          }
          case 'tool_call': {
            const toolCall = update as { title?: string; rawInput?: unknown; toolCallId: string }
            this.send<StreamChunk>(IPC_CHANNELS.acp.streamChunk, {
              sessionId: params.sessionId,
              type: 'tool_call',
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.title ?? undefined,
              toolInput: toolCall.rawInput as Record<string, unknown> | undefined,
            })
            break
          }
          case 'tool_call_update': {
            const toolUpdate = update as { toolCallId: string; status?: string; rawOutput?: unknown }
            this.send<StreamChunk>(IPC_CHANNELS.acp.streamChunk, {
              sessionId: params.sessionId,
              type: 'tool_result',
              toolCallId: toolUpdate.toolCallId,
              text: toolUpdate.status ?? (toolUpdate.rawOutput ? String(toolUpdate.rawOutput) : undefined),
            })
            break
          }
          case 'plan': {
            this.send<StreamChunk>(IPC_CHANNELS.acp.streamChunk, {
              sessionId: params.sessionId,
              type: 'plan',
            })
            break
          }
        }
        return Promise.resolve()
      },

      requestPermission: async (params) => {
        const requestId = randomUUID()
        const req: PermissionRequest = {
          requestId,
          agentId,
          sessionId: params.sessionId,
          toolName: params.toolCall?.title ?? 'unknown',
          toolInput: (params.toolCall?.rawInput ?? {}) as Record<string, unknown>,
        }
        const sessionCwd = agent.sessions.get(params.sessionId)?.cwd

        try {
          assertPermissionAllowed(req, agent.sandbox, sessionCwd)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Permission denied by sandbox policy'
          this.send<AgentError>(IPC_CHANNELS.acp.agentError, {
            agentId,
            sessionId: params.sessionId,
            code: 'SANDBOX_VIOLATION',
            message,
          })
          return { outcome: { outcome: 'cancelled' as const } }
        }

        this.send<PermissionRequest>(IPC_CHANNELS.acp.permissionRequest, req)

        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            this.pendingPermissions.delete(requestId)
            resolve({ outcome: { outcome: 'cancelled' as const } })
          }, this.PERMISSION_TIMEOUT_MS)

          this.pendingPermissions.set(requestId, {
            resolve,
            reject,
            timeout,
          })
        })
      },
    }

    const connection = new acp.ClientSideConnection(() => clientHandler, stream)

    await connection.initialize({
      protocolVersion: acp.PROTOCOL_VERSION,
      clientCapabilities: {
        fs: { readTextFile: false, writeTextFile: false },
        terminal: false,
      },
      clientInfo: { name: 'Solace', version: '0.1.0' },
    })

    agent.connection = connection
    agent.status = 'running'
    agent.error = undefined

    this.send<AgentInfo>(IPC_CHANNELS.acp.agentStatusChange, this.toAgentInfo(agent))

    return this.toAgentInfo(agent)
  }

  // ---- Session management ----

  async newSession(agentId: string, cwd: string): Promise<SessionInfo> {
    const agent = this.getAgent(agentId)
    if (agent.status !== 'running' || !agent.connection) {
      throw new Error('Agent is not running')
    }

    const resolvedCwd = resolveSandboxCwd(cwd, agent.sandbox)

    const result = await agent.connection.newSession({ cwd: resolvedCwd, mcpServers: [] })
    const session: SessionState = {
      sessionId: result.sessionId,
      cwd: resolvedCwd,
      createdAt: Date.now(),
    }
    agent.sessions.set(result.sessionId, session)

    return {
      sessionId: result.sessionId,
      agentId,
      cwd: resolvedCwd,
      createdAt: session.createdAt,
    }
  }

  async closeSession(agentId: string, sessionId: string): Promise<void> {
    const agent = this.getAgent(agentId)
    if (!agent.connection) throw new Error('Agent is not connected')

    try {
      await agent.connection.closeSession({ sessionId })
    } catch {
      // Session may already be closed
    }
    agent.sessions.delete(sessionId)
  }

  // ---- Prompt ----

  async sendPrompt(
    agentId: string,
    sessionId: string,
    promptText: string,
  ): Promise<PromptResult> {
    const agent = this.getAgent(agentId)
    if (!agent.connection) throw new Error('Agent is not connected')

    if (!agent.sessions.has(sessionId)) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    assertPromptAllowed(promptText, agent.sandbox)

    const result = await agent.connection.prompt({
      sessionId,
      prompt: [{ type: 'text', text: promptText }],
    })

    const promptResult: PromptResult = {
      sessionId,
      stopReason: result.stopReason,
      usage: result.usage ? {
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
      } : undefined,
    }

    this.send<PromptResult>(IPC_CHANNELS.acp.promptComplete, promptResult)

    return promptResult
  }

  async cancelPrompt(agentId: string): Promise<void> {
    const agent = this.getAgent(agentId)
    if (!agent.connection) throw new Error('Agent is not connected')

    await agent.connection.cancel({ sessionId: '' } as acp.CancelNotification)
  }

  // ---- Permission ----

  respondToPermission(_agentId: string, response: PermissionResponse) {
    const pending = this.pendingPermissions.get(response.requestId)
    if (pending) {
      const outcome: acp.RequestPermissionOutcome = response.allowed
        ? { outcome: 'selected' as const, optionId: '' }
        : { outcome: 'cancelled' as const }
      pending.resolve({ outcome })
      this.pendingPermissions.delete(response.requestId)
    }
  }

  // ---- Cleanup ----

  async killAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId)
    if (!agent) return

    agent.status = 'stopping'
    this.send<AgentInfo>(IPC_CHANNELS.acp.agentStatusChange, this.toAgentInfo(agent))

    if (agent.process && !agent.process.killed) {
      agent.process.kill('SIGTERM')
      setTimeout(() => {
        if (agent.process && !agent.process.killed) {
          agent.process.kill('SIGKILL')
        }
      }, 5000)
    }

    agent.connection = null
    agent.status = 'stopped'
    agent.sessions.clear()
    this.agents.delete(agentId)
  }

  async disposeAll(): Promise<void> {
    for (const agentId of [...this.agents.keys()]) {
      await this.killAgent(agentId)
    }
    this.pendingPermissions.clear()
  }

  // ---- Helpers ----

  private toAgentInfo(agent: RunningAgent): AgentInfo {
    return {
      agentId: agent.id,
      status: agent.status,
      config: agent.config,
      error: agent.error,
    }
  }
}

export const acpManager = new AcpManager()
