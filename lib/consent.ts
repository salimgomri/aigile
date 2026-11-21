import { CONSENT_MAX_AGE_MONTHS, CONSENT_STORAGE_KEY } from '@/lib/site-facts'

export { CONSENT_STORAGE_KEY, CONSENT_MAX_AGE_MONTHS }

export type ConsentChoice = 'granted' | 'denied'

export type StoredConsent = {
  choice: ConsentChoice
  at: string
}

export const CONSENT_EVENT = 'aigile:consent-change'
export const CONSENT_REOPEN_EVENT = 'aigile:consent-reopen'

export function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as StoredConsent
    if (data?.choice !== 'granted' && data?.choice !== 'denied') return null
    if (!data.at) return null
    return data
  } catch {
    return null
  }
}

export function isConsentExpired(stored: StoredConsent, now = new Date()): boolean {
  const at = new Date(stored.at)
  if (Number.isNaN(at.getTime())) return true
  const expires = new Date(at)
  expires.setMonth(expires.getMonth() + CONSENT_MAX_AGE_MONTHS)
  return now >= expires
}

export function shouldAskConsent(stored: StoredConsent | null, now = new Date()): boolean {
  if (!stored) return true
  return isConsentExpired(stored, now)
}

export function deleteGaCookies(): void {
  if (typeof document === 'undefined') return
  const cookies = document.cookie.split(';')
  for (const part of cookies) {
    const name = part.split('=')[0]?.trim()
    if (!name) continue
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat') {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
      document.cookie = `${name}=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
    }
  }
}
