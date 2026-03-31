import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import Stripe from 'stripe'
import { syncStripeCheckoutSessionsToOrders } from '@/lib/orders/sync-stripe-orders-admin'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  let body: { limit?: number; starting_after?: string } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    /* empty body */
  }

  const limit = typeof body.limit === 'number' && Number.isFinite(body.limit) ? body.limit : 50
  const starting_after =
    typeof body.starting_after === 'string' && body.starting_after.length > 0
      ? body.starting_after
      : undefined

  const stripe = new Stripe(stripeKey)

  try {
    const result = await syncStripeCheckoutSessionsToOrders({
      stripe,
      limit,
      starting_after,
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[API] admin stripe-orders-sync', err)
    const message = err instanceof Error ? err.message : 'Erreur'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
