import type { BrowserWindow } from 'electron'
import { streamText } from 'ai'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import type {
  Agent,
  AgentChatChunk,
  AgentChatError,
  AgentChatRequest,
  AgentChatResult,
  BuiltinAgentId,
  AgentToolEvent,
  SwarmMessageKind,
  SwarmMessageVisibility,
} from '@shared/types/agent'
import { createAiSdkModel } from '../services/ai-providers'
import {
  SEARCH_TOOL,
  extractSearchQueryFromPrompt,
  runSearchTool,
} from '../tools/search-tool'
import { ToolExecutor } from '../tools/tool-executor'
import { solaceDatabase } from '../storage/database'
import { profileManager } from '../profile/profile-manager'
import { swarmBus } from '../swarm/swarm-bus'

const BUILTIN_AGENTS: Agent[] = [
  {
    id: 'planner',
    name: 'Planner',
    description: 'Breaks down goals, clarifies tradeoffs, and proposes execution paths.',
    icon: 'route',
  },
  {
    id: 'coder',
    name: 'Coder',
    description: 'Focuses on implementation details, file-level changes, and code structure.',
    icon: 'code',
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Reviews risks, edge cases, regressions, and missing verification.',
    icon: 'shield',
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Focuses on UX clarity, practical interface suggestions, and pragmatic tradeoffs.',
    icon: 'palette',
  },
  {
    id: 'writer',
    name: 'Writer',
    description: 'Focuses on written communication, wording, tone, and output quality.',
    icon: 'auto_stories',
  },
  {
    id: 'philosopher',
    name: 'Philosopher',
    description: 'Raises deeper questions and explores context, assumptions, and alternatives.',
    icon: 'psychology',
  },
]

const AGENT_PROMPTS: Record<BuiltinAgentId, string> = {
  planner: [
    'You are Planner, a concise software planning agent inside the Solace desktop app.',
    'Decompose the user request into practical steps, identify missing context, and keep the plan actionable.',
    'Prefer short structured answers. Do not write implementation code unless the user asks for it.',
  ].join('\n'),
  coder: [
    'You are Coder, an implementation-focused software agent inside the Solace desktop app.',
    'Give concrete code-oriented guidance, call out affected files or APIs, and prefer minimal coherent changes.',
    'When code is useful, provide focused snippets instead of broad rewrites.',
  ].join('\n'),
  reviewer: [
    'You are Reviewer, a code-review and risk-analysis agent inside the Solace desktop app.',
    'Prioritize bugs, regressions, edge cases, missing tests, and unclear assumptions.',
    'Lead with findings and keep summaries brief.',
  ].join('\n'),
  designer: [
    'You are Designer, a practical product and UX thinking agent inside the Solace desktop app.',
    'Focus on clarity, usability, consistency, and feasible implementation direction.',
    'Give direct recommendations that can be actioned quickly.',
  ].join('\n'),
  writer: [
    'You are Writer, a communication-focused agent inside the Solace desktop app.',
    'Prioritize readable structure, tone, and precision in English outputs.',
    'When the user asks for text editing, improve clarity without unnecessary complexity.',
  ].join('\n'),
  philosopher: [
    'You are Philosopher, a reflective reasoning agent inside the Solace desktop app.',
    'Surface assumptions, contradictions, and hidden framing before answering.',
    'Offer alternatives and invite the user to choose the best tradeoff.',
  ].join('\n'),
}

const SWARM_SIGNAL_RULES: Record<
  BuiltinAgentId,
  Array<{ toAgentId: BuiltinAgentId; kind: SwarmMessageKind; visibility: SwarmMessageVisibility }>
> = {
  planner: [
    { toAgentId: 'designer', kind: 'note', visibility: 'internal' },
    { toAgentId: 'reviewer', kind: 'note', visibility: 'internal' },
    { toAgentId: 'philosopher', kind: 'note', visibility: 'internal' },
  ],
  coder: [
    { toAgentId: 'reviewer', kind: 'note', visibility: 'internal' },
    { toAgentId: 'writer', kind: 'note', visibility: 'public' },
  ],
  reviewer: [
    { toAgentId: 'planner', kind: 'note', visibility: 'internal' },
  ],
  designer: [
    { toAgentId: 'writer', kind: 'note', visibility: 'public' },
    { toAgentId: 'philosopher', kind: 'note', visibility: 'internal' },
  ],
  writer: [
    { toAgentId: 'planner', kind: 'note', visibility: 'public' },
  ],
  philosopher: [
    { toAgentId: 'planner', kind: 'note', visibility: 'internal' },
  ],
}

class BuiltinAgentService {
  private window: BrowserWindow | null = null
  private readonly pending = new Map<string, AbortController>()
  private readonly toolExecutor = new ToolExecutor({
    maxConcurrent: 4,
    emitToolEvent: (event) => this.emitToolEvent(event),
  })

  constructor() {
    this.toolExecutor.registerTool(SEARCH_TOOL.name, (query, context) => {
      return runSearchTool(query, context.signal)
    })
  }

  setWindow(win: BrowserWindow) {
    this.window = win
  }

  listAgents(): Agent[] {
    return BUILTIN_AGENTS
  }

