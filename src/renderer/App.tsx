import { useState, useMemo } from 'react'
import { AppTopBar } from '@/pages/bionic-console/components/AppTopBar'
import { IndexPage } from '@/pages/index/IndexPage'
import { WorkspacePage } from '@/pages/workspace/WorkspacePage'
import { SettingsOverlay } from '@/components/settings/SettingsOverlay'
import { createSpace, initialSpaces, workspaceConfig } from '@/pages/bionic-console/data/bionicConsoleConfig'
import type { ArtifactConfig, ConsoleTabId, FocusTabId, SpaceConfig } from '@/pages/bionic-console/types'
import './App.css'
import '@/pages/bionic-console/bionic-console.css'

type AppRoute = 'index' | 'workspace'

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('index')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const [spaces, setSpaces] = useState<SpaceConfig[]>(initialSpaces)
  const [activeSpaceId, setActiveSpaceId] = useState(initialSpaces[0].id)
  const [activeArtifactId, setActiveArtifactId] = useState(initialSpaces[0].artifacts[0].id)
  const [activeFocusTabId, setActiveFocusTabId] = useState<FocusTabId>('focus')
  const [activeConsoleTabId, setActiveConsoleTabId] = useState<ConsoleTabId>('agent')

  const activeSpace = useMemo(
    () => spaces.find((space) => space.id === activeSpaceId) ?? spaces[0],
    [activeSpaceId, spaces],
  )

  const activeArtifact = useMemo(
    () => activeSpace.artifacts.find((artifact) => artifact.id === activeArtifactId) ?? activeSpace.artifacts[0],
    [activeArtifactId, activeSpace],
  )

  const openSpace = (spaceId: string) => {
    const targetSpace = spaces.find((space) => space.id === spaceId)
    if (!targetSpace) return
    setActiveSpaceId(targetSpace.id)
    setActiveArtifactId(targetSpace.artifacts[0].id)
    setCurrentRoute('workspace')
  }

  const handleCreateSpace = () => {
    const nextSpace = createSpace(spaces.length + 1)
    setSpaces((currentSpaces) => [nextSpace, ...currentSpaces])
    setActiveSpaceId(nextSpace.id)
    setActiveArtifactId(nextSpace.artifacts[0].id)
    setCurrentRoute('workspace')
  }

  const handleCreateArtifact = () => {
    const artifactId = `artifact-${Date.now()}`
    const nextArtifact: ArtifactConfig = {
      id: artifactId,
      title: '新起点.md',
      extension: '.md',
      type: 'md',
      accent: 'blue',
      content: '',
    }
    setSpaces((currentSpaces) =>
      currentSpaces.map((space) =>
        space.id === activeSpace.id
          ? { ...space, artifacts: [nextArtifact, ...space.artifacts], focusTitle: nextArtifact.title }
          : space,
      ),
    )
    setActiveArtifactId(artifactId)
  }

  return (
    <div className="app-shell">
      <AppTopBar
        title={currentRoute === 'index' ? 'Solace' : activeSpace.title}
        onOpenHome={() => setCurrentRoute('index')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <main className="page-content">
        {currentRoute === 'index' && (
          <IndexPage
            spaces={spaces}
            onCreateSpace={handleCreateSpace}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenSpace={openSpace}
          />
        )}
        {currentRoute === 'workspace' && (
          <WorkspacePage
            space={activeSpace}
            activeArtifact={activeArtifact}
            activeFocusTabId={activeFocusTabId}
            activeConsoleTabId={activeConsoleTabId}
            config={workspaceConfig}
            onCreateArtifact={handleCreateArtifact}
            onSelectArtifact={setActiveArtifactId}
            onSwitchFocusTab={setActiveFocusTabId}
            onSwitchConsoleTab={setActiveConsoleTabId}
          />
        )}
      </main>
      
      {isSettingsOpen && <SettingsOverlay onClose={() => setIsSettingsOpen(false)} />}
    </div>
  )
}

export default function App() {
  return <AppContent />
}
