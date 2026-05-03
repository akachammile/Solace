import type { AgentConfig, AgentInfo, SessionInfo, StreamChunk, PromptResult, AgentError, PermissionRequest, PermissionResponse } from '@shared/types/acp'

// Invoke wrappers
export function spawnAgent(config: AgentConfig): Promise<AgentInfo> {
  return window.solace.acp.spawnAgent(config)
}

export function killAgent(agentId: string): Promise<void> {
  return window.solace.acp.killAgent(agentId)
}

export function initializeAgent(agentId: string): Promise<AgentInfo> {
  return window.solace.acp.initialize(agentId)
}

export function newSession(agentId: string, cwd: string): Promise<SessionInfo> {
  return window.solace.acp.newSession(agentId, cwd)
}

export function closeSession(agentId: string, sessionId: string): Promise<void> {
  return window.solace.acp.closeSession(agentId, sessionId)
}

export function sendPrompt(agentId: string, sessionId: string, promptText: string): Promise<PromptResult> {
  return window.solace.acp.sendPrompt(agentId, sessionId, promptText)
}

export function cancelPrompt(agentId: string): Promise<void> {
  return window.solace.acp.cancelPrompt(agentId)
}

export function respondToPermission(agentId: string, response: PermissionResponse): Promise<void> {
  return window.solace.acp.respondToPermission(agentId, response)
}

// Push event subscriptions — each returns cleanup function
export function onStreamChunk(callback: (chunk: StreamChunk) => void): () => void {
  return window.solace.acp.onStreamChunk(callback)
}

export function onPromptComplete(callback: (result: PromptResult) => void): () => void {
  return window.solace.acp.onPromptComplete(callback)
}

export function onAgentError(callback: (error: AgentError) => void): () => void {
  return window.solace.acp.onAgentError(callback)
}

export function onPermissionRequest(callback: (req: PermissionRequest) => void): () => void {
  return window.solace.acp.onPermissionRequest(callback)
}

export function onAgentStatusChange(callback: (info: AgentInfo) => void): () => void {
  return window.solace.acp.onAgentStatusChange(callback)
}
