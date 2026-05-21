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
  agents: {
    listAgents: 'agents:list-agents',
    sendMessage: 'agents:send-message',
    cancelMessage: 'agents:cancel-message',
    listSwarmMessages: 'agents:list-swarm-messages',
    sendSwarmMessage: 'agents:send-swarm-message',
    streamChunk: 'agents:stream-chunk',
    messageComplete: 'agents:message-complete',
    agentError: 'agents:agent-error',
    swarmMessage: 'agents:swarm-message',
    toolEvent: 'agents:tool-event',
  },
  storage: {
    getDatabaseInfo: 'storage:get-database-info',
    listConversations: 'storage:list-conversations',
    listMessages: 'storage:list-messages',
    deleteConversation: 'storage:delete-conversation',
  },
  profile: {
    getProfile: 'profile:get-profile',
  },
} as const
