import { useTranslation } from 'react-i18next'
import { SendHorizontal } from 'lucide-react'
import type { ConsoleTabId, ConsoleToolConfig, WorkspaceConfig } from './types'

interface ConsoleDockProps {
  activeTabId: ConsoleTabId
  tabs: WorkspaceConfig['consoleTabs']
  tools: ConsoleToolConfig[]
  onSwitchTab: (tabId: ConsoleTabId) => void
}

export function ConsoleDock({
  activeTabId,
  tabs,
  tools,
  onSwitchTab,
}: ConsoleDockProps) {
  const { t } = useTranslation()

  return (
    <section className="editor-console-dock">
      <div className="editor-console-tabs">
        {tabs.map((tab) => (
          <button
            className={`editor-console-tab${activeTabId === tab.id ? ' editor-console-tab--active' : ''}`}
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="editor-console-note">
        <span>{t('editor.aiBionicIntelligence')}</span>
        <p>{t('editor.blankCanvasHint')}</p>
      </div>

      <div className="editor-console-composer">
        <div className="editor-console-composer__tools">
          {tools.map((tool) => (
            <button key={tool.id} type="button">
              {tool.icon}
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
        <div className="editor-console-composer__input">
          <textarea placeholder={t('editor.discussPlaceholder')} rows={1} />
          <button aria-label={t('editor.send')} className="editor-console-send-button" type="button">
            <SendHorizontal aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
