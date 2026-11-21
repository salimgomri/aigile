import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'
import type { SalimLinkSlug } from '@/lib/salim/fiche'
import {
  SALIM_ORDER_FORMATS,
  SALIM_PAID_STATUSES,
  summarizePaidOrdersByFormat,
  type SalimFormatCount,
  type SalimOrderRow,
} from '@/lib/salim/suivi-summary'

export async function recordSalimLinkVisit(link: SalimLinkSlug): Promise<{ recorded: boolean }> {
  const { error } = await supabaseAdmin.from('salim_link_visits').insert({ link_slug: link })
  if (error) {
    console.error('[salim/visite]', error.message)
    return { recorded: false }
  }
  return { recorded: true }
}

export async function readSalimLinkVisits(sinceIso: string): Promise<Record<SalimLinkSlug, number>> {
  const counts: Record<SalimLinkSlug, number> = { extrait: 0, achat: 0 }
  const { data, error } = await supabaseAdmin
    .from('salim_link_visits')
    .select('link_slug')
    .gte('created_at', sinceIso)

  if (error) {
    console.error('[salim/visite] lecture', error.message)
    return counts
  }

  for (const row of data ?? []) {
    if (row.link_slug === 'extrait' || row.link_slug === 'achat') counts[row.link_slug] += 1
  }
  return counts
}

export async function readSalimPaidOrdersByFormat(sinceIso?: string): Promise<SalimFormatCount[]> {
  let query = supabaseAdmin
    .from('orders')
    .select('product_id, status, amount_total, coupon_code, quantity')
    .in('status', [...SALIM_PAID_STATUSES])
    .in('product_id', [...SALIM_ORDER_FORMATS])

  if (sinceIso) query = query.gte('created_at', sinceIso)

  const { data, error } = await query
  if (error) {
    console.error('[salim/suivi] commandes', error.message)
    return summarizePaidOrdersByFormat([])
  }
  return summarizePaidOrdersByFormat((data ?? []) as SalimOrderRow[])
}
