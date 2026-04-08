import { SendHorizontal, Paperclip, Eraser } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useChatState } from '../../state/chat-context'

export function ChatInput() {
  const [text, setText] = useState('')
  const { sendMessage, clearMessages, isTyping } = useChatState()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (text.trim() && !isTyping) {
      sendMessage(text.trim())
      setText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
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
        placeholder="Type a message..."
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="chat-input-actions">
        <div className="chat-input-tools">
          <button className="chat-tool-btn" title="Attach file">
            <Paperclip size={14} />
          </button>
          <button 
            className="chat-tool-btn" 
            title="Clear context"
            onClick={clearMessages}
          >
            <Eraser size={14} />
          </button>
        </div>
        <button
          className="chat-send-btn"
          disabled={!text.trim() || isTyping}
          onClick={handleSubmit}
        >
          <SendHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}
