import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ensureUserCredits } from '@/lib/payments/ensure-credits'
import {
  sendAuthorNotificationEmail,
  sendBuyerConfirmationEmail,
  sendPaymentFailedEmail,
} from '@/lib/email'
import Stripe from 'stripe'
import { getProduct, CATALOG, type Product } from '@/lib/payments/catalog'
import { getBaseUrl } from '@/lib/utils/base-url'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

/**
 * Événements Stripe à configurer dans le Dashboard :
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.deleted
 * - invoice.payment_failed
 */

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {}
  const productId = (metadata.product_id ?? metadata.productId ?? metadata.product) as string
  const productType = metadata.product_type as string
  const userId = (metadata.user_id ?? metadata.userId) as string | undefined
  const buyerName = (metadata.buyer_name ?? '') as string
  const inPersonPickup = metadata.in_person_pickup === 'true'

  const resolvedId = productId === 'pack_credits' ? 'credits_10' : productId
  const product: Product | null = resolvedId
    ? (getProduct(resolvedId) ?? (CATALOG[resolvedId] as Product | undefined) ?? null)
    : null
  const productTitle = product?.title ?? 'Commande'

  const amountTotal = session.amount_total ?? 0
  const amountShipping = session.total_details?.amount_shipping ?? (inPersonPickup ? 0 : 500)
  const amountDiscount = session.total_details?.amount_discount ?? 0
  const amountSubtotal = amountTotal - amountShipping + amountDiscount
  const buyerEmail = session.customer_email ?? session.customer_details?.email ?? ''

  if (!session.id || !buyerEmail) return

  // ── Insérer la commande dans orders ──────────────────────
  const orderData: Record<string, unknown> = {
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
    stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
    product_id: resolvedId ?? productId ?? 'unknown',
    product_type: productType ?? product?.type ?? 'unknown',
    product_title: productTitle,
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

  await supabaseAdmin.from('orders').upsert(orderData, {
    onConflict: 'stripe_session_id',
  })

  // ── Fulfillment selon le type ─────────────────────────────

  if (product?.fulfillmentType === 'automatic' && userId) {
    if (product.type === 'day_pass') {
      await ensureUserCredits(userId)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
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
    }
    else if (productId === 'day_pass') {
      await ensureUserCredits(userId)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
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

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata ?? {}
  const userId = metadata.user_id as string
  const productId = metadata.product_id as string

  if (!userId) return

  const plan = productId === 'pro_annual' ? 'pro_annual' : 'pro_monthly'
  await ensureUserCredits(userId)
  await supabaseAdmin
    .from('user_credits')
    .update({
      plan,
      stripe_subscription_id: subscription.id,
    })
    .eq('user_id', userId)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const sub = invoice.parent?.subscription_details?.subscription ?? (invoice as { subscription?: string }).subscription
  const subscriptionId = typeof sub === 'string' ? sub : sub?.id ?? null
  if (!subscriptionId || !stripe) return

  const { data: credits } = await supabaseAdmin
    .from('user_credits')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!credits) return

  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  const customerEmail = invoice.customer_email
  if (!customerId || !customerEmail) return

  const baseUrl = getBaseUrl()
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/dashboard`,
  })

  await sendPaymentFailedEmail({
    to: customerEmail,
    amount: invoice.amount_due,
    portalUrl: portalSession.url ?? `${baseUrl}/dashboard`,
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id as string
  if (!userId) return

  await ensureUserCredits(userId)
  await supabaseAdmin
    .from('user_credits')
    .update({
      plan: 'free',
      credits_remaining: 5,
      stripe_subscription_id: null,
    })
    .eq('user_id', userId)
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret || !stripe) {
    console.warn('[WEBHOOK] STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY not set')
    return NextResponse.json({ received: true })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, secret)
  } catch (err) {
    console.error('[WEBHOOK] Stripe signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // 1. Vérifier si l'événement a déjà été traité
  const { data: existing } = await supabaseAdmin
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .single()
  if (existing) {
    return Response.json({ received: true, skipped: true })
  }

  // 2. Enregistrer l'événement AVANT le traitement
  await supabaseAdmin.from('stripe_webhook_events').insert({
    id: event.id,
    type: event.type,
  })

  // 3. Traitement normal...

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
    }
    if (event.type === 'customer.subscription.created') {
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
    }
    if (event.type === 'customer.subscription.deleted') {
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
    }
    if (event.type === 'invoice.payment_failed') {
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
    }
  } catch (err) {
    console.error('[WEBHOOK] Handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
