import type { Message } from '@/types/ui'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message-bubble message-bubble--${message.role}${message.isStreaming ? ' message-bubble--streaming' : ''}`}
        >
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  )
}
