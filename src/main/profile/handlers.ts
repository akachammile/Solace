import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import { profileManager } from './profile-manager'

export function registerProfileHandlers() {
  ipcMain.handle(IPC_CHANNELS.profile.getProfile, () => {
    return profileManager.getProfile()
  })
}
