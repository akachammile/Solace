import { useChatState } from '../../state/chat-context'
import { formatRelativeTime } from './time'

export function MessageList() {
  const { messages } = useChatState()

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message-bubble message-bubble--${message.role}`}
        >
          <div className="message-bubble__meta">
            <span>{message.role}</span>
            <span>{formatRelativeTime(message.timestamp)}</span>
          </div>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  )
}
