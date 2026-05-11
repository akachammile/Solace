import { useState, useEffect } from 'react'
import type { ModelProvider } from '@/types/ui'

export interface ProviderSettings {
  apiKey: string
  baseUrl?: string
  enabled: boolean
}

export type SettingsMap = Partial<Record<ModelProvider, ProviderSettings>>

const STORAGE_KEY = 'solace-settings'

export function useSettings() {
  const [settings, setSettings] = useState<SettingsMap>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateProviderSettings = (provider: ModelProvider, partial: Partial<ProviderSettings>) => {
    setSettings((prev) => ({
      ...prev,
      [provider]: {
        ...(prev[provider] || { apiKey: '', enabled: false }),
        ...partial,
      },
    }))
  }

  return {
    settings,
    updateProviderSettings,
  }
}
