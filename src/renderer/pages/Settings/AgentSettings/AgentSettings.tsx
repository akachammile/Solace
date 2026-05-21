import { useTranslation } from 'react-i18next'
import type { AgentSettings as AgentSettingsState } from '@/hooks/useSettings'
import {
  SettingBlock,
  SettingField,
  SettingFormGrid,
  SettingMeta,
  SettingPageDescription,
  SettingPageTitle,
  SettingPanel,
  SettingPanelHeader,
  SettingSectionGrid,
} from '..'

interface AgentSettingsProps {
  iconProps: {
    strokeWidth: number
  }
  settings: AgentSettingsState
  onUpdate: (partial: Partial<AgentSettingsState>) => void
}

export function AgentSettings({ settings, onUpdate }: AgentSettingsProps) {
  const { t } = useTranslation()

  return (
    <SettingPanel>
      <SettingPanelHeader>
        <SettingMeta>{t('settings.agentRuntimeLabel')}</SettingMeta>
        <SettingPageTitle>{t('settings.agent')}</SettingPageTitle>
        <SettingPageDescription>{t('settings.agentDescription')}</SettingPageDescription>
      </SettingPanelHeader>

      <SettingSectionGrid>
        <SettingBlock>
          <SettingMeta>{t('settings.commandLabel')}</SettingMeta>
          <SettingFormGrid>
            <SettingField as="label">
              <input
                type="text"
                placeholder={t('settings.commandPlaceholderShort')}
                value={settings.command}
                onChange={(event) => onUpdate({ command: event.target.value })}
              />
            </SettingField>

            <SettingField as="label">
              <input
                type="text"
                placeholder={t('settings.argsPlaceholderShort')}
                value={settings.args}
                onChange={(event) => onUpdate({ args: event.target.value })}
              />
            </SettingField>
          </SettingFormGrid>

          <SettingField as="label">
            <span>{t('settings.workingDirectory')}</span>
            <input
              type="text"
              placeholder={t('settings.workingDirectoryPlaceholder')}
              value={settings.workingDir}
              onChange={(event) => onUpdate({ workingDir: event.target.value })}
            />
          </SettingField>
        </SettingBlock>
      </SettingSectionGrid>
    </SettingPanel>
  )
}
