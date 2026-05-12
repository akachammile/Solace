import { useEffect, useState } from 'react'
import type { ModelProvider } from '@/types/ui'

export interface ProviderSettings {
  apiKey: string
  baseUrl?: string
  enabled: boolean
  selectedModelId?: string
}

export type ProviderSettingsMap = Partial<Record<ModelProvider, ProviderSettings>>

export interface WorkspaceSettings {
  knowledgePath: string
  allowWebSearch: boolean
}

export interface AgentSettings {
  command: string
  args: string
  workingDir: string
}

export interface McpServerSettings {
  id: string
  name: string
  command: string
  args: string
  enabled: boolean
}

export type SkillSettings = Record<string, boolean>

export interface AppSettings {
  providers: ProviderSettingsMap
  workspace: WorkspaceSettings
  agent: AgentSettings
  mcp: McpServerSettings[]
  skills: SkillSettings
}

const STORAGE_KEY = 'solace-settings'

const defaultProviderSettings: ProviderSettings = {
  apiKey: '',
  enabled: false,
}

const defaultSettings: AppSettings = {
  providers: {},
  workspace: {
    knowledgePath: '',
    allowWebSearch: false,
  },
  agent: {
    command: '',
    args: '',
    workingDir: '',
  },
  mcp: [],
  skills: {
    'web-search': false,
    'file-operations': true,
    terminal: false,
    mcp: false,
    'code-interpreter': false,
    rag: false,
  },
}

const legacyProviderKeys: ModelProvider[] = ['openai', 'anthropic', 'gemini', 'deepseek', 'zhipu', 'custom']

function normalizeProviderSettings(
  config: (Partial<ProviderSettings> & { enabledModels?: string[] }) | undefined,
): ProviderSettings | undefined {
  if (!config) return undefined
  const selectedModelId = config.selectedModelId ?? config.enabledModels?.[0]

  return {
    apiKey: config.apiKey ?? defaultProviderSettings.apiKey,
    baseUrl: config.baseUrl,
    enabled: config.enabled ?? defaultProviderSettings.enabled,
    selectedModelId,
  }
}

function normalizeProviders(providers: ProviderSettingsMap | undefined): ProviderSettingsMap {
  return Object.entries(providers ?? {}).reduce<ProviderSettingsMap>((acc, [provider, providerSettings]) => {
    const config = normalizeProviderSettings(providerSettings)
    if (config) acc[provider] = config
    return acc
  }, {})
}

function parseSavedSettings(): AppSettings {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultSettings

  try {
    const parsed = JSON.parse(saved) as Partial<AppSettings> & ProviderSettingsMap
    const hasLegacyProviders = legacyProviderKeys.some((provider) => provider in parsed)

    if (hasLegacyProviders && !('providers' in parsed)) {
      return {
        ...defaultSettings,
        providers: normalizeProviders(parsed),
      }
    }

    return {
      ...defaultSettings,
      ...parsed,
      providers: {
        ...defaultSettings.providers,
        ...normalizeProviders(parsed.providers),
      },
      workspace: {
        ...defaultSettings.workspace,
        ...(parsed.workspace ?? {}),
      },
      agent: {
        ...defaultSettings.agent,
        ...(parsed.agent ?? {}),
      },
      mcp: parsed.mcp ?? defaultSettings.mcp,
      skills: {
        ...defaultSettings.skills,
        ...(parsed.skills ?? {}),
      },
    }
  } catch {
    return defaultSettings
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(parseSavedSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateProviderSettings = (provider: ModelProvider, partial: Partial<ProviderSettings>) => {
    setSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...(prev.providers[provider] || defaultProviderSettings),
          ...partial,
        },
      },
    }))
  }

  const updateWorkspaceSettings = (partial: Partial<WorkspaceSettings>) => {
    setSettings((prev) => ({
      ...prev,
      workspace: {
        ...prev.workspace,
        ...partial,
      },
    }))
  }

  const updateAgentSettings = (partial: Partial<AgentSettings>) => {
    setSettings((prev) => ({
      ...prev,
      agent: {
        ...prev.agent,
        ...partial,
      },
    }))
  }

  const addMcpServer = () => {
    setSettings((prev) => ({
      ...prev,
      mcp: [
        ...prev.mcp,
        {
          id: `mcp-${Date.now()}`,
          name: 'New MCP Server',
          command: '',
          args: '',
          enabled: false,
        },
      ],
    }))
  }

  const updateMcpServer = (id: string, partial: Partial<McpServerSettings>) => {
    setSettings((prev) => ({
      ...prev,
      mcp: prev.mcp.map((server) => (
        server.id === id
          ? { ...server, ...partial }
          : server
      )),
    }))
  }

  const removeMcpServer = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      mcp: prev.mcp.filter((server) => server.id !== id),
    }))
  }

  const updateSkillSettings = (skillId: string, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillId]: enabled,
      },
    }))
  }

  return {
    settings,
    updateProviderSettings,
    updateWorkspaceSettings,
    updateAgentSettings,
    addMcpServer,
    updateMcpServer,
    removeMcpServer,
    updateSkillSettings,
  }
}
