import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('tool_credit_promo_grants')
    .select('id, email, tool_slug, expires_at, early_adopter, note, created_at')
    .order('expires_at', { ascending: false })

  if (error) {
    console.error('[admin/credit-promos GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ promos: data ?? [] })
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  let body: {
    email?: string
    tool_slug?: string
    expires_at?: string
    early_adopter?: boolean
    note?: string | null
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const email = body.email?.trim()
  const toolSlug = body.tool_slug?.trim()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'email invalide' }, { status: 400 })
  }
  if (!toolSlug || !/^[a-z0-9_]+$/.test(toolSlug)) {
    return NextResponse.json({ error: 'tool_slug invalide (ex: skill_matrix)' }, { status: 400 })
  }

  const exp = body.expires_at ? new Date(body.expires_at) : null
  if (!exp || Number.isNaN(exp.getTime())) {
    return NextResponse.json({ error: 'expires_at invalide' }, { status: 400 })
  }

  const { data: flag } = await supabaseAdmin.from('feature_flags').select('slug').eq('slug', toolSlug).maybeSingle()
  if (!flag) {
    return NextResponse.json({ error: 'Outil inconnu (pas de feature flag pour ce slug)' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('tool_credit_promo_grants')
    .upsert(
      {
        email: normEmail(email),
        tool_slug: toolSlug,
        expires_at: exp.toISOString(),
        early_adopter: body.early_adopter !== false,
        note: body.note?.trim() || null,
      },
      { onConflict: 'email,tool_slug' }
    )
    .select('*')
    .single()

  if (error) {
    console.error('[admin/credit-promos POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ promo: data })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  let body: { email?: string; tool_slug?: string }
  try {
    body = (await request.json()) as { email?: string; tool_slug?: string }
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const email = body.email?.trim()
  const toolSlug = body.tool_slug?.trim()
  if (!email || !toolSlug) {
    return NextResponse.json({ error: 'email et tool_slug requis' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('tool_credit_promo_grants')
    .delete()
    .eq('email', normEmail(email))
    .eq('tool_slug', toolSlug)

  if (error) {
    console.error('[admin/credit-promos DELETE]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
