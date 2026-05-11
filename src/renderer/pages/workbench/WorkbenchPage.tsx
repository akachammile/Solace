import { useState } from 'react'
import { Send, Paperclip } from 'lucide-react'

interface WorkbenchPageProps {
  viewState: 'welcome' | 'chat'
  onStartChat: () => void
}

export function WorkbenchPage({ viewState, onStartChat }: WorkbenchPageProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    if (viewState === 'welcome') {
      onStartChat()
    }
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (viewState === 'welcome') {
    return (
      <div className="workbench-page sharp">
        <main className="workbench-welcome">
          <div className="geometric-icon-container">
            <div className="outer-glow"></div>
            <svg className="geometric-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" strokeWidth="0.5"></polygon>
              <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" strokeWidth="0.5"></polygon>
              <circle cx="50" cy="50" r="10" strokeWidth="0.5"></circle>
            </svg>
            <div className="central-core">
              <div className="core-dot"></div>
            </div>
          </div>

          <div className="welcome-content">
            <h2 className="welcome-greeting">Awaiting Input</h2>
            <p className="welcome-subtitle">System operational. Ready to synthesize new neural pathways.</p>
            
            <button className="initialize-btn sharp" onClick={onStartChat}>
              INITIALIZE SEQUENCE
              <span className="material-symbols-outlined icon">arrow_forward</span>
            </button>
          </div>

          <div className="tune-btn-container">
            <button className="tune-btn sharp">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>

          <div className="ambient-gradient"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="workbench-page sharp">
      <main className="workbench-chat">
        <div className="chat-messages-area custom-scrollbar">
          <div className="chat-placeholder">
            <p>System operational. Neural pathway established.</p>
          </div>
        </div>

        <div className="chat-bottom-area">
          <div className="chat-input-capsule sharp">
            <button className="chat-tool-btn">
              <Paperclip size={18} />
            </button>
            <textarea
              className="chat-textarea"
              placeholder="COMMAND >"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
