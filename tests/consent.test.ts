import { describe, it, expect } from 'vitest'
import { parseStoredConsent, shouldAskConsent, isConsentExpired } from '@/lib/consent'

describe('cookie consent', () => {
  it('asks when nothing stored', () => {
    expect(shouldAskConsent(null)).toBe(true)
    expect(parseStoredConsent(null)).toBeNull()
  })

  it('does not ask for a fresh granted choice', () => {
    const stored = { choice: 'granted' as const, at: new Date().toISOString() }
    expect(shouldAskConsent(stored)).toBe(false)
  })

  it('expires after 6 months', () => {
    const stored = { choice: 'denied' as const, at: '2025-01-01T00:00:00.000Z' }
    expect(isConsentExpired(stored, new Date('2026-10-30'))).toBe(true)
    expect(shouldAskConsent(stored, new Date('2026-10-30'))).toBe(true)
  })
})
