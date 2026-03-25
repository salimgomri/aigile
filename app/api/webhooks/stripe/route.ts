import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ensureUserCredits } from '@/lib/payments/ensure-credits'
import { sendPaymentFailedEmail } from '@/lib/email'
import { handleCheckoutCompleted } from '@/lib/orders/checkout-handler'
import Stripe from 'stripe'
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

// Crédits fongibles — valables pour Rétro IA (1 crédit) et Scoring livraison (2 crédits)

/**
 * Événements Stripe à configurer dans le Dashboard :
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.deleted
 * - invoice.payment_failed
 */

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata ?? {}
  const userId = metadata.user_id as string
  const productId = metadata.product_id as string

  if (!userId) return

  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id ?? null
  const plan = productId === 'pro_annual' ? 'pro_annual' : 'pro_monthly'
  await ensureUserCredits(userId)
  await supabaseAdmin
    .from('user_credits')
    .update({
      plan,
      stripe_subscription_id: subscription.id,
      ...(customerId && { stripe_customer_id: customerId }),
    })
    .eq('user_id', userId)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, baseUrl: string) {
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
    console.log('[WEBHOOK] event reçu', { id: event.id, type: event.type })
  } catch (err) {
    console.error('[WEBHOOK] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // 1. Vérifier si l'événement a déjà été traité
  const { data: existing } = await supabaseAdmin
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .single()
  if (existing) {
    console.log('[WEBHOOK] event déjà traité (idempotence)', { id: event.id })
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
      const session = event.data.object as Stripe.Checkout.Session
      console.log('[WEBHOOK] checkout.session.completed → handleCheckoutCompleted', { sessionId: session.id })
      await handleCheckoutCompleted(session)
      console.log('[WEBHOOK] handleCheckoutCompleted OK', { sessionId: session.id })
    }
    if (event.type === 'customer.subscription.created') {
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
    }
    if (event.type === 'customer.subscription.deleted') {
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
    }
    if (event.type === 'invoice.payment_failed') {
      const { getBaseUrlFromRequest } = await import('@/lib/utils/base-url')
      const baseUrl = getBaseUrlFromRequest(request)
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, baseUrl)
    }
  } catch (err) {
    console.error('[WEBHOOK] handler error', { eventId: event.id, eventType: event.type, err })
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  console.log('[WEBHOOK] traité avec succès', { id: event.id })
  return NextResponse.json({ received: true })
}
