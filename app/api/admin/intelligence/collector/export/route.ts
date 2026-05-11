import { NextResponse } from 'next/server'

import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'
import { postCollectorExportWebhook } from '@/lib/intelligence/collector-export-server'

type Body = {
  doctrine?: string
  /** Texte « Copier pour GPT » */
  smartCopy?: string
  lang?: 'fr' | 'en'
}

export async function POST(req: Request) {
  const session = await requireAdminApiSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const lang = body.lang === 'en' ? 'en' : 'fr'
  const doctrine = typeof body.doctrine === 'string' ? body.doctrine.trim() : ''
  const smartCopy = typeof body.smartCopy === 'string' ? body.smartCopy.trim() : ''

  if (!doctrine && !smartCopy) {
    return NextResponse.json({ error: 'doctrine ou smartCopy requis' }, { status: 400 })
  }

  const payload = {
    doctrine: doctrine || '(voir corps)',
    body: smartCopy || doctrine,
    lang: lang as 'fr' | 'en',
  }

  try {
    const { ok, errors } = await postCollectorExportWebhook(payload)
    if (!ok) {
      return NextResponse.json({ ok: false, errors }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[collector/export]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
