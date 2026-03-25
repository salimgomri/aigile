import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'

type Body = {
  launch_at?: string
  teaser_fr?: string | null
  teaser_en?: string | null
  label_fr?: string
  label_en?: string
  tool_path?: string
  invite_only?: boolean
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { slug } = await context.params
  if (!slug || !/^[a-z0-9_]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {}
  if (body.launch_at !== undefined) {
    const d = new Date(body.launch_at)
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: 'launch_at invalide' }, { status: 400 })
    }
    patch.launch_at = d.toISOString()
  }
  if (body.teaser_fr !== undefined) patch.teaser_fr = body.teaser_fr
  if (body.teaser_en !== undefined) patch.teaser_en = body.teaser_en
  if (body.label_fr !== undefined) patch.label_fr = body.label_fr
  if (body.label_en !== undefined) patch.label_en = body.label_en
  if (body.tool_path !== undefined) patch.tool_path = body.tool_path
  if (body.invite_only !== undefined) patch.invite_only = Boolean(body.invite_only)

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('feature_flags')
    .update(patch)
    .eq('slug', slug)
    .select('*')
    .single()

  if (error) {
    console.error('[admin/feature-flags PATCH]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ flag: data })
}
