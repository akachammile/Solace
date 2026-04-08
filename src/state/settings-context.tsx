/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SettingsState } from '../types/ui'

interface SettingsContextValue {
  settings: SettingsState
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
}

const defaultSettings: SettingsState = {
  provider: 'openai',
  model: 'gpt-4.1-mini',
  temperature: 0.7,
  knowledgePath: './knowledge',
  allowWebSearch: true,
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
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
