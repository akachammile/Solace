import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Archive, Bot, Brain, MessageSquare, Moon, Settings, Sun } from 'lucide-react'

type AppRailItemId = 'chat' | 'repository' | 'memory' | 'settings' | 'agentRole'
type AppTheme = 'light' | 'dark'

const chromeIconProps = {
  strokeWidth: 1.9,
}

interface AppRailProps {
  activeItemId: AppRailItemId
  theme: AppTheme
  onOpenChat: () => void
  onOpenSettings: () => void
  onToggleTheme: () => void
}

const appRailItems: Array<{
  id: AppRailItemId
  labelKey: string
  icon: ReactNode
}> = [
  { id: 'chat', labelKey: 'appRail.chat', icon: <MessageSquare {...chromeIconProps} /> },
  { id: 'repository', labelKey: 'appRail.repository', icon: <Archive {...chromeIconProps} /> },
  { id: 'memory', labelKey: 'appRail.memory', icon: <Brain {...chromeIconProps} /> },
  { id: 'agentRole', labelKey: 'appRail.agentRole', icon: <Bot {...chromeIconProps} /> },
]

const settingsItem = {
  id: 'settings' as const,
  labelKey: 'appRail.settings',
  icon: <Settings {...chromeIconProps} />,
}

export function AppRail({
  activeItemId,
  theme,
  onOpenChat,
  onOpenSettings,
  onToggleTheme,
}: AppRailProps) {
  const { t } = useTranslation()

  const handleClick = (itemId: AppRailItemId) => {
    if (itemId === 'chat') {
      onOpenChat()
      return
    }

    if (itemId === 'settings') {
      onOpenSettings()
    }
  }

  const themeLabel = theme === 'dark' ? t('appRail.switchToLight') : t('appRail.switchToDark')
  const settingsLabel = t(settingsItem.labelKey)

  return (
    <nav className="app-rail" aria-label={t('appRail.sections')}>
      <div className="app-rail__group">
        {appRailItems.map((item) => {
          const label = t(item.labelKey)

          return (
            <button
              aria-current={activeItemId === item.id ? 'page' : undefined}
              aria-label={label}
              className={`app-rail__item${activeItemId === item.id ? ' app-rail__item--active' : ''}`}
              key={item.id}
              onClick={() => handleClick(item.id)}
              title={label}
              type="button"
            >
              {item.icon}
            </button>
          )
        })}
      </div>

      <div className="app-rail__bottom">
        <button
          aria-label={themeLabel}
          aria-pressed={theme === 'dark'}
          className="app-rail__item"
          onClick={onToggleTheme}
          title={themeLabel}
          type="button"
        >
          {theme === 'dark' ? <Sun {...chromeIconProps} /> : <Moon {...chromeIconProps} />}
        </button>

        <button
          aria-current={activeItemId === settingsItem.id ? 'page' : undefined}
          aria-label={settingsLabel}
          className={`app-rail__item${activeItemId === settingsItem.id ? ' app-rail__item--active' : ''}`}
          onClick={() => handleClick(settingsItem.id)}
          title={settingsLabel}
          type="button"
        >
          {settingsItem.icon}
        </button>
      </div>
    </nav>
  )
}
