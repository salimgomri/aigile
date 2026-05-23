import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'
import type { WestrumNiveau, WestrumScores } from '@/lib/westrum/constants'

export type WestrumResultRow = {
  id: string
  user_id: string
  scores: WestrumScores
  score_moyen: number
  niveau: WestrumNiveau
  created_at: string
}

export async function insertWestrumResult(
  userId: string,
  scores: WestrumScores,
  scoreMoyen: number,
  niveau: WestrumNiveau
): Promise<WestrumResultRow | null> {
  const { data, error } = await supabaseAdmin
    .from('westrum_results')
    .insert({
      user_id: userId,
      scores,
      score_moyen: scoreMoyen,
      niveau,
    })
    .select('id, user_id, scores, score_moyen, niveau, created_at')
    .single()

  if (error) {
    console.error('[westrum] insert:', error)
    return null
  }

  await logWestrumToolUsage(userId, scoreMoyen, niveau)

  return {
    ...data,
    scores: data.scores as WestrumScores,
    score_moyen: Number(data.score_moyen),
  }
}

export async function getWestrumHistory(userId: string, limit = 24): Promise<WestrumResultRow[]> {
  const { data, error } = await supabaseAdmin
    .from('westrum_results')
    .select('id, user_id, scores, score_moyen, niveau, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('[westrum] history:', error)
    return []
  }

  return (data ?? []).map((row) => ({
    ...row,
    scores: row.scores as WestrumScores,
    score_moyen: Number(row.score_moyen),
  }))
}

export async function getLatestWestrumResult(userId: string): Promise<WestrumResultRow | null> {
  const { data, error } = await supabaseAdmin
    .from('westrum_results')
    .select('id, user_id, scores, score_moyen, niveau, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  return {
    ...data,
    scores: data.scores as WestrumScores,
    score_moyen: Number(data.score_moyen),
  }
}

/** Trace usage admin (0 crédit) — alimente v_tool_usage_with_user / dashboard stats. */
async function logWestrumToolUsage(
  userId: string,
  scoreMoyen: number,
  niveau: WestrumNiveau
): Promise<void> {
  const { data: credits } = await supabaseAdmin
    .from('user_credits')
    .select('plan')
    .eq('user_id', userId)
    .maybeSingle()

  const { error } = await supabaseAdmin.from('credit_transactions').insert({
    user_id: userId,
    action: 'westrum_submit',
    cost: 0,
    delta: 0,
    plan_at_time: credits?.plan ?? 'free',
    tool_slug: 'westrum',
    metadata: { score_moyen: scoreMoyen, niveau },
  })

  if (error) {
    console.error('[westrum] tool usage log:', error)
  }
}
