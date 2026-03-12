/**
 * Tests unitaires du webhook checkout — appelle la route POST de prod (flux réel) et vérifie l'order en BDD
 * Nécessite .env.local (Supabase, STRIPE_WEBHOOK_SECRET, Stripe price IDs pour le livre)
 */
import crypto from 'node:crypto'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/webhooks/stripe/route'
import { supabaseAdmin } from '@/lib/supabase'

// Mock emails pour éviter l'envoi réel
vi.mock('@/lib/email', () => ({
  sendBuyerConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendAuthorNotificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPaymentFailedEmail: vi.fn().mockResolvedValue(undefined),
}))

function createSignedStripeEvent(payload: object, secret: string): { body: string; signature: string } {
  const body = JSON.stringify(payload)
  const timestamp = Math.floor(Date.now() / 1000)
  const signedPayload = `${timestamp}.${body}`
  const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')
  return { body, signature: `t=${timestamp},v1=${signature}` }
}

function buildCheckoutCompletedEvent(sessionId: string, buyerEmail: string) {
  const amountSubtotal = 4000 // 40€ livre
  return {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: sessionId,
        object: 'checkout.session',
        amount_total: 0,
        currency: 'eur',
        customer_email: buyerEmail,
        metadata: {
          product_id: 'book_sale',
          product_type: 'book_physical',
          buyer_name: 'Salim',
          user_id: '',
          coupon_code: 'TEST100',
          in_person_pickup: 'true',
        },
        total_details: {
          amount_shipping: 0,
          amount_discount: amountSubtotal,
          amount_tax: 0,
        },
        payment_intent: null,
        subscription: null,
        customer_details: { email: buyerEmail },
      },
    },
  }
}

describe('Webhook POST — livre en main propre, TEST100', () => {
  const SESSION_ID = `cs_test_unit_${Date.now()}`
  const BUYER_EMAIL = 'test-checkout@aigile.lu'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('insère l\'order en BDD après appel de la route webhook de prod', async () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    expect(secret, 'STRIPE_WEBHOOK_SECRET requis dans .env.local').toBeDefined()
    if (!secret) return

    const event = buildCheckoutCompletedEvent(SESSION_ID, BUYER_EMAIL)
    const { body, signature } = createSignedStripeEvent(event, secret)

    const request = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature,
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('stripe_session_id', SESSION_ID)
      .single()

    expect(error).toBeNull()
    expect(order).toBeDefined()
    expect(order?.stripe_session_id).toBe(SESSION_ID)
    expect(order?.buyer_email).toBe(BUYER_EMAIL)
    expect(order?.product_id).toBe('book_sale')
    expect(order?.product_type).toBe('book_physical')
    expect(order?.product_title).toBe('Le Système S.A.L.I.M')
    expect(order?.in_person_pickup).toBe(true)
    expect(order?.coupon_code).toBe('TEST100')
    expect(order?.amount_total).toBe(0)
    expect(order?.status).toBe('paid')
  })
})
