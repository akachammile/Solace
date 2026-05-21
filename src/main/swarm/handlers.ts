import { ipcMain } from 'electron'
import type { BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import type { SwarmMessageSendRequest } from '@shared/types/agent'
import { swarmBus } from './swarm-bus'

export function registerSwarmHandlers() {
  ipcMain.handle(IPC_CHANNELS.agents.listSwarmMessages, async (_event, conversationId: string) => {
    return swarmBus.listMessages(conversationId)
  })

  ipcMain.handle(IPC_CHANNELS.agents.sendSwarmMessage, async (_event, request: SwarmMessageSendRequest) => {
    return swarmBus.sendMessage(request)
  })
}

export function setSwarmWindow(win: BrowserWindow) {
  swarmBus.setWindow(win)
}

