import { Globe, FolderOpen, Terminal, Wrench, Search, Puzzle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SkillEntry {
  id: string
  name: string
  description: string
  icon: LucideIcon
  provider: string
}

export const skillCatalog: SkillEntry[] = [
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the web in real-time and retrieve current information',
    icon: Globe,
    provider: 'builtin',
  },
  {
    id: 'file-operations',
    name: 'File Operations',
    description: 'Read, write, and manage files on the local filesystem',
    icon: FolderOpen,
    provider: 'builtin',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Execute shell commands and scripts in a sandboxed environment',
    icon: Terminal,
    provider: 'builtin',
  },
  {
    id: 'mcp',
    name: 'MCP Tools',
    description: 'Connect to Model Context Protocol servers for extended capabilities',
    icon: Puzzle,
    provider: 'builtin',
  },
  {
    id: 'code-interpreter',
    name: 'Code Interpreter',
    description: 'Run and analyze code snippets in Python, JavaScript, and more',
    icon: Wrench,
    provider: 'builtin',
  },
  {
    id: 'rag',
    name: 'Knowledge Retrieval',
    description: 'Search and reference documents from your knowledge base',
    icon: Search,
    provider: 'builtin',
  },
]

export function getSkill(id: string): SkillEntry | undefined {
  return skillCatalog.find((s) => s.id === id)
}
