import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { parseCheckoutSessionForOrder } from '@/lib/orders/parse-checkout-session'

export type StripeOrdersSyncResult = {
  imported: number
  skipped: number
  skippedMissingEmail: number
  errors: Array<{ sessionId: string; message: string }>
  has_more: boolean
  next_starting_after: string | null
}

/**
 * Liste les Checkout Sessions Stripe terminées et insère les commandes absentes de `orders`.
 * Ne renvoie pas d’emails ni de crédits — uniquement persistance pour l’admin.
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
  let existingSet = new Set<string>()
  if (ids.length > 0) {
    const { data: rows } = await supabaseAdmin
      .from('orders')
      .select('stripe_session_id')
      .in('stripe_session_id', ids)
    existingSet = new Set(rows?.map((r) => r.stripe_session_id as string) ?? [])
  }

  const errors: StripeOrdersSyncResult['errors'] = []
  let imported = 0
  let skipped = 0
  let skippedMissingEmail = 0

  for (const session of list.data) {
    if (existingSet.has(session.id)) {
      skipped++
      continue
    }
    const parsed = parseCheckoutSessionForOrder(session)
    if (!parsed) {
      skippedMissingEmail++
      continue
    }
    const { error } = await supabaseAdmin.from('orders').upsert(parsed.orderData, {
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
    errors,
    has_more: list.has_more,
    next_starting_after: list.has_more && last ? last.id : null,
  }
}
