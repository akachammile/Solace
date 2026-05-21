import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { modelProviders } from '@/data/model-catalog'
import { useSettings } from '@/hooks/useSettings'
import { testConnection } from '@/services/electron/system'
import { minimizeWindow, toggleMaximizeWindow } from '@/services/electron/window'
import type { ModelProvider } from '@/types/ui'
import { AgentSettings } from './AgentSettings/AgentSettings'
import { MCPSettings } from './MCPSettings/MCPSettings'
import { ModelsPanel, type TestState } from './ProviderSettings/ModelsPanel'
import { SettingsSidebar, type SettingsCategoryId } from './SettingsSidebar'
import { SkillsSettings } from './SkillsSettings/SkillsSettings'
import { WorkspaceSettings } from './WorkspaceSettings/WorkspaceSettings'
import {
  SettingsBody,
  SettingsCloseTrafficButton,
  SettingsContent,
  SettingsMinimizeTrafficButton,
  SettingsOverlayBackdrop,
  SettingsOverlayContainer,
  SettingsWindowControls,
  SettingsZoomTrafficButton,
} from '.'

const settingsIconProps = {
  strokeWidth: 1.9,
}

interface SettingsOverlayProps {
  onClose: () => void
}

export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const { t } = useTranslation()
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
  const [modelSearchQuery, setModelSearchQuery] = useState('')

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

  return (
    <SettingsOverlayBackdrop>
      <SettingsOverlayContainer>
        <SettingsWindowControls aria-label={t('shell.windowControls')}>
          <SettingsMinimizeTrafficButton
            as="button"
            onClick={() => void minimizeWindow()}
            aria-label={t('shell.minimize')}
            type="button"
          />
          <SettingsZoomTrafficButton
            as="button"
            onClick={() => void toggleMaximizeWindow()}
            aria-label={t('shell.maximize')}
            type="button"
          />
          <SettingsCloseTrafficButton
            as="button"
            onClick={onClose}
            aria-label={t('settings.closeSettings')}
            type="button"
          />
        </SettingsWindowControls>
        <SettingsBody>
          <SettingsSidebar
            activeCategory={activeCategory}
            iconProps={settingsIconProps}
            onCategoryChange={setActiveCategory}
          />

          <SettingsContent as="main">
            {activeCategory === 'models' && (
              <ModelsPanel
                activeProviderId={activeProviderId}
                iconProps={settingsIconProps}
                isApiKeyVisible={isApiKeyVisible}
                modelSearchQuery={modelSearchQuery}
                settings={settings}
                testingId={testingId}
                testResults={testResults}
                onProviderSearchChange={setModelSearchQuery}
                onSelectProvider={handleProviderSelect}
                onTestConnection={handleTestConnection}
                onToggleApiKeyVisible={() => setIsApiKeyVisible((visible) => !visible)}
                onUpdateProvider={updateProviderSettings}
              />
            )}
            {activeCategory === 'workspace' && (
              <WorkspaceSettings
                iconProps={settingsIconProps}
                settings={settings.workspace}
                onUpdate={updateWorkspaceSettings}
              />
            )}
            {activeCategory === 'agent' && (
              <AgentSettings
                iconProps={settingsIconProps}
                settings={settings.agent}
                onUpdate={updateAgentSettings}
              />
            )}
            {activeCategory === 'mcp' && (
              <MCPSettings
                iconProps={settingsIconProps}
                servers={settings.mcp}
                onAddServer={() => addMcpServer(t('settings.mcp.defaultServerName'))}
                onRemoveServer={removeMcpServer}
                onUpdateServer={updateMcpServer}
              />
            )}
            {activeCategory === 'skills' && (
              <SkillsSettings
                iconProps={settingsIconProps}
                settings={settings.skills}
                onUpdate={updateSkillSettings}
              />
            )}
          </SettingsContent>
        </SettingsBody>
      </SettingsOverlayContainer>
    </SettingsOverlayBackdrop>
  )
}
