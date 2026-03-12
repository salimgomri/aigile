'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import type { Product } from '@/lib/payments/catalog'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [creditsProduct, setCreditsProduct] = useState<Product | null>(null)
  const [dayPassProduct, setDayPassProduct] = useState<Product | null>(null)
  const [proMonthlyProduct, setProMonthlyProduct] = useState<Product | null>(null)
  const [proAnnualProduct, setProAnnualProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch('/api/products/upgrade')
      .then((r) => r.ok ? r.json() : null)
      .then((d: { credits_10?: Product; day_pass?: Product; pro_monthly?: Product; pro_annual?: Product } | null) => {
        if (!d) return
        setCreditsProduct(d.credits_10 ?? null)
        setDayPassProduct(d.day_pass ?? null)
        setProMonthlyProduct(d.pro_monthly ?? null)
        setProAnnualProduct(d.pro_annual ?? null)
      })
      .catch(() => {})
  }, [])

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
              {creditsProduct && (
                <div className="rounded-xl border-2 border-[#c9973a] bg-[#c9973a]/10 p-4 relative">
                  <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#c9973a] text-black text-xs font-semibold rounded">
                    Crédits
                  </span>
                  <h3 className="font-semibold text-white mb-1">Pack 10 crédits</h3>
                  <p className="text-2xl font-bold text-[#c9973a]">{formatPrice(creditsProduct.amount)}</p>
                  <p className="text-sm text-white/70 mb-3">achat unique</p>
                  <ul className="text-sm text-white/80 space-y-1 mb-4">
                    <li>• +10 crédits immédiatement</li>
                    <li>• Pas d&apos;abonnement</li>
                  </ul>
                  <CheckoutSheet
                    product={creditsProduct}
                    trigger={
                      <button className="w-full py-2.5 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full flex items-center justify-center gap-2">
                        Acheter
                      </button>
                    }
                  />
                </div>
              )}

              {dayPassProduct && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white mb-1">Day Pass</h3>
                  <p className="text-2xl font-bold text-[#c9973a]">{formatPrice(dayPassProduct.amount)}</p>
                  <p className="text-sm text-white/70 mb-3">aujourd&apos;hui</p>
                  <ul className="text-sm text-white/80 space-y-1 mb-4">
                    <li>• Accès 24h</li>
                    <li>• Crédits ∞</li>
                  </ul>
                  <CheckoutSheet
                    product={dayPassProduct}
                    trigger={
                      <button className="w-full py-2 border border-white/20 text-white rounded-full text-sm hover:bg-white/10 flex items-center justify-center gap-2">
                        Essayer
                      </button>
                    }
                  />
                </div>
              )}

              {proMonthlyProduct && (
                <div className="rounded-xl border-2 border-[#c9973a] bg-[#c9973a]/10 p-4 relative">
                  <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#c9973a] text-black text-xs font-semibold rounded">
                    Recommandé
                  </span>
                  <h3 className="font-semibold text-white mb-1">★ Pro Mensuel</h3>
                  <p className="text-2xl font-bold text-[#c9973a]">{formatPrice(proMonthlyProduct.amount)}<span className="text-sm font-normal text-white/70">/mois</span></p>
                  <ul className="text-sm text-white/80 space-y-1 mb-4">
                    <li>• Crédits ∞</li>
                    <li>• Tous les outils</li>
                    <li>• Équipe illimitée</li>
                    <li>• Export PDF ∞</li>
                  </ul>
                  <CheckoutSheet
                    product={proMonthlyProduct}
                    trigger={
                      <button className="w-full py-2.5 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full flex items-center justify-center gap-2">
                        Commencer Pro
                      </button>
                    }
                  />
                </div>
              )}

              {proAnnualProduct && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white mb-1">Pro Annuel</h3>
                  <p className="text-2xl font-bold text-[#c9973a]">{formatPrice(proAnnualProduct.amount)}<span className="text-sm font-normal text-white/70">/an</span></p>
                  <p className="text-xs text-white/60 mb-3">= 16,66€/mois · Éco 40€</p>
                  <ul className="text-sm text-white/80 space-y-1 mb-4">
                    <li>• Tout Pro Mensuel</li>
                    <li>• 2 mois offerts</li>
                  </ul>
                  <CheckoutSheet
                    product={proAnnualProduct}
                    trigger={
                      <button className="w-full py-2 border border-white/20 text-white rounded-full text-sm hover:bg-white/10 flex items-center justify-center gap-2">
                        Choisir
                      </button>
                    }
                  />
                </div>
              )}
            </div>

            <p className="text-sm text-white/60">
              ✦ Inclus dans Pro : Rétro IA · DORA · OKR · Dashboard · Skill Matrix · 25 Prompts · Équipe illimitée
            </p>
            <Link
              href="/#pricing"
              onClick={onClose}
              className="block text-center text-sm text-[#c9973a] hover:underline mt-4"
            >
              Voir tous les détails de nos offres →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
