/**
 * Unit tests — handleCheckoutCompleted persiste `orders` (sans appel réseau).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type Stripe from 'stripe'

const ordersUpsert = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (table: string) => {
      if (table === 'orders') {
        return {
          upsert: ordersUpsert,
          update: () => ({ eq: vi.fn().mockResolvedValue({ error: null }) }),
        }
      }
      return {
        upsert: vi.fn().mockResolvedValue({ error: null }),
        select: () => ({ eq: () => ({ single: vi.fn().mockResolvedValue({ data: null }) }) }),
      }
    },
    rpc: vi.fn().mockResolvedValue({}),
  },
}))

vi.mock('@/lib/payments/ensure-credits', () => ({
  ensureUserCredits: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/credits/log-addition', () => ({
  logCreditAddition: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/email', () => ({
  sendBuyerConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendAuthorNotificationEmail: vi.fn().mockResolvedValue(undefined),
}))

import { handleCheckoutCompleted } from '@/lib/orders/checkout-handler'

function sessionBookGuest(): Stripe.Checkout.Session {
  return {
    id: 'cs_unit_persist_1',
    object: 'checkout.session',
    amount_total: 4000,
    currency: 'eur',
    customer_email: 'acheteur@example.com',
    customer_details: { email: 'acheteur@example.com' },
    metadata: {
      product_id: 'book_sale',
      product_type: 'book_physical',
      buyer_name: 'Jean',
      quantity: '1',
      in_person_pickup: 'true',
    },
    total_details: {
      amount_shipping: 0,
      amount_discount: 0,
      amount_tax: 0,
    },
    payment_intent: 'pi_unit_1',
    subscription: null,
  } as Stripe.Checkout.Session
}

describe('handleCheckoutCompleted — persistance orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ordersUpsert.mockResolvedValue({ error: null })
  })

  it('upsert orders avec onConflict stripe_session_id et status paid', async () => {
    await handleCheckoutCompleted(sessionBookGuest())

    expect(ordersUpsert).toHaveBeenCalledTimes(1)
    const [payload, opts] = ordersUpsert.mock.calls[0] as [Record<string, unknown>, { onConflict: string }]
    expect(payload.stripe_session_id).toBe('cs_unit_persist_1')
    expect(payload.buyer_email).toBe('acheteur@example.com')
    expect(payload.product_id).toBe('book_sale')
    expect(payload.status).toBe('paid')
    expect(opts.onConflict).toBe('stripe_session_id')
  })

  it('lève si email acheteur absent (pas de persistance silencieuse)', async () => {
    const bad = { ...sessionBookGuest(), customer_email: null, customer_details: {} }
    await expect(handleCheckoutCompleted(bad as Stripe.Checkout.Session)).rejects.toThrow(
      /buyer_email manquant/
    )
    expect(ordersUpsert).not.toHaveBeenCalled()
  })
})
