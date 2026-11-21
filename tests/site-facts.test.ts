import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  yearsOfExperience,
  START_YEAR,
  DEFAULT_CONTACT_EMAIL,
  AMAZON_PRICES_CHECKED_AT,
  AMAZON_URL_DEFAULT,
  amazonUrlIsReady,
  TESTIMONIALS,
  LEGAL,
} from '@/lib/site-facts'

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

describe('site facts filled from Salim choices', () => {
  it('uses the public professional email', () => {
    expect(DEFAULT_CONTACT_EMAIL).toBe('salim@aigile.lu')
  })

  it('records Amazon prices check date and the public product URL', () => {
    expect(AMAZON_PRICES_CHECKED_AT).toBe('27/10/2026')
    expect(AMAZON_URL_DEFAULT).toBe('https://www.amazon.com/dp/B0GZ756F7C')
    expect(amazonUrlIsReady()).toBe(true)
  })

  it('keeps live-site testimonial roles', () => {
    expect(TESTIMONIALS[0].role).toBe('9 ans de collaboration · secteur bancaire')
    expect(TESTIMONIALS[1].role).toBe('collaboration multi-projets')
    expect(TESTIMONIALS[2].role).toBe('transformation digitale · secteur bancaire')
  })

  it('lists Hetzner as hoster', () => {
    expect(LEGAL.hosterName).toBe('Hetzner Online GmbH')
    expect(LEGAL.hosterPhone).toBe('+49 (0)9831 505-0')
  })
})
