import { ArrowUp, Square, Eraser } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ChatInputProps {
  onSend: (content: string) => void
  onClear: () => void
  onCancel: () => void
  isStreaming: boolean
  disabled: boolean
}

export function ChatInput({ onSend, onClear, onCancel, isStreaming, disabled }: ChatInputProps) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (text.trim() && !isStreaming && !disabled) {
      onSend(text.trim())
      setText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isStreaming) {
        onCancel()
      } else {
        handleSubmit()
      }
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  return (
    <div className="chat-input-container">
      <textarea
        ref={textareaRef}
        className="chat-input-field"
        placeholder={disabled ? t('chat.agentNotRunning') : t('chat.typeMessage')}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <div className="chat-input-actions">
        <div className="chat-input-tools">
          <button
            className="chat-tool-btn"
            title={t('chat.clearContext')}
            onClick={onClear}
            disabled={disabled}
            type="button"
          >
            <Eraser size={16} />
          </button>
        </div>
        {isStreaming ? (
          <button className="chat-cancel-btn" onClick={onCancel} type="button">
            <Square size={16} />
          </button>
        ) : (
          <button
            className="chat-send-btn"
            disabled={!text.trim() || disabled}
            onClick={handleSubmit}
            type="button"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}
