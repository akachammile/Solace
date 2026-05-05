import type { ReactNode } from 'react'

export type ConsoleScreen = 'launchpad' | 'workspace'
export type ArtifactType = 'md' | 'canvas' | 'slides' | 'code'
export type FocusTabId = 'focus' | 'knowledge'
export type ConsoleTabId = 'agent' | 'terminal'
export type AccentTone = 'blue' | 'purple' | 'green' | 'orange'

export interface ArtifactConfig {
  id: string
  title: string
  extension: string
  type: ArtifactType
  accent: AccentTone
  content: string
}

export interface SpaceConfig {
  id: string
  title: string
  description: string
  updatedAt: string
  focusTitle: string
  artifacts: ArtifactConfig[]
}

export interface ActionConfig {
  id: string
  title: string
  meta: string
  icon: ReactNode
}

export interface KnowledgeSourceConfig {
  id: string
  title: string
  meta: string
}

export interface ConsoleToolConfig {
  id: string
  label: string
  icon: ReactNode
}

export interface WorkspaceConfig {
  consoleTabs: Array<{ id: ConsoleTabId, label: string, icon: ReactNode }>
  focusTabs: Array<{ id: FocusTabId, label: string, icon: ReactNode }>
  nextActions: ActionConfig[]
  knowledgeSources: KnowledgeSourceConfig[]
  consoleTools: ConsoleToolConfig[]
}
