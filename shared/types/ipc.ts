export interface AppInfo {
  appName: string
  appVersion: string
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
  platform: string
}

export interface SystemApi {
  getAppInfo: () => Promise<AppInfo>
  ping: () => Promise<string>
  selectDirectory: () => Promise<string | null>
}

export interface WindowApi {
  minimize: () => Promise<void>
  toggleMaximize: () => Promise<void>
  close: () => Promise<void>
}
