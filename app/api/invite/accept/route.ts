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
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 })
    }

    const userId = session.user.id

    const { data: inv, error: invError } = await supabaseAdmin
      .from('invitations')
      .select('id, team_id, email, role, expires_at, accepted_at')
      .eq('token', token)
      .single()

    if (invError || !inv) {
      return NextResponse.json({ error: 'Invitation introuvable' }, { status: 404 })
    }

    if (inv.accepted_at) {
      return NextResponse.json({ error: 'Invitation déjà acceptée' }, { status: 410 })
    }

    const now = new Date().toISOString()
    if (inv.expires_at < now) {
      return NextResponse.json({ error: 'Invitation expirée' }, { status: 410 })
    }

    const { data: user } = await supabaseAdmin
      .from('user')
      .select('email')
      .eq('id', userId)
      .single()

    if (user?.email?.toLowerCase() !== inv.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cette invitation est destinée à un autre email' },
        { status: 403 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', inv.team_id)
      .eq('user_id', userId)
      .limit(1)

    if (existing?.length) {
      await supabaseAdmin
        .from('invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', inv.id)
      return NextResponse.json({ success: true, alreadyMember: true })
    }

    const check = await canInviteRealMember(supabaseAdmin, inv.team_id)
    if (!check.allowed) {
      return NextResponse.json(
        { error: check.reason ?? 'L\'équipe est complète' },
        { status: 403 }
      )
    }

    const { error: memberError } = await supabaseAdmin
      .from('team_members')
      .insert({
        user_id: userId,
        team_id: inv.team_id,
        role: inv.role,
      })

    if (memberError) {
      console.error('[API] invite accept member error:', memberError)
      return NextResponse.json({ error: 'Erreur ajout à l\'équipe' }, { status: 500 })
    }

    await supabaseAdmin
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', inv.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] invite accept error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
