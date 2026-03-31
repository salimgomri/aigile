import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'
import { isInternalTestCoupon, matchesCouponSubstring } from '@/lib/admin/promo-filters'

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const productType = searchParams.get('product_type')
  const status = searchParams.get('status')
  const country = searchParams.get('country')
  const period = searchParams.get('period') // 'month' | 'week' | 'all'
  const search = searchParams.get('search')?.trim()
  /** Inclure les commandes avec code promo test interne (ex. TEST100). Par défaut : non. */
  const includeInternalTest = searchParams.get('include_internal_test') === '1'
  /** Sous-chaîne sur coupon_code ; utiliser __none__ pour « sans code promo ». */
  const coupon = searchParams.get('coupon')?.trim() ?? ''

  let query = supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (productType) {
    query = query.eq('product_type', productType)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (country) {
    query = query.or(`shipping_country.eq.${country},shipping_country.is.null`)
  }
  if (period === 'month') {
    const start = new Date()
    start.setMonth(start.getMonth() - 1)
    query = query.gte('created_at', start.toISOString())
  } else if (period === 'week') {
    const start = new Date()
    start.setDate(start.getDate() - 7)
    query = query.gte('created_at', start.toISOString())
  }
  if (search) {
    query = query.or(`buyer_email.ilike.%${search}%,buyer_name.ilike.%${search}%`)
  }

  const { data: ordersRaw, error } = await query

  if (error) {
    console.error('[API] admin orders list error:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }

  let orders = ordersRaw ?? []
  if (!includeInternalTest) {
    orders = orders.filter((o) => !isInternalTestCoupon(o.coupon_code))
  }
  if (coupon) {
    orders = orders.filter((o) => matchesCouponSubstring(o.coupon_code, coupon))
  }

  // Stats : mêmes exclusions que la liste (hors filtres type/statut/période/recherche pays — on veut des totaux « business » globaux)
  const { data: allOrdersRaw } = await supabaseAdmin
    .from('orders')
    .select('id, product_type, status, amount_total, created_at, coupon_code')

  let allOrders = allOrdersRaw ?? []
  if (!includeInternalTest) {
    allOrders = allOrders.filter((o) => !isInternalTestCoupon(o.coupon_code))
  }
  if (coupon) {
    allOrders = allOrders.filter((o) => matchesCouponSubstring(o.coupon_code, coupon))
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthOrders = allOrders.filter((o) => new Date(o.created_at) >= monthStart)
  const booksPaid = allOrders.filter((o) => o.product_type === 'book_physical').length
  const pendingShipment = allOrders.filter((o) => o.product_type === 'book_physical' && o.status === 'paid').length
  const monthRevenue = monthOrders.reduce((s, o) => s + (o.amount_total ?? 0), 0)
  const activePro =
    allOrders.filter(
      (o) => ['subscription_monthly', 'subscription_annual'].includes(o.product_type ?? '') && o.status === 'paid'
    ).length ?? 0

  return NextResponse.json({
    orders,
    stats: {
      total: allOrders.length,
      booksPaid,
      monthRevenue,
      pendingShipment,
      activePro,
    },
    filtersMeta: {
      excludeInternalTestCoupons: !includeInternalTest,
      internalTestCodes: ['TEST100'],
      coupon: coupon || null,
    },
  })
}
