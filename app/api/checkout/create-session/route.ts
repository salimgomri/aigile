import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export type CheckoutProduct = 'day_pass' | 'pro_monthly' | 'pro_annual' | 'pack_credits'

const PRICE_IDS: Record<CheckoutProduct, string | undefined> = {
  day_pass: process.env.STRIPE_DAY_PASS_PRICE_ID,
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  pro_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  pack_credits: process.env.STRIPE_PACK_CREDITS_PRICE_ID,
}

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
    }

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const body = await request.json()
    const { product } = body as { product: CheckoutProduct }

    const priceId = PRICE_IDS[product]
    if (!product || !priceId) {
      return NextResponse.json({ error: 'Produit invalide' }, { status: 400 })
    }

    const isSubscription = ['pro_monthly', 'pro_annual'].includes(product)
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'https://aigile.lu'}/retro?checkout=success`
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'https://aigile.lu'}/retro?checkout=cancelled`

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: session.user.email ?? undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: session.user.id, product },
      line_items: [{ price: priceId, quantity: 1 }],
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('[API] checkout create-session error:', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
