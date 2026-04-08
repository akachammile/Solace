export const IPC_CHANNELS = {
  system: {
    getAppInfo: 'system:get-app-info',
    ping: 'system:ping',
    selectDirectory: 'system:select-directory',
  },
  window: {
    minimize: 'window:minimize',
    toggleMaximize: 'window:toggle-maximize',
    close: 'window:close',
  },
} as const
