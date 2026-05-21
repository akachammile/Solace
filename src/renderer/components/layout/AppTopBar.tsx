import { useTranslation } from 'react-i18next'
import { closeWindow, minimizeWindow, toggleMaximizeWindow } from '@/services/electron/window'

export function AppTopBar() {
  const { t } = useTranslation()

  return (
    <header className="app-topbar">
      <div className="topbar-drag-region" />
      <div className="window-traffic-controls" aria-label={t('shell.windowControls')} role="group">
        <button
          className="window-traffic-button window-traffic-button--minimize"
          onClick={() => void minimizeWindow()}
          aria-label={t('shell.minimize')}
          type="button"
        />
        <button
          className="window-traffic-button window-traffic-button--zoom"
          onClick={() => void toggleMaximizeWindow()}
          aria-label={t('shell.maximize')}
          type="button"
        />
        <button
          className="window-traffic-button window-traffic-button--close"
          onClick={() => void closeWindow()}
          aria-label={t('shell.close')}
          type="button"
        />
      </div>
    </header>
  )
}
