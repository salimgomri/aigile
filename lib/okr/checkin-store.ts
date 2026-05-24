import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'
import type { CheckInInput } from '@/lib/okr/checkin-schema'

export type OkrCheckInRow = {
  id: string
  team_id: string
  sprint_id: string
  user_id: string
  avance: string
  frein: string
  ajustement: string
  ai_summary: string | null
  ai_summary_at: string | null
  created_at: string
  sprint?: {
    id: string
    number: number
    start_date: string
    end_date: string
    status: string | null
  } | null
}

export type TeamDashboardRag = {
  on_time_score: number | null
  on_budget_score: number | null
  on_scope_score: number | null
  quality_score: number | null
  maturity_score: number | null
  wellbeing_score: number | null
}

export async function createCheckInRecord(
  teamId: string,
  userId: string,
  input: CheckInInput
): Promise<{ row: OkrCheckInRow | null; error?: string }> {
  const { data: sprint } = await supabaseAdmin
    .from('sprints')
    .select('id, team_id')
    .eq('id', input.sprintId)
    .eq('team_id', teamId)
    .maybeSingle()

  if (!sprint) {
    return { row: null, error: 'Sprint introuvable pour cette équipe' }
  }

  const { data, error } = await supabaseAdmin
    .from('okr_sprint_checkins')
    .insert({
      team_id: teamId,
      sprint_id: input.sprintId,
      user_id: userId,
      avance: input.avance,
      frein: input.frein,
      ajustement: input.ajustement,
    })
    .select(
      'id, team_id, sprint_id, user_id, avance, frein, ajustement, ai_summary, ai_summary_at, created_at'
    )
    .single()

  if (error) {
    if (error.code === '23505') {
      return { row: null, error: 'Un check-in existe déjà pour ce sprint' }
    }
    console.error('[okr-checkin] insert:', error)
    return { row: null, error: 'Erreur lors de l\'enregistrement' }
  }

  await logCheckInCreate(userId, data.id, teamId, input.sprintId)

  return { row: data as OkrCheckInRow }
}

async function logCheckInCreate(
  userId: string,
  checkInId: string,
  teamId: string,
  sprintId: string
): Promise<void> {
  const { data: credits } = await supabaseAdmin
    .from('user_credits')
    .select('plan')
    .eq('user_id', userId)
    .maybeSingle()

  await supabaseAdmin.from('credit_transactions').insert({
    user_id: userId,
    action: 'okr_checkin_create',
    cost: 0,
    delta: 0,
    plan_at_time: credits?.plan ?? 'free',
    tool_slug: 'okr-checkin',
    metadata: { check_in_id: checkInId, team_id: teamId, sprint_id: sprintId },
  })
}

export async function getCheckInsByTeam(teamId: string): Promise<OkrCheckInRow[]> {
  const { data, error } = await supabaseAdmin
    .from('okr_sprint_checkins')
    .select(
      'id, team_id, sprint_id, user_id, avance, frein, ajustement, ai_summary, ai_summary_at, created_at'
    )
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[okr-checkin] list:', error)
    return []
  }

  const rows = data ?? []
  if (rows.length === 0) return []

  const sprintIds = [...new Set(rows.map((r) => r.sprint_id))]
  const { data: sprints } = await supabaseAdmin
    .from('sprints')
    .select('id, number, start_date, end_date, status')
    .in('id', sprintIds)

  const sprintMap = new Map((sprints ?? []).map((s) => [s.id, s]))

  return rows.map((row) => ({
    ...(row as OkrCheckInRow),
    sprint: sprintMap.get(row.sprint_id) ?? null,
  }))
}

export async function getCheckInById(
  teamId: string,
  checkInId: string
): Promise<OkrCheckInRow | null> {
  const { data, error } = await supabaseAdmin
    .from('okr_sprint_checkins')
    .select(
      'id, team_id, sprint_id, user_id, avance, frein, ajustement, ai_summary, ai_summary_at, created_at'
    )
    .eq('team_id', teamId)
    .eq('id', checkInId)
    .maybeSingle()

  if (error || !data) return null

  const { data: sprint } = await supabaseAdmin
    .from('sprints')
    .select('id, number, start_date, end_date, status')
    .eq('id', data.sprint_id)
    .maybeSingle()

  return {
    ...(data as OkrCheckInRow),
    sprint: sprint ?? null,
  }
}

export async function getSprintDashboardRag(
  teamId: string,
  sprintId: string
): Promise<TeamDashboardRag | null> {
  const { data } = await supabaseAdmin
    .from('team_dashboard')
    .select(
      'on_time_score, on_budget_score, on_scope_score, quality_score, maturity_score, wellbeing_score'
    )
    .eq('team_id', teamId)
    .eq('sprint_id', sprintId)
    .maybeSingle()

  return data as TeamDashboardRag | null
}

export async function getTeamSprints(teamId: string) {
  const { data } = await supabaseAdmin
    .from('sprints')
    .select('id, number, start_date, end_date, status')
    .eq('team_id', teamId)
    .order('number', { ascending: false })

  return data ?? []
}

export async function saveCheckInAiSummary(
  checkInId: string,
  summary: string
): Promise<void> {
  await supabaseAdmin
    .from('okr_sprint_checkins')
    .update({ ai_summary: summary, ai_summary_at: new Date().toISOString() })
    .eq('id', checkInId)
}
