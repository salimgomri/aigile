import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { canInviteRealMember } from '@/lib/team-limits'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const body = await request.json()
    const code = (body.code || '').trim().toUpperCase().slice(0, 6)

    if (!code || code.length < 6) {
      return NextResponse.json(
        { error: 'Code invalide (6 caractères requis)' },
        { status: 400 }
      )
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('id, name')
      .eq('invite_code', code)
      .single()

    if (teamError || !team) {
      return NextResponse.json(
        { error: 'Équipe introuvable. Vérifiez le code.' },
        { status: 404 }
      )
    }

    const userId = session.user.id

    const { data: existing } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', team.id)
      .eq('user_id', userId)
      .limit(1)

    if (existing?.length) {
      return NextResponse.json({ success: true, alreadyMember: true, teamId: team.id })
    }

    const check = await canInviteRealMember(supabaseAdmin, team.id)
    if (!check.allowed) {
      return NextResponse.json(
        {
          error:
            check.reason ??
            'L\'équipe est complète en plan Free. Demandez à votre manager de passer Pro.',
        },
        { status: 403 }
      )
    }

    const { error: memberError } = await supabaseAdmin
      .from('team_members')
      .insert({
        user_id: userId,
        team_id: team.id,
        role: 'dev_team',
      })

    if (memberError) {
      console.error('[API] team join error:', memberError)
      return NextResponse.json({ error: 'Erreur lors de l\'ajout' }, { status: 500 })
    }

    return NextResponse.json({ success: true, teamId: team.id })
  } catch (err) {
    console.error('[API] team join error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
