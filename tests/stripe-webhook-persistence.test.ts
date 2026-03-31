/**
 * Vérifie que l’idempotence Stripe est enregistrée **après** le métier :
 * sinon un échec d’insert `orders` + retry Stripe « skipped » = pas de ligne en admin.
 */
import './stripe-webhook-env.stub'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const constructEventMock = vi.fn()
vi.mock('stripe', () => ({
  default: vi.fn(function StripeMock() {
    return {
      webhooks: {
        constructEvent: (...args: unknown[]) => constructEventMock(...args),
      },
    }
  }),
}))

const insertWebhookEvent = vi.fn().mockResolvedValue({ error: null })
const maybeSingleWebhook = vi.fn().mockResolvedValue({ data: null, error: null })

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (table: string) => {
      if (table === 'stripe_webhook_events') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: maybeSingleWebhook,
            }),
          }),
          insert: insertWebhookEvent,
        }
      }
      return {
        select: () => ({ eq: () => ({ single: vi.fn().mockResolvedValue({ data: null }) }) }),
        update: () => ({ eq: vi.fn() }),
      }
    },
  },
}))

const handleCheckoutCompletedMock = vi.fn().mockResolvedValue(undefined)
vi.mock('@/lib/orders/checkout-handler', () => ({
  handleCheckoutCompleted: (...args: unknown[]) => handleCheckoutCompletedMock(...args),
}))

vi.mock('@/lib/payments/ensure-credits', () => ({
  ensureUserCredits: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/email', () => ({
  sendPaymentFailedEmail: vi.fn().mockResolvedValue(undefined),
}))

import { POST } from '@/app/api/webhooks/stripe/route'

function minimalCheckoutEvent() {
  return {
    id: 'evt_persist_1',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_persist_1',
        customer_email: 'buyer@example.com',
        metadata: { product_id: 'book_sale' },
      },
    },
  }
}

describe('Webhook Stripe — persistance idempotence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    maybeSingleWebhook.mockResolvedValue({ data: null, error: null })
    constructEventMock.mockReturnValue(minimalCheckoutEvent())
  })

  it('appelle handleCheckoutCompleted avant insert stripe_webhook_events', async () => {
    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 't=1,v1=x' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)

    expect(handleCheckoutCompletedMock).toHaveBeenCalledTimes(1)
    expect(insertWebhookEvent).toHaveBeenCalledTimes(1)
    expect(insertWebhookEvent).toHaveBeenCalledWith({
      id: 'evt_persist_1',
      type: 'checkout.session.completed',
    })

    const orderHandle = handleCheckoutCompletedMock.mock.invocationCallOrder[0] ?? 0
    const orderInsert = insertWebhookEvent.mock.invocationCallOrder[0] ?? 0
    expect(orderInsert).toBeGreaterThan(orderHandle)
  })

  it('ne pas enregistrer idempotence si handleCheckoutCompleted échoue (retry Stripe possible)', async () => {
    handleCheckoutCompletedMock.mockRejectedValueOnce(new Error('orders upsert failed'))

    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 't=1,v1=x' },
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
    expect(insertWebhookEvent).not.toHaveBeenCalled()
  })

  it('skip métier si événement déjà en base (idempotence)', async () => {
    maybeSingleWebhook.mockResolvedValue({ data: { id: 'evt_persist_1' }, error: null })

    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 't=1,v1=x' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.skipped).toBe(true)

    expect(handleCheckoutCompletedMock).not.toHaveBeenCalled()
    expect(insertWebhookEvent).not.toHaveBeenCalled()
  })
})
