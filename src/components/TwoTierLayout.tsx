import type { ReactNode } from 'react'

interface TwoTierLayoutProps {
  sidebar: ReactNode
  detail?: ReactNode
  emptyState?: ReactNode
}

export function TwoTierLayout({ sidebar, detail, emptyState }: TwoTierLayoutProps) {
  return (
    <div className="two-tier-layout">
      <aside className="two-tier-layout__sidebar">{sidebar}</aside>
      <main className={`two-tier-layout__detail${detail ? '' : ' two-tier-layout__detail--empty'}`}>
        {detail ?? (
          <div className="two-tier-empty-state">
            {emptyState ?? 'Select an item'}
          </div>
        )}
      </main>
    </div>
  )
}
