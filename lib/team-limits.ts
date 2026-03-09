/**
 * P02b - Team quotas Free vs Pro
 */

export const TEAM_LIMITS = {
  free: {
    max_teams: 1,
    max_real_members: 3,
    max_ghost_members: Infinity,
    can_invite_by_email: true,
    multi_team: false,
  },
  pro_monthly: {
    max_teams: Infinity,
    max_real_members: Infinity,
    max_ghost_members: Infinity,
    can_invite_by_email: true,
    multi_team: true,
  },
  pro_annual: {
    max_teams: Infinity,
    max_real_members: Infinity,
    max_ghost_members: Infinity,
    can_invite_by_email: true,
    multi_team: true,
  },
} as const

export type Plan = keyof typeof TEAM_LIMITS

export interface CanInviteResult {
  allowed: boolean
  reason?: string
  current: number
  max: number
}

import type { SupabaseClient } from '@supabase/supabase-js'

export async function canInviteRealMember(
  supabase: SupabaseClient,
  teamId: string
): Promise<CanInviteResult> {
  const { data: team } = await supabase.from('teams').select('organization_id').eq('id', teamId).single()
  if (!team?.organization_id) {
    return { allowed: false, reason: 'Team not found', current: 0, max: 0 }
  }

  const { data: org } = await supabase.from('organizations').select('plan').eq('id', team.organization_id).single()
  const plan = (org?.plan as Plan) || 'free'
  const limits = TEAM_LIMITS[plan]

  const { data: members } = await supabase.from('team_members').select('id').eq('team_id', teamId)
  const current = members?.length ?? 0

  if (current >= limits.max_real_members) {
    return {
      allowed: false,
      reason: plan === 'free' ? 'Quota Free atteint (3/3 membres réels)' : 'Quota atteint',
      current,
      max: limits.max_real_members,
    }
  }

  return { allowed: true, current, max: limits.max_real_members }
}
