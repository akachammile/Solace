interface ContextSidebarProps {
  onNewSession: () => void
  onOpenSettings: () => void
}

export function ContextSidebar({ onNewSession, onOpenSettings }: ContextSidebarProps) {
  return (
    <aside className="context-sidebar sharp">
      <button className="new-experiment-btn sharp" onClick={onNewSession}>
        <span className="material-symbols-outlined icon">add</span>
        NEW EXPERIMENT
      </button>

      <div className="sidebar-sections">
        <section className="sidebar-section">
          <h2 className="section-label">System Directory</h2>
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <span className="material-symbols-outlined">alt_route</span>
              Neural Paths
            </a>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">database</span>
              Session Vault
            </a>
            <a href="#" className="nav-item">
              <span className="material-symbols-outlined">inventory_2</span>
              Lab Archives
            </a>
            <button 
              className="nav-item"
              onClick={(e) => {
                e.preventDefault()
                onOpenSettings()
              }}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </button>
          </nav>
        </section>
      </div>
      <footer className="sidebar-footer">
        <a href="#" className="nav-item">
          <span className="material-symbols-outlined">terminal</span>
          System Logs
        </a>
      </footer>
    </aside>
  )
}
