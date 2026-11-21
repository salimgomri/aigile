import { NextResponse } from 'next/server'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'
import { supabaseAdmin } from '@/lib/supabase'
import { csvResponse, formatParisDate, toCsv } from '@/lib/leads/csv'
import { LEAD_STATUSES, type LeadStatus } from '@/lib/leads/status'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await requireAdminApiSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const format = url.searchParams.get('format')

  let query = supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false })
  if (status && LEAD_STATUSES.includes(status as LeadStatus)) {
    query = query.eq('status', status)
  }
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (format === 'csv') {
    const headers = [
      'Date',
      'Type',
      'Nom',
      'Email',
      'Entreprise',
      'Rôle',
      'Motif',
      'Statut',
      'Relance',
      'Source',
      'Notes',
    ]
    const rows = (data ?? []).map((l) => [
      formatParisDate(l.created_at),
      l.type,
      l.name,
      l.email,
      l.company,
      l.role,
      l.motif,
      l.status,
      l.follow_up_at ? formatParisDate(l.follow_up_at) : '',
      l.from_param || l.source,
      l.notes,
    ])
    return csvResponse('leads.csv', toCsv(headers, rows))
  }

  return NextResponse.json(
    { leads: data ?? [] },
    { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  )
}

export async function PATCH(request: Request) {
  const session = await requireAdminApiSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof body.status === 'string' && LEAD_STATUSES.includes(body.status as LeadStatus)) {
    patch.status = body.status
  }
  if (typeof body.notes === 'string') patch.notes = body.notes
  if (body.follow_up_at === null || typeof body.follow_up_at === 'string') {
    patch.follow_up_at = body.follow_up_at || null
  }

  const { error } = await supabaseAdmin.from('leads').update(patch).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
