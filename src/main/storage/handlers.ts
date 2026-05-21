import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import { solaceDatabase } from './database'

export function registerStorageHandlers() {
  ipcMain.handle(IPC_CHANNELS.storage.getDatabaseInfo, async () => {
    return solaceDatabase.getInfo()
  })

  ipcMain.handle(IPC_CHANNELS.storage.listConversations, async () => {
    return solaceDatabase.listConversations()
  })

  ipcMain.handle(IPC_CHANNELS.storage.listMessages, async (_event, conversationId: string) => {
    return solaceDatabase.listMessages(conversationId)
  })

  ipcMain.handle(IPC_CHANNELS.storage.deleteConversation, async (_event, conversationId: string) => {
    return solaceDatabase.deleteConversation(conversationId)
  })
}
