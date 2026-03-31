import { describe, it, expect } from 'vitest'
import { stripeMetaValue, clampStripeMetadata } from '@/lib/payments/stripe-metadata'

describe('stripe-metadata (limite API Stripe 500 car.)', () => {
  it('tronque sans erreur au-delà de 500 caractères', () => {
    const long = 'x'.repeat(600)
    const out = stripeMetaValue(long)
    expect(out.length).toBe(500)
    expect(out.endsWith('...')).toBe(true)
  })

  it('clampStripeMetadata sécurise toutes les clés', () => {
    const meta = {
      short: 'ok',
      long: 'y'.repeat(800),
    }
    const safe = clampStripeMetadata(meta)
    expect(safe.short).toBe('ok')
    expect(safe.long.length).toBe(500)
  })

  it('accepte null/undefined comme chaîne vide', () => {
    expect(stripeMetaValue(null)).toBe('')
    expect(stripeMetaValue(undefined)).toBe('')
  })
})
