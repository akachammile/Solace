import { useTranslation } from 'react-i18next'
import { Brain, KeyRound, Plus, Activity } from 'lucide-react'
import type { SpaceConfig } from '@/components/Editor/types'

interface LaunchpadPageProps {
  spaces: SpaceConfig[]
  onCreateSpace: () => void
  onOpenSettings: () => void
  onOpenSpace: (spaceId: string) => void
}

export function LaunchpadPage({
  spaces,
  onCreateSpace,
  onOpenSettings,
  onOpenSpace,
}: LaunchpadPageProps) {
  const { t } = useTranslation()

  return (
    <section className="bc-launchpad">
      <div className="bc-launchpad__main">
        <div className="bc-brain" aria-hidden="true">
          <Brain aria-hidden="true" />
        </div>
        <div className="bc-launchpad__copy">
          <h1>{t('launchpad.brand')}</h1>
          <span>{t('launchpad.tagline')}</span>
        </div>
        <div className="bc-launchpad__actions">
          <button className="bc-button bc-button--primary" onClick={onCreateSpace} type="button">
            <Plus aria-hidden="true" />
            <span>{t('launchpad.createSpace')}</span>
          </button>
          <button className="bc-button" onClick={onOpenSettings} type="button">
            <KeyRound aria-hidden="true" />
            <span>{t('launchpad.configureEngine')}</span>
          </button>
        </div>
      </div>

      <aside className="bc-launchpad__recent">
        <div className="bc-launchpad__recent-head">
          <div>
            <span className="bc-panel-label">
              <Activity aria-hidden="true" />
              {t('launchpad.recentControlCenter')}
            </span>
            <p>{t('launchpad.recentDescription')}</p>
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
