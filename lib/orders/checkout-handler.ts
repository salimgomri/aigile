/**
 * Handler checkout.session.completed — logique métier partagée webhook + tests
 */
import { supabaseAdmin } from '@/lib/supabase'
import { ensureUserCredits } from '@/lib/payments/ensure-credits'
import { logCreditAddition } from '@/lib/credits/log-addition'
import {
  sendAuthorNotificationEmail,
  sendBuyerConfirmationEmail,
} from '@/lib/email'
import Stripe from 'stripe'
import { getProduct, CATALOG, type Product } from '@/lib/payments/catalog'

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[CHECKOUT] handleCheckoutCompleted début', { sessionId: session.id, customer_email: session.customer_email })
  const metadata = session.metadata ?? {}
  const productId = (metadata.product_id ?? metadata.productId ?? metadata.product) as string
  const productType = metadata.product_type as string
  const userId = (metadata.user_id ?? metadata.userId) as string | undefined
  const buyerName = (metadata.buyer_name ?? '') as string
  const inPersonPickup = metadata.in_person_pickup === 'true'
  const quantity = Math.max(1, parseInt(String(metadata.quantity ?? '1'), 10) || 1)

  const resolvedId = productId === 'pack_credits' ? 'credits_10' : productId
  const product: Product | null = resolvedId
    ? (getProduct(resolvedId) ?? (CATALOG[resolvedId] as Product | undefined) ?? null)
    : null
  const productTitle = product?.title ?? (productId === 'buy_coffee' ? 'Buy a coffee' : 'Commande')

  const amountTotal = session.amount_total ?? 0
  const amountShipping = session.total_details?.amount_shipping ?? (inPersonPickup ? 0 : 500)
  const amountDiscount = session.total_details?.amount_discount ?? 0
  const amountSubtotal = amountTotal - amountShipping + amountDiscount
  const buyerEmail = session.customer_email ?? session.customer_details?.email ?? ''

  if (!session.id || !buyerEmail) {
    console.warn('[CHECKOUT] handleCheckoutCompleted skip (session.id ou buyerEmail manquant)', { sessionId: session.id, buyerEmail })
    return
  }

  // ── Insérer la commande dans orders ──────────────────────
  const orderData: Record<string, unknown> = {
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
    stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
    product_id: resolvedId ?? productId ?? 'unknown',
    product_type: productType ?? product?.type ?? 'unknown',
    product_title: productTitle,
    quantity,
    buyer_email: buyerEmail,
    buyer_name: buyerName,
    user_id: userId || null,
    amount_subtotal: amountSubtotal,
    amount_discount: amountDiscount,
    amount_shipping: amountShipping,
    amount_total: amountTotal,
    currency: session.currency ?? 'eur',
    coupon_code: metadata.coupon_code || null,
    status: 'paid',
  }

  if (product?.requiresShipping) {
    orderData.in_person_pickup = inPersonPickup
    orderData.shipping_fee = inPersonPickup ? 0 : 500
    orderData.shipping_name = metadata.shipping_name ?? null
    orderData.shipping_address1 = metadata.shipping_address1 ?? null
    orderData.shipping_address2 = metadata.shipping_address2 ?? null
    orderData.shipping_city = metadata.shipping_city ?? null
    orderData.shipping_postal = metadata.shipping_postal ?? null
    orderData.shipping_country = metadata.shipping_country ?? null
    orderData.shipping_phone = metadata.shipping_phone ?? null
  }

  const { error: orderError } = await supabaseAdmin.from('orders').upsert(orderData, {
    onConflict: 'stripe_session_id',
  })
  if (orderError) {
    console.error('[CHECKOUT] orders insert failed', { sessionId: session.id, error: orderError })
    throw new Error(`orders insert failed: ${orderError.message}`)
  }
  console.log('[CHECKOUT] order inséré en BDD', { sessionId: session.id, productId: orderData.product_id })

  // ── Bonus 10 crédits pour acheteurs du livre S.A.L.I.M (si connecté) ───
  if (product?.type === 'book_physical' && userId) {
    await ensureUserCredits(userId)
    await supabaseAdmin.rpc('increment_credits', { p_user_id: userId, p_amount: 10 })
    await logCreditAddition(userId, 'book_bonus', 10)
    await supabaseAdmin
      .from('orders')
      .update({ book_bonus_granted_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id)
    console.log('[CHECKOUT] bonus 10 crédits livre attribué', { userId })
  }

  // ── Fulfillment selon le type ─────────────────────────────

  if (product?.fulfillmentType === 'automatic' && userId) {
    if (product.type === 'day_pass') {
      await ensureUserCredits(userId)
      const { data: current } = await supabaseAdmin
        .from('user_credits')
        .select('day_pass_expires_at')
        .eq('user_id', userId)
        .single()
      const now = Date.now()
      const oneDayMs = 24 * 60 * 60 * 1000
      const currentExpiry = current?.day_pass_expires_at ? new Date(current.day_pass_expires_at).getTime() : 0
      const expiresAt =
        currentExpiry > now ? new Date(currentExpiry + oneDayMs) : new Date(now + oneDayMs)
      await supabaseAdmin
        .from('user_credits')
        .update({
          plan: 'day_pass',
          day_pass_expires_at: expiresAt.toISOString(),
        })
        .eq('user_id', userId)
    }
    if (product.type === 'credits_pack') {
      await ensureUserCredits(userId)
      const match = resolvedId?.match(/credits_(\d+)/)
      const creditsToAdd = match ? parseInt(match[1], 10) : 10
      await supabaseAdmin.rpc('increment_credits', {
        p_user_id: userId,
        p_amount: creditsToAdd,
      })
      await logCreditAddition(userId, 'credits_pack', creditsToAdd)
    }
    await supabaseAdmin
      .from('orders')
      .update({ status: 'fulfilled', fulfilled_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id)
  }

  // Fallback legacy (sessions sans catalogue)
  if (!product && userId && (productId === 'pack_credits' || productId === 'day_pass')) {
    if (productId === 'pack_credits') {
      await ensureUserCredits(userId)
      await supabaseAdmin.rpc('increment_credits', { p_user_id: userId, p_amount: 10 })
      await logCreditAddition(userId, 'credits_pack', 10)
    }
    else if (productId === 'day_pass') {
      await ensureUserCredits(userId)
      const { data: current } = await supabaseAdmin
        .from('user_credits')
        .select('day_pass_expires_at')
        .eq('user_id', userId)
        .single()
      const now = Date.now()
      const oneDayMs = 24 * 60 * 60 * 1000
      const currentExpiry = current?.day_pass_expires_at ? new Date(current.day_pass_expires_at).getTime() : 0
      const expiresAt =
        currentExpiry > now ? new Date(currentExpiry + oneDayMs) : new Date(now + oneDayMs)
      await supabaseAdmin
        .from('user_credits')
        .update({
          plan: 'day_pass',
          day_pass_expires_at: expiresAt.toISOString(),
        })
        .eq('user_id', userId)
    }
  }

  if (product?.fulfillmentType === 'manual_kdp') {
    await sendAuthorNotificationEmail({
      buyerName,
      buyerEmail,
      productId: resolvedId ?? productId,
      productTitle,
      quantity,
      amountTotal,
      amountShipping,
      amountDiscount,
      couponCode: (metadata.coupon_code as string) || null,
      inPersonPickup,
      shippingAddress:
        !inPersonPickup && metadata.shipping_address1
          ? {
              name: (metadata.shipping_name as string) ?? '',
              address1: metadata.shipping_address1 as string,
              address2: (metadata.shipping_address2 as string) ?? undefined,
              city: metadata.shipping_city as string,
              postal: metadata.shipping_postal as string,
              country: metadata.shipping_country as string,
              phone: (metadata.shipping_phone as string) ?? undefined,
            }
          : undefined,
    })
  }

  // ── Email confirmation acheteur (toujours) ────────────────
  await sendBuyerConfirmationEmail({
    to: buyerEmail,
    buyerName: buyerName || buyerEmail.split('@')[0],
    productTitle,
    productType: productType ?? product?.type ?? 'unknown',
    quantity,
    amountTotal,
    amountSubtotal,
    amountDiscount,
    couponCode: (metadata.coupon_code as string) || null,
    ...(product?.requiresShipping && {
      shipping: {
        inPersonPickup,
        address:
          !inPersonPickup && metadata.shipping_address1
            ? {
                name: (metadata.shipping_name as string) ?? '',
                address1: metadata.shipping_address1 as string,
                address2: (metadata.shipping_address2 as string) ?? undefined,
                city: metadata.shipping_city as string,
                postal: metadata.shipping_postal as string,
                country: metadata.shipping_country as string,
                phone: (metadata.shipping_phone as string) ?? undefined,
              }
            : undefined,
      },
    }),
  })
}
