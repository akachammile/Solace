/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ViewType } from '../types/ui'

interface AppContextValue {
  activeView: ViewType
  setActiveView: (view: ViewType) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewType>('chat')
  const value = useMemo(() => ({ activeView, setActiveView }), [activeView])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppState must be used within AppProvider')
  }

  return context
}
