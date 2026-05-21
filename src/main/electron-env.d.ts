/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    VITE_PUBLIC: string
  }
}

import type { SystemApi, WindowApi, AcpApi, AgentsApi, StorageApi, ProfileApi } from '@shared/types/ipc'

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
