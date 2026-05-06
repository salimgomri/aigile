import { NextResponse } from 'next/server'
import { getCurrentBookProduct } from '@/lib/payments/catalog'

export async function GET() {
  const product = getCurrentBookProduct()
  if (!product) {
    return NextResponse.json({ error: 'Produit non configuré' }, { status: 404 })
  }

  return NextResponse.json({
    product: {
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
    },
    productId: product.id,
    amount: product.amount,
    priceFormatted: (product.amount / 100).toFixed(2).replace('.', ',') + ' €',
    isPreorder: false,
    daysLeft: 0,
    preorderEnd: null,
  })
}
