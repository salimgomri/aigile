import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { parseCheckoutSessionForOrder } from '@/lib/orders/parse-checkout-session'
import { fetchStripeFeeAmountCentimes } from '@/lib/payments/stripe-fee'

export type StripeOrdersSyncResult = {
  imported: number
  skipped: number
  skippedMissingEmail: number
  /** Lignes déjà en base dont stripe_fee_amount a été renseigné rétroactivement */
  feesBackfilled: number
  errors: Array<{ sessionId: string; message: string }>
  has_more: boolean
  next_starting_after: string | null
}

/**
 * Liste les Checkout Sessions Stripe terminées et insère les commandes absentes de `orders`.
 * Renseigne aussi `stripe_fee_amount` (commission Stripe, centimes) quand un PaymentIntent existe.
 * Pour les commandes déjà présentes sans frais, met à jour la colonne si Stripe renvoie un montant.
 */
export async function syncStripeCheckoutSessionsToOrders(opts: {
  stripe: Stripe
  limit: number
  starting_after?: string
}): Promise<StripeOrdersSyncResult> {
  const limit = Math.min(Math.max(opts.limit, 1), 100)
  const list = await opts.stripe.checkout.sessions.list({
    limit,
    status: 'complete',
    ...(opts.starting_after ? { starting_after: opts.starting_after } : {}),
    expand: ['data.payment_intent', 'data.subscription'],
  })

  const ids = list.data.map((s) => s.id)
  let existingBySession = new Map<string, number | null>()
  if (ids.length > 0) {
    const { data: rows } = await supabaseAdmin
      .from('orders')
      .select('stripe_session_id, stripe_fee_amount')
      .in('stripe_session_id', ids)
    existingBySession = new Map(
      rows?.map((r) => [r.stripe_session_id as string, r.stripe_fee_amount as number | null]) ?? []
    )
  }

  const errors: StripeOrdersSyncResult['errors'] = []
  let imported = 0
  let skipped = 0
  let skippedMissingEmail = 0
  let feesBackfilled = 0

  for (const session of list.data) {
    const fee = await fetchStripeFeeAmountCentimes(opts.stripe, session)
    const prevFee = existingBySession.get(session.id)

    if (prevFee !== undefined) {
      skipped++
      if (prevFee == null && fee != null) {
        const { error } = await supabaseAdmin
          .from('orders')
          .update({ stripe_fee_amount: fee })
          .eq('stripe_session_id', session.id)
        if (!error) feesBackfilled++
        else errors.push({ sessionId: session.id, message: error.message })
      }
      continue
    }

    const parsed = parseCheckoutSessionForOrder(session)
    if (!parsed) {
      skippedMissingEmail++
      continue
    }

    const orderData = { ...parsed.orderData, stripe_fee_amount: fee }
    const { error } = await supabaseAdmin.from('orders').upsert(orderData, {
      onConflict: 'stripe_session_id',
    })
    if (error) {
      errors.push({ sessionId: session.id, message: error.message })
      continue
    }
    imported++
  }

  const last = list.data[list.data.length - 1]
  return {
    imported,
    skipped,
    skippedMissingEmail,
    feesBackfilled,
    errors,
    has_more: list.has_more,
    next_starting_after: list.has_more && last ? last.id : null,
  }
}
