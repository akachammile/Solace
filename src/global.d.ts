import type { SystemApi, WindowApi, AcpApi } from '@shared/types/ipc'

declare global {
  interface Window {
    solace: {
      system: SystemApi
      window: WindowApi
      acp: AcpApi
    }
  }
}

export {}
