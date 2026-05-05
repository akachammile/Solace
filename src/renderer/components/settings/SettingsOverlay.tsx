import { useState } from 'react'
import { Database, KeyRound, SlidersHorizontal, Terminal, X } from 'lucide-react'
import './SettingsOverlay.css'

interface SettingsOverlayProps {
  onClose: () => void
}

const settingsCategories = [
  {
    id: 'general',
    title: 'General',
    icon: <SlidersHorizontal size={18} />,
  },
  {
    id: 'models',
    title: 'Model Engines',
    icon: <Database size={18} />,
  },
  {
    id: 'keys',
    title: 'API Keys',
    icon: <KeyRound size={18} />,
  },
  {
    id: 'mcp',
    title: 'MCP Services',
    icon: <Terminal size={18} />,
  },
]

export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const [activeCategory, setActiveCategory] = useState(settingsCategories[0].id)

  return (
    <div className="settings-overlay-backdrop">
      <div className="settings-overlay-container">
        <header className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close-button" onClick={onClose} aria-label="Close Settings">
            <X size={20} />
          </button>
        </header>
        
        <div className="settings-body">
          <nav className="settings-sidebar">
            {settingsCategories.map((category) => (
              <button
                key={category.id}
                className={`settings-tab ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                <span className="settings-tab-icon">{category.icon}</span>
                <span className="settings-tab-title">{category.title}</span>
              </button>
            ))}
          </nav>
          
          <main className="settings-content">
            {/* Placeholder for actual settings components based on activeCategory */}
            <div className="settings-content-placeholder">
              <h3>{settingsCategories.find(c => c.id === activeCategory)?.title}</h3>
              <p>Configuration details for {activeCategory} will go here.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
