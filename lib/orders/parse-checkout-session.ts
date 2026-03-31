/**
 * Mappe une Checkout Session Stripe → ligne `orders` (webhook, sync admin).
 */
import Stripe from 'stripe'
import { getProduct, CATALOG, type Product } from '@/lib/payments/catalog'

export type CheckoutOrderContext = {
  product: Product | null
  resolvedId: string
  productId: string
  productType: string
  userId: string | undefined
  buyerName: string
  quantity: number
  inPersonPickup: boolean
  metadata: Record<string, string>
  amountTotal: number
  amountShipping: number
  amountDiscount: number
  amountSubtotal: number
  productTitle: string
  buyerEmail: string
}

function paymentRefId(
  ref: string | Stripe.PaymentIntent | Stripe.SetupIntent | null | undefined
): string | null {
  if (typeof ref === 'string') return ref
  if (ref && typeof ref === 'object' && 'id' in ref) return ref.id
  return null
}

function subscriptionRefId(ref: string | Stripe.Subscription | null | undefined): string | null {
  if (typeof ref === 'string') return ref
  if (ref && typeof ref === 'object' && 'id' in ref) return ref.id
  return null
}

/**
 * Retourne null si session ou email acheteur manquant (pas de ligne commande fiable).
 */
export function parseCheckoutSessionForOrder(
  session: Stripe.Checkout.Session
): { orderData: Record<string, unknown>; ctx: CheckoutOrderContext } | null {
  const metadata = (session.metadata ?? {}) as Record<string, string>
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
    return null
  }

  const orderData: Record<string, unknown> = {
    stripe_session_id: session.id,
    stripe_payment_intent: paymentRefId(session.payment_intent),
    stripe_subscription_id: subscriptionRefId(session.subscription),
    product_id: resolvedId ?? productId ?? 'unknown',
    product_type: productType ?? product?.type ?? 'unknown',
    product_title: productTitle,
    quantity,
    buyer_email: buyerEmail,
    buyer_name: buyerName || buyerEmail.split('@')[0] || '—',
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

  const ctx: CheckoutOrderContext = {
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
  }

  return { orderData, ctx }
}
