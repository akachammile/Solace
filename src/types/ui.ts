export type ViewType = 'chat' | 'pet' | 'knowledge' | 'settings'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
}

export interface ToolToggles {
  web: boolean
  mcp: boolean
  skill: boolean
}

export interface SettingsState {
  provider: 'openai' | 'anthropic' | 'ollama'
  model: string
  temperature: number
  knowledgePath: string
  allowWebSearch: boolean
}
