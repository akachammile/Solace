import { useState } from 'react'
import { AppRail } from '@/components/layout/AppRail'
import { AppTopBar } from '@/components/layout/AppTopBar'
import { MainPage } from '@/pages/Main/MainPage'
import { SettingsOverlay } from '@/pages/Settings/SettingsPage'

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="app-content-wrapper">
        <AppTopBar />
        <div className="app-main">
          <main className="page-content">
            <div className="page-content__surface">
              <MainPage
                onOpenSettings={() => setIsSettingsOpen(true)}
                rail={(
                  <AppRail
                    activeItemId={isSettingsOpen ? 'settings' : 'chat'}
                    theme={theme}
                    onOpenChat={() => setIsSettingsOpen(false)}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onToggleTheme={() => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')}
                  />
                )}
              />
            </div>
          </main>
        </div>
      </div>
      
      {isSettingsOpen && <SettingsOverlay onClose={() => setIsSettingsOpen(false)} />}
    </div>
  )
}

export default function App() {
  return <AppContent />
}
