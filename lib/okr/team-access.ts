import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'

export async function assertTeamMember(userId: string, teamId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

export async function getTeamBasic(teamId: string) {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('id, name')
    .eq('id', teamId)
    .maybeSingle()
  if (error || !data) return null
  return data
}
