import { useTranslation } from 'react-i18next'
import { closeWindow, minimizeWindow, toggleMaximizeWindow } from '@/services/electron/window'

export function AppTopBar() {
  const { t } = useTranslation()

  return (
    <header className="app-topbar sharp">
      <div className="sidebar-toggle-area">
        <button className="utility-btn">
          <span className="material-symbols-outlined">side_navigation</span>
        </button>
      </div>

      <div className="topbar-content">
        <nav className="nav-links">
          <a href="#" className="nav-link active">Thought Path</a>
          <a href="#" className="nav-link">Trace</a>
          <a href="#" className="nav-link">Synthesis</a>
        </nav>

        <div className="topbar-actions">
          <button className="start-experiment-btn sharp">
            <div className="status-dot"></div>
            START EXPERIMENT
          </button>

          <div className="utility-btns">
            <button className="utility-btn">
              <span className="material-symbols-outlined">account_tree</span>
            </button>
            <button className="utility-btn">
              <span className="material-symbols-outlined">sensors</span>
            </button>
            <button className="utility-btn">
              <span className="material-symbols-outlined">terminal</span>
            </button>
          </div>

          <div className="window-controls-container">
            <div className="control-group">
              <button 
                className="control-dot min" 
                onClick={() => void minimizeWindow()} 
                aria-label={t('shell.minimize')}
              />
              <button 
                className="control-dot max" 
                onClick={() => void toggleMaximizeWindow()} 
                aria-label={t('shell.maximize')}
              />
              <button 
                className="control-dot close" 
                onClick={() => void closeWindow()} 
                aria-label={t('shell.close')}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
