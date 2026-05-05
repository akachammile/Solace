import { FilePlus2 } from 'lucide-react'
import { getArtifactIcon } from '../data/bionicConsoleConfig'
import type { ArtifactConfig } from '../types'

interface ArtifactsSidebarProps {
  artifacts: ArtifactConfig[]
  activeArtifactId: string
  onCreateArtifact: () => void
  onSelectArtifact: (artifactId: string) => void
}

export function ArtifactsSidebar({
  artifacts,
  activeArtifactId,
  onCreateArtifact,
  onSelectArtifact,
}: ArtifactsSidebarProps) {
  return (
    <aside className="bc-artifacts">
      <div className="bc-sidebar-header">
        <span className="bc-panel-label">ARTIFACTS</span>
        <button
          aria-label="新建 Artifact"
          className="bc-icon-button"
          onClick={onCreateArtifact}
          type="button"
        >
          <FilePlus2 size={16} />
        </button>
      </div>

      <div className="bc-artifact-list">
        {artifacts.map((artifact) => (
          <button
            className={`bc-artifact-row bc-accent-${artifact.accent}${activeArtifactId === artifact.id ? ' bc-artifact-row--active' : ''}`}
            key={artifact.id}
            onClick={() => onSelectArtifact(artifact.id)}
            type="button"
          >
            <span className="bc-artifact-row__icon">{getArtifactIcon(artifact.type)}</span>
            <span className="bc-artifact-row__title">{artifact.title}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
