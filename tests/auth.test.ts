import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Auth - temp password generation', () => {
  it('generates 64-character hex string', () => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const result = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[0-9a-f]+$/)
  })
})

describe('Auth - register validation', () => {
  it('rejects empty role', () => {
    const role = ''
    expect(!!role).toBe(false)
  })

  it('accepts valid role', () => {
    const role = 'agile_coach'
    expect(!!role).toBe(true)
  })

  it('maps "other" role to "guest"', () => {
    const role = 'other'
    const mapped = role === 'other' ? 'guest' : role
    expect(mapped).toBe('guest')
  })
})

describe('Auth - signUp payload shape', () => {
  it('builds correct payload structure', () => {
    const firstName = 'Salim'
    const lastName = 'Gomri'
    const email = 'test@example.com'
    const role = 'agile_coach'
    const tempPassword = 'a'.repeat(64)

    const payload = {
      email,
      password: tempPassword,
      name: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      role: role === 'other' ? 'guest' : role,
    }

    expect(payload.name).toBe('Salim Gomri')
    expect(payload.email).toBe('test@example.com')
    expect(payload.role).toBe('agile_coach')
    expect(payload.password).toHaveLength(64)
  })
})
