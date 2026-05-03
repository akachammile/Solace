// === Agent configuration (set by user in Settings) ===
export interface AgentConfig {
  command: string
  args: string[]
  cwd: string
}

// === Agent lifecycle ===
export type AgentStatus = 'stopped' | 'starting' | 'running' | 'error' | 'stopping'

export interface AgentInfo {
  agentId: string
  status: AgentStatus
  config: AgentConfig
  error?: string
}

// === Session ===
export interface SessionInfo {
  sessionId: string
  agentId: string
  cwd: string
  createdAt: number
}

// === Streaming ===
export interface StreamChunk {
  sessionId: string
  type: 'text' | 'tool_call' | 'tool_result' | 'plan'
  text?: string
  toolCallId?: string
  toolName?: string
  toolInput?: Record<string, unknown>
}

export interface PromptResult {
  sessionId: string
  stopReason: string
  usage?: { inputTokens: number; outputTokens: number }
}

export interface AgentError {
  agentId: string
  sessionId?: string
  code: string
  message: string
}

// === Permission ===
export interface PermissionRequest {
  requestId: string
  agentId: string
  sessionId: string
  toolName: string
  toolInput: Record<string, unknown>
}

export interface PermissionResponse {
  requestId: string
  allowed: boolean
}

// === ACP API surface exposed via preload ===
export interface AcpApi {
  // Invoke methods (renderer → main, promise-based)
  spawnAgent(config: AgentConfig): Promise<AgentInfo>
  killAgent(agentId: string): Promise<void>
  initialize(agentId: string): Promise<AgentInfo>
  newSession(agentId: string, cwd: string): Promise<SessionInfo>
  closeSession(agentId: string, sessionId: string): Promise<void>
  sendPrompt(agentId: string, sessionId: string, promptText: string): Promise<PromptResult>
  cancelPrompt(agentId: string): Promise<void>
  respondToPermission(agentId: string, response: PermissionResponse): Promise<void>

  // Push event subscriptions (main → renderer, each returns cleanup function)
  onStreamChunk(callback: (chunk: StreamChunk) => void): () => void
  onPromptComplete(callback: (result: PromptResult) => void): () => void
  onAgentError(callback: (error: AgentError) => void): () => void
  onPermissionRequest(callback: (req: PermissionRequest) => void): () => void
  onAgentStatusChange(callback: (info: AgentInfo) => void): () => void
}
