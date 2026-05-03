export interface AppInfo {
  appName: string
  appVersion: string
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
  platform: string
}

export interface TestConnectionResult {
  ok: boolean
  status: number
  latency: number
  error?: string
}

export interface SystemApi {
  getAppInfo: () => Promise<AppInfo>
  ping: () => Promise<string>
  selectDirectory: () => Promise<string | null>
  testConnection: (baseUrl: string, apiKey: string, authHeader: string, testEndpoint: string) => Promise<TestConnectionResult>
}

export interface WindowApi {
  minimize: () => Promise<void>
  toggleMaximize: () => Promise<void>
  toggleDimOverlay: () => Promise<void>
  close: () => Promise<void>
}

export type { AcpApi } from './acp'
