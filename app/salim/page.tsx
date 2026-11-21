import type { Metadata } from 'next'
import { AnimateIn, DrawLine } from '@/components/salim/animate-in'
import { SalimAuthor } from '@/components/salim/salim-author'
import { SalimBusinessOutcomes } from '@/components/salim/salim-business-outcomes'
import { SalimHero } from '@/components/salim/salim-hero'
import { SalimOffers } from '@/components/salim/salim-offers'
import { SalimPageAnalytics } from '@/components/salim/salim-page-analytics'
import { SalimPersonas } from '@/components/salim/salim-personas'
import { SalimProof } from '@/components/salim/salim-proof'
import { SalimStickyMobileCta } from '@/components/salim/salim-sticky-mobile-cta'
import { salimYearsTerrainFr } from '@/lib/salim-experience'
import { SALIM_PRICE_LABEL } from '@/lib/salim/fiche'
import './salim.css'

export const metadata: Metadata = {
  title: 'Le Système S.A.L.I.M., Salim Gomri',
  description: `${salimYearsTerrainFr()} Scrum et IA. Un système pour rendre visible ce que la vélocité cache. Livre disponible sur aigile.lu.`,
  openGraph: {
    title: 'Le Système S.A.L.I.M.',
    description: 'On mesure la vélocité. Jamais la solidité.',
    url: 'https://aigile.lu/salim',
  },
}

export default function SalimLandingPage() {
  return (
    <main className="salim-page min-h-screen bg-white text-aigile-navy pb-20 md:pb-0">
      <SalimPageAnalytics />
      <SalimHero />

      <AnimateIn as="section" className="pain-section">
        <p>Tu livres. Le client n&apos;est pas satisfait. Et personne dans la salle ne sait vraiment pourquoi.</p>
        <p>Ce n&apos;est pas un problème de méthode. C&apos;est un problème de lecture.</p>
        <p className="key-phrase">Le Système S.A.L.I.M. rend visible ce que la vélocité cache.</p>
      </AnimateIn>

      <div className="px-6 lg:px-10">
        <DrawLine />
      </div>

      <SalimProof />

      <div className="px-6 lg:px-10">
        <DrawLine />
      </div>

      <SalimPersonas />

      <SalimAuthor />

      <SalimBusinessOutcomes />

      <SalimOffers />

      <section className="delivery-section">
        <div className="delivery-inner">
          <h2>Livraison</h2>
          <p>Le prix affiché, {SALIM_PRICE_LABEL}, est le total livré : le livre et le port.</p>
        </div>
      </section>

      <SalimStickyMobileCta />
    </main>
  )
}
