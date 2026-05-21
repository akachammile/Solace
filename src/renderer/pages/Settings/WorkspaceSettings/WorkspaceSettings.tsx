import { useTranslation } from 'react-i18next'
import { FolderOpen, Search } from 'lucide-react'
import type { WorkspaceSettings as WorkspaceSettingsState } from '@/hooks/useSettings'
import { selectDirectory } from '@/services/electron/system'
import {
  SettingBlock,
  SettingContent,
  SettingControl,
  SettingField,
  SettingHint,
  SettingIconSlot,
  SettingIconButton,
  SettingInlineField,
  SettingMeta,
  SettingPageDescription,
  SettingPageTitle,
  SettingPanel,
  SettingPanelHeader,
  SettingRow,
  SettingSectionGrid,
  SettingSwitch,
  SettingTitle,
} from '..'

interface WorkspaceSettingsProps {
  iconProps: {
    strokeWidth: number
  }
  settings: WorkspaceSettingsState
  onUpdate: (partial: Partial<WorkspaceSettingsState>) => void
}

export function WorkspaceSettings({ iconProps, settings, onUpdate }: WorkspaceSettingsProps) {
  const { t } = useTranslation()

  const handleSelectKnowledgePath = async () => {
    const directory = await selectDirectory()
    if (directory) {
      onUpdate({ knowledgePath: directory })
    }
  }

  return (
    <SettingPanel>
      <SettingPanelHeader>
        <SettingMeta>{t('settings.workspaceLabel')}</SettingMeta>
        <SettingPageTitle>{t('settings.workspace')}</SettingPageTitle>
        <SettingPageDescription>{t('settings.workspaceDescription')}</SettingPageDescription>
      </SettingPanelHeader>

      <SettingSectionGrid>
        <SettingBlock>
          <SettingMeta>{t('settings.knowledgePathLabel')}</SettingMeta>
          <SettingField as="label">
            <span>{t('settings.knowledgePath')}</span>
            <SettingInlineField>
              <input
                type="text"
                placeholder={t('settings.knowledgePathPlaceholder')}
                value={settings.knowledgePath}
                onChange={(event) => onUpdate({ knowledgePath: event.target.value })}
              />
              <SettingIconButton as="button" onClick={handleSelectKnowledgePath} type="button">
                <FolderOpen {...iconProps} />
              </SettingIconButton>
            </SettingInlineField>
          </SettingField>
        </SettingBlock>

        <SettingRow>
          <SettingIconSlot>
            <Search {...iconProps} />
          </SettingIconSlot>
          <SettingContent>
            <SettingTitle>{t('settings.webSearch')}</SettingTitle>
            <SettingHint>{t('settings.webSearchDescription')}</SettingHint>
          </SettingContent>
          <SettingControl>
            <SettingSwitch as="label" aria-label={t('settings.enableWebSearch')}>
              <input
                type="checkbox"
                checked={settings.allowWebSearch}
                onChange={(event) => onUpdate({ allowWebSearch: event.target.checked })}
              />
              <span />
            </SettingSwitch>
          </SettingControl>
        </SettingRow>
      </SettingSectionGrid>
    </SettingPanel>
  )
}
