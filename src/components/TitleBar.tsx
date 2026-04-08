import { Minus, Square, X } from 'lucide-react'
import { useAppState } from '../state/app-context'
import { closeWindow, minimizeWindow, toggleMaximizeWindow } from '../services/electron/window'

const viewTitles = {
  chat: 'Chat',
  pet: 'Pet',
  knowledge: 'Knowledge',
  settings: 'Settings',
} as const

export function TitleBar() {
  const { activeView } = useAppState()

  return (
    <header className="title-bar">
      <div className="title-bar__drag-region">
        <div className="title-bar__meta">
          <span className="title-bar__brand">Solace</span>
          <span className="title-bar__divider" />
          <span className="title-bar__view">{viewTitles[activeView]}</span>
        </div>
      </div>

      <div className="title-bar__controls">
        <button
          aria-label="Minimize window"
          className="title-bar__button"
          onClick={() => void minimizeWindow()}
          type="button"
        >
          <Minus size={16} />
        </button>
        <button
          aria-label="Maximize window"
          className="title-bar__button"
          onClick={() => void toggleMaximizeWindow()}
          type="button"
        >
          <Square size={14} />
        </button>
        <button
          aria-label="Close window"
          className="title-bar__button title-bar__button--close"
          onClick={() => void closeWindow()}
          type="button"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  )
}
