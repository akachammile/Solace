import { ArtifactsSidebar } from '@/components/Editor/ArtifactsSidebar'
import { CreatorAxis } from '@/components/Editor/CreatorAxis'
import { FocusPanel } from '@/components/Editor/FocusPanel'
import { GoldenRatioLayout } from '@/components/layout/GoldenRatioLayout'
import type {
  ArtifactConfig,
  ConsoleTabId,
  FocusTabId,
  SpaceConfig,
  WorkspaceConfig,
} from '@/components/Editor/types'
import './workspace.css'

interface WorkspacePageProps {
  space: SpaceConfig
  activeArtifact: ArtifactConfig
  activeFocusTabId: FocusTabId
  activeConsoleTabId: ConsoleTabId
  config: WorkspaceConfig
  onCreateArtifact: () => void
  onSelectArtifact: (artifactId: string) => void
  onSwitchFocusTab: (tabId: FocusTabId) => void
  onSwitchConsoleTab: (tabId: ConsoleTabId) => void
}

export function WorkspacePage({
  space,
  activeArtifact,
  activeFocusTabId,
  activeConsoleTabId,
  config,
  onCreateArtifact,
  onSelectArtifact,
  onSwitchFocusTab,
  onSwitchConsoleTab,
}: WorkspacePageProps) {
  return (
    <GoldenRatioLayout
      leftPanel={
        <ArtifactsSidebar
          artifacts={space.artifacts}
          activeArtifactId={activeArtifact.id}
          onCreateArtifact={onCreateArtifact}
          onSelectArtifact={onSelectArtifact}
        />
      }
      mainPanel={
        <CreatorAxis
          artifact={activeArtifact}
          activeConsoleTabId={activeConsoleTabId}
          consoleTabs={config.consoleTabs}
          consoleTools={config.consoleTools}
          onSwitchConsoleTab={onSwitchConsoleTab}
        />
      }
      rightPanel={
        <FocusPanel
          activeTabId={activeFocusTabId}
          activeArtifact={activeArtifact}
          focusTabs={config.focusTabs}
          nextActions={config.nextActions}
          knowledgeSources={config.knowledgeSources}
          onSwitchTab={onSwitchFocusTab}
        />
      }
    />
  )
}
