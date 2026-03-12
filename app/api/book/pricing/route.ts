import { NextResponse } from 'next/server'
import { getCurrentBookProduct } from '@/lib/payments/catalog'

const PREORDER_END_STR = process.env.PREORDER_END_DATE

export async function GET() {
  const product = getCurrentBookProduct()
  if (!product) {
    return NextResponse.json({ error: 'Produit non configuré' }, { status: 404 })
  }

  const preorderEnd = PREORDER_END_STR ? new Date(PREORDER_END_STR) : null
  const now = new Date()
  const isPreorder = preorderEnd && now < preorderEnd
  const daysLeft = preorderEnd ? Math.max(0, Math.ceil((preorderEnd.getTime() - now.getTime()) / 86400000)) : 0

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
    isPreorder,
    daysLeft,
    preorderEnd: preorderEnd?.toISOString() ?? null,
  })
}
