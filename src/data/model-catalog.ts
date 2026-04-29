import anthropicIcon from '../assets/model-icons/anthropic.svg'
import deepseekIcon from '../assets/model-icons/deepseek.svg'
import geminiIcon from '../assets/model-icons/gemini.svg'
import openaiIcon from '../assets/model-icons/openai.svg'
import zhipuIcon from '../assets/model-icons/zhipu.svg'
import type { ModelProvider } from '../types/ui'

export const modelProviders: Array<{
  id: ModelProvider
  name: string
  icon: string
  defaultModel: string
  baseUrl: string
}> = [
  {
    id: 'openai',
    name: 'GPT',
    icon: openaiIcon,
    defaultModel: 'gpt-4.1-mini',
    baseUrl: 'https://api.openai.com/v1',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: anthropicIcon,
    defaultModel: 'claude-3-5-sonnet-latest',
    baseUrl: 'https://api.anthropic.com',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: geminiIcon,
    defaultModel: 'gemini-1.5-pro',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: deepseekIcon,
    defaultModel: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com',
  },
  {
    id: 'zhipu',
    name: 'Zhipu',
    icon: zhipuIcon,
    defaultModel: 'glm-4-plus',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  },
]

export function getModelProvider(provider: ModelProvider) {
  return modelProviders.find((item) => item.id === provider) ?? modelProviders[0]
}
