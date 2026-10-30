import type { Metadata } from 'next'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { LegalMarkdown, readRefonteMarkdown } from '@/components/legal/LegalMarkdown'
import { LEGAL, VAT_FRANCHISE_TODO, VAT_MENTION } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Mentions légales | AIgile',
  description: 'Mentions légales du site aigile.lu — Salim GOMRI EI (GO-COACH).',
}

export default function MentionsLegalesPage() {
  const source = readRefonteMarkdown('mentions-legales.md')

  return (
    <main className="min-h-screen bg-white text-aigile-navy">
      <PremiumNavbar />
      <article className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <LegalMarkdown source={source} />
          <p className="mt-8 text-sm text-gray-600">
            Identité : {LEGAL.legalName} · SIREN {LEGAL.siren} · SIRET {LEGAL.siret} · {VAT_MENTION}{' '}
            <mark className="todo-mark">{VAT_FRANCHISE_TODO}</mark>
          </p>
          <p className="mt-4 text-sm">
            Hébergeur détecté dans le dépôt (à confirmer) :{' '}
            <mark className="todo-mark">{LEGAL.hosterDetected}</mark>
          </p>
        </div>
      </article>
      <PremiumFooter />
    </main>
  )
}
