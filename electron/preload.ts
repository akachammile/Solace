import { ipcRenderer, contextBridge } from 'electron'
import { IPC_CHANNELS } from '../shared/constants/ipc-channels'
import type { SystemApi, WindowApi } from '../shared/types/ipc'

const systemApi: SystemApi = {
  getAppInfo: () => ipcRenderer.invoke(IPC_CHANNELS.system.getAppInfo),
  ping: () => ipcRenderer.invoke(IPC_CHANNELS.system.ping),
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.system.selectDirectory),
}

const windowApi: WindowApi = {
  minimize: () => ipcRenderer.invoke(IPC_CHANNELS.window.minimize),
  toggleMaximize: () => ipcRenderer.invoke(IPC_CHANNELS.window.toggleMaximize),
  close: () => ipcRenderer.invoke(IPC_CHANNELS.window.close),
}

contextBridge.exposeInMainWorld('solace', {
  system: systemApi,
  window: windowApi,
})
