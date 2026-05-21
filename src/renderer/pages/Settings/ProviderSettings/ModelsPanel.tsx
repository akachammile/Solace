import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, RefreshCw, Search } from 'lucide-react'
import { modelProviders, type ModelEntry, type ProviderEntry } from '@/data/model-catalog'
import type { AppSettings, ProviderSettings } from '@/hooks/useSettings'
import type { ModelProvider } from '@/types/ui'
import {
  SettingBadge,
  SettingCompactField,
  SettingContent,
  SettingField,
  SettingMeta,
  SettingModelRow,
  SettingProviderRow,
  SettingStatusDot,
  SettingSwitch,
  SettingTitle,
  SettingsModelGroup,
  SettingsModelGroupBody,
  SettingsModelGroupLabel,
  SettingsModelList,
  SettingsModelListScrollbar,
  SettingsModelListShell,
  SettingsModelListThumb,
  SettingsModelPicker,
  SettingsModelPickerHead,
  SettingsModelsLayout,
  SettingsModelsPanel,
  SettingsModelSearch,
  SettingsProviderBrowser,
  SettingsProviderBrowserHead,
  SettingsProviderBrowserList,
  SettingsProviderConfig,
  SettingsProviderDetails,
  SettingsProviderHero,
  SettingsProviderIcon,
  SettingsProviderIdentity,
  SettingsProviderMonogram,
  SettingsRotatingIcon,
  SettingsSecretControl,
  SettingsSecretIcon,
  SettingsTestResult,
} from '..'

export interface TestState {
  ok: boolean
  latency?: number
  error?: string
  status?: number
}

interface ModelGroup {
  series: string
  models: ModelEntry[]
}

interface ModelScrollbarState {
  visible: boolean
  top: number
  height: number
}

const modelTierLabels: Record<ModelEntry['tier'], string> = {
  flagship: 'settings.modelTiers.flagship',
  standard: 'settings.modelTiers.standard',
  fast: 'settings.modelTiers.fast',
  reasoning: 'settings.modelTiers.reasoning',
  code: 'settings.modelTiers.code',
  research: 'settings.modelTiers.research',
  local: 'settings.modelTiers.local',
}

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

function ProviderIcon({ provider }: { provider: ProviderEntry }) {
  if (provider.icon) {
    return (
      <SettingsProviderIcon>
        <img src={provider.icon} alt="" />
      </SettingsProviderIcon>
    )
  }

  return (
    <SettingsProviderMonogram aria-hidden="true">
      {provider.shortName}
    </SettingsProviderMonogram>
  )
}

interface ModelsPanelProps {
  activeProviderId: ModelProvider
  iconProps: {
    strokeWidth: number
  }
  isApiKeyVisible: boolean
  modelSearchQuery: string
  settings: AppSettings
  testingId: string | null
  testResults: Record<string, TestState>
  onProviderSearchChange: (query: string) => void
  onSelectProvider: (providerId: ModelProvider) => void
  onTestConnection: (providerId: ModelProvider) => void
  onToggleApiKeyVisible: () => void
  onUpdateProvider: (providerId: ModelProvider, partial: Partial<ProviderSettings>) => void
}

interface ModelListProps {
  activeModel?: ModelEntry
  provider: ProviderEntry
  groups: ModelGroup[]
  onSelectModel: (partial: Partial<ProviderSettings>) => void
}

