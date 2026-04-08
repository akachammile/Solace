import type { AppInfo } from '../../../shared/types/ipc'

export function getAppInfo(): Promise<AppInfo> {
  return window.solace.system.getAppInfo()
}

export function pingMain(): Promise<string> {
  return window.solace.system.ping()
}

export function selectDirectory(): Promise<string | null> {
  return window.solace.system.selectDirectory()
}
