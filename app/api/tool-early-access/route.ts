import { NextResponse } from 'next/server'
import { notifyEarlyAccessRequest } from '@/lib/callmebot'
import { supabaseAdmin } from '@/lib/supabase'

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

/** Demande publique early access (ex. Scoring livraison) — stockée pour validation admin */
export async function POST(request: Request) {
  let body: { email?: string; tool_slug?: string; message?: string | null }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const email = body.email?.trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'email invalide' }, { status: 400 })
  }

  const toolSlug = (body.tool_slug?.trim() || 'scoring_deliverable').replace(/[^a-z0-9_]/g, '')
  if (!toolSlug) {
    return NextResponse.json({ error: 'tool_slug invalide' }, { status: 400 })
  }

  const { data: flag } = await supabaseAdmin
    .from('feature_flags')
    .select('slug')
    .eq('slug', toolSlug)
    .maybeSingle()
  if (!flag) {
    return NextResponse.json({ error: 'Outil inconnu' }, { status: 400 })
  }

  const normalized = normEmail(email)
  const message = body.message?.trim()?.slice(0, 2000) || null

  const { data: lastRows } = await supabaseAdmin
    .from('tool_early_access_requests')
    .select('status')
    .eq('tool_slug', toolSlug)
    .eq('email', normalized)
    .order('created_at', { ascending: false })
    .limit(1)

  const last = lastRows?.[0]
  if (last?.status === 'pending') {
    return NextResponse.json({ ok: true, duplicate: true, message: 'Demande déjà enregistrée.' })
  }
  if (last?.status === 'approved') {
    return NextResponse.json({ ok: true, alreadyApproved: true, message: 'Vous avez déjà été accepté·e.' })
  }

  const { error } = await supabaseAdmin.from('tool_early_access_requests').insert({
    email: normalized,
    tool_slug: toolSlug,
    message,
    status: 'pending',
  })

  if (error) {
    console.error('[tool-early-access POST]', error)
    return NextResponse.json({ error: 'Enregistrement impossible' }, { status: 500 })
  }

  void notifyEarlyAccessRequest({
    email: normalized,
    toolSlug,
    message,
  }).then((r) => {
    if (!r.ok) console.warn('[callmebot early-access]', r.error)
  })

  return NextResponse.json({ ok: true })
}
