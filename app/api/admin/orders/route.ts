import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'

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
    query = query.or(
      `buyer_email.ilike.%${search}%,buyer_name.ilike.%${search}%`
    )
  }

  const { data: orders, error } = await query

  if (error) {
    console.error('[API] admin orders list error:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }

  // Stats (depuis toutes les commandes, pas filtrées)
  const { data: allOrders } = await supabaseAdmin
    .from('orders')
    .select('id, product_type, status, amount_total, created_at')
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthOrders = allOrders?.filter((o) => new Date(o.created_at) >= monthStart) ?? []
  const booksPaid = allOrders?.filter((o) => o.product_type === 'book_physical').length ?? 0
  const pendingShipment = allOrders?.filter((o) => o.product_type === 'book_physical' && o.status === 'paid').length ?? 0
  const monthRevenue = monthOrders.reduce((s, o) => s + (o.amount_total ?? 0), 0)
  const activePro = allOrders?.filter((o) =>
    ['subscription_monthly', 'subscription_annual'].includes(o.product_type) && o.status === 'paid'
  ).length ?? 0

  return NextResponse.json({
    orders: orders ?? [],
    stats: {
      total: allOrders?.length ?? 0,
      booksPaid,
      monthRevenue,
      pendingShipment,
      activePro,
    },
  })
}