function ModelList({ activeModel, provider, groups, onSelectModel }: ModelListProps) {
  const { t } = useTranslation()
  const modelListRef = useRef<HTMLDivElement | null>(null)
  const [modelScrollbar, setModelScrollbar] = useState<ModelScrollbarState>({
    visible: false,
    top: 0,
    height: 0,
  })

  const updateModelScrollbar = useCallback(() => {
    const list = modelListRef.current
    if (!list) return

    const { clientHeight, scrollHeight, scrollTop } = list
    const isScrollable = scrollHeight > clientHeight + 1

    if (!isScrollable) {
      setModelScrollbar({ visible: false, top: 0, height: 0 })
      return
    }

    const trackInset = 8
    const trackHeight = Math.max(clientHeight - trackInset * 2, 1)
    const thumbHeight = Math.max(34, Math.round((clientHeight / scrollHeight) * trackHeight))
    const scrollRange = Math.max(scrollHeight - clientHeight, 1)
    const thumbRange = Math.max(trackHeight - thumbHeight, 0)
    const top = trackInset + Math.round((scrollTop / scrollRange) * thumbRange)

    setModelScrollbar({ visible: true, top, height: thumbHeight })
  }, [])

  useEffect(() => {
    const list = modelListRef.current
    if (!list) return undefined

    const frame = window.requestAnimationFrame(updateModelScrollbar)
    const resizeObserver = new ResizeObserver(updateModelScrollbar)
    resizeObserver.observe(list)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [groups, updateModelScrollbar])

  return (
    <SettingsModelPicker>
      <SettingsModelPickerHead>
        <SettingMeta>{t('settings.selectModel')}</SettingMeta>
      </SettingsModelPickerHead>

      <SettingsModelListShell>
        <SettingsModelList ref={modelListRef} onScroll={updateModelScrollbar}>
          {groups.map((group, groupIndex) => (
            <SettingsModelGroup $stackIndex={groupIndex} key={group.series}>
              <SettingsModelGroupLabel>
                <ProviderIcon provider={provider} />
                {formatSeriesTitle(group.series)}
              </SettingsModelGroupLabel>
              <SettingsModelGroupBody>
                {group.models.map((modelEntry) => {
                  const isActive = activeModel?.id === modelEntry.id

                  return (
                    <SettingModelRow
                      $active={isActive}
                      key={modelEntry.id}
                      onClick={() => onSelectModel({ selectedModelId: modelEntry.id })}
                      role="button"
                      tabIndex={0}
                    >
                      <SettingContent>
                        <SettingTitle>{modelEntry.name}</SettingTitle>
                      </SettingContent>
                      <SettingBadge>
                        {isActive ? t('settings.selected') : t(modelTierLabels[modelEntry.tier])}
                      </SettingBadge>
                    </SettingModelRow>
                  )
                })}
              </SettingsModelGroupBody>
            </SettingsModelGroup>
          ))}
        </SettingsModelList>
        {modelScrollbar.visible && (
          <SettingsModelListScrollbar aria-hidden="true">
            <SettingsModelListThumb
              style={{
                height: `${modelScrollbar.height}px`,
                transform: `translateY(${modelScrollbar.top}px)`,
              }}
            />
          </SettingsModelListScrollbar>
        )}
      </SettingsModelListShell>
    </SettingsModelPicker>
  )
}

export function ModelsPanel({
  activeProviderId,
  iconProps,
  isApiKeyVisible,
  modelSearchQuery,
  settings,
  testingId,
  testResults,
  onProviderSearchChange,
  onSelectProvider,
  onTestConnection,
  onToggleApiKeyVisible,
  onUpdateProvider,
}: ModelsPanelProps) {
  const { t } = useTranslation()
  const activeProvider = modelProviders.find((provider) => provider.id === activeProviderId) ?? modelProviders[0]
  const activeProviderSettings = settings.providers[activeProvider.id]
  const normalizedModelSearch = modelSearchQuery.trim().toLowerCase()
  const matchesModelSearch = (...values: Array<string | undefined>) =>
    !normalizedModelSearch || values.some((value) => value?.toLowerCase().includes(normalizedModelSearch))
  const filteredProviders = modelProviders.filter((provider) =>
    matchesModelSearch(provider.id, provider.name, provider.shortName, provider.baseUrl) ||
    provider.models.some((modelEntry) =>
      matchesModelSearch(modelEntry.id, modelEntry.name, modelEntry.series, modelEntry.tier),
    ),
  )
  const visibleModels = activeProvider.models.filter((modelEntry) =>
    matchesModelSearch(modelEntry.id, modelEntry.name, modelEntry.series, modelEntry.tier),
  )
  const activeModel = activeProviderSettings?.selectedModelId
    ? activeProvider.models.find((modelEntry) => modelEntry.id === activeProviderSettings.selectedModelId)
    : undefined

  return (
    <SettingsModelsPanel as="section">
      <SettingsModelsLayout>
        <SettingsProviderBrowser as="aside">
          <SettingsProviderBrowserHead>
            <SettingsModelSearch as="label" aria-label={t('settings.searchModels')}>
              <Search {...iconProps} />
              <input
                autoComplete="off"
                type="search"
                value={modelSearchQuery}
                onChange={(event) => onProviderSearchChange(event.target.value)}
              />
            </SettingsModelSearch>
          </SettingsProviderBrowserHead>

          <SettingsProviderBrowserList>
            {filteredProviders.map((provider) => {
              const providerSettings = settings.providers[provider.id]
              const isActive = activeProvider.id === provider.id

              return (
                <SettingProviderRow
                  $active={isActive}
                  key={provider.id}
                  onClick={() => onSelectProvider(provider.id)}
                  role="button"
                  tabIndex={0}
                >
                  <ProviderIcon provider={provider} />
                  <SettingContent>
                    <SettingTitle>{provider.name}</SettingTitle>
                  </SettingContent>
                  <SettingStatusDot $online={providerSettings?.enabled} aria-hidden="true" />
                </SettingProviderRow>
              )
            })}
          </SettingsProviderBrowserList>
        </SettingsProviderBrowser>

        <SettingsProviderDetails as="section">
          <SettingsProviderHero>
            <SettingsProviderIdentity>
              <ProviderIcon provider={activeProvider} />
              <div>
                <strong>{activeProvider.name}</strong>
              </div>
            </SettingsProviderIdentity>

            <SettingSwitch as="label" aria-label={t('settings.enableProvider', { name: activeProvider.name })}>
              <input
                type="checkbox"
                checked={activeProviderSettings?.enabled || false}
                onChange={(event) => onUpdateProvider(activeProvider.id, { enabled: event.target.checked })}
              />
              <span />
            </SettingSwitch>
          </SettingsProviderHero>

          <SettingsProviderConfig>
            <SettingField as="label">
              <span>{t('settings.apiKey')}</span>
              <SettingsSecretControl>
                <input
                  type={isApiKeyVisible ? 'text' : 'password'}
                  placeholder={activeProvider.apiKeyRequired === false ? t('settings.optionalApiKey') : t('settings.pasteApiKey')}
                  value={activeProviderSettings?.apiKey || ''}
                  onChange={(event) => onUpdateProvider(activeProvider.id, { apiKey: event.target.value })}
                />
                <SettingsSecretIcon
                  as="button"
                  onClick={onToggleApiKeyVisible}
                  type="button"
                  aria-label={isApiKeyVisible ? t('settings.hideApiKey') : t('settings.showApiKey')}
                >
                  {isApiKeyVisible ? <EyeOff {...iconProps} /> : <Eye {...iconProps} />}
                </SettingsSecretIcon>
                <SettingsSecretIcon
                  as="button"
                  disabled={
                    testingId === activeProvider.id ||
                    (activeProvider.apiKeyRequired !== false && !activeProviderSettings?.apiKey)
                  }
                  onClick={() => onTestConnection(activeProvider.id)}
                  type="button"
                  aria-label={t('settings.testConnection')}
                >
                  {testingId === activeProvider.id ? (
                    <SettingsRotatingIcon>
                      <Loader2 {...iconProps} />
                    </SettingsRotatingIcon>
                  ) : (
                    <RefreshCw {...iconProps} />
                  )}
                </SettingsSecretIcon>
              </SettingsSecretControl>
            </SettingField>

            <SettingCompactField as="label">
              <span>{t('settings.baseUrl')}</span>
              <input
                type="text"
                placeholder={activeProvider.baseUrl}
                value={activeProviderSettings?.baseUrl || ''}
                onChange={(event) => onUpdateProvider(activeProvider.id, { baseUrl: event.target.value })}
              />
            </SettingCompactField>

            {testResults[activeProvider.id] && (
              <SettingsTestResult $ok={testResults[activeProvider.id].ok}>
                {testResults[activeProvider.id].ok ? <CheckCircle2 {...iconProps} /> : <AlertCircle {...iconProps} />}
                {testResults[activeProvider.id].ok
                  ? t('settings.testConn.connectedPlain', { latency: testResults[activeProvider.id].latency })
                  : testResults[activeProvider.id].error ||
                    t('settings.testConn.failedStatus', { status: testResults[activeProvider.id].status ?? '' })}
              </SettingsTestResult>
            )}
          </SettingsProviderConfig>

          <ModelList
            activeModel={activeModel}
            provider={activeProvider}
            groups={groupModels(visibleModels)}
            onSelectModel={(partial) => onUpdateProvider(activeProvider.id, partial)}
          />
        </SettingsProviderDetails>
      </SettingsModelsLayout>
    </SettingsModelsPanel>
  )
}
