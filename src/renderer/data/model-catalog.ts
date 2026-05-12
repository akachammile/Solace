import anthropicIcon from '@/assets/model-icons/anthropic.svg'
import dashscopeIcon from '@/assets/model-icons/dashscope.svg'
import qianfanIcon from '@/assets/model-icons/qianfan.svg'
import deepseekIcon from '@/assets/model-icons/deepseek.svg'
import geminiIcon from '@/assets/model-icons/gemini.svg'
import mistralIcon from '@/assets/model-icons/mistral.svg'
import nvidiaIcon from '@/assets/model-icons/nvidia.svg'
import ollamaIcon from '@/assets/model-icons/ollama.svg'
import openaiIcon from '@/assets/model-icons/openai.svg'
import openrouterIcon from '@/assets/model-icons/openrouter.svg'
import perplexityIcon from '@/assets/model-icons/perplexity.svg'
import volcengineIcon from '@/assets/model-icons/volcengine.svg'
import zhipuIcon from '@/assets/model-icons/zhipu.svg'
import type { ModelProvider } from '@/types/ui'

export type ProviderCategory = 'global' | 'china' | 'aggregator' | 'local'
export type ProviderProtocol = 'openai-compatible' | 'anthropic' | 'google'
export type ModelTier = 'flagship' | 'standard' | 'fast' | 'reasoning' | 'code' | 'research' | 'local'

export interface ModelEntry {
  id: string
  name: string
  series: string
  tier: ModelTier
  rank: number
}

export interface ProviderEntry {
  id: ModelProvider
  name: string
  shortName: string
  icon?: string
  category: ProviderCategory
  protocol: ProviderProtocol
  baseUrl: string
  models: ModelEntry[]
  testEndpoint: string
  authHeader: string
  apiKeyRequired?: boolean
}

function model(id: string, name: string, series: string, tier: ModelTier, rank: number): ModelEntry {
  return { id, name, series, tier, rank }
}

