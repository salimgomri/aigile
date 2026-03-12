import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const updates: Record<string, unknown> = {}
  if (body.status !== undefined) updates.status = body.status
  if (body.tracking_number !== undefined) updates.tracking_number = body.tracking_number
  if (body.fulfillment_ref !== undefined) updates.fulfillment_ref = body.fulfillment_ref
  if (body.notes !== undefined) updates.notes = body.notes
  if (body.shipped_at !== undefined) updates.shipped_at = body.shipped_at

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Aucune modification' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[API] admin order update error:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }

  return NextResponse.json(data)
}
