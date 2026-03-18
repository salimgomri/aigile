import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'

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

    // 2. Achats agrégés (totaux depuis v_user_purchases)
    const { data: purchaseRows } = await supabaseAdmin
      .from('v_user_purchases')
      .select('total_orders, books, credits_packs, pro_monthly, pro_annual, day_passes, total_centimes')

    const purchases = purchaseRows ?? []
    const macroPurchases = {
      totalBuyers: purchases.length,
      totalOrders: purchases.reduce((s, r) => s + (r.total_orders ?? 0), 0),
      totalBooks: purchases.reduce((s, r) => s + (r.books ?? 0), 0),
      totalCreditsPacks: purchases.reduce((s, r) => s + (r.credits_packs ?? 0), 0),
      totalProMonthly: purchases.reduce((s, r) => s + (r.pro_monthly ?? 0), 0),
      totalProAnnual: purchases.reduce((s, r) => s + (r.pro_annual ?? 0), 0),
      totalDayPasses: purchases.reduce((s, r) => s + (r.day_passes ?? 0), 0),
      totalRevenueCentimes: purchases.reduce((s, r) => s + (r.total_centimes ?? 0), 0),
    }

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
    })
  } catch (err) {
    console.error('[API] admin stats error:', err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
