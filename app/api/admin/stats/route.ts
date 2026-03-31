import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'
import { isInternalTestCoupon } from '@/lib/admin/promo-filters'
import { aggregateOrdersMacroTotals } from '@/lib/admin/aggregate-orders-macro'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    // 1. Usage par outil (v_tool_usage_macro)
    const { data: toolUsage } = await supabaseAdmin
      .from('v_tool_usage_macro')
      .select('*')
      .order('total_uses', { ascending: false })

    // 2. Achats agrégés — depuis orders, hors codes promo test internes (ex. TEST100)
    const { data: orderRows } = await supabaseAdmin
      .from('orders')
      .select('buyer_email, buyer_name, user_id, product_type, amount_total, coupon_code')
      .in('status', ['paid', 'fulfilled', 'shipped'])

    const filteredOrders = (orderRows ?? []).filter((o) => !isInternalTestCoupon(o.coupon_code))
    const macroPurchases = aggregateOrdersMacroTotals(filteredOrders)

    // 3. Dernières utilisations (v_tool_usage_with_user)
    const { data: recentUsage } = await supabaseAdmin
      .from('v_tool_usage_with_user')
      .select('user_email, user_name, tool_slug, action_slug, credits_cost, created_at')
      .limit(15)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      toolUsage: toolUsage ?? [],
      purchases: macroPurchases,
      recentUsage: recentUsage ?? [],
      purchasesNote:
        'Totaux calculés sur les commandes payées/livrées, hors codes promo test internes (TEST100).',
    })
  } catch (err) {
    console.error('[API] admin stats error:', err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
