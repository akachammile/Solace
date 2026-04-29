export const IPC_CHANNELS = {
  system: {
    getAppInfo: 'system:get-app-info',
    ping: 'system:ping',
    selectDirectory: 'system:select-directory',
  },
  window: {
    minimize: 'window:minimize',
    toggleMaximize: 'window:toggle-maximize',
    toggleDimOverlay: 'window:toggle-dim-overlay',
    close: 'window:close',
  },
} as const
