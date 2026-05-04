import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppProvider, useAppState } from '@/state/app-context'
import { ChatProvider } from '@/state/chat-context'
import { SettingsProvider, useSettingsState } from '@/state/settings-context'
import { ChatView } from '@/pages/chat/ChatView'
import { ImageGenView } from '@/pages/image/ImageGenView'
import { ScaleView } from '@/pages/scale/ScaleView'
import { PetView } from '@/pages/pet/PetView'
import { KnowledgeView } from '@/pages/knowledge/KnowledgeView'
import { SettingsView } from '@/pages/settings/SettingsView'
import { ShellChrome } from '@/components/ShellChrome'
import './App.css'

function AppContent() {
  const { activeView } = useAppState()
  const { settings } = useSettingsState()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language)
    }
  }, [settings.language, i18n])

  return (
    <div className="app-shell">
      <ShellChrome />
      <main className="page-content">
        {activeView === 'chat' && <ChatView />}
        {activeView === 'image' && <ImageGenView />}
        {activeView === 'scale' && <ScaleView />}
        {activeView === 'pet' && <PetView />}
        {activeView === 'knowledge' && <KnowledgeView />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <ChatProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ChatProvider>
    </SettingsProvider>
  )
}
