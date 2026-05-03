import { ChevronDown, MoreHorizontal, Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getProvider } from '@/data/model-catalog'
import { useChatState } from '@/state/chat-context'
import { useSettingsState } from '@/state/settings-context'
import { PermissionDialog } from '@/features/acp/PermissionDialog'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import './chat.css'

export function ChatView() {
  const { t } = useTranslation()
  const { settings } = useSettingsState()
  const {
    sessions, activeSessionId, createSession, switchSession, deleteSession,
    activeMessages, sendMessage, clearMessages, cancelGenerating,
    isStreaming, agentStatus, permissionRequest, resolvePermission,
  } = useChatState()

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const activeProvider = getProvider(settings.provider)

  const agentRunning = agentStatus === 'running'

  return (
    <div className="two-tier-layout">
      <aside className="two-tier-layout__sidebar">
        <div className="two-tier-sidebar-header">
          <button
            className="two-tier-action-btn"
            onClick={() => createSession({
              command: settings.agentConfig.command,
              args: settings.agentConfig.args.split(/\s+/).filter(Boolean),
              cwd: settings.agentConfig.cwd,
            })}
            disabled={isStreaming && !agentRunning}
            type="button"
          >
            <Plus size={16} />
            <span>{t('chat.newChat')}</span>
          </button>
        </div>

        <div className="two-tier-list">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`two-tier-capsule ${activeSessionId === session.id ? 'two-tier-capsule--active' : ''}`}
            >
              <button
                className="two-tier-capsule__label"
                onClick={() => switchSession(session.id)}
                type="button"
              >
                <span className="two-tier-capsule__title">{session.title}</span>
              </button>
              <button
                className="two-tier-capsule__more"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpenId(menuOpenId === session.id ? null : session.id)
                }}
                type="button"
                aria-label={t('chat.moreActions')}
              >
                <MoreHorizontal size={14} />
              </button>
              {menuOpenId === session.id && (
                <div className="two-tier-capsule__menu">
                  <button
                    className="two-tier-capsule__menu-item two-tier-capsule__menu-item--danger"
                    onClick={() => {
                      setMenuOpenId(null)
                      deleteSession(session.id)
                    }}
                    type="button"
                  >
                    {t('chat.delete')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {agentStatus === 'error' && (
          <div className="chat-agent-error">
            {t('chat.agentConnectionLost')}
          </div>
        )}
      </aside>

      {activeSessionId ? (
        <main className="two-tier-layout__detail">
          <div className="chat-two-tier">
            <div className="chat-tier-model">
              <span className="chat-tier-model__name">{activeProvider.name}</span>
              <span className="chat-tier-model__divider">/</span>
              <strong className="chat-tier-model__variant">{settings.model}</strong>
              <ChevronDown size={14} className="chat-tier-model__chevron" />
              {agentStatus === 'running' && <span className="chat-agent-dot" />}
            </div>

            <MessageList messages={activeMessages} />
            <ChatInput
              onSend={sendMessage}
              onClear={clearMessages}
              onCancel={cancelGenerating}
              isStreaming={isStreaming}
              disabled={!agentRunning}
            />
          </div>
          <PermissionDialog
            request={permissionRequest}
            onAllow={(id) => resolvePermission(id, true)}
            onDeny={(id) => resolvePermission(id, false)}
          />
        </main>
      ) : (
        <main className="two-tier-layout__detail two-tier-layout__detail--empty">
          <div className="two-tier-empty-state">
            <Sparkles size={20} />
            <span>
              {agentRunning
                ? t('chat.createNewChat')
                : t('chat.startingAgent')}
            </span>
          </div>
        </main>
      )}
    </div>
  )
}
