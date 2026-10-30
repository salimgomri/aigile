import { describe, it, expect, afterEach } from 'vitest'
import { getHomeVariant } from '@/lib/site-facts'

describe('HOME_VARIANT', () => {
  const original = process.env.HOME_VARIANT

  afterEach(() => {
    if (original === undefined) delete process.env.HOME_VARIANT
    else process.env.HOME_VARIANT = original
  })

  it('defaults to legacy', () => {
    delete process.env.HOME_VARIANT
    expect(getHomeVariant()).toBe('legacy')
  })

  it('reads v2', () => {
    process.env.HOME_VARIANT = 'v2'
    expect(getHomeVariant()).toBe('v2')
  })
})
