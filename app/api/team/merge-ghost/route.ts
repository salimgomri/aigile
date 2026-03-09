import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { canInviteRealMember } from '@/lib/team-limits'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

    const { ghostId, realUserId } = await request.json()
    if (!ghostId || !realUserId) return NextResponse.json({ error: 'ghostId et realUserId requis' }, { status: 400 })

    const { data: ghost } = await supabaseAdmin.from('ghost_members').select('id, team_id').eq('id', ghostId).is('merged_into', null).single()
    if (!ghost) return NextResponse.json({ error: 'Fantôme introuvable ou déjà fusionné' }, { status: 404 })

    const { data: m } = await supabaseAdmin.from('team_members').select('role').eq('team_id', ghost.team_id).eq('user_id', session.user.id).single()
    if (!m || !['manager', 'scrum_master'].includes(m.role)) return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })

    const check = await canInviteRealMember(supabaseAdmin, ghost.team_id)
    if (!check.allowed) return NextResponse.json({ error: check.reason ?? 'Quota atteint' }, { status: 403 })

    let { data: tm } = await supabaseAdmin.from('team_members').select('id').eq('team_id', ghost.team_id).eq('user_id', realUserId).single()
    if (!tm) {
      const { data: inserted } = await supabaseAdmin.from('team_members').insert({ team_id: ghost.team_id, user_id: realUserId, role: 'dev_team' }).select('id').single()
      tm = inserted
    }
    if (!tm?.id) return NextResponse.json({ error: 'Erreur création membre' }, { status: 500 })

    await supabaseAdmin.from('daily_moods').update({ member_id: tm.id, ghost_member_id: null }).eq('ghost_member_id', ghostId)
    await supabaseAdmin.from('ghost_members').update({ merged_into: realUserId, merged_at: new Date().toISOString() }).eq('id', ghostId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] merge-ghost:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
