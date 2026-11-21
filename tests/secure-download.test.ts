import { describe, it, expect } from 'vitest'
import { paymentStatusPaid, assertSlugMatches } from '@/lib/downloads/session-guards'
import { getDigitalProduct } from '@/lib/products'
import type Stripe from 'stripe'

describe('téléchargement', () => {
  it('rejects unpaid sessions', () => {
    const session = { payment_status: 'unpaid' } as Stripe.Checkout.Session
    expect(paymentStatusPaid(session)).toBe(false)
  })

  it('accepts paid sessions', () => {
    const session = { payment_status: 'paid' } as Stripe.Checkout.Session
    expect(paymentStatusPaid(session)).toBe(true)
  })

  it('rejects slug mismatch', () => {
    const cahier = getDigitalProduct('cahier')!
    expect(assertSlugMatches(cahier, 'livre-pdf')).toBe(false)
    expect(assertSlugMatches(cahier, 'cahier')).toBe(true)
  })

  it('livre papier has no file', () => {
    expect(getDigitalProduct('livre-papier')?.fichierCle).toBeNull()
  })
})
