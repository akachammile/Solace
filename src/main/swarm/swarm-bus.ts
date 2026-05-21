import type { BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '@shared/constants/ipc-channels'
import type { SwarmMessage, SwarmMessageSendRequest } from '@shared/types/agent'
import { solaceDatabase } from '../storage/database'

class SwarmBus {
  private window: BrowserWindow | null = null

  setWindow(win: BrowserWindow) {
    this.window = win
  }

  async sendMessage(request: SwarmMessageSendRequest): Promise<SwarmMessage> {
    const saved = await solaceDatabase.saveSwarmMessage(request)
    const event: SwarmMessage = {
      ...saved,
      fromAgentId: saved.fromAgentId,
    }

    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send(IPC_CHANNELS.agents.swarmMessage, event)
    }

    return event
  }

  async listMessages(conversationId: string): Promise<SwarmMessage[]> {
    const messages = await solaceDatabase.listSwarmMessages(conversationId)
    return messages.map((message) => ({
      ...message,
      visibility: message.visibility,
      kind: message.kind,
    }))
  }
}

export const swarmBus = new SwarmBus()

