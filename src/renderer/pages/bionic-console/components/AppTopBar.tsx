import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { closeWindow, minimizeWindow, toggleMaximizeWindow } from '@/services/electron/window'

interface AppTopBarProps {
  title: string
  onOpenHome: () => void
  onOpenSettings: () => void
}

export function AppTopBar({ title, onOpenHome, onOpenSettings }: AppTopBarProps) {
  const { t } = useTranslation()

  return (
    <header className="bc-topbar">
      <div className="bc-window-dots">
        <button aria-label={t('shell.close')} className="bc-window-dot bc-window-dot--close" onClick={() => void closeWindow()} type="button" />
        <button aria-label={t('shell.minimize')} className="bc-window-dot bc-window-dot--min" onClick={() => void minimizeWindow()} type="button" />
        <button aria-label={t('shell.maximize')} className="bc-window-dot bc-window-dot--max" onClick={() => void toggleMaximizeWindow()} type="button" />
      </div>

      <button className="bc-topbar__title" onClick={onOpenHome} type="button">
        {title}
      </button>

      <button
        aria-label={t('nav.settings')}
        className="bc-topbar__settings"
        onClick={onOpenSettings}
        title={t('nav.settings')}
        type="button"
      >
        <Settings size={18} />
      </button>
    </header>
  )
}
