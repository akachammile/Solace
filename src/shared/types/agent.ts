import type { AiSdkModelConfig } from './model-provider'
import type { ToolExecutionEvent } from './tool'

export type BuiltinAgentId =
  | 'planner'
  | 'coder'
  | 'reviewer'
  | 'designer'
  | 'writer'
  | 'philosopher'

export type AgentMessageRole = 'user' | 'assistant'

export interface Agent {
  id: BuiltinAgentId
  name: string
  description: string
  icon: string
}

export interface AgentChatMessage {
  role: AgentMessageRole
  content: string
  agentId?: BuiltinAgentId
}

export interface AgentChatRequest {
  conversationId: string
  messageId: string
  userMessageId?: string
  targetAgentId: BuiltinAgentId
  content: string
  history: AgentChatMessage[]
  modelConfig: AiSdkModelConfig
  toolContext?: string
}

export interface AgentTokenUsage {
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
}

export interface AgentChatChunk {
  conversationId: string
  messageId: string
  agentId: BuiltinAgentId
  delta: string
}

export interface AgentChatResult {
  conversationId: string
  messageId: string
  agentId: BuiltinAgentId
  content: string
  usage?: AgentTokenUsage
}

export interface AgentChatError {
  conversationId: string
  messageId: string
  agentId: BuiltinAgentId
  code: 'ABORTED' | 'AGENT_ERROR'
  message: string
}

export type SwarmMessageKind = 'chat' | 'note' | 'handoff'
export type SwarmMessageVisibility = 'public' | 'internal'

export interface SwarmMessageSendRequest {
  conversationId: string
  threadId: string
  fromAgentId: BuiltinAgentId
  toAgentId?: BuiltinAgentId
  kind: SwarmMessageKind
  visibility: SwarmMessageVisibility
  content: string
  context?: string
}

export interface SwarmMessage extends SwarmMessageSendRequest {
  id: string
  createdAt: number
  updatedAt: number
}

export type AgentToolEvent = ToolExecutionEvent<BuiltinAgentId>

export interface AgentsApi {
  listAgents(): Promise<Agent[]>
  sendMessage(request: AgentChatRequest): Promise<AgentChatResult>
  cancelMessage(messageId: string): Promise<void>
  listSwarmMessages(conversationId: string): Promise<SwarmMessage[]>
  sendSwarmMessage(request: SwarmMessageSendRequest): Promise<SwarmMessage>
  onStreamChunk(callback: (chunk: AgentChatChunk) => void): () => void
  onMessageComplete(callback: (result: AgentChatResult) => void): () => void
  onAgentError(callback: (error: AgentChatError) => void): () => void
  onSwarmMessage(callback: (message: SwarmMessage) => void): () => void
  onToolEvent(callback: (event: AgentToolEvent) => void): () => void
}
