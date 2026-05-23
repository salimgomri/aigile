import type { Metadata } from 'next'
import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Questionnaire Edmondson | AIgile',
  description: 'Psychological Safety — questionnaire Amy Edmondson (à venir).',
}

export default function EdmondsonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PremiumNavbar />

      <header className="bg-[#0f2240] px-4 pb-10 pt-24 text-white sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/dashboard/westrum"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-[#c9973a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Westrum
          </Link>
          <h1 className="text-2xl font-bold sm:text-3xl">Questionnaire Edmondson</h1>
          <p className="mt-3 text-sm text-white/80">
            Mesure de la sécurité psychologique (Amy Edmondson) — bientôt disponible sur AIgile.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-gray-600 shadow-sm">
          Fonctionnalité à venir. En attendant, passe le{' '}
          <Link href="/dashboard/westrum" className="font-semibold text-[#138eec] hover:underline">
            Westrum Culture Survey
          </Link>
          .
        </p>
      </div>

      <PremiumFooter />
    </div>
  )
}
