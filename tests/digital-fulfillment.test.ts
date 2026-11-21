import { describe, it, expect, vi } from 'vitest'
import type Stripe from 'stripe'

vi.mock('@/lib/emails/digital-delivery', () => ({
  sendDigitalDeliveryEmail: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/emails/kit-welcome', () => ({
  sendSalesNotifyEmail: vi.fn().mockResolvedValue(undefined),
}))

import { fulfillDigitalProductIfNeeded } from '@/lib/orders/digital-fulfillment'
import { sendDigitalDeliveryEmail } from '@/lib/emails/digital-delivery'

describe('digital fulfillment', () => {
  it('does nothing if unpaid', async () => {
    await fulfillDigitalProductIfNeeded({
      payment_status: 'unpaid',
      id: 'cs_test',
    } as Stripe.Checkout.Session)
    expect(sendDigitalDeliveryEmail).not.toHaveBeenCalled()
  })
})
