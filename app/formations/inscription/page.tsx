import type { Metadata } from 'next'
import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { Price } from '@/components/ui/Price'
import { DIGITAL_PRODUCTS, getPaymentLinkUrl } from '@/lib/products'
import { VAT_MENTION, areFormationsPublished } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Inscription — Agile + IA : démarrer | AIgile',
  robots: { index: false, follow: false },
}

export default function FormationInscriptionPage() {
  const product = DIGITAL_PRODUCTS.find((p) => p.slug === 'formation-a-place')!
  const stripeUrl = getPaymentLinkUrl(product)

  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy">
      <PremiumNavbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {!areFormationsPublished() ? (
            <p className="mb-6 text-sm rounded-lg bg-amber-100 px-3 py-2">Page en relecture (noindex).</p>
          ) : null}
          <h1 className="text-4xl font-bold mb-4">Agile + IA : démarrer — session inter</h1>
          <p className="text-gray-700 mb-6">
            Une journée à distance pour comprendre l&apos;agilité et utiliser l&apos;IA sans lui
            laisser la décision. Salim GOMRI EI (GO-COACH).
          </p>
          <div className="rounded-2xl bg-white border-2 border-aigile-gold p-8 text-center mb-8">
            <p className="text-sm uppercase tracking-wide text-gray-500">Prix public par place</p>
            <p className="text-4xl font-extrabold my-2">
              <Price amount="290 €" audience="b2c" />
            </p>
            <p className="text-xs">
              <mark className="todo-mark">[hypothèse à valider]</mark> · {VAT_MENTION}
            </p>
            {stripeUrl ? (
              <a
                href={stripeUrl}
                className="inline-flex mt-6 min-h-[48px] items-center rounded-full bg-aigile-gold px-6 py-3 font-semibold"
              >
                S&apos;inscrire et payer
              </a>
            ) : (
              <Link
                href="/kit"
                className="inline-flex mt-6 min-h-[48px] items-center rounded-full bg-aigile-gold px-6 py-3 font-semibold"
              >
                Être prévenu de la prochaine session
              </Link>
            )}
            <p className="mt-3 text-xs text-gray-600">
              Lien Stripe :{' '}
              {stripeUrl ? (
                'configuré'
              ) : (
                <mark className="todo-mark">[LIEN STRIPE]</mark>
              )}
            </p>
          </div>
          <p className="text-sm text-gray-700">
            Case de demande expresse d&apos;exécution avant la fin du délai de rétractation à prévoir
            côté Stripe (voir CGV partie B).
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
