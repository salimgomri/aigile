import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ROLE_LABELS: Record<string, string> = {
  manager: 'Manager',
  scrum_master: 'Scrum Master',
  product_owner: 'Product Owner',
  agile_coach: 'Coach Agile',
  dev_team: 'Développeur',
  guest: 'Invité',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token manquant' }, { status: 400 })
    }

    const { data: inv, error } = await supabaseAdmin
      .from('invitations')
      .select('id, team_id, email, role, expires_at, accepted_at')
      .eq('token', token)
      .single()

    if (error || !inv) {
      return NextResponse.json({ valid: false, error: 'Invitation introuvable' }, { status: 404 })
    }

    if (inv.accepted_at) {
      return NextResponse.json({ valid: false, error: 'Invitation déjà acceptée' }, { status: 410 })
    }

    const now = new Date().toISOString()
    if (inv.expires_at < now) {
      return NextResponse.json({ valid: false, error: 'Invitation expirée' }, { status: 410 })
    }

    const { data: team } = await supabaseAdmin
      .from('teams')
      .select('name')
      .eq('id', inv.team_id)
      .single()

    return NextResponse.json({
      valid: true,
      teamName: team?.name ?? 'Équipe',
      role: ROLE_LABELS[inv.role] ?? inv.role,
      email: inv.email,
    })
  } catch (err) {
    console.error('[API] invite get error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
