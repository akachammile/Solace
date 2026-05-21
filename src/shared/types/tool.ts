export type ToolName = 'search'

export type ToolExecutionKind = 'tool-start' | 'tool-result' | 'tool-error'
export type ToolExecutionStatus = 'start' | 'result' | 'error'

export interface ToolExecutionEvent<TAgentId extends string = string> {
  conversationId: string
  messageId: string
  agentId: TAgentId
  requestId: string
  toolName: ToolName
  status: ToolExecutionStatus
  query: string
  result?: string
  error?: string
  kind: ToolExecutionKind
}

export interface ToolEntity {
  name: ToolName
  label: string
  description: string
  enabled?: boolean
}
