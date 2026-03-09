import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { addCredits } from '@/lib/credits/manager'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const product = session.metadata?.product

    if (!userId) {
      console.warn('[WEBHOOK] checkout.session.completed: no userId in metadata')
      return NextResponse.json({ received: true })
    }

    if (product === 'pack_credits') {
      await addCredits(userId, 10)
    } else if (product === 'day_pass') {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)
      await supabaseAdmin
        .from('user_credits')
        .update({ plan: 'day_pass', day_pass_expires_at: expiresAt.toISOString() })
        .eq('user_id', userId)
    }
    // TODO: pro_monthly / pro_annual → subscription handling
  }

  return NextResponse.json({ received: true })
}
