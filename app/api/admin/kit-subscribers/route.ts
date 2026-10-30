import { NextResponse } from 'next/server'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'
import { supabaseAdmin } from '@/lib/supabase'
import { csvResponse, formatParisDate, toCsv } from '@/lib/leads/csv'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await requireAdminApiSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const url = new URL(request.url)
  const q = url.searchParams.get('q')?.trim()
  const format = url.searchParams.get('format')
  const activeOnly = url.searchParams.get('active') === '1'

  let query = supabaseAdmin.from('kit_subscribers').select('*').order('created_at', { ascending: false })
  if (q) query = query.ilike('email', `%${q}%`)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? []).filter((s) => (activeOnly ? !s.unsubscribed_at : true))

  if (format === 'csv') {
    const exportRows = url.searchParams.get('actifs') === '1' ? rows.filter((s) => !s.unsubscribed_at) : rows
    const headers = ['Date', 'Prénom', 'Email', 'Consentement kit', 'Date kit', 'Newsletter', 'Date news', 'Source', 'Désinscrit']
    const csvRows = exportRows.map((s) => [
      formatParisDate(s.created_at),
      s.first_name,
      s.email,
      s.consent_kit ? 'oui' : 'non',
      formatParisDate(s.consent_kit_at),
      s.consent_news ? 'oui' : 'non',
      formatParisDate(s.consent_news_at),
      s.source,
      s.unsubscribed_at ? formatParisDate(s.unsubscribed_at) : '',
    ])
    return csvResponse('kit-inscrits.csv', toCsv(headers, csvRows))
  }

  return NextResponse.json(
    { subscribers: rows },
    { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  )
}
