import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  const { teamId, displayName } = await request.json()
  if (!teamId || !displayName?.trim()) return NextResponse.json({ error: 'teamId et displayName requis' }, { status: 400 })
  const { data: m } = await supabaseAdmin.from('team_members').select('role').eq('team_id', teamId).eq('user_id', session.user.id).single()
  if (!m || !['manager', 'scrum_master'].includes(m.role)) return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
  const { error } = await supabaseAdmin.from('ghost_members').insert({ team_id: teamId, display_name: displayName.trim(), added_by: session.user.id })
  if (error) return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  const ghostId = new URL(request.url).searchParams.get('ghostId')
  if (!ghostId) return NextResponse.json({ error: 'ghostId requis' }, { status: 400 })
  const { data: ghost } = await supabaseAdmin.from('ghost_members').select('team_id').eq('id', ghostId).single()
  if (!ghost) return NextResponse.json({ error: 'Fantôme introuvable' }, { status: 404 })
  const { data: m } = await supabaseAdmin.from('team_members').select('role').eq('team_id', ghost.team_id).eq('user_id', session.user.id).single()
  if (!m || !['manager', 'scrum_master'].includes(m.role)) return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
  await supabaseAdmin.from('ghost_members').delete().eq('id', ghostId)
  return NextResponse.json({ success: true })
}
