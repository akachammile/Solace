import { ipcRenderer, contextBridge } from 'electron'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import type { SystemApi, WindowApi, AcpApi, AgentsApi, StorageApi, ProfileApi } from '@shared/types/ipc'

const systemApi: SystemApi = {
  getAppInfo: () => ipcRenderer.invoke(IPC_CHANNELS.system.getAppInfo),
  ping: () => ipcRenderer.invoke(IPC_CHANNELS.system.ping),
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.system.selectDirectory),
  testConnection: (baseUrl, apiKey, authHeader, testEndpoint, provider) =>
    ipcRenderer.invoke(IPC_CHANNELS.system.testConnection, baseUrl, apiKey, authHeader, testEndpoint, provider),
}

const windowApi: WindowApi = {
  minimize: () => ipcRenderer.invoke(IPC_CHANNELS.window.minimize),
  toggleMaximize: () => ipcRenderer.invoke(IPC_CHANNELS.window.toggleMaximize),
  toggleDimOverlay: () => ipcRenderer.invoke(IPC_CHANNELS.window.toggleDimOverlay),
  close: () => ipcRenderer.invoke(IPC_CHANNELS.window.close),
}

const acpApi: AcpApi = {
  spawnAgent: (config) => ipcRenderer.invoke(IPC_CHANNELS.acp.spawnAgent, config),
  killAgent: (agentId) => ipcRenderer.invoke(IPC_CHANNELS.acp.killAgent, agentId),
  initialize: (agentId) => ipcRenderer.invoke(IPC_CHANNELS.acp.initialize, agentId),
  newSession: (agentId, cwd) => ipcRenderer.invoke(IPC_CHANNELS.acp.newSession, agentId, cwd),
  closeSession: (agentId, sessionId) => ipcRenderer.invoke(IPC_CHANNELS.acp.closeSession, agentId, sessionId),
  sendPrompt: (agentId, sessionId, promptText) =>
    ipcRenderer.invoke(IPC_CHANNELS.acp.sendPrompt, agentId, sessionId, promptText),
  cancelPrompt: (agentId) => ipcRenderer.invoke(IPC_CHANNELS.acp.cancelPrompt, agentId),
  respondToPermission: (agentId, response) =>
    ipcRenderer.invoke(IPC_CHANNELS.acp.respondToPermission, agentId, response),

  // Push event subscriptions — each returns an unsubscribe function
  onStreamChunk: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, chunk: unknown) => callback(chunk as never)
    ipcRenderer.on(IPC_CHANNELS.acp.streamChunk, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.acp.streamChunk, handler) }
  },
  onPromptComplete: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, result: unknown) => callback(result as never)
    ipcRenderer.on(IPC_CHANNELS.acp.promptComplete, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.acp.promptComplete, handler) }
  },
  onAgentError: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, error: unknown) => callback(error as never)
    ipcRenderer.on(IPC_CHANNELS.acp.agentError, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.acp.agentError, handler) }
  },
  onPermissionRequest: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, req: unknown) => callback(req as never)
    ipcRenderer.on(IPC_CHANNELS.acp.permissionRequest, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.acp.permissionRequest, handler) }
  },
  onAgentStatusChange: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, info: unknown) => callback(info as never)
    ipcRenderer.on(IPC_CHANNELS.acp.agentStatusChange, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.acp.agentStatusChange, handler) }
  },
}

const agentsApi: AgentsApi = {
  listAgents: () => ipcRenderer.invoke(IPC_CHANNELS.agents.listAgents),
  sendMessage: (request) => ipcRenderer.invoke(IPC_CHANNELS.agents.sendMessage, request),
  cancelMessage: (messageId) => ipcRenderer.invoke(IPC_CHANNELS.agents.cancelMessage, messageId),
  listSwarmMessages: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.agents.listSwarmMessages, conversationId),
  sendSwarmMessage: (request) => ipcRenderer.invoke(IPC_CHANNELS.agents.sendSwarmMessage, request),
  onStreamChunk: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, chunk: unknown) => callback(chunk as never)
    ipcRenderer.on(IPC_CHANNELS.agents.streamChunk, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.agents.streamChunk, handler) }
  },
  onMessageComplete: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, result: unknown) => callback(result as never)
    ipcRenderer.on(IPC_CHANNELS.agents.messageComplete, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.agents.messageComplete, handler) }
  },
  onAgentError: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, error: unknown) => callback(error as never)
    ipcRenderer.on(IPC_CHANNELS.agents.agentError, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.agents.agentError, handler) }
  },
  onSwarmMessage: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, message: unknown) => callback(message as never)
    ipcRenderer.on(IPC_CHANNELS.agents.swarmMessage, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.agents.swarmMessage, handler) }
  },
  onToolEvent: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, event: unknown) => callback(event as never)
    ipcRenderer.on(IPC_CHANNELS.agents.toolEvent, handler)
    return () => { ipcRenderer.removeListener(IPC_CHANNELS.agents.toolEvent, handler) }
  },
}

const storageApi: StorageApi = {
  getDatabaseInfo: () => ipcRenderer.invoke(IPC_CHANNELS.storage.getDatabaseInfo),
  listConversations: () => ipcRenderer.invoke(IPC_CHANNELS.storage.listConversations),
  listMessages: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.storage.listMessages, conversationId),
  deleteConversation: (conversationId) => ipcRenderer.invoke(IPC_CHANNELS.storage.deleteConversation, conversationId),
}

const profileApi: ProfileApi = {
  getProfile: () => ipcRenderer.invoke(IPC_CHANNELS.profile.getProfile),
}

contextBridge.exposeInMainWorld('solace', {
  system: systemApi,
  window: windowApi,
  acp: acpApi,
  agents: agentsApi,
  storage: storageApi,
  profile: profileApi,
})
