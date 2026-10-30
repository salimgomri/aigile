import { NextResponse } from 'next/server'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'
import { supabaseAdmin } from '@/lib/supabase'
import { csvResponse, formatParisDate, toCsv } from '@/lib/leads/csv'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await requireAdminApiSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const url = new URL(request.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const format = url.searchParams.get('format')

  let query = supabaseAdmin
    .from('orders')
    .select('id, product_id, product_title, amount_total, status, created_at, buyer_email')
    .in('status', ['paid', 'fulfilled', 'shipped'])
    .order('created_at', { ascending: false })

  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const orders = data ?? []
  const byProduct = new Map<string, { count: number; amount: number; title: string }>()
  const byDay = new Map<string, { count: number; amount: number }>()
  const byMonth = new Map<string, { count: number; amount: number }>()

  for (const o of orders) {
    const p = byProduct.get(o.product_id) ?? { count: 0, amount: 0, title: o.product_title }
    p.count += 1
    p.amount += o.amount_total ?? 0
    byProduct.set(o.product_id, p)

    const day = formatParisDate(o.created_at).slice(0, 10)
    const month = day.slice(3)
    const d = byDay.get(day) ?? { count: 0, amount: 0 }
    d.count += 1
    d.amount += o.amount_total ?? 0
    byDay.set(day, d)
    const m = byMonth.get(month) ?? { count: 0, amount: 0 }
    m.count += 1
    m.amount += o.amount_total ?? 0
    byMonth.set(month, m)
  }

  if (format === 'csv') {
    const headers = ['Date', 'Produit', 'Montant EUR', 'Statut', 'Email']
    const rows = orders.map((o) => [
      formatParisDate(o.created_at),
      o.product_title,
      ((o.amount_total ?? 0) / 100).toFixed(2).replace('.', ','),
      o.status,
      o.buyer_email,
    ])
    return csvResponse('ventes-stripe.csv', toCsv(headers, rows))
  }

  return NextResponse.json(
    {
      orders,
      byProduct: Array.from(byProduct.entries()).map(([id, v]) => ({ id, ...v })),
      byDay: Array.from(byDay.entries()).map(([day, v]) => ({ day, ...v })),
      byMonth: Array.from(byMonth.entries()).map(([month, v]) => ({ month, ...v })),
      vat: 'TVA non applicable, art. 293 B du CGI',
    },
    { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  )
}
