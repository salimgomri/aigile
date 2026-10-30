import { describe, it, expect, vi, afterEach } from 'vitest'
import { yearsOfExperience, START_YEAR } from '@/lib/site-facts'

describe('yearsOfExperience', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 23 in 2026', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-30T12:00:00Z'))
    expect(yearsOfExperience()).toBe(23)
    expect(START_YEAR).toBe(2003)
  })

  it('returns 24 in 2027', () => {
    expect(yearsOfExperience(new Date('2027-01-15'))).toBe(24)
  })
})
