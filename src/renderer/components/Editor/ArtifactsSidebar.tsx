import { useTranslation } from 'react-i18next'
import { FileCode2, FilePlus2, FileText, GitBranch } from 'lucide-react'
import type { ArtifactConfig } from './types'

interface ArtifactsSidebarProps {
  artifacts: ArtifactConfig[]
  activeArtifactId: string
  onCreateArtifact: () => void
  onSelectArtifact: (artifactId: string) => void
}

function getArtifactIcon(type: ArtifactConfig['type']) {
  if (type === 'canvas') return <GitBranch aria-hidden="true" />
  if (type === 'code') return <FileCode2 aria-hidden="true" />
  return <FileText aria-hidden="true" />
}

export function ArtifactsSidebar({
  artifacts,
  activeArtifactId,
  onCreateArtifact,
  onSelectArtifact,
}: ArtifactsSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="editor-artifacts-sidebar">
      <div className="editor-artifacts-header">
        <span className="editor-artifacts-label">{t('editor.artifacts')}</span>
        <button
          aria-label={t('editor.newArtifact')}
          className="editor-artifacts-icon-button"
          onClick={onCreateArtifact}
          type="button"
        >
          <FilePlus2 aria-hidden="true" />
        </button>
      </div>

      <div className="editor-artifacts-list">
        {artifacts.map((artifact) => (
          <button
            className={`editor-artifact-row editor-artifact-accent-${artifact.accent}${activeArtifactId === artifact.id ? ' editor-artifact-row--active' : ''}`}
            key={artifact.id}
            onClick={() => onSelectArtifact(artifact.id)}
            type="button"
          >
            <span className="editor-artifact-row__icon">{getArtifactIcon(artifact.type)}</span>
            <span className="editor-artifact-row__title">{artifact.title}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
