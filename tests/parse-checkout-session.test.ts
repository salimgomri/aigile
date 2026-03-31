import { describe, it, expect } from 'vitest'
import type Stripe from 'stripe'
import { parseCheckoutSessionForOrder } from '@/lib/orders/parse-checkout-session'

describe('parseCheckoutSessionForOrder', () => {
  it('retourne null sans email', () => {
    const session = {
      id: 'cs_1',
      object: 'checkout.session',
      customer_email: null,
      customer_details: {},
      metadata: { product_id: 'book_sale' },
      amount_total: 1000,
      currency: 'eur',
      total_details: {},
      payment_intent: 'pi_x',
      subscription: null,
    } as unknown as Stripe.Checkout.Session
    expect(parseCheckoutSessionForOrder(session)).toBeNull()
  })

  it('mappe une session livre avec email', () => {
    const session = {
      id: 'cs_2',
      object: 'checkout.session',
      customer_email: 'a@b.com',
      metadata: {
        product_id: 'book_sale',
        product_type: 'book_physical',
        buyer_name: 'Marie',
        in_person_pickup: 'false',
        quantity: '2',
        shipping_city: 'Paris',
      },
      amount_total: 8500,
      currency: 'eur',
      total_details: { amount_shipping: 500, amount_discount: 0 },
      payment_intent: 'pi_abc',
      subscription: null,
    } as unknown as Stripe.Checkout.Session
    const parsed = parseCheckoutSessionForOrder(session)
    expect(parsed).not.toBeNull()
    expect(parsed!.orderData.stripe_session_id).toBe('cs_2')
    expect(parsed!.orderData.buyer_email).toBe('a@b.com')
    expect(parsed!.orderData.product_id).toBe('book_sale')
    expect(parsed!.ctx.quantity).toBe(2)
  })
})
