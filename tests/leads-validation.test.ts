import { describe, it, expect } from 'vitest'
import { isValidEmail } from '@/lib/leads/utm'

describe('lead emails', () => {
  it('rejects invalid', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('foo')).toBe(false)
  })
  it('accepts valid', () => {
    expect(isValidEmail('dsi@entreprise.com')).toBe(true)
  })
})
