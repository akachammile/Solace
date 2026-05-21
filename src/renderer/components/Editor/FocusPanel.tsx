import { useTranslation } from 'react-i18next'
import { CircleDot, GitBranch } from 'lucide-react'
import type {
  ActionConfig,
  ArtifactConfig,
  FocusTabId,
  KnowledgeSourceConfig,
  WorkspaceConfig,
} from './types'

interface FocusPanelProps {
  activeTabId: FocusTabId
  activeArtifact: ArtifactConfig
  focusTabs: WorkspaceConfig['focusTabs']
  nextActions: ActionConfig[]
  knowledgeSources: KnowledgeSourceConfig[]
  onSwitchTab: (tabId: FocusTabId) => void
}

export function FocusPanel({
  activeTabId,
  activeArtifact,
  focusTabs,
  nextActions,
  knowledgeSources,
  onSwitchTab,
}: FocusPanelProps) {
  const { t } = useTranslation()

  return (
    <aside className="editor-focus-panel">
      <div className="editor-focus-tabs">
        {focusTabs.map((tab) => (
          <button
            className={`editor-focus-tab${activeTabId === tab.id ? ' editor-focus-tab--active' : ''}`}
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="editor-focus-panel__body">
        {activeTabId === 'focus' ? (
          <>
            <div className="editor-focus-current-card">
              <div>
                <CircleDot aria-hidden="true" />
                <span>{t('editor.focusedAt')}</span>
              </div>
              <strong>{activeArtifact.title}</strong>
            </div>

            <div className="editor-focus-actions">
              <span className="editor-focus-label">{t('editor.nextAction')}</span>
              <div className="editor-focus-action-list">
                {nextActions.map((action) => (
                  <button className="editor-focus-action" key={action.id} type="button">
                    <span className="editor-focus-action__icon">{action.icon}</span>
                    <span>
                      <strong>{action.title}</strong>
                      <small>{action.meta}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-focus-flow">
              <div>
                <GitBranch aria-hidden="true" />
                <span>{t('editor.focusFlow')}</span>
              </div>
              <div className="editor-focus-flow__bar">
                <span />
              </div>
              <p>{t('editor.focusFlowDescription')}</p>
            </div>
          </>
        ) : (
          <div className="editor-focus-knowledge-list">
            <span className="editor-focus-label">{t('editor.knowledgeSources')}</span>
            {knowledgeSources.map((source) => (
              <button className="editor-focus-knowledge-source" key={source.id} type="button">
                <strong>{source.title}</strong>
                <small>{source.meta}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
