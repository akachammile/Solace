import { useTranslation } from 'react-i18next'
import { Plus, Terminal, Trash2 } from 'lucide-react'
import type { MCPServerSettings } from '@/hooks/useSettings'
import {
  SettingCard,
  SettingCardHead,
  SettingEmptyState,
  SettingField,
  SettingFormGrid,
  SettingIconButton,
  SettingList,
  SettingPageDescription,
  SettingPageTitle,
  SettingPanel,
  SettingPanelHeaderRow,
  SettingPanelHeaderText,
  SettingMeta,
  SettingPrimaryButton,
  SettingSwitch,
} from '..'

interface MCPSettingsProps {
  iconProps: {
    strokeWidth: number
  }
  servers: MCPServerSettings[]
  onAddServer: () => void
  onRemoveServer: (serverId: string) => void
  onUpdateServer: (serverId: string, partial: Partial<MCPServerSettings>) => void
}

export function MCPSettings({
  iconProps,
  servers,
  onAddServer,
  onRemoveServer,
  onUpdateServer,
}: MCPSettingsProps) {
  const { t } = useTranslation()

  return (
    <SettingPanel>
      <SettingPanelHeaderRow>
        <SettingPanelHeaderText>
          <SettingMeta>{t('settings.mcp.toolServers')}</SettingMeta>
          <SettingPageTitle>{t('settings.mcp.title')}</SettingPageTitle>
          <SettingPageDescription>{t('settings.mcp.description')}</SettingPageDescription>
        </SettingPanelHeaderText>
        <SettingPrimaryButton as="button" onClick={onAddServer} type="button">
          <Plus {...iconProps} />
          <span>{t('settings.mcp.addServer')}</span>
        </SettingPrimaryButton>
      </SettingPanelHeaderRow>

      {servers.length === 0 ? (
        <SettingEmptyState>
          <Terminal {...iconProps} />
          <strong>{t('settings.mcp.emptyTitle')}</strong>
          <small>{t('settings.mcp.emptyDescription')}</small>
        </SettingEmptyState>
      ) : (
        <SettingList>
          {servers.map((server) => (
            <SettingCard as="article" key={server.id}>
              <SettingCardHead>
                <SettingSwitch as="label" aria-label={t('settings.mcp.enableServer', { name: server.name })}>
                  <input
                    type="checkbox"
                    checked={server.enabled}
                    onChange={(event) => onUpdateServer(server.id, { enabled: event.target.checked })}
                  />
                  <span />
                </SettingSwitch>
                <SettingIconButton
                  as="button"
                  onClick={() => onRemoveServer(server.id)}
                  type="button"
                >
                  <Trash2 {...iconProps} />
                </SettingIconButton>
              </SettingCardHead>

              <SettingFormGrid>
                <SettingField as="label">
                  <span>{t('settings.mcp.name')}</span>
                  <input
                    type="text"
                    placeholder={t('settings.mcp.namePlaceholder')}
                    value={server.name}
                    onChange={(event) => onUpdateServer(server.id, { name: event.target.value })}
                  />
                </SettingField>

                <SettingField as="label">
                  <span>{t('settings.mcp.command')}</span>
                  <input
                    type="text"
                    placeholder={t('settings.mcp.commandPlaceholder')}
                    value={server.command}
                    onChange={(event) => onUpdateServer(server.id, { command: event.target.value })}
                  />
                </SettingField>
              </SettingFormGrid>

              <SettingField as="label">
                <span>{t('settings.mcp.args')}</span>
                <input
                  type="text"
                  placeholder={t('settings.mcp.argsPlaceholder')}
                  value={server.args}
                  onChange={(event) => onUpdateServer(server.id, { args: event.target.value })}
                />
              </SettingField>
            </SettingCard>
          ))}
        </SettingList>
      )}
    </SettingPanel>
  )
}
