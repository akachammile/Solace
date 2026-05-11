import type { AppInfo, ModelServiceProvider, TestConnectionResult } from '@shared/types/ipc'

export function getAppInfo(): Promise<AppInfo> {
  return window.solace.system.getAppInfo()
}

export function pingMain(): Promise<string> {
  return window.solace.system.ping()
}

export function selectDirectory(): Promise<string | null> {
  return window.solace.system.selectDirectory()
}

export function testConnection(
  baseUrl: string,
  apiKey: string,
  authHeader: string,
  testEndpoint: string,
  provider?: ModelServiceProvider,
): Promise<TestConnectionResult> {
  return window.solace.system.testConnection(baseUrl, apiKey, authHeader, testEndpoint, provider)
}
