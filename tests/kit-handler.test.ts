import { describe, it, expect } from 'vitest'
import { validateKitInput } from '@/lib/leads/kit-validate'

describe('kit form validation', () => {
  it('rejects missing consent', () => {
    const r = validateKitInput({
      email: 'ada@example.com',
      consentKit: false,
      consentNews: false,
    })
    expect(r?.ok).toBe(false)
    expect(r && 'status' in r ? r.status : 0).toBe(400)
  })

  it('rejects invalid email', () => {
    const r = validateKitInput({
      email: 'not-an-email',
      consentKit: true,
      consentNews: false,
    })
    expect(r?.ok).toBe(false)
  })

  it('ignores honeypot', () => {
    const r = validateKitInput({
      email: 'ada@example.com',
      consentKit: true,
      consentNews: false,
      honeypot: 'http://spam.test',
    })
    expect(r).toEqual({ ok: true, skipped: true })
  })

  it('accepts valid payload', () => {
    expect(
      validateKitInput({
        email: 'ada@example.com',
        consentKit: true,
        consentNews: false,
      }),
    ).toBeNull()
  })
})
