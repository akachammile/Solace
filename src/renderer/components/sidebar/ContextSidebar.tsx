import { useTranslation } from 'react-i18next'
import { Archive, Database, Plus, Route, Settings, Terminal } from 'lucide-react'

interface ContextSidebarProps {
  onNewSession: () => void
  onOpenSettings: () => void
}

export function ContextSidebar({ onNewSession, onOpenSettings }: ContextSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="context-sidebar">
      <button className="new-experiment-btn" onClick={onNewSession}>
        <Plus className="icon" aria-hidden="true" />
        <span className="context-sidebar__label">{t('contextSidebar.new')}</span>
      </button>

      <div className="sidebar-sections">
        <section className="sidebar-section">
          <h2 className="section-label">{t('contextSidebar.systemDirectory')}</h2>
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <Route aria-hidden="true" />
              <span className="context-sidebar__label">{t('contextSidebar.neural')}</span>
            </a>
            <a href="#" className="nav-item">
              <Database aria-hidden="true" />
              <span className="context-sidebar__label">{t('contextSidebar.session')}</span>
            </a>
            <a href="#" className="nav-item">
              <Archive aria-hidden="true" />
              <span className="context-sidebar__label">{t('contextSidebar.lab')}</span>
            </a>
            <button 
              className="nav-item"
              onClick={(e) => {
                e.preventDefault()
                onOpenSettings()
              }}
            >
              <Settings aria-hidden="true" />
              <span className="context-sidebar__label">{t('contextSidebar.settings')}</span>
            </button>
          </nav>
        </section>
      </div>
      <footer className="sidebar-footer">
        <a href="#" className="nav-item">
          <Terminal aria-hidden="true" />
          <span className="context-sidebar__label">{t('contextSidebar.systemLogs')}</span>
        </a>
      </footer>
    </aside>
  )
}
