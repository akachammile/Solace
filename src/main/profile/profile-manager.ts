import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import type { BuiltinAgentId } from '@shared/types/agent'
import type { ProfileRecord } from '@shared/types/ipc'

class ProfileManager {
  private profile?: ProfileRecord
  private readonly PROFILE_FILE_NAME = 'profile.json'
  private readonly PROFILE_DIR_NAME = 'profiles'
  private pendingWrite: Promise<void> = Promise.resolve()

  private getProfileDir() {
    return path.join(app.getPath('userData'), this.PROFILE_DIR_NAME)
  }

  private getProfilePath() {
    return path.join(this.getProfileDir(), this.PROFILE_FILE_NAME)
  }

  private createDefaultProfile(): ProfileRecord {
    return {
      userId: randomUUID(),
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      totals: {
        messages: 0,
        workspaceStarts: 0,
      },
      usage: {
        agents: {},
      },
    }
  }

  private async ensureProfileLoaded(): Promise<ProfileRecord> {
    if (this.profile) {
      return this.profile
    }

    const profilePath = this.getProfilePath()
    try {
      const raw = await fs.promises.readFile(profilePath, 'utf8')
      this.profile = JSON.parse(raw) as ProfileRecord
    } catch {
      this.profile = this.createDefaultProfile()
    }

    await this.persistProfile()
    return this.profile
  }

  private async persistProfile(profile = this.profile) {
    if (!profile) return
    await fs.promises.mkdir(this.getProfileDir(), { recursive: true })
    await fs.promises.writeFile(this.getProfilePath(), JSON.stringify(profile, null, 2), 'utf8')
  }

  private queueWrite(profile: ProfileRecord) {
    this.pendingWrite = this.pendingWrite.then(() => this.persistProfile(profile))
    return this.pendingWrite
  }

  async getProfile(): Promise<ProfileRecord> {
    const profile = await this.ensureProfileLoaded()
    return {
      ...profile,
      usage: {
        agents: { ...profile.usage.agents },
      },
    }
  }

  async recordWorkspaceStart() {
    const profile = await this.ensureProfileLoaded()
    profile.totals.workspaceStarts += 1
    profile.lastActiveAt = Date.now()
    this.profile = profile
    await this.queueWrite(profile)
  }

  async recordAgentMessage(agentId: BuiltinAgentId) {
    const profile = await this.ensureProfileLoaded()
    profile.totals.messages += 1
    profile.lastActiveAt = Date.now()
    profile.usage.agents[agentId] = (profile.usage.agents[agentId] ?? 0) + 1
    this.profile = profile
    await this.queueWrite(profile)
  }

}

export const profileManager = new ProfileManager()
