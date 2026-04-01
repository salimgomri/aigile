import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'
import { isInternalTestCoupon } from '@/lib/admin/promo-filters'
import { aggregateOrdersMacroTotals } from '@/lib/admin/aggregate-orders-macro'
import { aggregateToolUsageMacro, type ToolUsageCreditRow } from '@/lib/admin/aggregate-tool-usage-macro'
import {
  getStatsExcludedUserIds,
  shouldExcludeEmailFromToolStats,
  STATS_ALWAYS_EXCLUDED_EMAIL,
} from '@/lib/admin/stats-exclusions'
import {
  aggregateRetroInsights,
  aggregateScoringInsights,
  type RetroCreditRow,
  type ScoringSessionRow,
} from '@/lib/admin/aggregate-tool-insights'

const PAGE = 1000

async function fetchRetroCreditRows(): Promise<RetroCreditRow[]> {
  const out: RetroCreditRow[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabaseAdmin
      .from('credit_transactions')
      .select('action, user_id, created_at, cost, metadata')
      .eq('tool_slug', 'retro')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1)

    if (error) throw error
    if (!data?.length) break
    out.push(...(data as RetroCreditRow[]))
    if (data.length < PAGE) break
    from += PAGE
    if (from > 200_000) break
  }
  return out
}

async function fetchScoringSessionRows(): Promise<ScoringSessionRow[]> {
  const out: ScoringSessionRow[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabaseAdmin
      .from('scoring_sessions')
      .select('user_id, score_global, rag_global, completed_at, created_at')
      .eq('status', 'complete')
      .not('score_global', 'is', null)
      .order('completed_at', { ascending: true })
      .range(from, from + PAGE - 1)

    if (error) throw error
    if (!data?.length) break
    out.push(...(data as ScoringSessionRow[]))
    if (data.length < PAGE) break
    from += PAGE
    if (from > 100_000) break
  }
  return out
}

async function fetchToolUsageCreditRows(): Promise<ToolUsageCreditRow[]> {
  const out: ToolUsageCreditRow[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabaseAdmin
      .from('credit_transactions')
      .select('tool_slug, user_id, cost, created_at')
      .not('tool_slug', 'is', null)
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1)

    if (error) throw error
    if (!data?.length) break
    out.push(...(data as ToolUsageCreditRow[]))
    if (data.length < PAGE) break
    from += PAGE
    if (from > 500_000) break
  }
  return out
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const excludedUserIds = await getStatsExcludedUserIds()

    // 1. Usage par outil — recalculé sans comptes admin / email interne fixe
    const toolUsageRowsRaw = await fetchToolUsageCreditRows()
    const toolUsageRows = toolUsageRowsRaw.filter((r) => !excludedUserIds.has(r.user_id))
    const toolUsage = aggregateToolUsageMacro(toolUsageRows)

    // 2. Achats agrégés — depuis orders, hors codes promo test internes (ex. TEST100)
    const { data: orderRows } = await supabaseAdmin
      .from('orders')
      .select('buyer_email, buyer_name, user_id, product_type, amount_total, coupon_code')
      .in('status', ['paid', 'fulfilled', 'shipped'])

    const filteredOrders = (orderRows ?? []).filter((o) => !isInternalTestCoupon(o.coupon_code))
    const macroPurchases = aggregateOrdersMacroTotals(filteredOrders)

    // 3. Dernières utilisations — sur-échantillon puis filtre (excl. admin + email interne)
    const { data: recentRaw } = await supabaseAdmin
      .from('v_tool_usage_with_user')
      .select('user_email, user_name, tool_slug, action_slug, credits_cost, created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    const recentUsage = (recentRaw ?? [])
      .filter((u) => !shouldExcludeEmailFromToolStats(u.user_email))
      .slice(0, 15)

    const [retroCreditRows, scoringSessionRows] = await Promise.all([
      fetchRetroCreditRows(),
      fetchScoringSessionRows(),
    ])

    const retroInsights = aggregateRetroInsights(
      retroCreditRows.filter((r) => !excludedUserIds.has(r.user_id))
    )
    const scoringInsights = aggregateScoringInsights(
      scoringSessionRows.filter((r) => !excludedUserIds.has(r.user_id))
    )

    const toolStatsExclusionNote =
      `Usage outils, activité récente et insights Rétro/Scoring : exclus comptes ADMIN_EMAILS et ${STATS_ALWAYS_EXCLUDED_EMAIL}.`

    return NextResponse.json({
      toolUsage,
      purchases: macroPurchases,
      recentUsage,
      retroInsights,
      scoringInsights,
      purchasesNote:
        'Totaux calculés sur les commandes payées/livrées, hors codes promo test internes (TEST100).',
      toolStatsExclusionNote,
    })
  } catch (err) {
    console.error('[API] admin stats error:', err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
