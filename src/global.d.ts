import type { SystemApi, WindowApi } from '../shared/types/ipc'

declare global {
  interface Window {
    solace: {
      system: SystemApi
      window: WindowApi
    }
  }
}

export {}
