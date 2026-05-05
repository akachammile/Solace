import {
  AtSign,
  Bot,
  BrainCircuit,
  Database,
  FileCode2,
  FileText,
  GitBranch,
  ListTree,
  Paperclip,
  Play,
  Sparkles,
  Terminal,
} from 'lucide-react'
import type { SpaceConfig, WorkspaceConfig } from '../types'

export const initialSpaces: SpaceConfig[] = [
  {
    id: 'space-first-principles',
    title: '第一性原理产品推演',
    description: '用单入口重新推导产品结构。',
    updatedAt: '刚刚',
    focusTitle: '第一性原理.md',
    artifacts: [
      {
        id: 'artifact-first-principles',
        title: '第一性原理.md',
        extension: '.md',
        type: 'md',
        accent: 'blue',
        content: '',
      },
    ],
  },
  {
    id: 'space-console-redesign',
    title: 'Bionic Console 架构构思',
    description: '单入口工作台、焦点引擎和知识底座的信息架构。',
    updatedAt: '2小时前',
    focusTitle: '界面重构.md',
    artifacts: [
      {
        id: 'artifact-redesign-brief',
        title: '界面重构.md',
        extension: '.md',
        type: 'md',
        accent: 'blue',
        content: '目标：删除旧导航残留，把页面重构为 Launchpad、Artifacts、Canvas、Console 和 Focus Engine。',
      },
      {
        id: 'artifact-redesign-map',
        title: '三段式结构.canvas',
        extension: '.canvas',
        type: 'canvas',
        accent: 'orange',
        content: 'Artifacts -> Canvas -> Console -> Focus Engine',
      },
      {
        id: 'artifact-redesign-code',
        title: '组件拆分.code',
        extension: '.code',
        type: 'code',
        accent: 'green',
        content: 'pages/bionic-console/components\npages/bionic-console/data\npages/bionic-console/types.ts',
      },
    ],
  },
]

export const workspaceConfig: WorkspaceConfig = {
  consoleTabs: [
    { id: 'agent', label: 'Console Agent', icon: <Bot size={15} /> },
    { id: 'terminal', label: 'Terminal', icon: <Terminal size={15} /> },
  ],
  focusTabs: [
    { id: 'focus', label: '焦点引擎', icon: <BrainCircuit size={15} /> },
    { id: 'knowledge', label: '知识底座', icon: <Database size={15} /> },
  ],
  consoleTools: [
    { id: 'attach', label: 'Attach', icon: <Paperclip size={14} /> },
    { id: 'mention', label: 'Mention', icon: <AtSign size={14} /> },
    { id: 'skills', label: 'Skills', icon: <Sparkles size={14} /> },
  ],
  nextActions: [
    { id: 'outline', title: '自动搭建结构大纲', meta: 'Est. 5 min', icon: <ListTree size={18} /> },
    { id: 'sources', title: '从本地加载参考资料', meta: 'Est. 5 min', icon: <Database size={18} /> },
    { id: 'script', title: '运行初始化代码脚本', meta: 'Est. 5 min', icon: <Play size={18} /> },
  ],
  knowledgeSources: [
    { id: 'local-folder', title: '本地项目资料夹', meta: '等待挂载' },
    { id: 'obsidian', title: 'Obsidian Vault', meta: '可作为后续知识底座' },
    { id: 'notes', title: 'Markdown Notes', meta: 'Local-first 文本源' },
  ],
}

export function createSpace(index: number): SpaceConfig {
  const timestamp = Date.now()

  return {
    id: `space-${timestamp}`,
    title: `新空间 ${index}`,
    description: '新的思考空间，默认从一份空白 Markdown 开始。',
    updatedAt: '刚刚',
    focusTitle: '新起点.md',
    artifacts: [
      {
        id: `artifact-${timestamp}`,
        title: '新起点.md',
        extension: '.md',
        type: 'md',
        accent: 'blue',
        content: '',
      },
    ],
  }
}

export function getArtifactIcon(type: SpaceConfig['artifacts'][number]['type']) {
  if (type === 'canvas') return <GitBranch size={16} />
  if (type === 'slides') return <FileText size={16} />
  if (type === 'code') return <FileCode2 size={16} />
  return <FileText size={16} />
}
