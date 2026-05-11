import Anthropic from '@anthropic-ai/sdk'
import type { TestConnectionResult } from '@shared/types/ipc'

const DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com'
const CONNECTION_TIMEOUT_MS = 10_000

interface AnthropicClientOptions {
  apiKey: string
  baseUrl?: string
}

interface ErrorWithStatus {
  status?: number
  message?: string
}

function normalizeBaseUrl(baseUrl?: string) {
  const trimmedBaseUrl = baseUrl?.trim()
  if (!trimmedBaseUrl) {
    return DEFAULT_ANTHROPIC_BASE_URL
  }

  return trimmedBaseUrl.replace(/\/v1\/?$/, '').replace(/\/$/, '')
}

export function createAnthropicClient({ apiKey, baseUrl }: AnthropicClientOptions) {
  return new Anthropic({
    apiKey,
    baseURL: normalizeBaseUrl(baseUrl),
    timeout: CONNECTION_TIMEOUT_MS,
    maxRetries: 0,
  })
}

export async function testAnthropicConnection(
  baseUrl: string,
  apiKey: string,
): Promise<TestConnectionResult> {
  const start = Date.now()

  try {
    const client = createAnthropicClient({ apiKey, baseUrl })
    await client.models.list({ limit: 1 })

    return {
      ok: true,
      status: 200,
      latency: Date.now() - start,
    }
  } catch (err) {
    const error = err as ErrorWithStatus

    return {
      ok: false,
      status: typeof error.status === 'number' ? error.status : 0,
      latency: Date.now() - start,
      error: error.message ?? 'Unknown Anthropic connection error',
    }
  }
}
