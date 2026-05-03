import anthropicIcon from '@/assets/model-icons/anthropic.svg'
import deepseekIcon from '@/assets/model-icons/deepseek.svg'
import geminiIcon from '@/assets/model-icons/gemini.svg'
import openaiIcon from '@/assets/model-icons/openai.svg'
import zhipuIcon from '@/assets/model-icons/zhipu.svg'
import type { ModelProvider } from '@/types/ui'

export interface ModelEntry {
  id: string
  name: string
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
      { id: 'gpt-4.1', name: 'GPT-4.1' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano' },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'o4-mini', name: 'O4 Mini' },
      { id: 'o3-mini', name: 'O3 Mini' },
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
      { id: 'claude-opus-4-7', name: 'Claude Opus 4.7' },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' },
      { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet' },
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
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
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
      { id: 'deepseek-chat', name: 'DeepSeek Chat' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
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
      { id: 'glm-4-plus', name: 'GLM-4 Plus' },
      { id: 'glm-4', name: 'GLM-4' },
      { id: 'glm-4-flash', name: 'GLM-4 Flash' },
      { id: 'glm-4-air', name: 'GLM-4 Air' },
    ],
  },
]

export function getProvider(id: ModelProvider): ProviderEntry {
  return modelProviders.find((p) => p.id === id) ?? modelProviders[0]
}
