import type { BuiltinAgentId } from './agent'

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

export type ModelServiceProvider = string

export interface SystemApi {
  getAppInfo: () => Promise<AppInfo>
  ping: () => Promise<string>
  selectDirectory: () => Promise<string | null>
  testConnection: (
    baseUrl: string,
    apiKey: string,
    authHeader: string,
    testEndpoint: string,
    provider?: ModelServiceProvider,
  ) => Promise<TestConnectionResult>
}

export interface WindowApi {
  minimize: () => Promise<void>
  toggleMaximize: () => Promise<void>
  toggleDimOverlay: () => Promise<void>
  close: () => Promise<void>
}

export type { AcpApi } from './acp'
export type { AgentsApi } from './agent'
export type { StorageApi } from './storage'

export interface ProfileRecord {
  userId: string
  createdAt: number
  lastActiveAt: number
  totals: {
    messages: number
    workspaceStarts: number
  }
  usage: {
    agents: Partial<Record<BuiltinAgentId, number>>
  }
}

export interface ProfileApi {
  getProfile(): Promise<ProfileRecord>
}
