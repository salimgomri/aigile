import 'server-only'

import { getClientSafeData, getQuestionBank } from '@/lib/scoring/rules-loader'
import { ScoringWizard } from '@/components/scoring/ScoringWizard'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'

export default async function ScoringDeliverablePage() {
  const { questions, model } = getClientSafeData({
    C2: 'a',
    C4: 'b',
    C5: 'c',
    C7: 'a',
  })
  const cadrageItems = getQuestionBank().cadrage

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-black">
      {/* Même atmosphère que /retro/result — exclu de l’export PDF (window.print) */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        data-no-print
        aria-hidden
      >
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent blur-3xl" />
        <div
          className="absolute bottom-1/4 right-1/4 h-[800px] w-[800px] animate-pulse rounded-full bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent blur-3xl"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div data-no-print>
        <PremiumNavbar />
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-6 pt-10 text-center md:px-8 md:pt-16"
        data-no-print
      >
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-orange-400">
          Évaluation livrable
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Scoring livraison
        </h1>
        <p className="mx-auto mb-3 max-w-2xl text-lg font-light text-white/60 md:text-xl">
          Mesurez la maturité de votre livraison logicielle sur neuf dimensions. Rapport détaillé et
          enregistrement après authentification.
        </p>
        <p className="mx-auto max-w-xl text-sm text-white/50">
          Vous pouvez parcourir le cadrage et le questionnaire sans compte. La connexion est requise
          uniquement pour générer le rapport ; les crédits sont débités à cette étape.
        </p>
      </div>

      <main className="relative z-10 pb-16">
        <ScoringWizard allQuestions={questions} scoringModel={model} cadrageItems={cadrageItems} />
      </main>

      <div data-no-print>
        <PremiumFooter />
      </div>
    </div>
  )
}
