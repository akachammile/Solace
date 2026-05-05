import { Brain, KeyRound, Plus, Activity } from 'lucide-react'
import type { SpaceConfig } from '../bionic-console/types'

interface IndexPageProps {
  spaces: SpaceConfig[]
  onCreateSpace: () => void
  onOpenSettings: () => void
  onOpenSpace: (spaceId: string) => void
}

export function IndexPage({
  spaces,
  onCreateSpace,
  onOpenSettings,
  onOpenSpace,
}: IndexPageProps) {
  return (
    <section className="bc-launchpad">
      <div className="bc-launchpad__main">
        <div className="bc-brain" aria-hidden="true">
          <Brain size={48} />
        </div>
        <div className="bc-launchpad__copy">
          <h1>Bionic Console</h1>
          <span>FOCUSED HUMAN INTELLIGENCE</span>
        </div>
        <div className="bc-launchpad__actions">
          <button className="bc-button bc-button--primary" onClick={onCreateSpace} type="button">
            <Plus size={20} />
            <span>开辟新空间</span>
          </button>
          <button className="bc-button" onClick={onOpenSettings} type="button">
            <KeyRound size={18} />
            <span>配置引擎室</span>
          </button>
        </div>
      </div>

      <aside className="bc-launchpad__recent">
        <div className="bc-launchpad__recent-head">
          <div>
            <span className="bc-panel-label">
              <Activity size={14} />
              Recent Control Center
            </span>
            <p>恢复最近的工作空间，或从一个空白节点继续。</p>
          </div>
          <strong>{spaces.length}</strong>
        </div>
        <div className="bc-launchpad__recent-list">
          {spaces.slice(0, 5).map((space) => (
            <button
              className="bc-recent-space"
              key={space.id}
              onClick={() => onOpenSpace(space.id)}
              type="button"
            >
              <i aria-hidden="true" />
              <span className="bc-recent-space__text">
                <strong>{space.title}</strong>
                <small>{space.description}</small>
              </span>
              <em>{space.updatedAt}</em>
            </button>
          ))}
        </div>
      </aside>
    </section>
  )
}
