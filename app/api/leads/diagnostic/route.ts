import { NextResponse } from 'next/server'
import { insertLead } from '@/lib/leads/create-lead'
import { checkRateLimit, getClientIp } from '@/lib/leads/rate-limit'
import { isValidEmail, pickUtm } from '@/lib/leads/utm'

export const dynamic = 'force-dynamic'

const CONSENT_TEXT =
  "J'accepte que mes données soient utilisées pour me recontacter au sujet de ce diagnostic flash."

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  if (body.website) return NextResponse.json({ ok: true })

  const ip = getClientIp(request)
  if (!(await checkRateLimit(ip, 'diagnostic'))) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 })
  }

  const email = String(body.email ?? '')
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'E-mail invalide' }, { status: 400 })
  }
  if (!body.consent) {
    return NextResponse.json({ error: 'Le consentement est obligatoire' }, { status: 400 })
  }

  try {
    await insertLead({
      type: 'diagnostic',
      name: String(body.name ?? ''),
      email,
      company: String(body.company ?? ''),
      role: String(body.role ?? ''),
      motif: String(body.motif ?? 'diagnostic'),
      message: String(body.message ?? ''),
      source: String(body.source ?? 'diagnostic'),
      utm: pickUtm(body),
      from_param: body.from ? String(body.from) : undefined,
      consent_text: CONSENT_TEXT,
    })
  } catch (err) {
    console.error('[leads/diagnostic]', err)
    return NextResponse.json({ error: "L'envoi n'a pas fonctionné." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
