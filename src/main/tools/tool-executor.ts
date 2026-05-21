import type { BuiltinAgentId, AgentToolEvent } from '@shared/types/agent'
import type { ToolName } from '@shared/types/tool'

interface ToolExecutionContext {
  conversationId: string
  messageId: string
  agentId: BuiltinAgentId
  requestId: string
  signal?: AbortSignal
  query: string
}

interface QueuedToolJob {
  id: string
  request: ToolExecutionRequest
  handler: ToolHandler
  resolve: (result: string) => void
  reject: (error: unknown) => void
  signalAbort?: () => void
  settled?: boolean
}

type ToolHandler = (query: string, context: ToolExecutionContext) => Promise<string>

interface ToolExecutionRequest {
  conversationId: string
  messageId: string
  agentId: BuiltinAgentId
  toolName: ToolName
  query: string
  requestId: string
  signal?: AbortSignal
}

interface ToolExecutionInput {
  conversationId: string
  messageId: string
  agentId: BuiltinAgentId
  toolName: ToolName
  query: string
  requestId?: string
  signal?: AbortSignal
}

interface ToolExecutorOptions {
  maxConcurrent?: number
  emitToolEvent: (event: AgentToolEvent) => void
}

export class ToolExecutor {
  private readonly handlers = new Map<ToolName, ToolHandler>()
  private readonly emitToolEvent: (event: AgentToolEvent) => void
  private readonly maxConcurrent: number
  private readonly queue: QueuedToolJob[] = []
  private readonly running = new Set<string>()

  constructor(options: ToolExecutorOptions) {
    this.emitToolEvent = options.emitToolEvent
    this.maxConcurrent = options.maxConcurrent ?? 4
  }

  registerTool(name: ToolName, handler: ToolHandler) {
    this.handlers.set(name, handler)
  }

  execute(request: ToolExecutionInput): Promise<string> {
    const tool = this.handlers.get(request.toolName)
    if (!tool) {
      return Promise.reject(new Error(`Unknown tool: ${request.toolName}`))
    }

    return new Promise<string>((resolve, reject) => {
      const requestId = request.requestId ?? `${request.messageId}-tool-${Date.now()}-${Math.random().toString(16).slice(2)}`
      const jobId = `${request.messageId}-${request.toolName}-${Date.now()}-${Math.random().toString(16).slice(2)}`

      const job: QueuedToolJob = {
        id: jobId,
        request: {
          ...request,
          requestId,
        },
        handler: tool,
        resolve,
        reject,
        settled: false,
      }

      const emitAbortError = (error: Error) => {
        const event: AgentToolEvent = {
          conversationId: job.request.conversationId,
          messageId: job.request.messageId,
          agentId: job.request.agentId,
          requestId,
          toolName: request.toolName,
          status: 'error',
          query: request.query,
          kind: 'tool-error',
          error: error.message,
        }
        this.emitToolEvent(event)
      }

      if (job.request.signal?.aborted) {
        emitAbortError(new Error('Tool execution aborted'))
        reject(new Error('Tool execution aborted'))
        return
      }

      const onAbort = () => {
        if (job.settled) {
          return
        }
        const error = new Error('Tool execution aborted')
        if (this.removeQueuedJob(jobId)) {
          emitAbortError(error)
          job.settled = true
          job.reject(error)
        } else if (this.running.has(jobId)) {
          emitAbortError(error)
          job.settled = true
          job.reject(error)
        }
      }
      request.signal?.addEventListener('abort', onAbort, { once: true })
      job.signalAbort = () => request.signal?.removeEventListener('abort', onAbort)

      this.queue.push(job)
      this.emitToolEvent({
        conversationId: job.request.conversationId,
        messageId: job.request.messageId,
        agentId: job.request.agentId,
        requestId,
        toolName: request.toolName,
        status: 'start',
        query: request.query,
        kind: 'tool-start',
      })
      this.processQueue()
    })
  }

  private processQueue() {
    while (this.running.size < this.maxConcurrent) {
      const job = this.queue.shift()
      if (!job) return

      if (job.request.signal?.aborted) {
        const error = new Error('Tool execution aborted')
        this.emitToolEvent({
          conversationId: job.request.conversationId,
          messageId: job.request.messageId,
          agentId: job.request.agentId,
          requestId: job.request.requestId,
          toolName: job.request.toolName,
          status: 'error',
          query: job.request.query,
          kind: 'tool-error',
          error: error.message,
        })
        job.settled = true
        job.reject(error)
        job.signalAbort?.()
        continue
      }

      this.running.add(job.id)
      void this.runJob(job)
    }
  }

  private async runJob(job: QueuedToolJob) {
    const request = job.request
    try {
      const result = await job.handler(request.query, {
        conversationId: request.conversationId,
        messageId: request.messageId,
        agentId: request.agentId,
        requestId: request.requestId,
        query: request.query,
        signal: request.signal,
      })

      if (job.settled) {
        return
      }
      job.settled = true
      this.emitToolEvent({
        conversationId: request.conversationId,
        messageId: request.messageId,
        agentId: request.agentId,
        requestId: request.requestId,
        toolName: request.toolName,
        status: 'result',
        query: request.query,
        result,
        kind: 'tool-result',
      })
      job.resolve(result)
    } catch (error) {
      if (job.settled) {
        return
      }
      job.settled = true
      const message = error instanceof Error ? error.message : 'Tool execution failed'
      this.emitToolEvent({
        conversationId: request.conversationId,
        messageId: request.messageId,
        agentId: request.agentId,
        requestId: request.requestId,
        toolName: request.toolName,
        status: 'error',
        query: request.query,
        error: message,
        kind: 'tool-error',
      })
      job.reject(error instanceof Error ? error : new Error(message))
    } finally {
      this.running.delete(job.id)
      job.signalAbort?.()
      this.processQueue()
    }
  }

  private removeQueuedJob(jobId: string) {
    const index = this.queue.findIndex((item) => item.id === jobId)
    if (index === -1) return false
    this.queue.splice(index, 1)
    return true
  }
}
