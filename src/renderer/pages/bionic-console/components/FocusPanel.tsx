import { CircleDot, GitBranch } from 'lucide-react'
import type {
  ActionConfig,
  ArtifactConfig,
  FocusTabId,
  KnowledgeSourceConfig,
  WorkspaceConfig,
} from '../types'

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
  return (
    <aside className="bc-focus-panel">
      <div className="bc-focus-tabs">
        {focusTabs.map((tab) => (
          <button
            className={`bc-focus-tab${activeTabId === tab.id ? ' bc-focus-tab--active' : ''}`}
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bc-focus-panel__body">
        {activeTabId === 'focus' ? (
          <>
            <div className="bc-focused-card">
              <div>
                <CircleDot size={17} />
                <span>FOCUSED AT</span>
              </div>
              <strong>{activeArtifact.title}</strong>
            </div>

            <div className="bc-next-action-group">
              <span className="bc-panel-label">NEXT ACTION</span>
              <div className="bc-next-action-list">
                {nextActions.map((action) => (
                  <button className="bc-next-action" key={action.id} type="button">
                    <span className="bc-next-action__icon">{action.icon}</span>
                    <span>
                      <strong>{action.title}</strong>
                      <small>{action.meta}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bc-flow-card">
              <div>
                <GitBranch size={16} />
                <span>FOCUS FLOW</span>
              </div>
              <div className="bc-flow-card__bar">
                <span />
              </div>
              <p>已经为您维持专注 42 分钟。建议完成当前节点后稍微休息。</p>
            </div>
          </>
        ) : (
          <div className="bc-knowledge-list">
            <span className="bc-panel-label">KNOWLEDGE SOURCES</span>
            {knowledgeSources.map((source) => (
              <button className="bc-knowledge-source" key={source.id} type="button">
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
