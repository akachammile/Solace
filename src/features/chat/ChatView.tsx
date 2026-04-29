import { ChevronDown, MoreHorizontal, Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { getModelProvider } from '../../data/model-catalog'
import { useSettingsState } from '../../state/settings-context'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import './chat.css'

export function ChatView() {
  const { settings } = useSettingsState()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const activeProvider = getModelProvider(settings.provider)

  const history = [
    { id: '1', title: 'Explaining Quantum Physics' },
    { id: '2', title: 'Refactoring React Hooks' },
    { id: '3', title: 'Vacation Planning' },
  ]

  return (
    <div className="two-tier-layout">
      <aside className="two-tier-layout__sidebar">
        <div className="two-tier-sidebar-header">
          <button className="two-tier-action-btn" onClick={() => setSelectedChatId('draft')} type="button">
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="two-tier-list">
          {history.map((item) => (
            <div
              key={item.id}
              className={`two-tier-capsule ${selectedChatId === item.id ? 'two-tier-capsule--active' : ''}`}
            >
              <button
                className="two-tier-capsule__label"
                onClick={() => setSelectedChatId(item.id)}
                type="button"
              >
                <span className="two-tier-capsule__title">{item.title}</span>
              </button>
              <button
                className="two-tier-capsule__more"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpenId(menuOpenId === item.id ? null : item.id)
                }}
                type="button"
                aria-label="More actions"
              >
                <MoreHorizontal size={14} />
              </button>
              {menuOpenId === item.id && (
                <div className="two-tier-capsule__menu">
                  <button
                    className="two-tier-capsule__menu-item two-tier-capsule__menu-item--danger"
                    onClick={() => {
                      setMenuOpenId(null)
                      if (selectedChatId === item.id) setSelectedChatId(null)
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {selectedChatId ? (
        <main className="two-tier-layout__detail">
          <div className="chat-two-tier">
            <div className="chat-tier-model">
              <span className="chat-tier-model__name">{activeProvider.name}</span>
              <span className="chat-tier-model__divider">/</span>
              <strong className="chat-tier-model__variant">{settings.model}</strong>
              <ChevronDown size={14} className="chat-tier-model__chevron" />
            </div>

            <MessageList />
            <ChatInput />
          </div>
        </main>
      ) : (
        <main className="two-tier-layout__detail two-tier-layout__detail--empty">
          <div className="two-tier-empty-state">
            <Sparkles size={20} />
            <span>Select a chat</span>
          </div>
        </main>
      )}
    </div>
  )
}
