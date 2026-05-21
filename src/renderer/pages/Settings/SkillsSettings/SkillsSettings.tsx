import { useTranslation } from 'react-i18next'
import { KeyRound } from 'lucide-react'
import type { SkillSettings as SkillSettingsState } from '@/hooks/useSettings'
import {
  SettingContent,
  SettingControl,
  SettingHint,
  SettingIconSlot,
  SettingMeta,
  SettingPageDescription,
  SettingPageTitle,
  SettingPanel,
  SettingPanelHeader,
  SettingSkillGrid,
  SettingStartRow,
  SettingSwitch,
  SettingTitle,
} from '..'

const skillOptions = [
  {
    id: 'web-search',
    nameKey: 'skills.web-search.name',
    metaKey: 'settings.skillsMeta.webSearch',
    descriptionKey: 'skills.web-search.desc',
  },
  {
    id: 'file-operations',
    nameKey: 'skills.file-operations.name',
    metaKey: 'settings.skillsMeta.fileOperations',
    descriptionKey: 'skills.file-operations.desc',
  },
  {
    id: 'terminal',
    nameKey: 'skills.terminal.name',
    metaKey: 'settings.skillsMeta.terminal',
    descriptionKey: 'skills.terminal.desc',
  },
  {
    id: 'mcp',
    nameKey: 'skills.mcp.name',
    metaKey: 'settings.skillsMeta.mcp',
    descriptionKey: 'skills.mcp.desc',
  },
  {
    id: 'code-interpreter',
    nameKey: 'skills.code-interpreter.name',
    metaKey: 'settings.skillsMeta.codeInterpreter',
    descriptionKey: 'skills.code-interpreter.desc',
  },
  {
    id: 'rag',
    nameKey: 'skills.rag.name',
    metaKey: 'settings.skillsMeta.rag',
    descriptionKey: 'skills.rag.desc',
  },
]

interface SkillsSettingsProps {
  iconProps: {
    strokeWidth: number
  }
  settings: SkillSettingsState
  onUpdate: (skillId: string, enabled: boolean) => void
}

export function SkillsSettings({ iconProps, settings, onUpdate }: SkillsSettingsProps) {
  const { t } = useTranslation()

  return (
    <SettingPanel>
      <SettingPanelHeader>
        <SettingMeta>{t('settings.capabilities')}</SettingMeta>
        <SettingPageTitle>{t('settings.skills')}</SettingPageTitle>
        <SettingPageDescription>{t('settings.skillsDescription')}</SettingPageDescription>
      </SettingPanelHeader>

      <SettingSkillGrid>
        {skillOptions.map((skill) => (
          <SettingStartRow key={skill.id}>
            <SettingIconSlot>
              <KeyRound {...iconProps} />
            </SettingIconSlot>
            <SettingContent>
              <SettingMeta>{t(skill.metaKey)}</SettingMeta>
              <SettingTitle>{t(skill.nameKey)}</SettingTitle>
              <SettingHint>{t(skill.descriptionKey)}</SettingHint>
            </SettingContent>
            <SettingControl>
              <SettingSwitch as="label" aria-label={t('settings.enableSkill', { name: t(skill.nameKey) })}>
                <input
                  type="checkbox"
                  checked={settings[skill.id] || false}
                  onChange={(event) => onUpdate(skill.id, event.target.checked)}
                />
                <span />
              </SettingSwitch>
            </SettingControl>
          </SettingStartRow>
        ))}
      </SettingSkillGrid>
    </SettingPanel>
  )
}
