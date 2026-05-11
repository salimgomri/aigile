import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'
import { isInternalTestCoupon } from '@/lib/admin/promo-filters'

/** Commandes pertinentes pour chiffres « business » (hors abandoned / pending éventuel). */
const COMMERCIAL_STATUSES = ['paid', 'fulfilled', 'shipped'] as const

export type LandingCommerceSummary = {
  /** Livres physique : quantités commandes (somme quantity). */
  booksSold: number
  grossRevenueCentimes: number
  /** Somme des frais Stripe quand stripe_fee_amount est renseigné. */
  stripeFeesKnownCentimes: number
  /** Ventes où la commission Stripe n’est pas encore en base → net incomplet */
  ordersMissingStripeFeeCount: number
}

function emptySummary(): LandingCommerceSummary {
  return {
    booksSold: 0,
    grossRevenueCentimes: 0,
    stripeFeesKnownCentimes: 0,
    ordersMissingStripeFeeCount: 0,
  }
}

/** Totaux landing admin — alignés sur exclusions promo test (TEST100 comme le dashboard orders). */
export async function getLandingCommerceSummary(): Promise<LandingCommerceSummary> {
  const { data: rowsRaw, error } = await supabaseAdmin
    .from('orders')
    .select('product_type, status, amount_total, stripe_fee_amount, coupon_code, quantity')
    .in('status', [...COMMERCIAL_STATUSES])

  if (error) {
    console.error('[landing-commerce-summary]', error.message)
    return emptySummary()
  }

  const rows = (rowsRaw ?? []).filter((o) => !isInternalTestCoupon(o.coupon_code))

  let booksSold = 0
  let grossRevenueCentimes = 0
  let stripeFeesKnownCentimes = 0
  let ordersMissingStripeFeeCount = 0

  for (const o of rows) {
    grossRevenueCentimes += o.amount_total ?? 0

    const fee = o.stripe_fee_amount
    const total = o.amount_total ?? 0
    if (fee != null) stripeFeesKnownCentimes += fee
    else if (total > 0) ordersMissingStripeFeeCount += 1

    if (o.product_type === 'book_physical') {
      const q = typeof o.quantity === 'number' && o.quantity >= 1 ? o.quantity : 1
      booksSold += Math.min(999, Math.floor(q))
    }
  }

  return {
    booksSold,
    grossRevenueCentimes,
    stripeFeesKnownCentimes,
    ordersMissingStripeFeeCount,
  }
}
