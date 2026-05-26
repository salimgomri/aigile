import { NextResponse } from 'next/server'
import {
  BOOK_COMPARE_AT_CENTIMES,
  FICHES_COMPARE_AT_CENTIMES,
  formatBookPrice,
} from '@/lib/book-config'
import { getCurrentBookProduct, getProduct } from '@/lib/payments/catalog'
import type { Product } from '@/lib/payments/catalog'

function serializeProduct(product: Product) {
  return {
    id: product.id,
    stripePriceId: product.stripePriceId,
    type: product.type,
    title: product.title,
    description: product.description,
    amount: product.amount,
    currency: product.currency,
    isRecurring: product.isRecurring,
    requiresShipping: product.requiresShipping,
    shippingFee: product.shippingFee,
    freeShippingInPerson: product.freeShippingInPerson,
    fulfillmentType: product.fulfillmentType,
  }
}

export async function GET() {
  const product = getCurrentBookProduct()
  if (!product) {
    return NextResponse.json({ error: 'Produit non configuré' }, { status: 404 })
  }

  const fichesProduct = getProduct('fiches_salim')

  return NextResponse.json({
    product: serializeProduct(product),
    productId: product.id,
    amount: product.amount,
    compareAtAmount: BOOK_COMPARE_AT_CENTIMES,
    priceFormatted: formatBookPrice(product.amount),
    compareAtFormatted: formatBookPrice(BOOK_COMPARE_AT_CENTIMES),
    fiches: fichesProduct
      ? {
          product: serializeProduct(fichesProduct),
          amount: fichesProduct.amount,
          compareAtAmount: FICHES_COMPARE_AT_CENTIMES,
          priceFormatted: formatBookPrice(fichesProduct.amount),
          compareAtFormatted: formatBookPrice(FICHES_COMPARE_AT_CENTIMES),
        }
      : null,
    isPreorder: false,
    daysLeft: 0,
    preorderEnd: null,
  })
}
