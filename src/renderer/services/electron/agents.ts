import type {
  AgentChatError,
  AgentToolEvent,
  SwarmMessage,
  AgentChatRequest,
  AgentChatResult,
  AgentChatChunk,
  Agent,
} from '@shared/types/agent'

export function listAgents(): Promise<Agent[]> {
  return window.solace.agents.listAgents()
}

export function sendAgentMessage(request: AgentChatRequest): Promise<AgentChatResult> {
  return window.solace.agents.sendMessage(request)
}

export function cancelAgentMessage(messageId: string): Promise<void> {
  return window.solace.agents.cancelMessage(messageId)
}

export function onAgentStreamChunk(callback: (chunk: AgentChatChunk) => void): () => void {
  return window.solace.agents.onStreamChunk(callback)
}

export function onAgentMessageComplete(callback: (result: AgentChatResult) => void): () => void {
  return window.solace.agents.onMessageComplete(callback)
}

export function onAgentError(callback: (error: AgentChatError) => void): () => void {
  return window.solace.agents.onAgentError(callback)
}

export function listSwarmMessages(conversationId: string): Promise<SwarmMessage[]> {
  return window.solace.agents.listSwarmMessages(conversationId)
}

export function onSwarmMessage(callback: (message: SwarmMessage) => void): () => void {
  return window.solace.agents.onSwarmMessage(callback)
}

export function onAgentToolEvent(callback: (event: AgentToolEvent) => void): () => void {
  return window.solace.agents.onToolEvent(callback)
}
