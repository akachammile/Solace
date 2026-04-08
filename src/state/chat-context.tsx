/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Message, ToolToggles } from '../types/ui'

interface ChatContextValue {
  messages: Message[]
  toolToggles: ToolToggles
  sendMessage: (content: string) => void
  toggleTool: (tool: keyof ToolToggles) => void
}

const initialMessages: Message[] = [
  {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: 'Solace shell is ready. Start with a prompt, or configure your model in Settings.',
    timestamp: Date.now(),
  },
]

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [toolToggles, setToolToggles] = useState<ToolToggles>({
    web: true,
    mcp: false,
    skill: true,
  })

  const sendMessage = (content: string) => {
    const trimmed = content.trim()

    if (!trimmed) {
      return
    }

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      },
    ])
  }

  const toggleTool = (tool: keyof ToolToggles) => {
    setToolToggles((current) => ({
      ...current,
      [tool]: !current[tool],
    }))
  }

  const value = useMemo(
    () => ({
      messages,
      toolToggles,
      sendMessage,
      toggleTool,
    }),
    [messages, toolToggles],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatState() {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatState must be used within ChatProvider')
  }

  return context
}
