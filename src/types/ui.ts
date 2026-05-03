import type { AgentConfigUi } from '@/features/acp/types'

export type ViewType = 'chat' | 'image' | 'scale' | 'pet' | 'knowledge' | 'settings'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  isStreaming?: boolean
}

export interface ToolToggles {
  web: boolean
  mcp: boolean
  skill: boolean
}

export type ModelProvider = 'openai' | 'anthropic' | 'gemini' | 'deepseek' | 'zhipu'

export interface SkillsConfig {
  webSearch: boolean
  fileOperations: boolean
  terminal: boolean
  mcp: boolean
  codeInterpreter: boolean
  rag: boolean
}

export interface SettingsState {
  language: 'zh' | 'en'
  provider: ModelProvider
  model: string
  apiKey: string
  baseUrl: string
  temperature: number
  knowledgePath: string
  allowWebSearch: boolean
  agentConfig: AgentConfigUi
  skillsConfig: SkillsConfig
}
