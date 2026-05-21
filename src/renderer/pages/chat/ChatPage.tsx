import { useState } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './chat.css'

export function ChatPage() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: input }])
    setInput('')
    // AI response simulation or logic would go here later
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-page__messages">
        {messages.length === 0 ? (
          <div className="chat-page__empty">
            <p>{t('chat.emptyState')}</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`chat-message chat-message--${msg.role}`}>
              <div className="chat-message__content">{msg.content}</div>
            </div>
          ))
        )}
      </div>

      <div className="chat-page__input-area">
        <div className="chat-input-container">
          <button className="chat-input__tool-btn" type="button" aria-label={t('chat.attachFile')}>
            <Paperclip aria-hidden="true" />
          </button>
          <textarea
            className="chat-input__field"
            placeholder={t('chat.placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button 
            className="chat-input__send-btn" 
            onClick={handleSend} 
            disabled={!input.trim()}
            type="button" 
            aria-label={t('chat.typeMessage')}
          >
            <Send aria-hidden="true" />
          </button>
        </div>
        <div className="chat-page__status-bar">
          <span>{t('chat.statusReady')}</span>
        </div>
      </div>
    </div>
  )
}
