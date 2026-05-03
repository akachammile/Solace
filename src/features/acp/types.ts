export interface AgentConfigUi {
  command: string
  args: string
  cwd: string
}

export interface ChatSession {
  id: string
  title: string
  createdAt: number
}
