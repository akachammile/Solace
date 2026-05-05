import { SendHorizontal } from 'lucide-react'
import type { ConsoleTabId, ConsoleToolConfig, WorkspaceConfig } from '../types'

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
  return (
    <section className="bc-console-dock">
      <div className="bc-console-tabs">
        {tabs.map((tab) => (
          <button
            className={`bc-console-tab${activeTabId === tab.id ? ' bc-console-tab--active' : ''}`}
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bc-agent-note">
        <span>AI BIONIC INTELLIGENCE</span>
        <p>一张白纸。输入内容，或者在右侧查看我的行动建议。</p>
      </div>

      <div className="bc-composer">
        <div className="bc-composer__tools">
          {tools.map((tool) => (
            <button key={tool.id} type="button">
              {tool.icon}
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
        <div className="bc-composer__input">
          <textarea placeholder="探讨当前主题..." rows={1} />
          <button aria-label="发送" className="bc-send-button" type="button">
            <SendHorizontal size={19} />
          </button>
        </div>
      </div>
    </section>
  )
}