  async sendMessage(request: AgentChatRequest): Promise<AgentChatResult> {
    const agent = BUILTIN_AGENTS.find((item) => item.id === request.targetAgentId)
    if (!agent) {
      throw new Error(`Unknown agent: ${request.targetAgentId}`)
    }

    const abortController = new AbortController()
    this.pending.set(request.messageId, abortController)
    let content = ''

    try {
      await solaceDatabase.ensureConversation(request.conversationId)
      await profileManager.recordAgentMessage(agent.id)
      await solaceDatabase.upsertMessage({
        id: request.userMessageId ?? `${request.messageId}-user`,
        conversationId: request.conversationId,
        role: 'user',
        agentId: agent.id,
        content: request.content,
        status: 'complete',
      })
      await solaceDatabase.upsertMessage({
        id: request.messageId,
        conversationId: request.conversationId,
        role: 'assistant',
        agentId: agent.id,
        content: '',
        status: 'streaming',
      })

      const toolContext = request.toolContext ?? await this.runTools({
        conversationId: request.conversationId,
        messageId: request.messageId,
        agentId: agent.id,
        content: request.content,
      })
      const { model } = createAiSdkModel(request.modelConfig)

      const prompt = toolContext
        ? `${toolContext}\n\n${this.buildPrompt(request)}`
        : this.buildPrompt(request)

      const result = streamText({
        model,
        system: AGENT_PROMPTS[agent.id],
        prompt,
        abortSignal: abortController.signal,
      })

      for await (const delta of result.textStream) {
        content += delta
        this.send<AgentChatChunk>(IPC_CHANNELS.agents.streamChunk, {
          conversationId: request.conversationId,
          messageId: request.messageId,
          agentId: agent.id,
          delta,
        })
      }

      const usage = await Promise.resolve(result.usage)
      const finalResult: AgentChatResult = {
        conversationId: request.conversationId,
        messageId: request.messageId,
        agentId: agent.id,
        content,
        usage: {
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
        },
      }

      await solaceDatabase.upsertMessage({
        id: request.messageId,
        conversationId: request.conversationId,
        role: 'assistant',
        agentId: agent.id,
        content,
        status: 'complete',
      })

      this.send<AgentChatResult>(IPC_CHANNELS.agents.messageComplete, finalResult)

      void this.broadcastSwarmSignals({
        conversationId: request.conversationId,
        threadId: request.messageId,
        fromAgentId: agent.id,
        sourceContent: finalResult.content,
      }).catch(() => {})

      return finalResult
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown agent error'
      await solaceDatabase.upsertMessage({
        id: request.messageId,
        conversationId: request.conversationId,
        role: 'assistant',
        agentId: agent.id,
        content: message,
        status: 'error',
      })
      const error: AgentChatError = {
        conversationId: request.conversationId,
        messageId: request.messageId,
        agentId: agent.id,
        code: abortController.signal.aborted ? 'ABORTED' : 'AGENT_ERROR',
        message,
      }
      this.send<AgentChatError>(IPC_CHANNELS.agents.agentError, error)
      throw err
    } finally {
      this.pending.delete(request.messageId)
    }
  }

  private async runTools(params: {
    conversationId: string
    messageId: string
    agentId: BuiltinAgentId
    content: string
  }) {
    const searchQuery = extractSearchQueryFromPrompt(params.content)
    if (!searchQuery) return undefined

    try {
      const result = await this.toolExecutor.execute({
        conversationId: params.conversationId,
        messageId: params.messageId,
        agentId: params.agentId,
        toolName: SEARCH_TOOL.name,
        query: searchQuery,
        signal: this.pending.get(params.messageId)?.signal,
      })
      return `Search result for "${searchQuery}": ${result}`
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Search tool execution failed'
      return `Search result for "${searchQuery}" unavailable: ${message}`
    }
  }

  private emitToolEvent(event: AgentToolEvent) {
    this.send<AgentToolEvent>(IPC_CHANNELS.agents.toolEvent, event)
  }

  private async broadcastSwarmSignals(params: {
    conversationId: string
    threadId: string
    fromAgentId: BuiltinAgentId
    sourceContent: string
  }) {
    const rules = SWARM_SIGNAL_RULES[params.fromAgentId]
    if (!rules.length) return

    for (const rule of rules) {
      await swarmBus.sendMessage({
        conversationId: params.conversationId,
        threadId: `${params.threadId}:${rule.toAgentId}`,
        fromAgentId: params.fromAgentId,
        toAgentId: rule.toAgentId,
        kind: rule.kind,
        visibility: rule.visibility,
        content: this.buildSwarmDigest(params.sourceContent, rule.toAgentId),
        context: `handoff:${params.fromAgentId}->${rule.toAgentId}`,
      })
    }
  }

  private buildSwarmDigest(content: string, targetAgent: BuiltinAgentId) {
    const normalized = content.trim()
    const [firstSentence] = normalized.split(/(?<=[.!?])\s+/g)
    const summarySource = firstSentence || normalized
    const digest = summarySource.length > 120 ? `${summarySource.slice(0, 120)}...` : summarySource
    const trimmed = digest.length > 160 ? `${digest.slice(0, 160)}...` : digest
    return `To ${targetAgent}: ${trimmed}`
  }

  cancelMessage(messageId: string) {
    this.pending.get(messageId)?.abort()
    this.pending.delete(messageId)
  }

  private buildPrompt(request: AgentChatRequest): string {
    const recentHistory = request.history.slice(-8)
    const historyText = recentHistory
      .map((message) => {
        const speaker = message.role === 'assistant' && message.agentId
          ? `assistant:${message.agentId}`
          : message.role
        return `${speaker}: ${message.content}`
      })
      .join('\n\n')

    if (!historyText) {
      return `User request:\n${request.content}`
    }

    return [
      'Recent conversation:',
      historyText,
      '',
      'User request:',
      request.content,
    ].join('\n')
  }

  private send<T>(channel: string, data: T) {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send(channel, data)
    }
  }
}

export const builtinAgentService = new BuiltinAgentService()
