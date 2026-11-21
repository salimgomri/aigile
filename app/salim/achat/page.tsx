import type { Metadata } from 'next'
import Link from 'next/link'
import { SalimPurchase } from '@/components/salim/salim-purchase'
import { SalimLinkVisit } from '@/components/salim/salim-link-visit'
import { getProduct } from '@/lib/payments/catalog'
import { SALIM_EDITION_ID, SALIM_EDITION_LABEL, SALIM_EXCERPT_PATH, SALIM_PRICE_LABEL, SALIM_SUBTITLE } from '@/lib/salim/fiche'
import '../salim.css'

export const metadata: Metadata = {
  title: 'Acheter le livre · Le Système S.A.L.I.M.',
  description: `${SALIM_EDITION_LABEL}. ${SALIM_PRICE_LABEL}, port compris.`,
}

export default function SalimAchatPage() {
  const book = getProduct(SALIM_EDITION_ID)

  return (
    <main className="salim-page min-h-screen bg-white text-aigile-navy">
      <SalimLinkVisit link="achat" />
      <article className="excerpt-article">
        <p className="excerpt-kicker">Achat</p>
        <h1 className="text-3xl font-bold mb-4">{SALIM_EDITION_LABEL}</h1>
        <p className="text-4xl font-bold mb-2">{SALIM_PRICE_LABEL}</p>
        <p className="mb-8">{SALIM_SUBTITLE}</p>
        <SalimPurchase book={book} />
        <p className="salim-two-links">
          <Link href={SALIM_EXCERPT_PATH}>Lire l’extrait</Link>
          <Link href="/salim">Retour à la fiche</Link>
        </p>
      </article>
    </main>
  )
}
