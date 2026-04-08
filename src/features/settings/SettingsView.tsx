import { FolderOpen, Globe, Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAppInfo, pingMain, selectDirectory } from '../../services/electron/system'
import { useSettingsState } from '../../state/settings-context'
import type { AppInfo } from '../../../shared/types/ipc'
import './settings.css'

export function SettingsView() {
  const { settings, updateSetting } = useSettingsState()
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [pingStatus, setPingStatus] = useState('loading...')
  const [directoryStatus, setDirectoryStatus] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([getAppInfo(), pingMain()]).then(([info, pong]) => {
      if (!isMounted) {
        return
      }

      setAppInfo(info)
      setPingStatus(pong)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSelectDirectory = async () => {
    setDirectoryStatus('Opening dialog...')

    const selectedPath = await selectDirectory()

    if (!selectedPath) {
      setDirectoryStatus('Selection canceled')
      return
    }

    updateSetting('knowledgePath', selectedPath)
    setDirectoryStatus('Directory selected')
  }

  return (
    <section className="view-shell">
      <header className="view-header">
        <div className="view-header__copy">
          <p className="view-header__eyebrow">Configuration</p>
          <h1>Settings</h1>
          <p>Keep model, retrieval, and web access choices stable across view switches.</p>
        </div>
        <span className="settings-badge">
          <Settings2 size={16} />
          Session state
        </span>
      </header>

      <div className="settings-grid">
        <section className="view-surface settings-panel">
          <label className="settings-field">
            <span>Provider</span>
            <select
              onChange={(event) => updateSetting('provider', event.target.value as typeof settings.provider)}
              value={settings.provider}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="ollama">Ollama</option>
            </select>
          </label>

          <label className="settings-field">
            <span>Model</span>
            <input
              onChange={(event) => updateSetting('model', event.target.value)}
              placeholder="Model name"
              value={settings.model}
            />
          </label>

          <label className="settings-field">
            <span>Temperature</span>
            <input
              max={1}
              min={0}
              onChange={(event) => updateSetting('temperature', Number(event.target.value))}
              step={0.1}
              type="range"
              value={settings.temperature}
            />
            <strong>{settings.temperature.toFixed(1)}</strong>
          </label>

          <label className="settings-field">
            <span>Knowledge path</span>
            <div className="settings-directory-row">
              <input
                onChange={(event) => updateSetting('knowledgePath', event.target.value)}
                placeholder="./knowledge"
                value={settings.knowledgePath}
              />
              <button className="settings-directory-button" onClick={handleSelectDirectory} type="button">
                <FolderOpen size={16} />
                Browse
              </button>
            </div>
            {directoryStatus && <p className="settings-meta">{directoryStatus}</p>}
          </label>

          <label className="settings-toggle">
            <input
              checked={settings.allowWebSearch}
              onChange={(event) => updateSetting('allowWebSearch', event.target.checked)}
              type="checkbox"
            />
            <span>
              <Globe size={16} />
              Allow web search tools in chat
            </span>
          </label>
        </section>

        <aside className="stack">
          <article className="info-card">
            <h4>Persistence</h4>
            <p>These values live in React state now. Persist them through preload and main when the shape stabilizes.</p>
          </article>
          <article className="info-card">
            <h4>IPC boundary</h4>
            <p>Keep API keys and file-system paths behind preload instead of reading them directly in the renderer.</p>
          </article>
          <article className="info-card">
            <h4>Main process status</h4>
            <p className="settings-meta">Ping: {pingStatus}</p>
            {appInfo ? (
              <div className="settings-meta">
                <p>{appInfo.appName} v{appInfo.appVersion}</p>
                <p>Electron {appInfo.electronVersion}</p>
                <p>Chrome {appInfo.chromeVersion}</p>
                <p>Node {appInfo.nodeVersion}</p>
                <p>Platform {appInfo.platform}</p>
              </div>
            ) : (
              <p className="settings-meta">Loading app info...</p>
            )}
          </article>
        </aside>
      </div>
    </section>
  )
}
