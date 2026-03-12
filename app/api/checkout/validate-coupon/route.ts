import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProduct, getCurrentBookProduct, CATALOG } from '@/lib/payments/catalog'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ valid: false, reason: 'Service indisponible' }, { status: 503 })
    }

    const body = await request.json()
    const { code, productId } = body as { code?: string; productId?: string }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, reason: 'Code manquant' }, { status: 400 })
    }

    const resolvedId = productId === 'pack_credits' ? 'credits_10' : productId
    const product =
      resolvedId === 'book_preorder' || resolvedId === 'book_sale'
        ? getCurrentBookProduct()
        : getProduct(resolvedId ?? '') ?? (CATALOG[resolvedId ?? ''] as { amount: number } | undefined)

    if (!product?.amount) {
      return NextResponse.json({ valid: false, reason: 'Produit invalide' }, { status: 400 })
    }

    const promoCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase().trim(),
      active: true,
      limit: 1,
    })

    if (promoCodes.data.length === 0) {
      return NextResponse.json({ valid: false, reason: 'Code invalide ou expiré' })
    }

    const promoCode = promoCodes.data[0]
    const promotion = promoCode.promotion
    const couponId =
      typeof promotion.coupon === 'string' ? promotion.coupon : promotion.coupon?.id
    const coupon =
      typeof promotion.coupon === 'object' && promotion.coupon
        ? promotion.coupon
        : await stripe.coupons.retrieve(couponId!)

    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ valid: false, reason: 'Code expiré' })
    }

    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return NextResponse.json({ valid: false, reason: 'Code épuisé' })
    }

    const amount = product.amount
    let discountAmount = 0
    let discountLabel = ''

    if (coupon.percent_off) {
      discountAmount = Math.round((amount * coupon.percent_off) / 100)
      discountLabel = `-${coupon.percent_off}%`
    } else if (coupon.amount_off) {
      discountAmount = Math.min(coupon.amount_off, amount)
      discountLabel = `-${(coupon.amount_off / 100).toFixed(2).replace('.', ',')} €`
    }

    const newTotal = Math.max(0, amount - discountAmount)

    return NextResponse.json({
      valid: true,
      discountLabel,
      discountAmount,
      newSubtotal: newTotal,
      displayDiscount: (discountAmount / 100).toFixed(2).replace('.', ',') + ' €',
      displayTotal: (newTotal / 100).toFixed(2).replace('.', ',') + ' €',
    })
  } catch (err) {
    console.error('[API] validate-coupon error:', err)
    return NextResponse.json({ valid: false, reason: 'Erreur de vérification' }, { status: 500 })
  }
}
