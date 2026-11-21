import type { Metadata } from 'next'
import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { FormationRequestForm } from '@/components/formations/FormationRequestForm'
import { Price } from '@/components/ui/Price'
import { VAT_MENTION, areFormationsPublished } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Formations intra | AIgile',
  description: 'Formations intra Agile + IA — à partir de 2 000 € HT pour 8 personnes.',
  robots: { index: false, follow: false },
}

export default function FormationsPage() {
  const published = areFormationsPublished()

  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy">
      <PremiumNavbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {!published ? (
            <p className="mb-6 text-sm rounded-lg bg-amber-100 px-3 py-2">
              Pages en relecture — non indexées tant que <code>FORMATIONS_PUBLISHED</code> n&apos;est
              pas à <code>true</code>.
            </p>
          ) : null}
          <h1 className="text-4xl font-bold mb-4">Formations intra</h1>
          <p className="text-gray-700 mb-4">
            À partir de <Price amount="2 000 €" audience="b2b" hideVat /> pour 8 personnes.{' '}
            {VAT_MENTION}.
          </p>
          <p className="italic mb-8">Le livre expose le système. La formation vous apprend à l&apos;utiliser.</p>
          <div className="grid gap-5 md:grid-cols-2 mb-12">
            <article className="rounded-2xl bg-white border border-black/10 p-6">
              <h2 className="text-xl font-bold">Agile + IA : démarrer</h2>
              <p className="text-sm text-gray-700 mt-2">1 jour. Démarrer une équipe avec l&apos;IA, sans lui laisser la décision.</p>
              <Link href="/formations/agile-ia-demarrer" className="inline-block mt-4 underline font-semibold">
                Voir la fiche A
              </Link>
            </article>
            <article className="rounded-2xl bg-white border border-black/10 p-6">
              <h2 className="text-xl font-bold">Livraison fiable avec l&apos;IA</h2>
              <p className="text-sm text-gray-700 mt-2">2 jours intra. DoR/DoD, rétro, scoring, sur votre réel.</p>
              <Link href="/formations/livraison-fiable-ia" className="inline-block mt-4 underline font-semibold">
                Voir la fiche B
              </Link>
            </article>
          </div>
          <div className="rounded-2xl bg-white border border-black/10 p-6">
            <h2 className="text-xl font-bold mb-4">Demander un programme</h2>
            <FormationRequestForm />
          </div>
        </div>
      </div>
      <PremiumFooter />
    </main>
  )
}
