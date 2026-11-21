import type { Metadata } from 'next'
import { Suspense } from 'react'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { DiagnosticForm } from '@/components/diagnostic/DiagnosticForm'
import { PROBLEM_SIGNALS } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Diagnostic flash 30 min | AIgile',
  description:
    'Diagnostic flash gratuit de 30 minutes : une photo nette des signaux de livraison, 2 à 3 priorités.',
}

export default function DiagnosticPage() {
  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy">
      <PremiumNavbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-book-orange mb-3">
              Gratuit · 30 min · visio
            </p>
            <h1 className="text-4xl font-bold mb-4">Diagnostic flash</h1>
            <p className="text-gray-700 mb-6">
              Une photo nette des signaux, 2 à 3 priorités. Compte rendu d&apos;une page sous 24 h.
              Le livre expose le système. Le coaching l&apos;installe.
            </p>
            <ul className="space-y-3">
              {PROBLEM_SIGNALS.map((s) => (
                <li key={s.title} className="rounded-xl bg-white border border-black/8 p-4">
                  <strong>{s.title}</strong>
                  <p className="text-sm text-gray-700 mt-1">{s.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white border border-black/10 p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Demander un créneau</h2>
            <Suspense fallback={<p>Chargement du formulaire…</p>}>
              <DiagnosticForm />
            </Suspense>
          </div>
        </div>
      </div>
      <PremiumFooter />
    </main>
  )
}
