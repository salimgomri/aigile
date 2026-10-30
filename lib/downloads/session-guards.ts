import { getDigitalProduct, matchSessionToProduct, type DigitalProduct } from '@/lib/products'
import type Stripe from 'stripe'

export function paymentStatusPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === 'paid'
}

export function productFromSession(session: Stripe.Checkout.Session): DigitalProduct | undefined {
  const paymentLink =
    typeof session.payment_link === 'string'
      ? session.payment_link
      : session.payment_link && typeof session.payment_link === 'object'
        ? session.payment_link.id
        : null
  const metadataSlug = (session.metadata?.product_slug || session.metadata?.product_id || null) as
    | string
    | null
  const lineItems = session.line_items?.data ?? []
  const priceIds = lineItems
    .map((li) => {
      const price = li.price
      if (!price) return null
      return typeof price === 'string' ? price : price.id
    })
    .filter((id): id is string => Boolean(id))

  return matchSessionToProduct({ paymentLinkId: paymentLink, priceIds, metadataSlug })
}

export function assertSlugMatches(sessionProduct: DigitalProduct, slug: string): boolean {
  return sessionProduct.slug === slug && Boolean(getDigitalProduct(slug)?.fichierCle)
}
