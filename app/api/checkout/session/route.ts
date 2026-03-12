import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { COUNTRIES } from '@/lib/countries'
import { getProduct, CATALOG, type Product } from '@/lib/payments/catalog'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export async function GET(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id requis' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const metadata = session.metadata ?? {}
    const productId = (metadata.product_id ?? metadata.productId ?? metadata.product) as string
    const resolvedId = productId === 'pack_credits' ? 'credits_10' : productId
    const product: Product | null = resolvedId
      ? (getProduct(resolvedId) ?? (CATALOG[resolvedId] as Product | undefined) ?? null)
      : null
    const productType = (metadata.product_type ?? product?.type ?? 'unknown') as string
    const productTitle = product?.title ?? 'Commande'
    const inPersonPickup = metadata.in_person_pickup === 'true'

    const shipping =
      metadata.shipping_address1 && !inPersonPickup
        ? {
            name: metadata.shipping_name as string,
            address1: metadata.shipping_address1 as string,
            address2: metadata.shipping_address2 as string,
            city: metadata.shipping_city as string,
            postal: metadata.shipping_postal as string,
            country: metadata.shipping_country as string,
            countryName: getCountryName(metadata.shipping_country as string),
            phone: metadata.shipping_phone as string,
          }
        : null

    return NextResponse.json({
      productType,
      productId: resolvedId ?? productId,
      productTitle,
      inPersonPickup,
      shipping,
      amountTotal: session.amount_total ?? 0,
    })
  } catch (err) {
    console.error('[API] checkout session retrieve error:', err)
    return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
  }
}
