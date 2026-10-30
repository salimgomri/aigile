import { NextResponse } from 'next/server'
import { subscribeKit } from '@/lib/leads/kit-handler'
import { checkRateLimit, getClientIp } from '@/lib/leads/rate-limit'
import { pickUtm } from '@/lib/leads/utm'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const ip = getClientIp(request)
  const allowed = await checkRateLimit(ip, 'kit')
  if (!allowed) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 })
  }

  const result = await subscribeKit({
    email: String(body.email ?? ''),
    firstName: body.prenom ? String(body.prenom) : undefined,
    consentKit: Boolean(body.consent_kit),
    consentNews: Boolean(body.consent_news),
    honeypot: body.website ? String(body.website) : '',
    source: body.source ? String(body.source) : 'kit',
    utm: pickUtm(body),
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json({ ok: true, skipped: result.skipped ?? false })
}
