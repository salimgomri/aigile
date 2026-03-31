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
import { parseCheckoutSessionForOrder } from '@/lib/orders/parse-checkout-session'

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[CHECKOUT] handleCheckoutCompleted début', { sessionId: session.id, customer_email: session.customer_email })
  const parsed = parseCheckoutSessionForOrder(session)
  if (!parsed) {
    console.warn('[CHECKOUT] handleCheckoutCompleted skip (session.id ou buyerEmail manquant)', {
      sessionId: session.id,
      buyerEmail: session.customer_email ?? session.customer_details?.email ?? '',
    })
    throw new Error('[CHECKOUT] session.id ou buyer_email manquant — impossible de persister la commande')
  }

  const { orderData, ctx } = parsed
  const {
    product,
    resolvedId,
    productId,
    productType,
    userId,
    buyerName,
    quantity,
    inPersonPickup,
    metadata,
    amountTotal,
    amountShipping,
    amountDiscount,
    amountSubtotal,
    productTitle,
    buyerEmail,
  } = ctx

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
    } else if (productId === 'day_pass') {
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
