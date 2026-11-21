import { NextResponse } from 'next/server'
import { isSalimLinkSlug } from '@/lib/salim/fiche'
import { recordSalimLinkVisit } from '@/lib/salim/suivi'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps illisible' }, { status: 400 })
  }

  const link = typeof body === 'object' && body && 'link' in body ? String((body as { link: unknown }).link) : ''
  if (!isSalimLinkSlug(link)) {
    return NextResponse.json({ error: 'Lien inconnu' }, { status: 400 })
  }

  const result = await recordSalimLinkVisit(link)
  return NextResponse.json(result)
}
