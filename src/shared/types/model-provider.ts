import type { LanguageModel } from 'ai'

export type AiSdkProviderPackage =
  | '@ai-sdk/openai'
  | '@ai-sdk/anthropic'
  | '@ai-sdk/google'
  | '@ai-sdk/xai'
  | '@ai-sdk/mistral'
  | '@ai-sdk/groq'
  | '@ai-sdk/cohere'
  | '@ai-sdk/deepseek'
  | '@ai-sdk/perplexity'
  | '@ai-sdk/togetherai'
  | '@ai-sdk/fireworks'
  | '@ai-sdk/cerebras'
  | '@ai-sdk/openai-compatible'

export interface AiSdkModelConfig {
  providerId: string
  modelId: string
  apiKey?: string
  baseUrl?: string
}

export interface AiSdkModelResolution {
  model: LanguageModel
  packageName: AiSdkProviderPackage
}
