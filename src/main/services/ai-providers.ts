import { createAnthropic } from '@ai-sdk/anthropic'
import { createCerebras } from '@ai-sdk/cerebras'
import { createCohere } from '@ai-sdk/cohere'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createFireworks } from '@ai-sdk/fireworks'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { createMistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createPerplexity } from '@ai-sdk/perplexity'
import { createTogetherAI } from '@ai-sdk/togetherai'
import { createXai } from '@ai-sdk/xai'
import type { LanguageModel } from 'ai'
import type {
  AiSdkModelConfig,
  AiSdkModelResolution,
  AiSdkProviderPackage,
} from '@shared/types/model-provider'

interface ProviderSettings {
  apiKey?: string
  baseURL?: string
}

type AiSdkProvider = (modelId: string) => LanguageModel

interface ProviderAdapter {
  packageName: AiSdkProviderPackage
  createProvider: (settings: ProviderSettings) => AiSdkProvider
}

const directProviderAdapters: Record<string, ProviderAdapter> = {
  openai: {
    packageName: '@ai-sdk/openai',
    createProvider: (settings) => createOpenAI(settings) as AiSdkProvider,
  },
  anthropic: {
    packageName: '@ai-sdk/anthropic',
    createProvider: (settings) => createAnthropic(settings) as AiSdkProvider,
  },
  gemini: {
    packageName: '@ai-sdk/google',
    createProvider: (settings) => createGoogleGenerativeAI(settings) as AiSdkProvider,
  },
  xai: {
    packageName: '@ai-sdk/xai',
    createProvider: (settings) => createXai(settings) as AiSdkProvider,
  },
  mistral: {
    packageName: '@ai-sdk/mistral',
    createProvider: (settings) => createMistral(settings) as AiSdkProvider,
  },
  groq: {
    packageName: '@ai-sdk/groq',
    createProvider: (settings) => createGroq(settings) as AiSdkProvider,
  },
  cohere: {
    packageName: '@ai-sdk/cohere',
    createProvider: (settings) => createCohere(settings) as AiSdkProvider,
  },
  deepseek: {
    packageName: '@ai-sdk/deepseek',
    createProvider: (settings) => createDeepSeek(settings) as AiSdkProvider,
  },
  perplexity: {
    packageName: '@ai-sdk/perplexity',
    createProvider: (settings) => createPerplexity(settings) as AiSdkProvider,
  },
  together: {
    packageName: '@ai-sdk/togetherai',
    createProvider: (settings) => createTogetherAI(settings) as AiSdkProvider,
  },
  fireworks: {
    packageName: '@ai-sdk/fireworks',
    createProvider: (settings) => createFireworks(settings) as AiSdkProvider,
  },
  cerebras: {
    packageName: '@ai-sdk/cerebras',
    createProvider: (settings) => createCerebras(settings) as AiSdkProvider,
  },
}

function optionalString(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function createProviderSettings(config: AiSdkModelConfig): ProviderSettings {
  return {
    apiKey: optionalString(config.apiKey),
    baseURL: optionalString(config.baseUrl),
  }
}

function createOpenAICompatibleProvider(config: AiSdkModelConfig): AiSdkProvider {
  const baseURL = optionalString(config.baseUrl)

  if (!baseURL) {
    throw new Error(`Provider ${config.providerId} requires a base URL for @ai-sdk/openai-compatible`)
  }

  return createOpenAICompatible({
    name: config.providerId,
    baseURL,
    apiKey: optionalString(config.apiKey),
  }) as AiSdkProvider
}

export function getAiSdkProviderPackage(providerId: string): AiSdkProviderPackage {
  return directProviderAdapters[providerId]?.packageName ?? '@ai-sdk/openai-compatible'
}

export function createAiSdkModel(config: AiSdkModelConfig): AiSdkModelResolution {
  const modelId = optionalString(config.modelId)

  if (!modelId) {
    throw new Error('AI SDK model ID is required')
  }

  const directAdapter = directProviderAdapters[config.providerId]
  const provider = directAdapter
    ? directAdapter.createProvider(createProviderSettings(config))
    : createOpenAICompatibleProvider(config)

  return {
    model: provider(modelId),
    packageName: directAdapter?.packageName ?? '@ai-sdk/openai-compatible',
  }
}
