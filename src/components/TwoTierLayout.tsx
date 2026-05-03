import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface TwoTierLayoutProps {
  sidebar: ReactNode
  detail?: ReactNode
  emptyState?: ReactNode
}

export function TwoTierLayout({ sidebar, detail, emptyState }: TwoTierLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="two-tier-layout">
      <aside className="two-tier-layout__sidebar">{sidebar}</aside>
      <main className={`two-tier-layout__detail${detail ? '' : ' two-tier-layout__detail--empty'}`}>
        {detail ?? (
          <div className="two-tier-empty-state">
            {emptyState ?? t('layout.selectItem')}
          </div>
        )}
      </main>
    </div>
  )
}
