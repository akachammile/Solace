import anthropicIcon from '@/assets/model-icons/anthropic.svg'
import deepseekIcon from '@/assets/model-icons/deepseek.svg'
import geminiIcon from '@/assets/model-icons/gemini.svg'
import openaiIcon from '@/assets/model-icons/openai.svg'
import zhipuIcon from '@/assets/model-icons/zhipu.svg'
import type { ModelProvider } from '@/types/ui'

export interface ModelEntry {
  id: string
  name: string
  group?: string
}

export interface ProviderEntry {
  id: ModelProvider
  name: string
  icon: string
  baseUrl: string
  models: ModelEntry[]
  testEndpoint: string
  authHeader: string
}

export const modelProviders: ProviderEntry[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: openaiIcon,
    baseUrl: 'https://api.openai.com/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      { id: 'gpt-5.2', name: 'GPT-5.2', group: 'GPT-5 系列' },
      { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', group: 'GPT-5 系列' },
      { id: 'gpt-5.1', name: 'GPT-5.1', group: 'GPT-5 系列' },
      { id: 'gpt-5-mini', name: 'GPT-5 Mini', group: 'GPT-5 系列' },
      { id: 'gpt-5-nano', name: 'GPT-5 Nano', group: 'GPT-5 系列' },
      { id: 'gpt-4.1', name: 'GPT-4.1', group: 'GPT-4.1 系列' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', group: 'GPT-4.1 系列' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', group: 'GPT-4.1 系列' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: anthropicIcon,
    baseUrl: 'https://api.anthropic.com',
    testEndpoint: '/v1/messages',
    authHeader: 'x-api-key',
    models: [
      { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1', group: 'Claude 4 系列' },
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', group: 'Claude 4 系列' },
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', group: 'Claude 4 系列' },
      { id: 'claude-3-7-sonnet-latest', name: 'Claude 3.7 Sonnet', group: 'Claude 3 系列' },
      { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku', group: 'Claude 3 系列' },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: geminiIcon,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    testEndpoint: '/models',
    authHeader: 'x-goog-api-key',
    models: [
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', group: 'Gemini 3 系列' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', group: 'Gemini 2.5 系列' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', group: 'Gemini 2.5 系列' },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', group: 'Gemini 2.5 系列' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', group: 'Gemini 2.0 系列' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', group: 'Gemini 1.5 系列' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', group: 'Gemini 1.5 系列' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: deepseekIcon,
    baseUrl: 'https://api.deepseek.com',
    testEndpoint: '/v1/models',
    authHeader: 'Bearer',
    models: [
      { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', group: 'DeepSeek V4 系列' },
      { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', group: 'DeepSeek V4 系列' },
      { id: 'deepseek-chat', name: 'DeepSeek Chat', group: '兼容别名' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', group: '兼容别名' },
    ],
  },
  {
    id: 'zhipu',
    name: 'Zhipu',
    icon: zhipuIcon,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus', group: 'GLM 系列' },
      { id: 'glm-4', name: 'GLM-4', group: 'GLM 系列' },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', group: 'GLM 系列' },
      { id: 'glm-4-air', name: 'GLM-4 Air', group: 'GLM 系列' },
    ],
  },
]

export function getProvider(id: ModelProvider): ProviderEntry {
  return modelProviders.find((p) => p.id === id) ?? modelProviders[0]
}
