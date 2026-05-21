import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bot,
  CheckCircle2,
  CircleDot,
  Clock3,
  MessageSquarePlus,
  Paperclip,
  Search,
  Send,
  Settings,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { modelProviders } from '@/data/model-catalog'
import { useSettings } from '@/hooks/useSettings'
import {
  listAgents,
  listSwarmMessages,
  onAgentError,
  onAgentMessageComplete,
  onAgentStreamChunk,
  onAgentToolEvent,
  onSwarmMessage,
  sendAgentMessage,
} from '@/services/electron/agents'
import { listConversations, listMessages } from '@/services/electron/storage'
import type {
  Agent,
  AgentChatMessage,
  BuiltinAgentId,
  SwarmMessage,
  AgentToolEvent,
} from '@shared/types/agent'
import type { StoredChatMessage, StoredConversation } from '@shared/types/storage'
import type { AiSdkModelConfig } from '@shared/types/model-provider'
import './main.css'

type AgentRunStatus = 'idle' | 'running' | 'complete' | 'error'

interface MainPageProps {
  onOpenSettings: () => void
  rail: ReactNode
}

interface ActiveModelConfig {
  providerName: string
  modelName: string
  config: AiSdkModelConfig
}

const fallbackAgent: Agent = {
  id: 'planner',
  name: 'Planner',
  description: 'Breaks down goals, clarifies tradeoffs, and proposes execution paths.',
  icon: 'route',
}

function createConversationId() {
  return `conversation-${crypto.randomUUID()}`
}

function createMessageId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function formatConversationTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp)
}

function createLocalMessage(params: {
  id: string
  conversationId: string
  role: StoredChatMessage['role']
  agentId?: BuiltinAgentId
  content: string
  status: StoredChatMessage['status']
}): StoredChatMessage {
  const now = Date.now()

  return {
    ...params,
    createdAt: now,
    updatedAt: now,
  }
}

