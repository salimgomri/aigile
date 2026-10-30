import type { Metadata } from 'next'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { LegalMarkdown, readRefonteMarkdown } from '@/components/legal/LegalMarkdown'
import { VAT_FRANCHISE_TODO, VAT_MENTION } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Conditions générales de vente | AIgile',
  description: 'CGV produits numériques et formations / prestations — AIgile.lu',
}

export default function CgvPage() {
  const produits = readRefonteMarkdown('cgv-produits-numeriques.md')
  const formations = readRefonteMarkdown('cgv-formations-prestations.md')

  return (
    <main className="min-h-screen bg-white text-aigile-navy">
      <PremiumNavbar />
      <article className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Conditions générales de vente</h1>
          <p className="text-sm text-gray-600 mb-10">
            {VAT_MENTION} <mark className="todo-mark">{VAT_FRANCHISE_TODO}</mark>
          </p>
          <nav className="mb-10 text-sm">
            <a href="#produits-numeriques" className="underline mr-4">
              Produits numériques
            </a>
            <a href="#formations-prestations" className="underline">
              Formations et prestations
            </a>
          </nav>
          <section id="produits-numeriques">
            <LegalMarkdown source={produits} />
          </section>
          <section id="formations-prestations" className="mt-16">
            <LegalMarkdown source={formations} />
          </section>
        </div>
      </article>
      <PremiumFooter />
    </main>
  )
}
