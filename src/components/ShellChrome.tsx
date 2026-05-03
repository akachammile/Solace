import {
  BookOpen,
  Eye,
  HeartHandshake,
  Image,
  Layers,
  MessageSquareText,
  Minus,
  Settings,
  Square,
  UserCircle2,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../state/app-context'
import { closeWindow, minimizeWindow, toggleDimOverlay, toggleMaximizeWindow } from '../services/electron/window'
import type { ViewType } from '../types/ui'

const navigationItems: Array<{
  view: ViewType
  icon: React.ReactNode
}> = [
  { view: 'chat', icon: <MessageSquareText size={18} /> },
  { view: 'image', icon: <Image size={18} /> },
  { view: 'scale', icon: <Layers size={18} /> },
  { view: 'pet', icon: <HeartHandshake size={18} /> },
  { view: 'knowledge', icon: <BookOpen size={18} /> },
]

export function ShellChrome() {
  const { activeView, setActiveView } = useAppState()
  const { t } = useTranslation()

  return (
    <>
      <header className="shell-top-rail">
        <div className="shell-top-rail__drag-region" />

        <div className="shell-window-controls-island">
          <button
            aria-label={t('shell.dimBackground')}
            className="shell-ctrl-btn shell-ctrl-btn--focus"
            onClick={() => void toggleDimOverlay()}
            title={t('shell.dimBackground')}
            type="button"
          >
            <Eye size={16} />
          </button>
          <button
            aria-label={t('shell.minimize')}
            className="shell-ctrl-btn"
            onClick={() => void minimizeWindow()}
            type="button"
          >
            <Minus size={15} />
          </button>
          <button
            aria-label={t('shell.maximize')}
            className="shell-ctrl-btn"
            onClick={() => void toggleMaximizeWindow()}
            type="button"
          >
            <Square size={14} />
          </button>
          <button
            aria-label={t('shell.close')}
            className="shell-ctrl-btn shell-ctrl-btn--close"
            onClick={() => void closeWindow()}
            type="button"
          >
            <X size={15} />
          </button>
        </div>
      </header>

      <aside className="shell-left-rail">
        <button
          aria-label={t('shell.userProfile')}
          data-tooltip={t('shell.profile')}
          className="shell-corner-avatar"
          onClick={() => setActiveView('chat')}
          type="button"
        >
          <UserCircle2 size={18} />
        </button>

        <nav aria-label={t('shell.primaryNav')} className="shell-nav">
          {navigationItems.map((item) => (
            <button
              key={item.view}
              aria-label={t(`nav.${item.view}`)}
              data-tooltip={t(`nav.${item.view}`)}
              className={`shell-nav__button ${activeView === item.view ? 'shell-nav__button--active' : ''}`}
              onClick={() => setActiveView(item.view)}
              type="button"
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <div className="shell-bottom-actions" style={{ marginTop: 'auto', paddingBottom: '4px' }}>
          <button
            aria-label={t('nav.settings')}
            data-tooltip={t('nav.settings')}
            className={`shell-nav__button ${activeView === 'settings' ? 'shell-nav__button--active' : ''}`}
            onClick={() => setActiveView('settings')}
            type="button"
          >
            <Settings size={18} />
          </button>
        </div>
      </aside>
    </>
  )
}
