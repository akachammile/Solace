/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import type { Message, ToolToggles } from '@/types/ui'
import type { AgentConfig, AgentInfo, AgentStatus } from '@shared/types/acp'
import type { ChatSession } from '@/features/acp/types'
import {
  spawnAgent,
  initializeAgent,
  newSession,
  closeSession,
  sendPrompt,
  cancelPrompt,
  respondToPermission,
  onStreamChunk,
  onPromptComplete,
  onAgentError,
  onPermissionRequest,
  onAgentStatusChange,
} from '@/features/acp/service'
import type { StreamChunk, PromptResult, AgentError, PermissionRequest } from '@shared/types/acp'

interface ChatContextValue {
  sessions: ChatSession[]
  activeSessionId: string | null
  createSession: (agentConfig: AgentConfig) => Promise<void>
  switchSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => Promise<void>
  activeMessages: Message[]
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  cancelGenerating: () => Promise<void>
  isStreaming: boolean
  agentStatus: AgentStatus
  agentInfo: AgentInfo | null
  toolToggles: ToolToggles
  toggleTool: (tool: keyof ToolToggles) => void
  permissionRequest: PermissionRequest | null
  resolvePermission: (requestId: string, allowed: boolean) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [agentId, setAgentId] = useState<string | null>(null)
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('stopped')
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null)
  const [sessionMessages, setSessionMessages] = useState<Record<string, Message[]>>({})
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [toolToggles, setToolToggles] = useState<ToolToggles>({
    web: true,
    mcp: false,
    skill: true,
  })
  const [permissionRequest, setPermissionRequest] = useState<PermissionRequest | null>(null)

  const streamingMessageIdRef = useRef<string | null>(null)

  // Subscribe to push events from main process
  useEffect(() => {
    const unsubChunk = onStreamChunk((chunk: StreamChunk) => {
      if (chunk.type === 'text' && chunk.text) {
        setSessionMessages((prev) => {
          const msgs = prev[chunk.sessionId]
          if (!msgs) return prev
          const updated = msgs.map((msg) => {
            if (msg.id === streamingMessageIdRef.current && msg.isStreaming) {
              return { ...msg, content: msg.content + chunk.text }
            }
            return msg
          })
          return { ...prev, [chunk.sessionId]: updated }
        })
      }
    })

    const unsubComplete = onPromptComplete((_result: PromptResult) => {
      setIsStreaming(false)
      setSessionMessages((prev) => {
        const msgs = prev[_result.sessionId]
        if (!msgs) return prev
        return {
          ...prev,
          [_result.sessionId]: msgs.map((msg) =>
            msg.isStreaming ? { ...msg, isStreaming: false } : msg,
          ),
        }
      })
      streamingMessageIdRef.current = null
    })

    const unsubError = onAgentError((error: AgentError) => {
      const sid = error.sessionId
      if (sid) {
        setIsStreaming(false)
        setSessionMessages((prev) => {
          const msgs = prev[sid]
          if (!msgs) return prev
          return {
            ...prev,
            [sid]: msgs.map((msg) =>
              msg.isStreaming
                ? { ...msg, content: msg.content || `Error: ${error.message}`, isStreaming: false }
                : msg,
            ),
          }
        })
        streamingMessageIdRef.current = null
      }
    })

    const unsubPermission = onPermissionRequest((req: PermissionRequest) => {
      setPermissionRequest(req)
    })

    const unsubStatus = onAgentStatusChange((info: AgentInfo) => {
      setAgentStatus(info.status)
      setAgentInfo(info)
    })

    return () => {
      unsubChunk()
      unsubComplete()
      unsubError()
      unsubPermission()
      unsubStatus()
    }
  }, [])

  const createSession = useCallback(async (agentConfig: AgentConfig) => {
    let currentAgentId = agentId

    if (!currentAgentId) {
      const info = await spawnAgent(agentConfig)
      currentAgentId = info.agentId
      setAgentId(currentAgentId)

      const initialized = await initializeAgent(currentAgentId)
      setAgentStatus(initialized.status)
      setAgentInfo(initialized)
    }

    const sessionInfo = await newSession(currentAgentId, agentConfig.cwd)
    const newChatSession: ChatSession = {
      id: sessionInfo.sessionId,
      title: 'New Chat',
      createdAt: sessionInfo.createdAt,
    }

    setSessions((prev) => [...prev, newChatSession])
    setActiveSessionId(newChatSession.id)
    setSessionMessages((prev) => ({
      ...prev,
      [newChatSession.id]: [],
    }))
  }, [agentId])

  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId)
  }, [])

  const deleteSession = useCallback(async (sessionId: string) => {
    if (agentId) {
      await closeSession(agentId, sessionId)
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    setSessionMessages((prev) => {
      const next = { ...prev }
      delete next[sessionId]
      return next
    })
    if (activeSessionId === sessionId) {
      setActiveSessionId(null)
    }
  }, [agentId, activeSessionId])

  const activeMessages = useMemo(() => {
    if (!activeSessionId) return []
    return sessionMessages[activeSessionId] ?? []
  }, [activeSessionId, sessionMessages])

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || !agentId || !activeSessionId) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }

    streamingMessageIdRef.current = assistantMsg.id

    setSessionMessages((prev) => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] ?? []), userMsg, assistantMsg],
    }))

    setIsStreaming(true)

    // Update session title from first user message
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId && s.title === 'New Chat'
          ? { ...s, title: trimmed.slice(0, 50) }
          : s,
      ),
    )

    try {
      await sendPrompt(agentId, activeSessionId, trimmed)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setIsStreaming(false)
      setSessionMessages((prev) => {
        const msgs = prev[activeSessionId]
        if (!msgs) return prev
        return {
          ...prev,
          [activeSessionId]: msgs.map((msg) =>
            msg.id === assistantMsg.id
              ? { ...msg, content: `Error: ${errorMessage}`, isStreaming: false }
              : msg,
          ),
        }
      })
      streamingMessageIdRef.current = null
    }
  }, [agentId, activeSessionId])

  const clearMessages = useCallback(() => {
    if (!activeSessionId) return
    setSessionMessages((prev) => ({
      ...prev,
      [activeSessionId]: [],
    }))
  }, [activeSessionId])

  const cancelGenerating = useCallback(async () => {
    if (agentId) {
      await cancelPrompt(agentId)
    }
    setIsStreaming(false)
    streamingMessageIdRef.current = null
  }, [agentId])

  const toggleTool = useCallback((tool: keyof ToolToggles) => {
    setToolToggles((current) => ({
      ...current,
      [tool]: !current[tool],
    }))
  }, [])

  const resolvePermission = useCallback((requestId: string, allowed: boolean) => {
    if (agentId) {
      respondToPermission(agentId, { requestId, allowed })
    }
    setPermissionRequest(null)
  }, [agentId])

  const value = useMemo<ChatContextValue>(
    () => ({
      sessions,
      activeSessionId,
      createSession,
      switchSession,
      deleteSession,
      activeMessages,
      sendMessage,
      clearMessages,
      cancelGenerating,
      isStreaming,
      agentStatus,
      agentInfo,
      toolToggles,
      toggleTool,
      permissionRequest,
      resolvePermission,
    }),
    [
      sessions, activeSessionId, createSession, switchSession, deleteSession,
      activeMessages, sendMessage, clearMessages, cancelGenerating,
      isStreaming, agentStatus, agentInfo, toolToggles, toggleTool,
      permissionRequest, resolvePermission,
    ],
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
