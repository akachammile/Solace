import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Bot, Database, FolderOpen, Terminal, Wrench } from 'lucide-react'
import {
  SettingsSidebarShell,
  SettingsSidebarTab,
  SettingsSidebarTabCopy,
  SettingsSidebarTabIcon,
} from '.'

export type SettingsCategoryId = 'models' | 'workspace' | 'agent' | 'mcp' | 'skills'

interface SettingsSidebarProps {
  activeCategory: SettingsCategoryId
  iconProps: {
    strokeWidth: number
  }
  onCategoryChange: (categoryId: SettingsCategoryId) => void
}

const settingsCategories: Array<{
  id: SettingsCategoryId
  titleKey: string
  icon: (iconProps: SettingsSidebarProps['iconProps']) => ReactNode
}> = [
  {
    id: 'models',
    titleKey: 'settings.providers',
    icon: (iconProps) => <Database {...iconProps} />,
  },
  {
    id: 'workspace',
    titleKey: 'settings.workspace',
    icon: (iconProps) => <FolderOpen {...iconProps} />,
  },
  {
    id: 'agent',
    titleKey: 'settings.agent',
    icon: (iconProps) => <Bot {...iconProps} />,
  },
  {
    id: 'mcp',
    titleKey: 'settings.mcp.title',
    icon: (iconProps) => <Terminal {...iconProps} />,
  },
  {
    id: 'skills',
    titleKey: 'settings.skills',
    icon: (iconProps) => <Wrench {...iconProps} />,
  },
]

export function SettingsSidebar({
  activeCategory,
  iconProps,
  onCategoryChange,
}: SettingsSidebarProps) {
  const { t } = useTranslation()

  return (
    <SettingsSidebarShell as="nav" aria-label={t('settings.sections')}>
      {settingsCategories.map((category) => (
        <SettingsSidebarTab
          as="button"
          key={category.id}
          $active={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
          type="button"
        >
          <SettingsSidebarTabIcon>{category.icon(iconProps)}</SettingsSidebarTabIcon>
          <SettingsSidebarTabCopy $active={activeCategory === category.id}>
            {t(category.titleKey)}
          </SettingsSidebarTabCopy>
        </SettingsSidebarTab>
      ))}
    </SettingsSidebarShell>
  )
}
