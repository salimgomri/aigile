import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'
import { sendToolAccessInviteEmail } from '@/lib/email'

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const toolSlug = searchParams.get('tool_slug')
  if (!toolSlug || !/^[a-z0-9_]+$/.test(toolSlug)) {
    return NextResponse.json({ error: 'tool_slug requis (a-z, 0-9, _)' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('tool_invites')
    .select('id, tool_slug, email, created_at')
    .eq('tool_slug', toolSlug)
    .order('email')

  if (error) {
    console.error('[admin/tool-invites GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ invites: data ?? [] })
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  let body: { tool_slug?: string; email?: string }
  try {
    body = (await request.json()) as { tool_slug?: string; email?: string }
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const toolSlug = body.tool_slug?.trim()
  const email = body.email?.trim()
  if (!toolSlug || !/^[a-z0-9_]+$/.test(toolSlug)) {
    return NextResponse.json({ error: 'tool_slug invalide' }, { status: 400 })
  }
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'email invalide' }, { status: 400 })
  }

  const { data: flag } = await supabaseAdmin
    .from('feature_flags')
    .select('slug, label_fr, tool_path')
    .eq('slug', toolSlug)
    .maybeSingle()
  if (!flag) {
    return NextResponse.json({ error: 'Outil inconnu (pas de feature flag)' }, { status: 400 })
  }

  const normalized = normEmail(email)
  const { data, error } = await supabaseAdmin
    .from('tool_invites')
    .insert({ tool_slug: toolSlug, email: normalized })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Cet email est déjà invité pour cet outil' }, { status: 409 })
    }
    console.error('[admin/tool-invites POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  void sendToolAccessInviteEmail({
    to: normalized,
    toolLabelFr: flag.label_fr || toolSlug,
    toolPath: flag.tool_path || '/',
  })

  return NextResponse.json({ invite: data })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  let body: { tool_slug?: string; email?: string }
  try {
    body = (await request.json()) as { tool_slug?: string; email?: string }
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const toolSlug = body.tool_slug?.trim()
  const email = body.email?.trim()
  if (!toolSlug || !email) {
    return NextResponse.json({ error: 'tool_slug et email requis' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('tool_invites')
    .delete()
    .eq('tool_slug', toolSlug)
    .eq('email', normEmail(email))

  if (error) {
    console.error('[admin/tool-invites DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
