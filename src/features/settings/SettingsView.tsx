import { FolderOpen, Globe, KeyRound, Link2, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { modelProviders } from '../../data/model-catalog'
import { selectDirectory } from '../../services/electron/system'
import { useSettingsState } from '../../state/settings-context'
import { TwoTierLayout } from '../../components/TwoTierLayout'
import './settings.css'

export function SettingsView() {
  const { settings, updateSetting } = useSettingsState()
  const activeProvider = modelProviders.find((p) => p.id === settings.provider) ?? modelProviders[0]
  const [directoryStatus, setDirectoryStatus] = useState('')

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
    <TwoTierLayout
      sidebar={
        <>
          <div className="two-tier-sidebar-header">
            <span className="settings-sidebar-title">Model Providers</span>
          </div>
          <div className="two-tier-list">
            {modelProviders.map((provider) => (
              <button
                key={provider.id}
                className={`settings-provider-card ${
                  settings.provider === provider.id ? 'settings-provider-card--active' : ''
                }`}
                onClick={() => updateSetting('provider', provider.id)}
                type="button"
              >
                <span className="settings-provider-card__icon">
                  <img alt="" src={provider.icon} />
                </span>
                <span>
                  <strong>{provider.name}</strong>
                  <small>{provider.defaultModel}</small>
                </span>
              </button>
            ))}
          </div>
        </>
      }
      detail={
        <div className="settings-panel">
          <div className="settings-panel__title">
            <span className="settings-provider-card__icon">
              <img alt="" src={activeProvider.icon} />
            </span>
            <div>
              <h2>{activeProvider.name}</h2>
              <p>Model configuration</p>
            </div>
          </div>

          <label className="settings-field">
            <span>Model</span>
            <input
              onChange={(e) => updateSetting('model', e.target.value)}
              placeholder="Model name"
              value={settings.model}
            />
          </label>

          <label className="settings-field">
            <span>API key</span>
            <div className="settings-input-with-icon">
              <KeyRound size={16} />
              <input
                onChange={(e) => updateSetting('apiKey', e.target.value)}
                placeholder={`${activeProvider.name} API key`}
                type="password"
                value={settings.apiKey}
              />
            </div>
          </label>

          <label className="settings-field">
            <span>Base URL</span>
            <div className="settings-input-with-icon">
              <Link2 size={16} />
              <input
                onChange={(e) => updateSetting('baseUrl', e.target.value)}
                placeholder={activeProvider.baseUrl}
                value={settings.baseUrl}
              />
            </div>
          </label>

          <label className="settings-field">
            <span>Temperature</span>
            <div className="settings-range-row">
              <SlidersHorizontal size={16} />
              <input
                max={1}
                min={0}
                onChange={(e) => updateSetting('temperature', Number(e.target.value))}
                step={0.1}
                type="range"
                value={settings.temperature}
              />
              <strong>{settings.temperature.toFixed(1)}</strong>
            </div>
          </label>

          <label className="settings-field">
            <span>Knowledge path</span>
            <div className="settings-directory-row">
              <input
                onChange={(e) => updateSetting('knowledgePath', e.target.value)}
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
              onChange={(e) => updateSetting('allowWebSearch', e.target.checked)}
              type="checkbox"
            />
            <span>
              <Globe size={16} />
              Allow web search tools in chat
            </span>
          </label>
        </div>
      }
    />
  )
}
