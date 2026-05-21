import type { DatabaseInfo, StoredChatMessage, StoredConversation } from '@shared/types/storage'

export function getDatabaseInfo(): Promise<DatabaseInfo> {
  return window.solace.storage.getDatabaseInfo()
}

export function listConversations(): Promise<StoredConversation[]> {
  return window.solace.storage.listConversations()
}

export function listMessages(conversationId: string): Promise<StoredChatMessage[]> {
  return window.solace.storage.listMessages(conversationId)
}

export function deleteConversation(conversationId: string): Promise<void> {
  return window.solace.storage.deleteConversation(conversationId)
}
