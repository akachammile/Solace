import { Bot, Sparkles } from 'lucide-react'
import { useChatState } from '../../state/chat-context'
import { useSettingsState } from '../../state/settings-context'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import './chat.css'

export function ChatView() {
  const { messages } = useChatState()
  const { settings } = useSettingsState()

  return (
    <div className="view-shell chat-layout">
      {/* Integrated Compact Header */}
      <header className="chat-compact-header">
        <div className="chat-compact-header__info">
          <h2>SOLACE CHAT</h2>
          <p>{settings.model.split('/').pop()}</p>
        </div>

        <div className="chat-tool-group" style={{ display: 'flex', gap: '4px' }}>
          <div className="chat-status-pill">
            <Bot size={12} />
            <span>READY</span>
          </div>
          <div className="chat-status-pill">
            <Sparkles size={12} />
            <span>{messages.length}</span>
          </div>
        </div>
      </header>

      {/* Main Conversation Area */}
      <MessageList />

      {/* Compact Input */}
      <ChatInput />
    </div>
  )
}
