import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getProduct, getCurrentBookProduct } from '@/lib/payments/catalog'
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

/** @deprecated Préférer productId du catalogue. Rétrocompat: pack_credits → credits_10 */
export type CheckoutProduct = 'day_pass' | 'pro_monthly' | 'pro_annual' | 'pack_credits'

type ShippingInput = {
  name: string
  address1: string
  address2?: string
  city: string
  postal: string
  country: string
  phone?: string
}

type BodyInput = {
  productId?: string
  product?: string
  buyerName?: string
  buyerEmail?: string
  shipping?: ShippingInput
  couponCode?: string
  inPersonPickup?: boolean
}

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
    }

    const session = await auth.api.getSession({ headers: await headers() })
    const body = (await request.json()) as BodyInput
    const {
      productId,
      product,
      buyerName,
      buyerEmail,
      shipping,
      couponCode,
      inPersonPickup = false,
    } = body

    const id = productId ?? product
    const resolvedId = id === 'pack_credits' ? 'credits_10' : id

    if (!resolvedId) {
      return NextResponse.json({ error: 'productId requis' }, { status: 400 })
    }

    // 1. Charger le produit (livre = dynamique selon date)
    const resolvedProduct =
      resolvedId === 'book_preorder' || resolvedId === 'book_sale'
        ? getCurrentBookProduct()
        : getProduct(resolvedId)

    if (!resolvedProduct) {
      return NextResponse.json({ error: 'Produit invalide ou non configuré' }, { status: 400 })
    }

    // 2. Produits numériques/pro : session requise
    const requiresAuth =
      resolvedProduct.type !== 'book_physical' &&
      ['credits_pack', 'day_pass', 'subscription_monthly', 'subscription_annual'].includes(
        resolvedProduct.type
      )
    if (requiresAuth && !session?.user) {
      return NextResponse.json({ error: 'Connectez-vous pour procéder au paiement' }, { status: 401 })
    }

    const userName = buyerName ?? session?.user?.name ?? ''
    const userEmail = buyerEmail ?? session?.user?.email ?? ''
    if (!userEmail) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // 3. Validation adresse si livraison requise et pas en main propre
    if (resolvedProduct.requiresShipping && !inPersonPickup) {
      const requiredFields = ['address1', 'city', 'postal', 'country'] as const
      const missing = requiredFields.filter((f) => !shipping?.[f]?.trim())

      if (missing.length > 0) {
        return NextResponse.json(
          {
            error: 'Adresse de livraison incomplète',
            missing,
          },
          { status: 400 }
        )
      }
    }

    // 4. Frais de livraison
    const shippingAmount =
      resolvedProduct.requiresShipping && !inPersonPickup ? resolvedProduct.shippingFee : 0

    // 5. Code promo (uniquement si livraison)
    let promotionCodeId: string | undefined
    if (couponCode?.trim() && resolvedProduct.requiresShipping) {
      const { data } = await stripe.promotionCodes.list({
        code: couponCode.trim(),
        active: true,
      })
      if (data.length > 0) promotionCodeId = data[0].id
    }

    // URL de la requête = source fiable (aigile.lu en prod, localhost en dev)
    const baseUrl = new URL(request.url).origin
    const successUrl = `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = resolvedProduct.type === 'book_physical' ? `${baseUrl}/#book` : `${baseUrl}/retro?checkout=cancelled`

    const metadata: Record<string, string> = {
      product_id: resolvedProduct.id,
      product_type: resolvedProduct.type,
      buyer_name: userName,
      user_id: session?.user?.id ?? '',
      coupon_code: couponCode ?? '',
      in_person_pickup: String(inPersonPickup),
    }
    if (resolvedProduct.requiresShipping && !inPersonPickup && shipping) {
      metadata.shipping_name = shipping.name
      metadata.shipping_address1 = shipping.address1
      metadata.shipping_address2 = shipping.address2 ?? ''
      metadata.shipping_city = shipping.city
      metadata.shipping_postal = shipping.postal
      metadata.shipping_country = shipping.country
      metadata.shipping_phone = shipping.phone ?? ''
    }

    const baseConfig: Stripe.Checkout.SessionCreateParams = {
      customer_email: userEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    }

    if (resolvedProduct.isRecurring) {
      const checkoutSession = await stripe.checkout.sessions.create({
        ...baseConfig,
        mode: 'subscription',
        line_items: [{ price: resolvedProduct.stripePriceId, quantity: 1 }],
        subscription_data: {
          metadata: { product_id: resolvedProduct.id, user_id: session?.user?.id ?? '' },
        },
      })
      return NextResponse.json({ url: checkoutSession.url })
    }

    // Mode payment
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: resolvedProduct.stripePriceId, quantity: 1 },
    ]
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Livraison mondiale' },
          unit_amount: shippingAmount,
        },
        quantity: 1,
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      ...baseConfig,
      mode: 'payment',
      line_items: lineItems,
      ...(promotionCodeId && { discounts: [{ promotion_code: promotionCodeId }] }),
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('[API] checkout create-session error:', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
