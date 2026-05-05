import { Download } from 'lucide-react'
import { AdaptiveCanvas } from './AdaptiveCanvas'
import { ConsoleDock } from './ConsoleDock'
import type { ArtifactConfig, ConsoleTabId, ConsoleToolConfig, WorkspaceConfig } from '../types'

interface CreatorAxisProps {
  artifact: ArtifactConfig
  activeConsoleTabId: ConsoleTabId
  consoleTabs: WorkspaceConfig['consoleTabs']
  consoleTools: ConsoleToolConfig[]
  onSwitchConsoleTab: (tabId: ConsoleTabId) => void
}

export function CreatorAxis({
  artifact,
  activeConsoleTabId,
  consoleTabs,
  consoleTools,
  onSwitchConsoleTab,
}: CreatorAxisProps) {
  return (
    <main className="bc-creator-axis">
      <div className="bc-axis-toolbar">
        <div>
          <span className="bc-panel-label">CREATOR AXIS</span>
          <strong>{artifact.title}</strong>
        </div>
        <button className="bc-export-button" type="button">
          <Download size={15} />
          <span>导出</span>
        </button>
      </div>

      <AdaptiveCanvas artifact={artifact} />

      <ConsoleDock
        activeTabId={activeConsoleTabId}
        tabs={consoleTabs}
        tools={consoleTools}
        onSwitchTab={onSwitchConsoleTab}
      />
    </main>
  )
}
