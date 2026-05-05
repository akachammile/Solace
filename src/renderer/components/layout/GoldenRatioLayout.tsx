import { ReactNode } from 'react'
import './GoldenRatioLayout.css'

interface GoldenRatioLayoutProps {
  leftPanel?: ReactNode
  mainPanel: ReactNode
  rightPanel?: ReactNode
}

export function GoldenRatioLayout({ leftPanel, mainPanel, rightPanel }: GoldenRatioLayoutProps) {
  return (
    <div className="golden-ratio-layout">
      {leftPanel && <aside className="golden-ratio-layout__left">{leftPanel}</aside>}
      <main className="golden-ratio-layout__main">{mainPanel}</main>
      {rightPanel && <aside className="golden-ratio-layout__right">{rightPanel}</aside>}
    </div>
  )
}
