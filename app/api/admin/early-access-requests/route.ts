import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEarlyAdopterApprovedEmail } from '@/lib/email'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('tool_early_access_requests')
    .select('id, email, tool_slug, message, status, created_at, processed_at, processed_by')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('[admin/early-access-requests GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ requests: data ?? [] })
}

/** Valider une demande : invite + promo illimitée + email félicitations */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  let body: { id?: string; expires_at?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const id = body.id?.trim()
  if (!id) {
    return NextResponse.json({ error: 'id requis' }, { status: 400 })
  }

  const expiresAt = body.expires_at ? new Date(body.expires_at) : null
  if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
    return NextResponse.json({ error: 'expires_at requis (date/heure de fin de la promo early adopter)' }, { status: 400 })
  }

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from('tool_early_access_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (fetchErr || !row) {
    return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
  }
  if (row.status !== 'pending') {
    return NextResponse.json({ error: 'Déjà traitée' }, { status: 400 })
  }

  const toolSlug = row.tool_slug as string
  const email = row.email as string

  const { data: flag } = await supabaseAdmin
    .from('feature_flags')
    .select('slug, label_fr, tool_path')
    .eq('slug', toolSlug)
    .maybeSingle()
  if (!flag) {
    return NextResponse.json({ error: 'Feature flag manquant' }, { status: 500 })
  }

  const { error: invErr } = await supabaseAdmin.from('tool_invites').insert({ tool_slug: toolSlug, email })
  if (invErr && invErr.code !== '23505') {
    console.error('[approve invite]', invErr)
    return NextResponse.json({ error: invErr.message }, { status: 500 })
  }

  const { error: promoErr } = await supabaseAdmin.from('tool_credit_promo_grants').upsert(
    {
      email,
      tool_slug: toolSlug,
      expires_at: expiresAt.toISOString(),
      early_adopter: true,
      note: 'Early access (demande landing)',
    },
    { onConflict: 'email,tool_slug' }
  )
  if (promoErr) {
    console.error('[approve promo]', promoErr)
    return NextResponse.json({ error: promoErr.message }, { status: 500 })
  }

  const { error: updErr } = await supabaseAdmin
    .from('tool_early_access_requests')
    .update({
      status: 'approved',
      processed_at: new Date().toISOString(),
      processed_by: session.user.email ?? null,
    })
    .eq('id', id)
    .eq('status', 'pending')

  if (updErr) {
    console.error('[approve update]', updErr)
    return NextResponse.json({ error: updErr.message }, { status: 500 })
  }

  void sendEarlyAdopterApprovedEmail({
    to: email,
    toolLabelFr: flag.label_fr || toolSlug,
    toolPath: flag.tool_path || '/',
    expiresAtISO: expiresAt.toISOString(),
  })

  return NextResponse.json({ ok: true })
}
