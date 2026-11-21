import type { Metadata } from 'next'
import Link from 'next/link'
import { SalimLinkVisit } from '@/components/salim/salim-link-visit'
import { SALIM_EXCERPT, SALIM_PRICE_LABEL, SALIM_PURCHASE_PATH } from '@/lib/salim/fiche'
import '../salim.css'

export const metadata: Metadata = {
  title: 'Extrait · Le Système S.A.L.I.M.',
  description: 'Extrait du livre Le Système S.A.L.I.M., Salim Gomri.',
  robots: { index: true, follow: true },
}

export default function SalimExtraitPage() {
  return (
    <main className="salim-page min-h-screen bg-white text-aigile-navy">
      <SalimLinkVisit link="extrait" />
      <article className="excerpt-article">
        <p className="excerpt-kicker">Extrait</p>
        <h1 className="text-3xl font-bold mb-8">Le Système S.A.L.I.M.</h1>
        {SALIM_EXCERPT.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="text-sm text-aigile-navy/70">Salim Gomri</p>
        <p className="salim-two-links">
          <Link href={SALIM_PURCHASE_PATH}>Acheter le livre · {SALIM_PRICE_LABEL}</Link>
          <Link href="/salim">Retour à la fiche</Link>
        </p>
      </article>
    </main>
  )
}
