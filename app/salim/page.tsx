import type { Metadata } from 'next'
import { AnimateIn, DrawLine } from '@/components/salim/animate-in'
import { SalimAuthor } from '@/components/salim/salim-author'
import { SalimBusinessOutcomes } from '@/components/salim/salim-business-outcomes'
import { SalimHero } from '@/components/salim/salim-hero'
import { SalimOffers } from '@/components/salim/salim-offers'
import { SalimPageAnalytics } from '@/components/salim/salim-page-analytics'
import { SalimPersonas } from '@/components/salim/salim-personas'
import { SalimProof } from '@/components/salim/salim-proof'
import { SalimSocialProof } from '@/components/salim/salim-social-proof'
import { SalimStickyMobileCta } from '@/components/salim/salim-sticky-mobile-cta'
import { SalimContactLinks } from '@/components/salim/salim-contact-links'
import { getCurrentBookProduct, getProduct } from '@/lib/payments/catalog'
import './salim.css'

export const metadata: Metadata = {
  title: 'Le Système S.A.L.I.M., Salim Gomri',
  description:
    '22 ans de terrain Scrum et IA. Un système pour rendre visible ce que la vélocité cache. Livre disponible sur aigile.lu.',
  openGraph: {
    title: 'Le Système S.A.L.I.M.',
    description: 'On mesure la vélocité. Jamais la solidité.',
    url: 'https://aigile.lu/salim',
  },
}

export default function SalimLandingPage() {
  const bookProduct = getCurrentBookProduct()
  const fichesProduct = getProduct('fiches_salim')
  const bundleProduct = getProduct('bundle_salim')

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

      <SalimSocialProof />

      <SalimBusinessOutcomes />

      <SalimOffers book={bookProduct} fiches={fichesProduct} bundle={bundleProduct} />

      <section className="delivery-section">
        <div className="delivery-inner">
          <h2>Livraison</h2>
          <div className="delivery-grid">
            <div>
              <h3>Envoi postal</h3>
              <p>
                Livraison à domicile. Frais de port calculés au checkout selon ta zone géographique.
              </p>
            </div>
            <div>
              <h3>Retrait gratuit</h3>
              <p>
                Tu passes récupérer ton livre directement. Gratuit. Contacte-moi après commande pour convenir du
                lieu et du moment. <SalimContactLinks className="text-aigile-blue" />
              </p>
            </div>
          </div>
        </div>
      </section>

      <SalimStickyMobileCta bundle={bundleProduct} />
    </main>
  )
}
