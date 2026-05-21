import type {
  BuiltinAgentId,
  AgentMessageRole,
  SwarmMessageVisibility,
  SwarmMessageKind,
} from './agent'

export interface StoredConversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messageCount: number
}

export interface StoredChatMessage {
  id: string
  conversationId: string
  role: AgentMessageRole
  agentId?: BuiltinAgentId
  content: string
  status: 'streaming' | 'complete' | 'error'
  createdAt: number
  updatedAt: number
}

export interface StoredSwarmMessage {
  id: string
  conversationId: string
  threadId: string
  fromAgentId: BuiltinAgentId
  toAgentId?: BuiltinAgentId
  kind: SwarmMessageKind
  visibility: SwarmMessageVisibility
  content: string
  context?: string
  createdAt: number
  updatedAt: number
}

export interface DatabaseInfo {
  path: string
  initialized: boolean
}

export interface StorageApi {
  getDatabaseInfo(): Promise<DatabaseInfo>
  listConversations(): Promise<StoredConversation[]>
  listMessages(conversationId: string): Promise<StoredChatMessage[]>
  deleteConversation(conversationId: string): Promise<void>
}
