import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import type { AgentChatRequest } from '@shared/types/agent'
import { builtinAgentService } from './builtin-agents'

export function registerBuiltinAgentHandlers() {
  ipcMain.handle(IPC_CHANNELS.agents.listAgents, async () => {
    return builtinAgentService.listAgents()
  })

  ipcMain.handle(IPC_CHANNELS.agents.sendMessage, async (_event, request: AgentChatRequest) => {
    return builtinAgentService.sendMessage(request)
  })

  ipcMain.handle(IPC_CHANNELS.agents.cancelMessage, async (_event, messageId: string) => {
    return builtinAgentService.cancelMessage(messageId)
  })
}
