import { useState } from 'react'
import { CheckCircle2, Database, KeyRound, Loader2, RefreshCw, SlidersHorizontal, Terminal, X, AlertCircle } from 'lucide-react'
import { modelProviders } from '@/data/model-catalog'
import { useSettings } from '@/hooks/useSettings'
import { testConnection } from '@/services/electron/system'
import type { ModelProvider } from '@/types/ui'

interface SettingsOverlayProps {
  onClose: () => void
}

const settingsCategories = [
  {
    id: 'general',
    title: 'General',
    icon: <SlidersHorizontal size={18} />,
  },
  {
    id: 'models',
    title: 'Model Engines',
    icon: <Database size={18} />,
  },
  {
    id: 'keys',
    title: 'API Keys',
    icon: <KeyRound size={18} />,
  },
  {
    id: 'mcp',
    title: 'MCP Services',
    icon: <Terminal size={18} />,
  },
]

export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const [activeCategory, setActiveCategory] = useState(settingsCategories[1].id)
  const { settings, updateProviderSettings } = useSettings()
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; latency?: number; error?: string }>>({})

  const handleTestConnection = async (providerId: ModelProvider) => {
    const config = settings[providerId]
    if (!config?.apiKey) return

    const providerEntry = modelProviders.find(p => p.id === providerId)
    if (!providerEntry) return

    setTestingId(providerId)
    try {
      const result = await testConnection(
        config.baseUrl || providerEntry.baseUrl,
        config.apiKey,
        providerEntry.authHeader,
        providerEntry.testEndpoint,
        providerId
      )
      setTestResults(prev => ({ ...prev, [providerId]: result }))
    } catch (err) {
      setTestResults(prev => ({ ...prev, [providerId]: { ok: false, error: String(err) } }))
    } finally {
      setTestingId(null)
    }
  }

  return (
    <div className="settings-overlay-backdrop">
      <div className="settings-overlay-container">
        <header className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close-button" onClick={onClose} aria-label="Close Settings">
            <X size={20} />
          </button>
        </header>
        
        <div className="settings-body">
          <nav className="settings-sidebar">
            {settingsCategories.map((category) => (
              <button
                key={category.id}
                className={`settings-tab ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                <span className="settings-tab-icon">{category.icon}</span>
                <span className="settings-tab-title">{category.title}</span>
              </button>
            ))}
          </nav>
          
          <main className="settings-content">
            {activeCategory === 'models' ? (
              <div className="models-settings">
                <h3>Model Engines</h3>
                <p className="settings-subtitle">Configure your LLM providers and API credentials.</p>
                
                <div className="providers-list">
                  {modelProviders.map((provider) => (
                    <div key={provider.id} className="provider-card">
                      <div className="provider-card-header">
                        <div className="provider-info">
                          <img src={provider.icon} alt={provider.name} className="provider-icon" />
                          <strong>{provider.name}</strong>
                        </div>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={settings[provider.id]?.enabled || false}
                            onChange={(e) => updateProviderSettings(provider.id, { enabled: e.target.checked })}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="provider-card-body">
                        <div className="input-group">
                          <label>API Key</label>
                          <input 
                            type="password" 
                            placeholder="sk-..." 
                            value={settings[provider.id]?.apiKey || ''}
                            onChange={(e) => updateProviderSettings(provider.id, { apiKey: e.target.value })}
                          />
                        </div>
                        
                        <div className="input-group">
                          <label>Base URL (Optional)</label>
                          <input 
                            type="text" 
                            placeholder={provider.baseUrl} 
                            value={settings[provider.id]?.baseUrl || ''}
                            onChange={(e) => updateProviderSettings(provider.id, { baseUrl: e.target.value })}
                          />
                        </div>

                        <div className="provider-actions">
                          <button 
                            className="test-btn" 
                            onClick={() => handleTestConnection(provider.id)}
                            disabled={testingId === provider.id || !settings[provider.id]?.apiKey}
                          >
                            {testingId === provider.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <RefreshCw size={14} />
                            )}
                            Test Connection
                          </button>

                          {testResults[provider.id] && (
                            <div className={`test-result ${testResults[provider.id].ok ? 'success' : 'error'}`}>
                              {testResults[provider.id].ok ? (
                                <><CheckCircle2 size={14} /> Connected ({testResults[provider.id].latency}ms)</>
                              ) : (
                                <><AlertCircle size={14} /> Failed: {testResults[provider.id].error}</>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="settings-content-placeholder">
                <h3>{settingsCategories.find(c => c.id === activeCategory)?.title}</h3>
                <p>Configuration details for {activeCategory} will go here.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
