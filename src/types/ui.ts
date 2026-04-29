export type ViewType = 'chat' | 'image' | 'scale' | 'pet' | 'knowledge' | 'settings'

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

export type ModelProvider = 'openai' | 'anthropic' | 'gemini' | 'deepseek' | 'zhipu'

export interface SettingsState {
  provider: ModelProvider
  model: string
  apiKey: string
  baseUrl: string
  temperature: number
  knowledgePath: string
  allowWebSearch: boolean
}
