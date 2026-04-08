import {
  BookOpen,
  HeartHandshake,
  MessageSquareText,
  Minus,
  Settings,
  Square,
  UserCircle2,
  X,
} from 'lucide-react'
import { useAppState } from '../state/app-context'
import { closeWindow, minimizeWindow, toggleMaximizeWindow } from '../services/electron/window'
import type { ViewType } from '../types/ui'

const navigationItems: Array<{
  label: string
  view: ViewType
  icon: React.ReactNode
}> = [
  { label: 'Chat', view: 'chat', icon: <MessageSquareText size={20} /> },
  { label: 'Pet', view: 'pet', icon: <HeartHandshake size={20} /> },
  { label: 'Knowledge', view: 'knowledge', icon: <BookOpen size={20} /> },
]

const viewTitles = {
  chat: 'CHAT',
  pet: 'PET',
  knowledge: 'KNOWLEDGE',
  settings: 'SETTINGS',
} as const

export function ShellChrome() {
  const { activeView, setActiveView } = useAppState()

  return (
    <>
      <header className="shell-top-rail">
        <div className="shell-top-rail__drag-region" />

        <div className="shell-window-controls-island">
          <button
            aria-label="Minimize"
            className="shell-ctrl-btn"
            onClick={() => void minimizeWindow()}
            type="button"
          >
            <Minus size={12} />
          </button>
          <button
            aria-label="Maximize"
            className="shell-ctrl-btn"
            onClick={() => void toggleMaximizeWindow()}
            type="button"
          >
            <Square size={11} />
          </button>
          <button
            aria-label="Close"
            className="shell-ctrl-btn shell-ctrl-btn--close"
            onClick={() => void closeWindow()}
            type="button"
          >
            <X size={12} />
          </button>
        </div>
      </header>

      <aside className="shell-left-rail">
        <button
          aria-label="User profile"
          data-tooltip="Profile"
          className="shell-corner-avatar"
          onClick={() => setActiveView('chat')}
          type="button"
        >
          <UserCircle2 size={20} />
        </button>

        <nav aria-label="Primary navigation" className="shell-nav">
          {navigationItems.map((item) => (
            <button
              key={item.view}
              aria-label={item.label}
              data-tooltip={item.label}
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
            aria-label="Settings"
            data-tooltip="Settings"
            className={`shell-nav__button ${activeView === 'settings' ? 'shell-nav__button--active' : ''}`}
            onClick={() => setActiveView('settings')}
            type="button"
          >
            <Settings size={20} />
          </button>
        </div>
      </aside>
    </>
  )
}
