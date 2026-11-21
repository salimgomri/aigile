import type { Metadata } from 'next'
import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { Price } from '@/components/ui/Price'
import { FormationCheckout } from '@/components/formations/FormationCheckout'
import { VAT_MENTION, areFormationsPublished } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Inscription — Agile + IA : démarrer | AIgile',
  robots: { index: false, follow: false },
}

export default async function FormationInscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams

  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy">
      <PremiumNavbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {!areFormationsPublished() ? (
            <p className="mb-6 text-sm rounded-lg bg-amber-100 px-3 py-2">Page en relecture (noindex).</p>
          ) : null}
          <h1 className="text-4xl font-bold mb-4">Agile + IA : démarrer — session inter</h1>
          {sessionId ? (
            <div className="rounded-2xl bg-white border-2 border-aigile-gold p-8 text-center mb-8">
              <p className="text-2xl font-bold mb-2">Inscription confirmée</p>
              <p className="text-gray-700">
                Le paiement Stripe est enregistré. Votre reçu arrive par e-mail. Conservez cet
                identifiant de session : <code className="text-xs break-all">{sessionId}</code>
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-6">
                Une journée à distance pour comprendre l&apos;agilité et utiliser l&apos;IA sans lui
                laisser la décision. Salim GOMRI EI (GO-COACH).
              </p>
              <div className="rounded-2xl bg-white border-2 border-aigile-gold p-8 text-center mb-8">
                <p className="text-sm uppercase tracking-wide text-gray-500">Prix public par place</p>
                <p className="text-4xl font-extrabold my-2">
                  <Price amount="290 €" audience="b2c" />
                </p>
                <p className="text-xs">{VAT_MENTION}</p>
                <FormationCheckout />
              </div>
            </>
          )}
          <p className="text-sm text-gray-700">
            Paiement par carte via Stripe Checkout (même flux que le livre). Case de demande
            expresse d&apos;exécution avant la fin du délai de rétractation : obligatoire, non
            précochée.
          </p>
          <p className="mt-6 text-sm">
            Entreprise, équipe d&apos;environ 8 personnes :{' '}
            <Link href="/formations" className="underline">
              demander un programme intra
            </Link>
            .
          </p>
        </div>
      </div>
      <PremiumFooter />
    </main>
  )
}