export const modelProviders: ProviderEntry[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'OA',
    icon: openaiIcon,
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('gpt-5.2-pro', 'GPT-5.2 Pro', 'GPT-5', 'flagship', 10),
      model('gpt-5.2', 'GPT-5.2', 'GPT-5', 'standard', 20),
      model('gpt-5.1', 'GPT-5.1', 'GPT-5', 'standard', 30),
      model('gpt-5-mini', 'GPT-5 Mini', 'GPT-5', 'fast', 40),
      model('gpt-5-nano', 'GPT-5 Nano', 'GPT-5', 'fast', 50),
      model('gpt-4.1', 'GPT-4.1', 'GPT-4.1', 'standard', 60),
      model('gpt-4.1-mini', 'GPT-4.1 Mini', 'GPT-4.1', 'fast', 70),
      model('gpt-4.1-nano', 'GPT-4.1 Nano', 'GPT-4.1', 'fast', 80),
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    shortName: 'AI',
    icon: anthropicIcon,
    category: 'global',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    testEndpoint: '/v1/messages',
    authHeader: 'x-api-key',
    models: [
      model('claude-opus-4-1-20250805', 'Claude Opus 4.1', 'Claude 4', 'flagship', 10),
      model('claude-opus-4-20250514', 'Claude Opus 4', 'Claude 4', 'flagship', 20),
      model('claude-sonnet-4-20250514', 'Claude Sonnet 4', 'Claude 4', 'standard', 30),
      model('claude-3-7-sonnet-latest', 'Claude 3.7 Sonnet', 'Claude 3', 'reasoning', 40),
      model('claude-3-5-haiku-latest', 'Claude 3.5 Haiku', 'Claude 3', 'fast', 50),
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    shortName: 'GM',
    icon: geminiIcon,
    category: 'global',
    protocol: 'google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    testEndpoint: '/models',
    authHeader: 'x-goog-api-key',
    models: [
      model('gemini-3-pro-preview', 'Gemini 3 Pro Preview', 'Gemini 3', 'flagship', 10),
      model('gemini-2.5-pro', 'Gemini 2.5 Pro', 'Gemini 2.5', 'flagship', 20),
      model('gemini-2.5-flash', 'Gemini 2.5 Flash', 'Gemini 2.5', 'fast', 30),
      model('gemini-2.5-flash-lite', 'Gemini 2.5 Flash-Lite', 'Gemini 2.5', 'fast', 40),
      model('gemini-2.0-flash', 'Gemini 2.0 Flash', 'Gemini 2.0', 'fast', 50),
      model('gemini-1.5-pro', 'Gemini 1.5 Pro', 'Gemini 1.5', 'standard', 60),
      model('gemini-1.5-flash', 'Gemini 1.5 Flash', 'Gemini 1.5', 'fast', 70),
    ],
  },
  {
    id: 'xai',
    name: 'xAI',
    shortName: 'xA',
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.x.ai/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('grok-4', 'Grok 4', 'Grok 4', 'flagship', 10),
      model('grok-4-fast', 'Grok 4 Fast', 'Grok 4', 'fast', 20),
      model('grok-3', 'Grok 3', 'Grok 3', 'standard', 30),
      model('grok-3-mini', 'Grok 3 Mini', 'Grok 3', 'fast', 40),
      model('grok-2-vision-1212', 'Grok 2 Vision', 'Grok 2', 'standard', 50),
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    shortName: 'MI',
    icon: mistralIcon,
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.mistral.ai/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('mistral-large-latest', 'Mistral Large', 'Mistral', 'flagship', 10),
      model('mistral-medium-latest', 'Mistral Medium', 'Mistral', 'standard', 20),
      model('mistral-small-latest', 'Mistral Small', 'Mistral', 'fast', 30),
      model('codestral-latest', 'Codestral', 'Specialized', 'code', 40),
      model('ministral-8b-latest', 'Ministral 8B', 'Ministral', 'fast', 50),
      model('ministral-3b-latest', 'Ministral 3B', 'Ministral', 'fast', 60),
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    shortName: 'GQ',
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.groq.com/openai/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('llama-3.3-70b-versatile', 'Llama 3.3 70B Versatile', 'Llama', 'flagship', 10),
      model('llama-3.1-8b-instant', 'Llama 3.1 8B Instant', 'Llama', 'fast', 20),
      model('openai/gpt-oss-120b', 'GPT OSS 120B', 'GPT OSS', 'flagship', 30),
      model('openai/gpt-oss-20b', 'GPT OSS 20B', 'GPT OSS', 'fast', 40),
      model('deepseek-r1-distill-llama-70b', 'DeepSeek R1 Distill 70B', 'Reasoning', 'reasoning', 50),
    ],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    shortName: 'CH',
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.cohere.com/v2',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('command-a-03-2025', 'Command A', 'Command A', 'flagship', 10),
      model('command-r-plus', 'Command R+', 'Command R', 'flagship', 20),
      model('command-r', 'Command R', 'Command R', 'standard', 30),
      model('command-r7b-12-2024', 'Command R7B', 'Command R', 'fast', 40),
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    shortName: 'PX',
    icon: perplexityIcon,
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.perplexity.ai',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('sonar-deep-research', 'Sonar Deep Research', 'Sonar Research', 'research', 10),
      model('sonar-reasoning-pro', 'Sonar Reasoning Pro', 'Sonar Reasoning', 'reasoning', 20),
      model('sonar-reasoning', 'Sonar Reasoning', 'Sonar Reasoning', 'reasoning', 30),
      model('sonar-pro', 'Sonar Pro', 'Sonar', 'flagship', 40),
      model('sonar', 'Sonar', 'Sonar', 'standard', 50),
    ],
  },
  {
    id: 'together',
    name: 'Together AI',
    shortName: 'TG',
    category: 'aggregator',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.together.xyz/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Llama 3.3 70B Turbo', 'Llama', 'flagship', 10),
      model('meta-llama/Llama-3.1-8B-Instruct-Turbo', 'Llama 3.1 8B Turbo', 'Llama', 'fast', 20),
      model('deepseek-ai/DeepSeek-R1', 'DeepSeek R1', 'Reasoning', 'reasoning', 30),
      model('Qwen/Qwen2.5-72B-Instruct-Turbo', 'Qwen2.5 72B Turbo', 'Qwen', 'flagship', 40),
      model('mistralai/Mixtral-8x7B-Instruct-v0.1', 'Mixtral 8x7B', 'Mistral', 'standard', 50),
    ],
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    shortName: 'FW',
    category: 'aggregator',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('accounts/fireworks/models/llama-v3p1-405b-instruct', 'Llama 3.1 405B', 'Llama', 'flagship', 10),
      model('accounts/fireworks/models/llama-v3p3-70b-instruct', 'Llama 3.3 70B', 'Llama', 'standard', 20),
      model('accounts/fireworks/models/deepseek-r1', 'DeepSeek R1', 'Reasoning', 'reasoning', 30),
      model('accounts/fireworks/models/qwen2p5-72b-instruct', 'Qwen2.5 72B', 'Qwen', 'flagship', 40),
    ],
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    shortName: 'NV',
    icon: nvidiaIcon,
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('nvidia/llama-3.1-nemotron-70b-instruct', 'Nemotron 70B Instruct', 'Nemotron', 'flagship', 10),
      model('meta/llama-3.1-405b-instruct', 'Llama 3.1 405B', 'Llama', 'flagship', 20),
      model('meta/llama-3.3-70b-instruct', 'Llama 3.3 70B', 'Llama', 'standard', 30),
      model('mistralai/mixtral-8x22b-instruct-v0.1', 'Mixtral 8x22B', 'Mistral', 'standard', 40),
    ],
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    shortName: 'CB',
    category: 'global',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.cerebras.ai/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('qwen-3-235b-a22b', 'Qwen3 235B A22B', 'Qwen', 'flagship', 10),
      model('qwen-3-32b', 'Qwen3 32B', 'Qwen', 'fast', 20),
      model('llama3.3-70b', 'Llama 3.3 70B', 'Llama', 'standard', 30),
      model('llama3.1-8b', 'Llama 3.1 8B', 'Llama', 'fast', 40),
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    shortName: 'OR',
    icon: openrouterIcon,
    category: 'aggregator',
    protocol: 'openai-compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('openai/gpt-5.2', 'OpenAI GPT-5.2', 'OpenAI', 'flagship', 10),
      model('anthropic/claude-sonnet-4', 'Claude Sonnet 4', 'Anthropic', 'standard', 20),
      model('google/gemini-2.5-pro', 'Gemini 2.5 Pro', 'Google', 'flagship', 30),
      model('deepseek/deepseek-r1', 'DeepSeek R1', 'Reasoning', 'reasoning', 40),
      model('meta-llama/llama-3.3-70b-instruct', 'Llama 3.3 70B', 'Meta', 'standard', 50),
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    shortName: 'DS',
    icon: deepseekIcon,
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.deepseek.com',
    testEndpoint: '/v1/models',
    authHeader: 'Bearer',
    models: [
      model('deepseek-v4-pro', 'DeepSeek V4 Pro', 'DeepSeek V4', 'flagship', 10),
      model('deepseek-v4-flash', 'DeepSeek V4 Flash', 'DeepSeek V4', 'fast', 20),
      model('deepseek-reasoner', 'DeepSeek Reasoner', 'DeepSeek R1', 'reasoning', 30),
      model('deepseek-chat', 'DeepSeek Chat', 'DeepSeek V3', 'standard', 40),
    ],
  },
  {
    id: 'zhipu',
    name: 'Zhipu',
    shortName: 'ZP',
    icon: zhipuIcon,
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('glm-4-plus', 'GLM-4 Plus', 'GLM-4', 'flagship', 10),
      model('glm-4', 'GLM-4', 'GLM-4', 'standard', 20),
      model('glm-4-air', 'GLM-4 Air', 'GLM-4', 'fast', 30),
      model('glm-4-flash', 'GLM-4 Flash', 'GLM-4', 'fast', 40),
    ],
  },
  {
    id: 'dashscope',
    name: 'Qwen DashScope',
    shortName: 'QW',
    icon: dashscopeIcon,
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('qwen3-max', 'Qwen3 Max', 'Qwen3', 'flagship', 10),
      model('qwen3-coder-plus', 'Qwen3 Coder Plus', 'Qwen3', 'code', 20),
      model('qwen-max', 'Qwen Max', 'Qwen', 'flagship', 30),
      model('qwen-plus', 'Qwen Plus', 'Qwen', 'standard', 40),
      model('qwen-turbo', 'Qwen Turbo', 'Qwen', 'fast', 50),
    ],
  },
  {
    id: 'moonshot',
    name: 'Moonshot Kimi',
    shortName: 'KM',
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.moonshot.cn/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('kimi-k2-0905-preview', 'Kimi K2 Preview', 'Kimi K2', 'flagship', 10),
      model('kimi-k2-turbo-preview', 'Kimi K2 Turbo', 'Kimi K2', 'fast', 20),
      model('moonshot-v1-128k', 'Moonshot v1 128K', 'Moonshot v1', 'standard', 30),
      model('moonshot-v1-32k', 'Moonshot v1 32K', 'Moonshot v1', 'standard', 40),
      model('moonshot-v1-8k', 'Moonshot v1 8K', 'Moonshot v1', 'fast', 50),
    ],
  },
  {
    id: 'qianfan',
    name: 'Baidu Qianfan',
    shortName: 'BD',
    icon: qianfanIcon,
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://qianfan.baidubce.com/v2',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('ernie-5.0-thinking-preview', 'ERNIE 5.0 Thinking', 'ERNIE 5', 'reasoning', 10),
      model('ernie-4.5-turbo-128k', 'ERNIE 4.5 Turbo 128K', 'ERNIE 4.5', 'standard', 20),
      model('ernie-4.0-turbo-8k', 'ERNIE 4.0 Turbo 8K', 'ERNIE 4', 'standard', 30),
      model('ernie-x1-turbo-32k', 'ERNIE X1 Turbo 32K', 'ERNIE X1', 'reasoning', 40),
      model('deepseek-v3.2', 'DeepSeek V3.2', 'Hosted Models', 'standard', 50),
    ],
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    shortName: 'MM',
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.minimax.io/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('MiniMax-M1', 'MiniMax M1', 'MiniMax', 'reasoning', 10),
      model('abab6.5g-chat', 'ABAB 6.5g Chat', 'ABAB 6.5', 'flagship', 20),
      model('abab6.5s-chat', 'ABAB 6.5s Chat', 'ABAB 6.5', 'standard', 30),
      model('abab6.5t-chat', 'ABAB 6.5t Chat', 'ABAB 6.5', 'fast', 40),
    ],
  },
  {
    id: 'hunyuan',
    name: 'Tencent Hunyuan',
    shortName: 'HY',
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('hunyuan-large', 'Hunyuan Large', 'Hunyuan', 'flagship', 10),
      model('hunyuan-turbos-latest', 'Hunyuan TurboS', 'Hunyuan', 'fast', 20),
      model('hunyuan-standard', 'Hunyuan Standard', 'Hunyuan', 'standard', 30),
      model('hunyuan-lite', 'Hunyuan Lite', 'Hunyuan', 'fast', 40),
    ],
  },
  {
    id: 'volcengine',
    name: 'Volcengine Doubao',
    shortName: 'DB',
    icon: volcengineIcon,
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('doubao-seed-1-6-thinking-250715', 'Doubao Seed 1.6 Thinking', 'Doubao Seed 1.6', 'reasoning', 10),
      model('doubao-seed-1-6-250615', 'Doubao Seed 1.6', 'Doubao Seed 1.6', 'flagship', 20),
      model('doubao-1-5-pro-32k-250115', 'Doubao 1.5 Pro 32K', 'Doubao 1.5', 'standard', 30),
      model('doubao-1-5-lite-32k-250115', 'Doubao 1.5 Lite 32K', 'Doubao 1.5', 'fast', 40),
    ],
  },
  {
    id: 'baichuan',
    name: 'Baichuan AI',
    shortName: 'BC',
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.baichuan-ai.com/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('Baichuan4', 'Baichuan 4', 'Baichuan 4', 'flagship', 10),
      model('Baichuan3-Turbo-128k', 'Baichuan 3 Turbo 128K', 'Baichuan 3', 'standard', 20),
      model('Baichuan3-Turbo', 'Baichuan 3 Turbo', 'Baichuan 3', 'fast', 30),
      model('Baichuan2-Turbo', 'Baichuan 2 Turbo', 'Baichuan 2', 'fast', 40),
    ],
  },
  {
    id: 'stepfun',
    name: 'StepFun',
    shortName: 'ST',
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.stepfun.com/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('step-2-16k', 'Step 2 16K', 'Step 2', 'flagship', 10),
      model('step-1-256k', 'Step 1 256K', 'Step 1', 'standard', 20),
      model('step-1-32k', 'Step 1 32K', 'Step 1', 'standard', 30),
      model('step-1-8k', 'Step 1 8K', 'Step 1', 'fast', 40),
    ],
  },
  {
    id: 'lingyiwanwu',
    name: '01.AI',
    shortName: '01',
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.lingyiwanwu.com/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('yi-lightning', 'Yi Lightning', 'Yi', 'flagship', 10),
      model('yi-large', 'Yi Large', 'Yi', 'standard', 20),
      model('yi-medium', 'Yi Medium', 'Yi', 'fast', 30),
      model('yi-vision', 'Yi Vision', 'Yi Vision', 'standard', 40),
    ],
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    shortName: 'SF',
    category: 'china',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.siliconflow.cn/v1',
    testEndpoint: '/models',
    authHeader: 'Bearer',
    models: [
      model('Qwen/Qwen3-235B-A22B', 'Qwen3 235B A22B', 'Qwen', 'flagship', 10),
      model('Qwen/Qwen3-Coder-480B-A35B-Instruct', 'Qwen3 Coder 480B', 'Qwen', 'code', 20),
      model('deepseek-ai/DeepSeek-R1', 'DeepSeek R1', 'Reasoning', 'reasoning', 30),
      model('deepseek-ai/DeepSeek-V3', 'DeepSeek V3', 'DeepSeek', 'standard', 40),
      model('moonshotai/Kimi-K2-Instruct', 'Kimi K2 Instruct', 'Kimi', 'flagship', 50),
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama / Local',
    shortName: 'OL',
    icon: ollamaIcon,
    category: 'local',
    protocol: 'openai-compatible',
    baseUrl: 'http://localhost:11434/v1',
    testEndpoint: '/models',
    authHeader: 'none',
    apiKeyRequired: false,
    models: [
      model('llama3.3', 'Llama 3.3', 'Llama', 'local', 10),
      model('llama3.1', 'Llama 3.1', 'Llama', 'local', 20),
      model('qwen3', 'Qwen3', 'Qwen', 'local', 30),
      model('deepseek-r1', 'DeepSeek R1', 'Reasoning', 'reasoning', 40),
      model('mistral', 'Mistral', 'Mistral', 'local', 50),
      model('codellama', 'Code Llama', 'Code', 'code', 60),
    ],
  },
]

export function getProvider(id: ModelProvider): ProviderEntry {
  return modelProviders.find((provider) => provider.id === id) ?? modelProviders[0]
}
