import { useState } from 'react'
import { AppTopBar } from '@/pages/bionic-console/components/AppTopBar'
import { ContextSidebar } from '@/components/sidebar/ContextSidebar'
import { WorkbenchPage } from '@/pages/workbench/WorkbenchPage'
import { SettingsOverlay } from '@/components/settings/SettingsOverlay'
import './App.css'

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [viewState, setViewState] = useState<'welcome' | 'chat'>('welcome')

  return (
    <div className="app-shell">
      <AppTopBar />
      <div className="app-main">
        <ContextSidebar onNewSession={() => setViewState('welcome')} />
        <main className="page-content">
          <WorkbenchPage 
            viewState={viewState} 
            onStartChat={() => setViewState('chat')} 
          />
        </main>
      </div>
      
      {isSettingsOpen && <SettingsOverlay onClose={() => setIsSettingsOpen(false)} />}
    </div>
  )
}

export default function App() {
  return <AppContent />
}
