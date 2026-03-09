import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

const ROLES = ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest']

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  const { teamId, memberId, role } = await request.json()
  if (!teamId || !memberId || !role || !ROLES.includes(role)) return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
  const { data: m } = await supabaseAdmin.from('team_members').select('role').eq('team_id', teamId).eq('user_id', session.user.id).single()
  if (!m || !['manager', 'scrum_master'].includes(m.role)) return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
  const { error } = await supabaseAdmin.from('team_members').update({ role }).eq('id', memberId).eq('team_id', teamId)
  if (error) return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')
  const memberId = searchParams.get('memberId')
  if (!teamId || !memberId) return NextResponse.json({ error: 'teamId et memberId requis' }, { status: 400 })
  const { data: target } = await supabaseAdmin.from('team_members').select('user_id').eq('id', memberId).eq('team_id', teamId).single()
  if (!target) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
  if (target.user_id === session.user.id) return NextResponse.json({ error: 'Impossible de vous supprimer' }, { status: 400 })
  const { data: m } = await supabaseAdmin.from('team_members').select('role').eq('team_id', teamId).eq('user_id', session.user.id).single()
  if (!m || m.role !== 'manager') return NextResponse.json({ error: 'Seul le manager peut supprimer' }, { status: 403 })
  await supabaseAdmin.from('team_members').delete().eq('id', memberId)
  return NextResponse.json({ success: true })
}
