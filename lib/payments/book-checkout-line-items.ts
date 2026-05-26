import Stripe from 'stripe'
import { getCurrentBookProduct, getProduct, type Product } from '@/lib/payments/catalog'

export function resolveBookCatalogProduct(productId: string): Product | null {
  if (productId === 'book_preorder' || productId === 'book_sale') {
    return getCurrentBookProduct()
  }
  return getProduct(productId)
}

export function getBookCoverPath(productId: string): string {
  if (productId === 'fiches_salim') return '/images/book-cover-fiche.png'
  if (productId === 'bundle_salim') return '/images/bundle-covers.png'
  return '/images/book-cover.jpg'
}

export function buildBookPhysicalLineItem(
  product: Product,
  productId: string,
  baseUrl: string,
  quantity = 1
): Stripe.Checkout.SessionCreateParams.LineItem {
  const coverPath = getBookCoverPath(productId)
  const coverUrl =
    baseUrl.startsWith('http') && /^https:\/\//i.test(baseUrl)
      ? `${baseUrl.replace(/\/$/, '')}${coverPath}`
      : undefined

  return {
    price_data: {
      currency: 'eur',
      product_data: {
        name: product.title,
        description: product.description,
        ...(coverUrl ? { images: [coverUrl] } : {}),
      },
      unit_amount: product.amount,
    },
    quantity: Math.max(1, Math.min(99, Math.floor(quantity) || 1)),
  }
}

export function buildCombinedProductTitle(primary: Product, addon: Product): string {
  return `${primary.title} + ${addon.title}`
}
