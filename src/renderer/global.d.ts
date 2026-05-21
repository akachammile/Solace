import type { SystemApi, WindowApi, AcpApi, AgentsApi, StorageApi, ProfileApi } from '@shared/types/ipc'

declare global {
  interface Window {
    solace: {
      system: SystemApi
      window: WindowApi
      acp: AcpApi
      agents: AgentsApi
      storage: StorageApi
      profile: ProfileApi
    }
  }
}

export {}
