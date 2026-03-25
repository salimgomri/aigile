'use client'

import { useState } from 'react'
import { Sparkles, Lock } from 'lucide-react'

type ScoringCompletionGateProps = {
  devLocalhost: boolean
  isLoggedIn: boolean
  isCalculating: boolean
  errorMessage: string | null
  creditCost: number
  onFinalize: () => void
  onPersistPendingAndGoLogin: () => void
  onPersistPendingAndGoRegister: () => void
}

/**
 * Inspiré du flux Rétro IA (résultat verrouillé) : teasing + friction avant connexion / crédits.
 */
export function ScoringCompletionGate({
  devLocalhost,
  isLoggedIn,
  isCalculating,
  errorMessage,
  creditCost,
  onFinalize,
  onPersistPendingAndGoLogin,
  onPersistPendingAndGoRegister,
}: ScoringCompletionGateProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (devLocalhost) {
    return (
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200/90">
          <span className="font-semibold text-emerald-100">Mode localhost</span> — rapport simulé, sans
          connexion ni crédits (URL <code className="text-xs opacity-90">localhost</code> ou{' '}
          <code className="text-xs opacity-90">127.0.0.1</code> uniquement).
        </div>
        {errorMessage && (
          <p className="text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        )}
        <button
          type="button"
          disabled={isCalculating}
          onClick={() => void onFinalize()}
          className="min-h-[48px] w-full sm:w-auto px-10 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg disabled:opacity-50"
        >
          {isCalculating ? 'Génération…' : 'Voir le rapport (simulation locale)'}
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="pt-6 border-t border-white/10 space-y-6">
        <div
          role={isLoggedIn ? undefined : 'button'}
          tabIndex={isLoggedIn ? undefined : 0}
          onClick={isLoggedIn ? undefined : () => setShowAuthModal(true)}
          onKeyDown={isLoggedIn ? undefined : (e) => e.key === 'Enter' && setShowAuthModal(true)}
          className={`relative rounded-[2rem] border p-6 md:p-10 bg-gradient-to-br from-white/[0.04] via-transparent to-black/40 backdrop-blur-xl shadow-2xl transition-all ${
            isLoggedIn ? 'border-white/15' : 'border-white/15 hover:border-orange-500/40 cursor-pointer'
          }`}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/40">
              <Lock className="w-8 h-8 text-white" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-400/90 font-semibold mb-2">
                Analyse prête
              </p>
              <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                Votre profil de maturité est calculé
              </h3>
              <p className="text-white/55 text-sm mt-2">
                Il ne manque qu&apos;une étape pour voir le détail — pas un résumé public ici.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {['Score global', 'Radar 9D', 'Rapport IA'].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/30 px-3 py-4 text-center"
              >
                <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2">{label}</div>
                <div className="text-2xl font-bold text-white/90 blur-sm select-none" aria-hidden>
                  ??.?
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Les réponses sont enregistrées côté navigateur jusqu&apos;à la génération. Pour débloquer le
            rapport complet, le radar par dimension et les recommandations, il faut un compte et{' '}
            <span className="text-orange-400 font-medium">{creditCost} crédits</span> (débités une seule fois à
            la génération).
          </p>

          {errorMessage && (
            <p className="text-sm text-red-400 mb-4" role="alert">
              {errorMessage}
            </p>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              disabled={isCalculating}
              onClick={(e) => {
                e.stopPropagation()
                void onFinalize()
              }}
              className="min-h-[52px] w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {isCalculating ? 'Génération du rapport…' : `Débloquer le rapport (${creditCost} crédits)`}
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowAuthModal(true)
              }}
              className="w-full py-4 rounded-xl border-2 border-orange-500/50 text-orange-300 font-medium hover:bg-orange-500/10 transition-colors flex items-center justify-center gap-2 animate-pulse"
            >
              <span>Débloquer — connexion requise</span>
              <span className="text-xl" aria-hidden>
                →
              </span>
            </button>
          )}
        </div>
      </div>

      {showAuthModal && !isLoggedIn && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-[#0f2240] border border-orange-500/35 rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-2 text-center">Accéder au rapport</h3>
              <p className="text-white/70 text-center mb-6 text-sm leading-relaxed">
                Vous y êtes presque. Créez un compte ou connectez-vous — ensuite, un clic génère le rapport
                ({creditCost} crédits).
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    onPersistPendingAndGoRegister()
                    setShowAuthModal(false)
                  }}
                  className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Créer un compte (rapide)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPersistPendingAndGoLogin()
                    setShowAuthModal(false)
                  }}
                  className="w-full py-3 rounded-xl font-semibold border-2 border-white/25 text-white hover:bg-white/10 transition-colors"
                >
                  J&apos;ai déjà un compte
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full mt-4 py-2 text-sm text-white/45 hover:text-white/70 transition-colors"
              >
                Pas maintenant
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
