/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { getProvider } from '@/data/model-catalog'
import type { SettingsState } from '@/types/ui'

interface SettingsContextValue {
  settings: SettingsState
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
}

const defaultSettings: SettingsState = {
  language: 'zh',
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
  apiKey: '',
  baseUrl: 'https://api.anthropic.com',
  temperature: 0.7,
  knowledgePath: './knowledge',
  allowWebSearch: true,
  agentConfig: {
    command: 'npx',
    args: 'tsx agent.ts',
    cwd: '~',
  },
  skillsConfig: {
    webSearch: true,
    fileOperations: true,
    terminal: false,
    mcp: false,
    codeInterpreter: true,
    rag: true,
  },
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
      ...(key === 'provider'
        ? {
            model: getProvider(value as SettingsState['provider']).models[0].id,
            baseUrl: getProvider(value as SettingsState['provider']).baseUrl,
          }
        : {}),
    }))
  }

  const value = useMemo(() => ({ settings, updateSetting }), [settings])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettingsState() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error('useSettingsState must be used within SettingsProvider')
  }

  return context
}
