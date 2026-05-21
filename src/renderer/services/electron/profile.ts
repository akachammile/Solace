import type { ProfileRecord } from '@shared/types/ipc'

export function getProfile(): Promise<ProfileRecord> {
  return window.solace.profile.getProfile()
}
