import {
  FolderOpen, Globe, KeyRound, Link2, SlidersHorizontal,
  Zap, Loader2, Wrench,
  Server, Cpu, Settings
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { modelProviders, getProvider } from '@/data/model-catalog'
import { skillCatalog } from '@/data/skills-catalog'
import { selectDirectory, testConnection } from '@/services/electron/system'
import { useSettingsState } from '@/state/settings-context'
import type { ModelProvider } from '@/types/ui'
import './settings.css'

type SettingsSection = 'general' | 'model-service' | 'skills' | 'api'

export function SettingsView() {
  const { t } = useTranslation()
  const { settings, updateSetting } = useSettingsState()
  
  // Navigation state
  const [activeSection, setActiveSection] = useState<SettingsSection>('model-service')
  const [selectedProviderId, setSelectedProviderId] = useState<ModelProvider>(settings.provider)
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skillCatalog[0].id)

  const [directoryStatus, setDirectoryStatus] = useState('')
  const [agentDirStatus, setAgentDirStatus] = useState('')
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [testResult, setTestResult] = useState('')

  const activeProvider = getProvider(selectedProviderId)
  const selectedSkill = skillCatalog.find((s) => s.id === selectedSkillId)

  // Sections that use a 3-stage layout (Sidebar 1 -> Sidebar 2 -> Detail)
  const isThreeTier = activeSection === 'model-service' || activeSection === 'skills'

  // Ensure default selections when section changes
  useEffect(() => {
    setTestState('idle')
    setTestResult('')
  }, [activeSection, selectedProviderId])

  const handleSelectDirectory = async () => {
    setDirectoryStatus(t('settings.dialog.opening'))
    const selectedPath = await selectDirectory()
    if (!selectedPath) {
      setDirectoryStatus(t('settings.dialog.canceled'))
      return
    }
    updateSetting('knowledgePath', selectedPath)
    setDirectoryStatus(t('settings.dialog.selected'))
  }

  const handleSelectAgentDir = async () => {
    setAgentDirStatus(t('settings.dialog.opening'))
    const selectedPath = await selectDirectory()
    if (!selectedPath) {
      setAgentDirStatus(t('settings.dialog.canceled'))
      return
    }
    updateSetting('agentConfig', { ...settings.agentConfig, cwd: selectedPath })
    setAgentDirStatus(t('settings.dialog.selected'))
  }

  const handleTestConnection = async () => {
    if (!settings.apiKey) {
      setTestState('error')
      setTestResult(t('settings.testConn.required'))
      return
    }
    setTestState('testing')
    setTestResult('')
    const result = await testConnection(
      settings.baseUrl,
      settings.apiKey,
      activeProvider.authHeader,
      activeProvider.testEndpoint,
    )
    if (result.ok) {
      setTestState('success')
      setTestResult(t('settings.testConn.connected', { latency: result.latency }))
    } else if (result.status === 0) {
      setTestState('error')
      setTestResult(result.error ?? t('settings.testConn.failed'))
    } else {
      setTestState('error')
      setTestResult(t('settings.testConn.httpError', { status: result.status }))
    }
  }

  const handleSkillToggle = (skillId: string) => {
    updateSetting('skillsConfig', {
      ...settings.skillsConfig,
      [skillId]: !settings.skillsConfig[skillId as keyof typeof settings.skillsConfig],
    })
  }

  // 1st Stage: Category Bars
  const primaryNav = (
    <div className="settings-primary-nav">
      <button
        className={`settings-nav-bar-btn${activeSection === 'general' ? ' settings-nav-bar-btn--active' : ''}`}
        onClick={() => setActiveSection('general')}
        type="button"
      >
        <Settings size={18} />
        <span>{t('settings.general')}</span>
      </button>

      <button
        className={`settings-nav-bar-btn${activeSection === 'model-service' ? ' settings-nav-bar-btn--active' : ''}`}
        onClick={() => setActiveSection('model-service')}
        type="button"
      >
        <Cpu size={18} />
        <span>{t('settings.modelService')}</span>
      </button>

      <button
        className={`settings-nav-bar-btn${activeSection === 'skills' ? ' settings-nav-bar-btn--active' : ''}`}
        onClick={() => setActiveSection('skills')}
        type="button"
      >
        <Wrench size={18} />
        <span>{t('settings.skills')}</span>
      </button>

      <button
        className={`settings-nav-bar-btn${activeSection === 'api' ? ' settings-nav-bar-btn--active' : ''}`}
        onClick={() => setActiveSection('api')}
        type="button"
      >
        <Server size={18} />
        <span>{t('settings.apiServer')}</span>
      </button>
    </div>
  )

  // 2nd Stage: Item Labels (Only for multi-option sections)
  const secondaryNav = (() => {
    if (activeSection === 'model-service') {
      return (
        <div className="settings-secondary-nav">
          <div className="settings-nav-header">{t('settings.modelProviders')}</div>
          {modelProviders.map((p) => (
            <button
              key={p.id}
              className={`settings-sidebar-item${selectedProviderId === p.id ? ' settings-sidebar-item--active' : ''}`}
              onClick={() => {
                setSelectedProviderId(p.id)
                updateSetting('provider', p.id)
              }}
              type="button"
            >
              <span className="settings-sidebar-item__icon"><img src={p.icon} alt="" /></span>
              <div className="settings-sidebar-item__text"><strong>{p.name}</strong></div>
            </button>
          ))}
        </div>
      )
    }

    if (activeSection === 'skills') {
      return (
        <div className="settings-secondary-nav">
          <div className="settings-nav-header">{t('settings.skills')}</div>
          {skillCatalog.map((skill) => {
            const SkillIcon = skill.icon
            return (
              <button
                key={skill.id}
                className={`settings-sidebar-item${selectedSkillId === skill.id ? ' settings-sidebar-item--active' : ''}`}
                onClick={() => setSelectedSkillId(skill.id)}
                type="button"
              >
                <span className="settings-sidebar-item__icon settings-sidebar-item__icon--skill"><SkillIcon size={18} /></span>
                <div className="settings-sidebar-item__text"><strong>{t(`skills.${skill.id}.name`, { defaultValue: skill.name })}</strong></div>
              </button>
            )
          })}
        </div>
      )
    }

    return null
  })()

  // 3rd Stage: Detail View
  const detail = (() => {
    if (activeSection === 'general') {
      return (
        <div className="settings-detail">
          <div className="settings-detail-header">
            <span className="settings-detail-header__icon"><Globe size={26} /></span>
            <div><h2>{t('settings.languageLabel')}</h2></div>
          </div>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-row__label">{t('common.language')}</span>
              <div className="settings-row__control">
                <select
                  className="settings-select"
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value as 'en' | 'zh')}
                >
                  <option value="zh">{t('common.zh')}</option>
                  <option value="en">{t('common.en')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeSection === 'model-service') {
      return (
        <div className="settings-detail">
          <div className="settings-detail-header">
            <span className="settings-detail-header__icon"><img src={activeProvider.icon} alt="" /></span>
            <div><h2>{activeProvider.name}</h2></div>
          </div>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-row__label">{t('settings.model')}</span>
              <div className="settings-row__control">
                <select
                  className="settings-select"
                  value={settings.model}
                  onChange={(e) => updateSetting('model', e.target.value)}
                >
                  {activeProvider.models.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="settings-card__divider" />
            <div className="settings-row">
              <SlidersHorizontal size={14} className="settings-row__lead-icon" />
              <span className="settings-row__label">{t('settings.temperature')}</span>
              <input
                className="settings-range"
                max={2} min={0} step={0.1} type="range"
                value={settings.temperature}
                onChange={(e) => updateSetting('temperature', Number(e.target.value))}
              />
              <strong className="settings-range-value">{settings.temperature.toFixed(1)}</strong>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card__header">{t('settings.connection')}</div>
            <div className="settings-input-row">
              <KeyRound size={15} className="settings-input-row__icon" />
              <input
                className="settings-input-row__input"
                onChange={(e) => updateSetting('apiKey', e.target.value)}
                placeholder={t('settings.apiKeyPlaceholder', { name: activeProvider.name })}
                type="password"
                value={settings.apiKey}
              />
            </div>
            <div className="settings-card__divider" />
            <div className="settings-input-row">
              <Link2 size={15} className="settings-input-row__icon" />
              <input
                className="settings-input-row__input"
                onChange={(e) => updateSetting('baseUrl', e.target.value)}
                placeholder={activeProvider.baseUrl}
                value={settings.baseUrl}
              />
              <button
                className="settings-test-chip"
                onClick={handleTestConnection}
                disabled={testState === 'testing'}
                type="button"
              >
                {testState === 'testing' ? <Loader2 size={13} className="settings-spin" /> : <Zap size={13} />}
                <span>{t('settings.test')}</span>
              </button>
            </div>
            {testResult && (
              <div className={`settings-test-banner${testState === 'success' ? ' settings-test-banner--ok' : ' settings-test-banner--err'}`}>
                {testResult}
              </div>
            )}
          </div>
        </div>
      )
    }

    if (activeSection === 'skills' && selectedSkill) {
      return (
        <div className="settings-detail">
          <div className="settings-detail-header">
            <span className="settings-detail-header__icon settings-detail-header__icon--skill"><selectedSkill.icon size={22} /></span>
            <div><h2>{t(`skills.${selectedSkill.id}.name`, { defaultValue: selectedSkill.name })}</h2></div>
          </div>
          <div className="settings-card">
            <div className="settings-row settings-row--toggle">
              <div className="settings-row__toggle-text"><Wrench size={16} /><span>{t('settings.enableSkill', { name: selectedSkill.name })}</span></div>
              <label className="ios-toggle">
                <input
                  checked={settings.skillsConfig[selectedSkill.id as keyof typeof settings.skillsConfig]}
                  onChange={() => handleSkillToggle(selectedSkill.id)}
                  type="checkbox"
                />
                <span className="ios-toggle__track" />
              </label>
            </div>
          </div>
          <div className="settings-meta-card">
            <span>{t('settings.providerLabel', { name: selectedSkill.provider })}</span>
            <span>{t('settings.idLabel', { id: selectedSkill.id })}</span>
          </div>
        </div>
      )
    }

    if (activeSection === 'api') {
      return (
        <div className="settings-detail">
          <div className="settings-detail-header">
            <span className="settings-detail-header__icon settings-detail-header__icon--api"><Server size={26} /></span>
            <div><h2>{t('settings.apiServer')}</h2></div>
          </div>
          
          <div className="settings-card">
            <div className="settings-card__header">{t('settings.workspace')}</div>
            <div className="settings-input-row">
              <FolderOpen size={15} className="settings-input-row__icon" />
              <input
                className="settings-input-row__input"
                onChange={(e) => updateSetting('knowledgePath', e.target.value)}
                placeholder="./knowledge"
                value={settings.knowledgePath}
              />
              <button className="settings-browse-chip" onClick={handleSelectDirectory} type="button">{t('settings.browse')}</button>
            </div>
            {directoryStatus && <div className="settings-test-banner settings-test-banner--ok">{directoryStatus}</div>}
            
            <div className="settings-card__divider" />
            
            <div className="settings-row settings-row--toggle">
              <div className="settings-row__toggle-text"><Globe size={16} /><span>{t('settings.allowWebSearch')}</span></div>
              <label className="ios-toggle">
                <input
                  checked={settings.allowWebSearch}
                  onChange={(e) => updateSetting('allowWebSearch', e.target.checked)}
                  type="checkbox"
                />
                <span className="ios-toggle__track" />
              </label>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card__header">{t('settings.agent')}</div>
            <div className="settings-input-row">
              <input
                className="settings-input-row__input settings-input-row__input--mono"
                onChange={(e) => updateSetting('agentConfig', { ...settings.agentConfig, command: e.target.value })}
                placeholder={t('settings.commandPlaceholder')}
                value={settings.agentConfig.command}
              />
            </div>
            <div className="settings-card__divider" />
            <div className="settings-input-row">
              <input
                className="settings-input-row__input settings-input-row__input--mono"
                onChange={(e) => updateSetting('agentConfig', { ...settings.agentConfig, args: e.target.value })}
                placeholder={t('settings.argsPlaceholder')}
                value={settings.agentConfig.args}
              />
            </div>
            <div className="settings-card__divider" />
            <div className="settings-input-row">
              <FolderOpen size={15} className="settings-input-row__icon" />
              <input
                className="settings-input-row__input"
                onChange={(e) => updateSetting('agentConfig', { ...settings.agentConfig, cwd: e.target.value })}
                placeholder={t('settings.workingDirPlaceholder')}
                value={settings.agentConfig.cwd}
              />
              <button className="settings-browse-chip" onClick={handleSelectAgentDir} type="button">{t('settings.browse')}</button>
            </div>
            {agentDirStatus && <div className="settings-test-banner settings-test-banner--ok">{agentDirStatus}</div>}
          </div>
        </div>
      )
    }

    return null
  })()

  return (
    <div className={`settings-view-layout${isThreeTier ? ' settings-view-layout--three-tier' : ' settings-view-layout--two-tier'}`}>
      <aside className="settings-view-layout__primary">{primaryNav}</aside>
      {isThreeTier && <aside className="settings-view-layout__secondary">{secondaryNav}</aside>}
      <main className="settings-view-layout__detail">
        {detail ?? <div className="two-tier-empty-state">{t('settings.emptyState')}</div>}
      </main>
    </div>
  )
}
