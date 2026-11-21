import { describe, it, expect } from 'vitest'
import type Stripe from 'stripe'
import { getProduct, usesInlinePriceData } from '@/lib/payments/catalog'
import { parseCheckoutSessionForOrder } from '@/lib/orders/parse-checkout-session'
import { productFromSession } from '@/lib/downloads/session-guards'
import { AMAZON_URL_DEFAULT, FORMATION_A_INTER } from '@/lib/site-facts'

describe('formation checkout (price_data, like the book)', () => {
  it('exposes the inter seat without a Stripe Price ID', () => {
    const product = getProduct('formation-a-place')
    expect(product).not.toBeNull()
    expect(product!.amount).toBe(80000)
    expect(FORMATION_A_INTER.priceEuros).toBe(800)
    expect(product!.type).toBe('formation_seat')
    expect(usesInlinePriceData(product!)).toBe(true)
    expect(product!.description).toContain('1 place')
    expect(product!.description).toContain('7 h')
    expect(FORMATION_A_INTER.seatsMin).toBe(8)
    expect(FORMATION_A_INTER.seatsMax).toBe(12)
    expect(FORMATION_A_INTER.duration).toContain('7 h')
  })

  it('does not invent shipping fees on a formation order', () => {
    const session = {
      id: 'cs_formation',
      customer_email: 'a@b.com',
      metadata: {
        product_id: 'formation-a-place',
        product_type: 'formation_seat',
        buyer_name: 'Alex',
        quantity: '1',
      },
      amount_total: 80000,
      currency: 'eur',
      total_details: {},
      payment_intent: 'pi_f',
      subscription: null,
    } as unknown as Stripe.Checkout.Session
    const parsed = parseCheckoutSessionForOrder(session)
    expect(parsed).not.toBeNull()
    expect(parsed!.orderData.amount_shipping).toBe(0)
    expect(parsed!.orderData.product_id).toBe('formation-a-place')
  })

  it('maps a paid session to the digital catalogue via metadata', () => {
    const session = {
      payment_status: 'paid',
      metadata: { product_slug: 'formation-a-place', product_id: 'formation-a-place' },
      line_items: { data: [] },
    } as unknown as Stripe.Checkout.Session
    const product = productFromSession(session)
    expect(product?.slug).toBe('formation-a-place')
    expect(product?.fichierCle).toBeNull()
  })
})

describe('Amazon public listing', () => {
  it('uses the canonical product URL', () => {
    expect(AMAZON_URL_DEFAULT).toContain('B0GZ756F7C')
  })
})
