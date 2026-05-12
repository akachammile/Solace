import { useState } from 'react'
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FolderOpen,
  KeyRound,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Terminal,
  Trash2,
  Wrench,
  X,
} from 'lucide-react'
import { modelProviders, type ModelEntry, type ModelTier, type ProviderEntry } from '@/data/model-catalog'
import { useSettings } from '@/hooks/useSettings'
import { selectDirectory, testConnection } from '@/services/electron/system'
import type { ModelProvider } from '@/types/ui'

interface SettingsOverlayProps {
  onClose: () => void
}

type SettingsCategoryId = 'models' | 'workspace' | 'agent' | 'mcp' | 'skills'

interface TestState {
  ok: boolean
  latency?: number
  error?: string
  status?: number
}

interface ModelGroup {
  series: string
  models: ModelEntry[]
}

const modelTierLabels: Record<ModelTier, string> = {
  flagship: 'Flagship',
  standard: 'Standard',
  fast: 'Fast',
  reasoning: 'Reasoning',
  code: 'Code',
  research: 'Research',
  local: 'Local',
}

const settingsCategories: Array<{
  id: SettingsCategoryId
  title: string
  icon: JSX.Element
}> = [
  {
    id: 'models',
    title: 'Model Services',
    icon: <Database size={18} />,
  },
  {
    id: 'workspace',
    title: 'Workspace',
    icon: <FolderOpen size={18} />,
  },
  {
    id: 'agent',
    title: 'Agent',
    icon: <Bot size={18} />,
  },
  {
    id: 'mcp',
    title: 'MCP Services',
    icon: <Terminal size={18} />,
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: <Wrench size={18} />,
  },
]

const skillOptions = [
  {
    id: 'web-search',
    name: 'Web Search',
    meta: 'WEB SEARCH',
    description: 'Allow sessions to retrieve live web context.',
  },
  {
    id: 'file-operations',
    name: 'File Operations',
    meta: 'LOCAL FILES',
    description: 'Allow local workspace file access.',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    meta: 'SHELL',
    description: 'Allow controlled shell execution.',
  },
  {
    id: 'mcp',
    name: 'MCP Tools',
    meta: 'MCP',
    description: 'Allow Model Context Protocol integrations.',
  },
  {
    id: 'code-interpreter',
    name: 'Code Interpreter',
    meta: 'CODE',
    description: 'Allow script execution and analysis.',
  },
  {
    id: 'rag',
    name: 'Knowledge Retrieval',
    meta: 'RAG',
    description: 'Allow local knowledge-base references.',
  },
]

function groupModels(models: ModelEntry[]): ModelGroup[] {
  return models
    .reduce<ModelGroup[]>((groups, modelEntry) => {
      const existingGroup = groups.find((group) => group.series === modelEntry.series)

      if (existingGroup) {
        existingGroup.models.push(modelEntry)
        return groups
      }

      return [...groups, { series: modelEntry.series, models: [modelEntry] }]
    }, [])
    .map((group) => ({
      ...group,
      models: [...group.models].sort((first, second) => first.rank - second.rank),
    }))
}

function formatSeriesTitle(series: string): string {
  return series.replace(/-/g, ' ')
}

function formatModelVariant(modelEntry: ModelEntry): string {
  return modelEntry.name
}

function ProviderIcon({ provider }: { provider: ProviderEntry }) {
  if (provider.icon) {
    return <img src={provider.icon} alt="" className="settings-provider__icon" />
  }

  return (
    <span className="settings-provider__icon settings-provider__monogram" aria-hidden="true">
      {provider.shortName}
    </span>
  )
}

