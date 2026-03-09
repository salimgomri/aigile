'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { CheckoutProduct } from '@/app/api/checkout/create-session/route'

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState<CheckoutProduct | null>(null)

  const handleCheckout = async (product: CheckoutProduct) => {
    setLoading(product)
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setLoading(null)
      }
    } catch {
      setLoading(null)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div className="bg-[#0f2240] border border-[#c9973a]/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">✦ Plus de crédits ce mois</h2>
            <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-white/80">Tu as utilisé tes 10 crédits Free. Reset automatique le 1er du mois.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border-2 border-[#c9973a] bg-[#c9973a]/10 p-4 relative">
                <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#c9973a] text-black text-xs font-semibold rounded">
                  Crédits
                </span>
                <h3 className="font-semibold text-white mb-1">Pack 10 crédits</h3>
                <p className="text-2xl font-bold text-[#c9973a]">4,99€</p>
                <p className="text-sm text-white/70 mb-3">achat unique</p>
                <ul className="text-sm text-white/80 space-y-1 mb-4">
                  <li>• +10 crédits immédiatement</li>
                  <li>• Pas d&apos;abonnement</li>
                </ul>
                <button
                  onClick={() => handleCheckout('pack_credits')}
                  disabled={!!loading}
                  className="w-full py-2.5 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading === 'pack_credits' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Acheter
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white mb-1">Day Pass</h3>
                <p className="text-2xl font-bold text-[#c9973a]">9,99€</p>
                <p className="text-sm text-white/70 mb-3">aujourd&apos;hui</p>
                <ul className="text-sm text-white/80 space-y-1 mb-4">
                  <li>• Accès 24h</li>
                  <li>• Crédits ∞</li>
                </ul>
                <button
                  onClick={() => handleCheckout('day_pass')}
                  disabled={!!loading}
                  className="w-full py-2 border border-white/20 text-white rounded-full text-sm hover:bg-white/10 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading === 'day_pass' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Essayer
                </button>
              </div>

              <div className="rounded-xl border-2 border-[#c9973a] bg-[#c9973a]/10 p-4 relative">
                <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#c9973a] text-black text-xs font-semibold rounded">
                  Recommandé
                </span>
                <h3 className="font-semibold text-white mb-1">★ Pro Mensuel</h3>
                <p className="text-2xl font-bold text-[#c9973a]">19,99€<span className="text-sm font-normal text-white/70">/mois</span></p>
                <ul className="text-sm text-white/80 space-y-1 mb-4">
                  <li>• Crédits ∞</li>
                  <li>• Tous les outils</li>
                  <li>• Équipe illimitée</li>
                  <li>• Export PDF ∞</li>
                </ul>
                <button
                  onClick={() => handleCheckout('pro_monthly')}
                  disabled={!!loading}
                  className="w-full py-2.5 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading === 'pro_monthly' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Commencer Pro
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white mb-1">Pro Annuel</h3>
                <p className="text-2xl font-bold text-[#c9973a]">199,99€<span className="text-sm font-normal text-white/70">/an</span></p>
                <p className="text-xs text-white/60 mb-3">= 16,66€/mois · Éco 40€</p>
                <ul className="text-sm text-white/80 space-y-1 mb-4">
                  <li>• Tout Pro Mensuel</li>
                  <li>• 2 mois offerts</li>
                </ul>
                <button
                  onClick={() => handleCheckout('pro_annual')}
                  disabled={!!loading}
                  className="w-full py-2 border border-white/20 text-white rounded-full text-sm hover:bg-white/10 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading === 'pro_annual' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Choisir
                </button>
              </div>
            </div>

            <p className="text-sm text-white/60">
              ✦ Inclus dans Pro : Rétro IA · DORA · OKR · Dashboard · Skill Matrix · 25 Prompts · Équipe illimitée
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
