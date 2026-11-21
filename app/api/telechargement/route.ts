import { NextResponse } from 'next/server'
import { getStripeReadClient } from '@/lib/stripe-read'
import {
  assertSlugMatches,
  countDownloads,
  incrementDownloads,
  maxDownloads,
  paymentStatusPaid,
  productFromSession,
  readPrivatePdf,
} from '@/lib/downloads/secure-download'
import { getDigitalProduct } from '@/lib/products'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const sessionId = url.searchParams.get('session_id')
  const slug = url.searchParams.get('produit')

  if (!sessionId || !slug) {
    return NextResponse.json({ error: 'Lien invalide' }, { status: 400 })
  }

  const product = getDigitalProduct(slug)
  if (!product?.fichierCle) {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 })
  }

  const stripe = getStripeReadClient()
  if (!stripe) {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 })
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })
  } catch {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 })
  }

  if (!paymentStatusPaid(session)) {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 })
  }

  const matched = productFromSession(session)
  if (!matched || !assertSlugMatches(matched, slug)) {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 })
  }

  const already = await countDownloads(sessionId, slug)
  if (already >= maxDownloads()) {
    return NextResponse.json({ error: 'Limite de téléchargement atteinte' }, { status: 429 })
  }

  const pdf = await readPrivatePdf(matched)
  if (!pdf) {
    return NextResponse.json({ error: 'Fichier temporairement indisponible' }, { status: 404 })
  }

  await incrementDownloads(sessionId, slug)

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${matched.nomFichier ?? 'document.pdf'}"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
    },
  })
}