export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategoryId>('models')
  const [activeProviderId, setActiveProviderId] = useState<ModelProvider>(modelProviders[0].id)
  const {
    settings,
    updateProviderSettings,
    updateWorkspaceSettings,
    updateAgentSettings,
    addMcpServer,
    updateMcpServer,
    removeMcpServer,
    updateSkillSettings,
  } = useSettings()
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, TestState>>({})
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(true)

  const activeProvider = modelProviders.find((provider) => provider.id === activeProviderId) ?? modelProviders[0]
  const activeProviderSettings = settings.providers[activeProvider.id]
  const selectedModelId = activeProviderSettings?.selectedModelId
  const activeModel = selectedModelId
    ? activeProvider.models.find((modelEntry) => modelEntry.id === selectedModelId)
    : undefined

  const handleProviderSelect = (providerId: ModelProvider) => {
    setActiveProviderId(providerId)
  }

  const handleTestConnection = async (providerId: ModelProvider) => {
    const config = settings.providers[providerId]
    const providerEntry = modelProviders.find((provider) => provider.id === providerId)
    if (!providerEntry) return
    if (providerEntry.apiKeyRequired !== false && !config?.apiKey) return

    setTestingId(providerId)
    try {
      const result = await testConnection(
        config?.baseUrl || providerEntry.baseUrl,
        config?.apiKey || '',
        providerEntry.authHeader,
        providerEntry.testEndpoint,
        providerId,
      )
      setTestResults((prev) => ({ ...prev, [providerId]: result }))
    } catch (err) {
      setTestResults((prev) => ({ ...prev, [providerId]: { ok: false, error: String(err) } }))
    } finally {
      setTestingId(null)
    }
  }

  const handleSelectKnowledgePath = async () => {
    const directory = await selectDirectory()
    if (directory) {
      updateWorkspaceSettings({ knowledgePath: directory })
    }
  }

  const renderModelsPanel = () => {
    const testResult = testResults[activeProvider.id]
    const modelGroups = groupModels(activeProvider.models)

    return (
      <section className="settings-panel settings-models-panel">
        <div className="settings-models-layout">
          <aside className="settings-provider-browser">
            <div className="settings-provider-browser__head">
              <span className="settings-panel-label">MODEL PROVIDERS</span>
            </div>

            <div className="settings-provider-browser__list">
              {modelProviders.map((provider) => {
                const providerSettings = settings.providers[provider.id]

                return (
                  <button
                    className={`settings-provider-list-item${activeProvider.id === provider.id ? ' is-active' : ''}`}
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    type="button"
                  >
                    <ProviderIcon provider={provider} />
                    <span>
                      <strong>{provider.name}</strong>
                    </span>
                    <i className={providerSettings?.enabled ? 'is-online' : ''} aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="settings-provider-details">
            <div className="settings-provider-details__hero">
              <div className="settings-provider__identity">
                <ProviderIcon provider={activeProvider} />
                <div>
                  {/* <span className="settings-panel-label">PROVIDER DETAILS</span> */}
                  <strong>{activeProvider.name}</strong>
                </div>
              </div>

              <label className="settings-switch" aria-label={`Enable ${activeProvider.name}`}>
                <input
                  type="checkbox"
                  checked={activeProviderSettings?.enabled || false}
                  onChange={(event) => updateProviderSettings(activeProvider.id, { enabled: event.target.checked })}
                />
                <span />
              </label>
            </div>

            <div className="settings-provider-config">
              <label className="settings-field">
                <span>API Key</span>
                <div className="settings-secret-control">
                  <input
                    type={isApiKeyVisible ? 'text' : 'password'}
                    placeholder={activeProvider.apiKeyRequired === false ? 'Optional API key' : 'Paste API key'}
                    value={activeProviderSettings?.apiKey || ''}
                    onChange={(event) => updateProviderSettings(activeProvider.id, { apiKey: event.target.value })}
                  />
                  <button
                    className="settings-secret-icon"
                    onClick={() => setIsApiKeyVisible((visible) => !visible)}
                    type="button"
                    aria-label={isApiKeyVisible ? 'Hide API Key' : 'Show API Key'}
                  >
                    {isApiKeyVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    className="settings-secret-icon"
                    disabled={
                      testingId === activeProvider.id ||
                      (activeProvider.apiKeyRequired !== false && !activeProviderSettings?.apiKey)
                    }
                    onClick={() => handleTestConnection(activeProvider.id)}
                    type="button"
                    aria-label="Test Connection"
                  >
                    {testingId === activeProvider.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                  </button>
                </div>
              </label>

              <label className="settings-field settings-field--compact">
                <span>Base URL</span>
                <input
                  type="text"
                  placeholder={activeProvider.baseUrl}
                  value={activeProviderSettings?.baseUrl || ''}
                  onChange={(event) => updateProviderSettings(activeProvider.id, { baseUrl: event.target.value })}
                />
              </label>

              {testResult && (
                <span className={`settings-test-result ${testResult.ok ? 'is-success' : 'is-error'}`}>
                  {testResult.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {testResult.ok
                    ? `Connected ${testResult.latency}ms`
                    : testResult.error || `Connection failed ${testResult.status ?? ''}`}
                </span>
              )}
            </div>

            <div className="settings-model-picker">
              <div className="settings-model-picker__head">
                <span className="settings-panel-label">SELECT MODEL</span>
              </div>

              <div className="settings-model-list">
                {modelGroups.map((group) => (
                  <div className="settings-model-group" key={group.series}>
                    <div className="settings-model-group__label">{formatSeriesTitle(group.series)}</div>
                    {group.models.map((modelEntry) => {
                      const isActive = activeModel?.id === modelEntry.id

                      return (
                        <button
                          className={`settings-model-row${isActive ? ' is-active' : ''}`}
                          key={modelEntry.id}
                          onClick={() => updateProviderSettings(activeProvider.id, { selectedModelId: modelEntry.id })}
                          type="button"
                        >
                          <span>
                            <strong>{formatModelVariant(modelEntry)}</strong>
                          </span>
                          <em>{isActive ? 'Selected' : modelTierLabels[modelEntry.tier]}</em>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    )
  }

  const renderWorkspacePanel = () => (
    <section className="settings-panel">
      <div className="settings-panel__heading">
        <span className="settings-panel-label">WORKSPACE</span>
        <h3>Workspace</h3>
        <p>Save the knowledge path and chat tool permissions.</p>
      </div>

      <div className="settings-section-grid">
        <div className="settings-block">
          <span className="settings-panel-label">KNOWLEDGE PATH</span>
          <label className="settings-field">
            <span>Knowledge Path</span>
            <div className="settings-inline-field">
              <input
                type="text"
                placeholder="Choose a local knowledge directory"
                value={settings.workspace.knowledgePath}
                onChange={(event) => updateWorkspaceSettings({ knowledgePath: event.target.value })}
              />
              <button className="settings-icon-button" onClick={handleSelectKnowledgePath} type="button">
                <FolderOpen size={17} />
              </button>
            </div>
          </label>
        </div>

        <div className="settings-option-row">
          <div className="settings-option-row__icon">
            <Search size={18} />
          </div>
          <div>
            <strong>Web Search</strong>
            <small>Allow chat sessions to use Web Search.</small>
          </div>
          <label className="settings-switch" aria-label="Enable Web Search">
            <input
              type="checkbox"
              checked={settings.workspace.allowWebSearch}
              onChange={(event) => updateWorkspaceSettings({ allowWebSearch: event.target.checked })}
            />
            <span />
          </label>
        </div>
      </div>
    </section>
  )

  const renderAgentPanel = () => (
    <section className="settings-panel">
      <div className="settings-panel__heading">
        <span className="settings-panel-label">ACP RUNTIME</span>
        <h3>Agent</h3>
        <p>Save the ACP agent command and working directory.</p>
      </div>

      <div className="settings-section-grid">
        <div className="settings-block">
          <span className="settings-panel-label">COMMAND</span>
          <div className="settings-form-grid">
            <label className="settings-field">
              <span>Command</span>
              <input
                type="text"
                placeholder="npx"
                value={settings.agent.command}
                onChange={(event) => updateAgentSettings({ command: event.target.value })}
              />
            </label>

            <label className="settings-field">
              <span>Args</span>
              <input
                type="text"
                placeholder="tsx agent.ts"
                value={settings.agent.args}
                onChange={(event) => updateAgentSettings({ args: event.target.value })}
              />
            </label>
          </div>

          <label className="settings-field">
            <span>Working Directory</span>
            <input
              type="text"
              placeholder="E:\\workspace\\project"
              value={settings.agent.workingDir}
              onChange={(event) => updateAgentSettings({ workingDir: event.target.value })}
            />
          </label>
        </div>

        <div className="settings-signal-card">
          <ShieldCheck size={20} />
          <div>
            <strong>Configuration only</strong>
            <small>This panel does not start or stop the agent.</small>
          </div>
        </div>
      </div>
    </section>
  )

  const renderMcpPanel = () => (
    <section className="settings-panel">
      <div className="settings-panel__heading settings-panel__heading--row">
        <div>
          <span className="settings-panel-label">TOOL SERVERS</span>
          <h3>MCP Services</h3>
          <p>Save local MCP server launch parameters.</p>
        </div>
        <button className="settings-action-button settings-action-button--primary" onClick={addMcpServer} type="button">
          <Plus size={15} />
          <span>Add Server</span>
        </button>
      </div>

      {settings.mcp.length === 0 ? (
        <div className="settings-empty-state">
          <Terminal size={22} />
          <strong>No MCP servers yet</strong>
          <small>Added servers are saved in local settings.</small>
        </div>
      ) : (
        <div className="settings-mcp-list">
          {settings.mcp.map((server) => (
            <article className="settings-mcp-server" key={server.id}>
              <div className="settings-mcp-server__head">
                <label className="settings-switch" aria-label={`Enable ${server.name}`}>
                  <input
                    type="checkbox"
                    checked={server.enabled}
                    onChange={(event) => updateMcpServer(server.id, { enabled: event.target.checked })}
                  />
                  <span />
                </label>
                <button
                  className="settings-icon-button"
                  onClick={() => removeMcpServer(server.id)}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="settings-form-grid">
                <label className="settings-field">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="filesystem"
                    value={server.name}
                    onChange={(event) => updateMcpServer(server.id, { name: event.target.value })}
                  />
                </label>

                <label className="settings-field">
                  <span>Command</span>
                  <input
                    type="text"
                    placeholder="npx"
                    value={server.command}
                    onChange={(event) => updateMcpServer(server.id, { command: event.target.value })}
                  />
                </label>
              </div>

              <label className="settings-field">
                <span>Args</span>
                <input
                  type="text"
                  placeholder="-y @modelcontextprotocol/server-filesystem"
                  value={server.args}
                  onChange={(event) => updateMcpServer(server.id, { args: event.target.value })}
                />
              </label>
            </article>
          ))}
        </div>
      )}
    </section>
  )

  const renderSkillsPanel = () => (
    <section className="settings-panel">
      <div className="settings-panel__heading">
        <span className="settings-panel-label">CAPABILITIES</span>
        <h3>Skills</h3>
        <p>Manage built-in capabilities available to chat sessions.</p>
      </div>

      <div className="settings-skill-grid">
        {skillOptions.map((skill) => (
          <div className="settings-option-row settings-option-row--skill" key={skill.id}>
            <div className="settings-option-row__icon">
              <KeyRound size={18} />
            </div>
            <div>
              <span className="settings-panel-label">{skill.meta}</span>
              <strong>{skill.name}</strong>
              <small>{skill.description}</small>
            </div>
            <label className="settings-switch" aria-label={`Enable ${skill.name}`}>
              <input
                type="checkbox"
                checked={settings.skills[skill.id] || false}
                onChange={(event) => updateSkillSettings(skill.id, event.target.checked)}
              />
              <span />
            </label>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className="settings-overlay-backdrop">
      <div className="settings-overlay-container">
        <header className="settings-header">
          <button className="settings-close-button" onClick={onClose} aria-label="Close Settings" type="button">
            <X size={20} />
          </button>
        </header>

        <div className="settings-body">
          <nav className="settings-sidebar" aria-label="Settings sections">
            {settingsCategories.map((category) => (
              <button
                key={category.id}
                className={`settings-tab ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                <span className="settings-tab-icon">{category.icon}</span>
                <span className="settings-tab-copy">
                  <strong>{category.title}</strong>
                </span>
              </button>
            ))}
          </nav>

          <main className="settings-content">
            {activeCategory === 'models' && renderModelsPanel()}
            {activeCategory === 'workspace' && renderWorkspacePanel()}
            {activeCategory === 'agent' && renderAgentPanel()}
            {activeCategory === 'mcp' && renderMcpPanel()}
            {activeCategory === 'skills' && renderSkillsPanel()}
          </main>
        </div>
      </div>
    </div>
  )
}
