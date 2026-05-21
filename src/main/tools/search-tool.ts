import { ToolName, type ToolEntity } from '@shared/types/tool'

export const SEARCH_TOOL_NAME: ToolName = 'search'
export const SEARCH_TOOL: ToolEntity = {
  name: SEARCH_TOOL_NAME,
  label: 'Search',
  description: 'DuckDuckGo autocomplete suggestions for tool-invoked query refinement.',
  enabled: true,
}

export function extractSearchQueryFromPrompt(content: string) {
  const normalized = content.trim()
  if (!normalized) return undefined

  const explicitToolMatch = normalized.match(/(?:^|\s)@tool\s+search\s+(.+)$/i)
  if (explicitToolMatch) {
    const query = explicitToolMatch[1]?.trim()
    return query && query.length ? query : undefined
  }

  const inlineMatch = normalized.match(/(?:^|[\s,.;:!?])search\s*:?\s+(.+)/i)
  if (inlineMatch) {
    const query = inlineMatch[1]?.trim()
    return query && query.length ? query : undefined
  }

  return undefined
}

export async function runSearchTool(query: string, signal?: AbortSignal) {
  const searchUrl = new URL('https://duckduckgo.com/ac/')
  searchUrl.searchParams.set('q', query)
  searchUrl.searchParams.set('type', 'list')

  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new Error('Search tool timed out'))
  }, 8000)

  const combinedSignals = combineSignals([signal, timeoutController.signal])
  try {
    const response = await fetch(searchUrl.toString(), { signal: combinedSignals })
    if (!response.ok) {
      throw new Error(`Search service returned ${response.status}`)
    }

    const payload = await response.json() as unknown
    if (!Array.isArray(payload)) {
      return `No search suggestions found for "${query}".`
    }

    const suggestions = payload
      .slice(0, 5)
      .map((item) => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item !== null) {
          const candidate = item as { phrase?: unknown }
          return typeof candidate.phrase === 'string' ? candidate.phrase : ''
        }
        return ''
      })
      .filter(Boolean)

    if (suggestions.length === 0) {
      return `No search suggestions found for "${query}".`
    }

    return `Top suggestions: ${suggestions.join('; ')}`
  } finally {
    clearTimeout(timeoutId)
  }
}

function combineSignals(signals: Array<AbortSignal | undefined>) {
  const validSignals = signals.filter((item): item is AbortSignal => Boolean(item))
  if (validSignals.length === 0) {
    return undefined
  }
  if (validSignals.length === 1) {
    return validSignals[0]
  }

  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any(validSignals)
  }

  const controller = new AbortController()
  const onAbort = (event: Event) => {
    const signal = event.target as AbortSignal
    controller.abort(signal.reason)
    removeListeners()
  }

  const removeListeners = () => {
    validSignals.forEach((signal) => signal.removeEventListener('abort', onAbort))
  }

  validSignals.forEach((signal) => signal.addEventListener('abort', onAbort))
  return controller.signal
}
