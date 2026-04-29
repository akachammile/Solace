import { AppProvider, useAppState } from './state/app-context'
import { ChatProvider } from './state/chat-context'
import { SettingsProvider } from './state/settings-context'
import { ChatView } from './features/chat/ChatView'
import { ImageGenView } from './features/image/ImageGenView'
import { ScaleView } from './features/scale/ScaleView'
import { PetView } from './features/pet/PetView'
import { KnowledgeView } from './features/knowledge/KnowledgeView'
import { SettingsView } from './features/settings/SettingsView'
import { ShellChrome } from './components/ShellChrome'
import './App.css'

function AppContent() {
  const { activeView } = useAppState()

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
