import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { sendInvitationEmail } from '@/lib/email'

const ROLE_LABELS: Record<string, string> = {
  manager: 'Manager',
  scrum_master: 'Scrum Master',
  product_owner: 'Product Owner',
  agile_coach: 'Coach Agile',
  dev_team: 'Développeur',
  guest: 'Invité',
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const body = await request.json()
    const { invitationId } = body

    if (!invitationId) {
      return NextResponse.json({ error: 'invitationId requis' }, { status: 400 })
    }

    const { data: inv } = await supabaseAdmin
      .from('invitations')
      .select('id, team_id, email, role')
      .eq('id', invitationId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!inv) {
      return NextResponse.json({ error: 'Invitation introuvable ou expirée' }, { status: 404 })
    }

    const { data: membership } = await supabaseAdmin
      .from('team_members')
      .select('role')
      .eq('team_id', inv.team_id)
      .eq('user_id', session.user.id)
      .single()

    if (!membership || !['manager', 'scrum_master'].includes(membership.role)) {
      return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
    }

    const { data: team } = await supabaseAdmin
      .from('teams')
      .select('name')
      .eq('id', inv.team_id)
      .single()

    const inviterName =
      (session.user as { firstName?: string }).firstName ||
      session.user.name?.split(' ')[0] ||
      'Un collègue'

    const newToken = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').slice(0, 32)
    await supabaseAdmin
      .from('invitations')
      .update({
        token: newToken,
        expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', inv.id)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
    const url = `${baseUrl}/invite/${newToken}`
    void sendInvitationEmail({
      to: inv.email,
      url,
      inviterName,
      teamName: team?.name ?? 'Équipe',
      role: ROLE_LABELS[inv.role] ?? inv.role,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] resend invitation error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
