import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import { acpManager } from './manager'
import type { AgentConfig, PermissionResponse } from '@shared/types/acp'

export function registerAcpHandlers() {
  ipcMain.handle(IPC_CHANNELS.acp.spawnAgent, async (_event, config: AgentConfig) => {
    return acpManager.spawnAgent(config)
  })

  ipcMain.handle(IPC_CHANNELS.acp.killAgent, async (_event, agentId: string) => {
    return acpManager.killAgent(agentId)
  })

  ipcMain.handle(IPC_CHANNELS.acp.initialize, async (_event, agentId: string) => {
    return acpManager.initialize(agentId)
  })

  ipcMain.handle(IPC_CHANNELS.acp.newSession, async (_event, agentId: string, cwd: string) => {
    return acpManager.newSession(agentId, cwd)
  })

  ipcMain.handle(IPC_CHANNELS.acp.closeSession, async (_event, agentId: string, sessionId: string) => {
    return acpManager.closeSession(agentId, sessionId)
  })

  ipcMain.handle(IPC_CHANNELS.acp.sendPrompt, async (_event, agentId: string, sessionId: string, promptText: string) => {
    return acpManager.sendPrompt(agentId, sessionId, promptText)
  })

  ipcMain.handle(IPC_CHANNELS.acp.cancelPrompt, async (_event, agentId: string) => {
    return acpManager.cancelPrompt(agentId)
  })

  ipcMain.handle(IPC_CHANNELS.acp.respondToPermission, async (_event, agentId: string, response: PermissionResponse) => {
    return acpManager.respondToPermission(agentId, response)
  })
}
