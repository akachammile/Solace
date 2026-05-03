export const IPC_CHANNELS = {
  system: {
    getAppInfo: 'system:get-app-info',
    ping: 'system:ping',
    selectDirectory: 'system:select-directory',
    testConnection: 'system:test-connection',
  },
  window: {
    minimize: 'window:minimize',
    toggleMaximize: 'window:toggle-maximize',
    toggleDimOverlay: 'window:toggle-dim-overlay',
    close: 'window:close',
  },
  acp: {
    // Invoke channels (renderer → main)
    spawnAgent: 'acp:spawn-agent',
    killAgent: 'acp:kill-agent',
    initialize: 'acp:initialize',
    newSession: 'acp:new-session',
    closeSession: 'acp:close-session',
    sendPrompt: 'acp:send-prompt',
    cancelPrompt: 'acp:cancel-prompt',
    respondToPermission: 'acp:respond-to-permission',
    // Push channels (main → renderer)
    streamChunk: 'acp:stream-chunk',
    promptComplete: 'acp:prompt-complete',
    agentError: 'acp:agent-error',
    permissionRequest: 'acp:permission-request',
    agentStatusChange: 'acp:agent-status-change',
  },
} as const
