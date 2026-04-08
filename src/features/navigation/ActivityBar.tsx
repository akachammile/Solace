import { BookOpen, HeartHandshake, MessageSquareText, Settings2 } from 'lucide-react'
import { IconButton } from '../../components/IconButton'
import { useAppState } from '../../state/app-context'
import type { ViewType } from '../../types/ui'
import './ActivityBar.css'

const navigationItems: Array<{
  label: string
  view: ViewType
  icon: React.ReactNode
}> = [
  { label: 'Chat', view: 'chat', icon: <MessageSquareText size={18} /> },
  { label: 'Pet', view: 'pet', icon: <HeartHandshake size={18} /> },
  { label: 'Knowledge', view: 'knowledge', icon: <BookOpen size={18} /> },
]

export function ActivityBar() {
  const { activeView, setActiveView } = useAppState()

  return (
    <aside className="activity-bar">
      <div className="activity-bar__brand">
        <span className="activity-bar__brand-mark">S</span>
      </div>

      <nav aria-label="Primary navigation" className="activity-bar__nav">
        {navigationItems.map((item) => (
          <IconButton
            key={item.view}
            icon={item.icon}
            isActive={activeView === item.view}
            isCompact
            label={item.label}
            onClick={() => setActiveView(item.view)}
            title={item.label}
          />
        ))}
      </nav>

      <div className="activity-bar__footer">
        <IconButton
          icon={<Settings2 size={18} />}
          isActive={activeView === 'settings'}
          isCompact
          label="Settings"
          onClick={() => setActiveView('settings')}
          title="Settings"
        />
      </div>
    </aside>
  )
}
