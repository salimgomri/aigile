import type { Metadata } from 'next'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { LegalMarkdown, readRefonteMarkdown } from '@/components/legal/LegalMarkdown'
import { FormationRequestForm } from '@/components/formations/FormationRequestForm'
import { areFormationsPublished } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Formation B — Livraison fiable avec l’IA | AIgile',
  robots: { index: false, follow: false },
}

export default function FormationBPage() {
  const source = readRefonteMarkdown('formations/fiche-formation-B.md')
  return (
    <main className="min-h-screen bg-white text-aigile-navy">
      <PremiumNavbar />
      <article className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {!areFormationsPublished() ? (
            <p className="mb-6 text-sm rounded-lg bg-amber-100 px-3 py-2">Page en relecture (noindex).</p>
          ) : null}
          <LegalMarkdown source={source} />
          <div className="mt-12 rounded-2xl border border-black/10 p-6 bg-[#f3ede7]">
            <h2 className="text-xl font-bold mb-4">Demander un devis</h2>
            <FormationRequestForm defaultFormation="livraison-fiable-ia" />
          </div>
        </div>
      </article>
      <PremiumFooter />
    </main>
  )
}