export function MainPage({ onOpenSettings, rail }: MainPageProps) {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [agents, setAgents] = useState<Agent[]>([])
  const [targetAgentId, setTargetAgentId] = useState<BuiltinAgentId>('planner')
  const [conversations, setConversations] = useState<StoredConversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [draftConversationId, setDraftConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<StoredChatMessage[]>([])
  const [swarmMessages, setSwarmMessages] = useState<SwarmMessage[]>([])
  const [toolEvents, setToolEvents] = useState<AgentToolEvent[]>([])
  const [conversationQuery, setConversationQuery] = useState('')
  const [input, setInput] = useState('')
  const [composerNotice, setComposerNotice] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [agentRunStatus, setAgentRunStatus] = useState<AgentRunStatus>('idle')
  const activeConversationRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const activeModelConfig = useMemo<ActiveModelConfig | null>(() => {
    const provider = modelProviders.find((entry) => {
      const providerSettings = settings.providers[entry.id]
      const modelId = providerSettings?.selectedModelId ?? entry.models[0]?.id
      const hasAuth = entry.apiKeyRequired === false || Boolean(providerSettings?.apiKey)

      return Boolean(providerSettings?.enabled && modelId && hasAuth)
    })

    if (!provider) return null

    const providerSettings = settings.providers[provider.id]
    const modelId = providerSettings?.selectedModelId ?? provider.models[0]?.id
    if (!modelId) return null

    const modelEntry = provider.models.find((item) => item.id === modelId)

    return {
      providerName: provider.name,
      modelName: modelEntry?.name ?? modelId,
      config: {
        providerId: provider.id,
        modelId,
        apiKey: providerSettings?.apiKey || undefined,
        baseUrl: providerSettings?.baseUrl || provider.baseUrl,
      },
    }
  }, [settings.providers])

  const visibleAgents = agents.length > 0 ? agents : [fallbackAgent]
  const activeAgent = visibleAgents.find((agent) => agent.id === targetAgentId) ?? visibleAgents[0]

  const refreshConversations = useCallback(async () => {
    const items = await listConversations()
    setConversations(items)
  }, [])

  const draftConversation = useMemo<StoredConversation | null>(() => {
    if (!draftConversationId || conversations.some((conversation) => conversation.id === draftConversationId)) {
      return null
    }

    return {
      id: draftConversationId,
      title: t('main.workspace.draftConversation'),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: messages.length,
    }
  }, [conversations, draftConversationId, messages.length, t])

  const visibleConversations = useMemo(() => {
    const items = draftConversation ? [draftConversation, ...conversations] : conversations
    const query = conversationQuery.trim().toLowerCase()

    if (!query) return items

    return items.filter((conversation) => (
      conversation.title.toLowerCase().includes(query)
      || conversation.id.toLowerCase().includes(query)
    ))
  }, [conversationQuery, conversations, draftConversation])

  useEffect(() => {
    activeConversationRef.current = selectedConversationId
  }, [selectedConversationId])

  useEffect(() => {
    void refreshConversations()

    listAgents()
      .then((items) => {
        setAgents(items)
        if (items.length > 0) setTargetAgentId(items[0].id)
      })
      .catch(() => setAgents([fallbackAgent]))
  }, [refreshConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      setSwarmMessages([])
      setToolEvents([])
      setAgentRunStatus('idle')
      return
    }

    if (selectedConversationId === draftConversationId) {
      return
    }

    let canceled = false
    setIsLoadingMessages(true)
    setComposerNotice(null)
    setAgentRunStatus('idle')

    listMessages(selectedConversationId)
      .then((items) => {
        if (!canceled) setMessages(items)
      })
      .catch(() => {
        if (!canceled) setMessages([])
      })
      .finally(() => {
        if (!canceled) setIsLoadingMessages(false)
      })

    listSwarmMessages(selectedConversationId)
      .then((items) => {
        if (!canceled) setSwarmMessages(items.slice(-6))
      })
      .catch(() => {
        if (!canceled) setSwarmMessages([])
      })

    return () => {
      canceled = true
    }
  }, [draftConversationId, selectedConversationId])

  useEffect(() => {
    const disposeChunk = onAgentStreamChunk((chunk) => {
      if (chunk.conversationId !== activeConversationRef.current) return

      setAgentRunStatus('running')
      setMessages((currentMessages) => currentMessages.map((message) => (
        message.id === chunk.messageId
          ? {
              ...message,
              content: `${message.content}${chunk.delta}`,
              status: 'streaming',
              updatedAt: Date.now(),
            }
          : message
      )))
    })

    const disposeComplete = onAgentMessageComplete((result) => {
      if (result.conversationId !== activeConversationRef.current) return

      setAgentRunStatus('complete')
      setMessages((currentMessages) => currentMessages.map((message) => (
        message.id === result.messageId
          ? {
              ...message,
              content: result.content,
              status: 'complete',
              updatedAt: Date.now(),
            }
          : message
      )))
      void refreshConversations()
    })

    const disposeError = onAgentError((error) => {
      if (error.conversationId !== activeConversationRef.current) return

      setAgentRunStatus('error')
      setComposerNotice(error.message)
      setMessages((currentMessages) => currentMessages.map((message) => (
        message.id === error.messageId
          ? {
              ...message,
              content: error.message,
              status: 'error',
              updatedAt: Date.now(),
            }
          : message
      )))
    })

    const disposeToolEvent = onAgentToolEvent((event) => {
      if (event.conversationId !== activeConversationRef.current) return

      setToolEvents((currentEvents) => [...currentEvents, event].slice(-8))
      if (event.status === 'error') {
        setAgentRunStatus('error')
      } else {
        setAgentRunStatus('running')
      }
    })

    const disposeSwarmMessage = onSwarmMessage((message) => {
      if (message.conversationId !== activeConversationRef.current) return

      setSwarmMessages((currentMessages) => [...currentMessages, message].slice(-6))
    })

    return () => {
      disposeChunk()
      disposeComplete()
      disposeError()
      disposeToolEvent()
      disposeSwarmMessage()
    }
  }, [refreshConversations])

  const handleNewConversation = () => {
    const conversationId = createConversationId()
    setDraftConversationId(conversationId)
    setSelectedConversationId(conversationId)
    setMessages([])
    setSwarmMessages([])
    setToolEvents([])
    setInput('')
    setComposerNotice(null)
    setAgentRunStatus('idle')
  }

  const handleSelectConversation = (conversationId: string) => {
    if (conversationId !== draftConversationId) {
      setDraftConversationId(null)
    }

    setSelectedConversationId(conversationId)
    setComposerNotice(null)
  }

  const handleSend = async () => {
    const content = input.trim()
    if (!content || isSending || !selectedConversationId) return

    if (!activeModelConfig) {
      setComposerNotice(t('main.workspace.modelMissing'))
      return
    }

    const conversationId = selectedConversationId
    const userMessageId = createMessageId('user')
    const assistantMessageId = createMessageId('assistant')
    const history: AgentChatMessage[] = messages.map((message) => ({
      role: message.role,
      content: message.content,
      agentId: message.agentId,
    }))

    setInput('')
    setComposerNotice(null)
    setIsSending(true)
    setAgentRunStatus('running')
    setMessages((currentMessages) => [
      ...currentMessages,
      createLocalMessage({
        id: userMessageId,
        conversationId,
        role: 'user',
        agentId: activeAgent.id,
        content,
        status: 'complete',
      }),
      createLocalMessage({
        id: assistantMessageId,
        conversationId,
        role: 'assistant',
        agentId: activeAgent.id,
        content: '',
        status: 'streaming',
      }),
    ])

    try {
      await sendAgentMessage({
        conversationId,
        messageId: assistantMessageId,
        userMessageId,
        targetAgentId: activeAgent.id,
        content,
        history,
        modelConfig: activeModelConfig.config,
      })
      setDraftConversationId((currentDraftId) => (
        currentDraftId === conversationId ? null : currentDraftId
      ))
      await refreshConversations()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('main.workspace.sendFailed')
      setAgentRunStatus('error')
      setComposerNotice(message)
      setMessages((currentMessages) => currentMessages.map((item) => (
        item.id === assistantMessageId
          ? {
              ...item,
              content: message,
              status: 'error',
              updatedAt: Date.now(),
            }
          : item
      )))
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const statusLabel = {
    idle: t('main.workspace.agentIdle'),
    running: t('main.workspace.agentRunning'),
    complete: t('main.workspace.agentComplete'),
    error: t('main.workspace.agentError'),
  }[agentRunStatus]

  const selectedConversation = visibleConversations.find((conversation) => (
    conversation.id === selectedConversationId
  ))

  return (
    <div className="agent-workspace">
      <aside className="agent-workspace__apprail" aria-label={t('main.workspace.conversationList')}>
        <div className="workspace-apprail-slot">
          {rail}
        </div>

        <div className="agent-workspace__conversations">
          <div className="workspace-panel-head">
            <div>
              <span className="workspace-panel-kicker">{t('main.workspace.leftKicker')}</span>
              <h2>{t('main.workspace.conversations')}</h2>
            </div>
            <button
              aria-label={t('main.workspace.newConversation')}
              className="workspace-icon-button"
              onClick={handleNewConversation}
              title={t('main.workspace.newConversation')}
              type="button"
            >
              <MessageSquarePlus aria-hidden="true" />
            </button>
          </div>

          <label className="conversation-search">
            <Search aria-hidden="true" />
            <input
              aria-label={t('main.workspace.searchConversations')}
              onChange={(event) => setConversationQuery(event.target.value)}
              placeholder={t('main.workspace.searchConversations')}
              value={conversationQuery}
            />
          </label>

          <button className="new-session-card" onClick={handleNewConversation} type="button">
            <Sparkles aria-hidden="true" />
            <span>
              <strong>{t('main.workspace.newConversation')}</strong>
              <small>{t('main.workspace.newConversationHint')}</small>
            </span>
          </button>

          <div className="conversation-list custom-scrollbar">
            {visibleConversations.length === 0 ? (
              <div className="conversation-empty">
                <CircleDot aria-hidden="true" />
                <p>{t('main.workspace.noConversations')}</p>
              </div>
            ) : visibleConversations.map((conversation) => (
              <button
                aria-current={conversation.id === selectedConversationId ? 'page' : undefined}
                className={`conversation-item${conversation.id === selectedConversationId ? ' conversation-item--active' : ''}`}
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                type="button"
              >
                <span className="conversation-item__main">
                  <strong>{conversation.title}</strong>
                  <small>
                    {t('main.workspace.messageCount', { count: conversation.messageCount })}
                  </small>
                </span>
                <time>{formatConversationTime(conversation.updatedAt)}</time>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="agent-workspace__conversation">
        <header className="conversation-stage-head">
          <div>
            <span className="workspace-panel-kicker">{t('main.workspace.centerKicker')}</span>
            <h1>{selectedConversation?.title ?? t('main.workspace.selectConversationTitle')}</h1>
          </div>
          <div className="conversation-model-pill">
            <Bot aria-hidden="true" />
            <span>
              {activeModelConfig
                ? `${activeModelConfig.providerName} / ${activeModelConfig.modelName}`
                : t('main.workspace.modelNotConfigured')}
            </span>
          </div>
        </header>

        {!selectedConversationId ? (
          <section className="conversation-picker">
            <Sparkles aria-hidden="true" />
            <h2>{t('main.workspace.selectConversationTitle')}</h2>
            <p>{t('main.workspace.selectConversationDescription')}</p>
            <div className="conversation-picker__actions">
              <button className="workspace-primary-button" onClick={handleNewConversation} type="button">
                <MessageSquarePlus aria-hidden="true" />
                <span>{t('main.workspace.newConversation')}</span>
              </button>
              <button className="workspace-secondary-button" onClick={onOpenSettings} type="button">
                <Settings aria-hidden="true" />
                <span>{t('main.workspace.openSettings')}</span>
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="conversation-messages custom-scrollbar" aria-label={t('main.workspace.messages')}>
              {isLoadingMessages ? (
                <div className="conversation-system-state">
                  <Clock3 aria-hidden="true" />
                  <span>{t('main.workspace.loadingMessages')}</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="conversation-system-state">
                  <Sparkles aria-hidden="true" />
                  <span>{t('main.workspace.emptyConversation')}</span>
                </div>
              ) : messages.map((message) => (
                <article className={`workspace-message workspace-message--${message.role}`} key={message.id}>
                  <div className="workspace-message__meta">
                    <span>{message.role === 'user' ? t('main.workspace.you') : activeAgent.name}</span>
                    <small>{message.status === 'streaming' ? t('main.workspace.streaming') : formatConversationTime(message.updatedAt)}</small>
                  </div>
                  <p>{message.content || t('main.workspace.thinking')}</p>
                </article>
              ))}
              <div ref={messagesEndRef} />
            </section>

            <section className="workspace-composer" aria-label={t('main.workspace.composer')}>
              {composerNotice && (
                <div className="workspace-composer__notice">
                  <span>{composerNotice}</span>
                  {!activeModelConfig && (
                    <button onClick={onOpenSettings} type="button">
                      {t('main.workspace.openSettings')}
                    </button>
                  )}
                </div>
              )}
              <textarea
                className="workspace-composer__input"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('main.workspace.inputPlaceholder')}
                rows={3}
                value={input}
              />
              <div className="workspace-composer__toolbar">
                <div className="workspace-composer__tools">
                  <button aria-label={t('chat.attachFile')} className="workspace-tool-button" type="button">
                    <Paperclip aria-hidden="true" />
                  </button>
                  <button aria-label={t('main.workspace.tools')} className="workspace-tool-button" type="button">
                    <Wrench aria-hidden="true" />
                  </button>
                </div>
                <button
                  aria-label={t('main.sendMessage')}
                  className="workspace-send-button"
                  disabled={!input.trim() || isSending}
                  onClick={() => void handleSend()}
                  type="button"
                >
                  <Send aria-hidden="true" />
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <aside className="agent-workspace__status" aria-label={t('main.workspace.agentStatus')}>
        <div className="workspace-panel-head">
          <div>
            <span className="workspace-panel-kicker">{t('main.workspace.rightKicker')}</span>
            <h2>{t('main.workspace.agentStatus')}</h2>
          </div>
          <span className={`agent-run-dot agent-run-dot--${agentRunStatus}`} aria-hidden="true" />
        </div>

        <section className="agent-card">
          <div className="agent-card__identity">
            <div className="agent-avatar">
              <Bot aria-hidden="true" />
            </div>
            <div>
              <strong>{activeAgent.name}</strong>
              <small>{statusLabel}</small>
            </div>
          </div>
          <p>{activeAgent.description}</p>
        </section>

        <section className="agent-role-list" aria-label={t('main.workspace.agentRoles')}>
          {visibleAgents.map((agent) => (
            <button
              className={`agent-role-chip${agent.id === activeAgent.id ? ' agent-role-chip--active' : ''}`}
              key={agent.id}
              onClick={() => setTargetAgentId(agent.id)}
              type="button"
            >
              <span>{agent.name}</span>
            </button>
          ))}
        </section>

        <section className="agent-status-section">
          <div className="agent-status-section__head">
            <CheckCircle2 aria-hidden="true" />
            <span>{t('main.workspace.tools')}</span>
          </div>
          {toolEvents.length === 0 ? (
            <p className="agent-muted">{t('main.workspace.noToolEvents')}</p>
          ) : (
            <div className="agent-event-list custom-scrollbar">
              {toolEvents.map((event) => (
                <article className="agent-event" key={event.requestId}>
                  <strong>{event.toolName}</strong>
                  <small>{event.status}</small>
                  <p>{event.query}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="agent-status-section">
          <div className="agent-status-section__head">
            <CircleDot aria-hidden="true" />
            <span>{t('main.workspace.internalNotes')}</span>
          </div>
          {swarmMessages.length === 0 ? (
            <p className="agent-muted">{t('main.workspace.noInternalNotes')}</p>
          ) : (
            <div className="agent-event-list custom-scrollbar">
              {swarmMessages.map((message) => (
                <article className="agent-event" key={message.id}>
                  <strong>{message.fromAgentId}</strong>
                  <small>{message.kind}</small>
                  <p>{message.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </aside>
    </div>
  )
}
