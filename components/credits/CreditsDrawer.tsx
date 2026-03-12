'use client'

import { useEffect, useState } from 'react'
import { useCredits } from '@/lib/credits/CreditContext'
import { CREDIT_ACTIONS } from '@/lib/credits/actions'
import { X, Zap } from 'lucide-react'
import Link from 'next/link'
import UpgradeModal from './UpgradeModal'

export default function CreditsDrawer(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props
  const { status } = useCredits()
  const [transactions, setTransactions] = useState<Array<{ action: string; label: string; created_at: string }>>([])
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    if (!open) return
    fetch('/api/credits/transactions?limit=5').then((r) => r.json()).then((d) => setTransactions(d.transactions ?? [])).catch(() => setTransactions([]))
  }, [open])

  function formatDate(d: string) {
    const date = new Date(d)
    const diff = Date.now() - date.getTime()
    if (diff < 86400000) return "aujourd'hui " + date.getHours() + 'h' + String(date.getMinutes()).padStart(2, '0')
    if (diff < 172800000) return 'hier'
    return 'il y a ' + Math.floor(diff / 86400000) + ' jours'
  }

  if (!open) return null

  return (
    <>
      <div className="fixed top-0 right-0 z-50 w-full max-w-md h-full bg-[#0f2240] border-l border-[#c9973a]/30 shadow-2xl">
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c9973a]" />
              Tes crédits AIgile
            </h2>
            <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 space-y-6">
            {status?.plan === 'free' && (
              <>
                <div>
                  <p className="text-sm text-white/60 mb-2">Plan Free</p>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-bold text-white">⚡ {status.creditsRemaining ?? 0}</p>
                    <p className="text-sm text-white/70">crédits restants ce mois</p>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#c9973a] rounded-full" style={{ width: `${((status.creditsRemaining ?? 0) / 10) * 100}%` }} />
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Reset le {status.nextResetAt ? new Date(status.nextResetAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : '—'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-2">CE QUE TU PEUX ENCORE FAIRE</p>
                  <div className="space-y-2">
                    {Object.entries(CREDIT_ACTIONS).map(([key, v]) => (
                      <div key={key} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 text-sm">
                        <span className="text-white/90">{v.label}</span>
                        <span className="text-[#c9973a]">{v.cost} crédit{v.cost > 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-medium text-white mb-3">Passe Pro — crédits illimités</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowUpgrade(true)} className="flex-1 py-2.5 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full text-sm">
                      Passer Pro — 19,99€/mois
                    </button>
                    <button onClick={() => setShowUpgrade(true)} className="py-2.5 px-4 border border-white/20 text-white rounded-full text-sm hover:bg-white/10">
                      Day Pass — 9,99€
                    </button>
                  </div>
                  <Link href="/#pricing" onClick={onClose} className="block text-center text-xs text-[#c9973a] hover:underline mt-3">
                    Voir la page tarifs complète →
                  </Link>
                </div>
              </>
            )}
            {status?.plan === 'day_pass' && status.dayPassTimeRemaining && (
              <>
                <div>
                  <p className="text-sm text-white/60 mb-2">Day Pass actif</p>
                  <div className="rounded-xl border border-[#c9973a]/30 bg-[#c9973a]/10 p-4">
                    <p className="text-xl font-bold text-[#c9973a]">⏱ Expire dans {status.dayPassTimeRemaining}</p>
                    <p className="text-sm text-white/80 mt-1">Crédits illimités jusqu&apos;à expiration</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/80 mb-3">Tu utilises souvent AIgile ? Pro = 2 Day Pass</p>
                  <button onClick={() => setShowUpgrade(true)} className="w-full py-2.5 bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold rounded-full">
                    Passer Pro
                  </button>
                  <Link href="/#pricing" onClick={onClose} className="block text-center text-xs text-[#c9973a] hover:underline mt-3">
                    Voir la page tarifs complète →
                  </Link>
                </div>
              </>
            )}
            {(status?.plan === 'pro_monthly' || status?.plan === 'pro_annual') && (
              <>
                <div>
                  <p className="text-sm text-[#c9973a] font-medium">✦ Plan Pro</p>
                  <p className="text-white/80 text-sm">Crédits illimités</p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/stripe/portal?return=' + encodeURIComponent('/dashboard'))
                      const { url } = await res.json()
                      if (url) window.location.href = url
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-full py-2.5 border border-white/20 text-white rounded-full text-sm hover:bg-white/10"
                >
                  Gérer mon abonnement
                </button>
              </>
            )}
            {transactions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-white mb-2">HISTORIQUE</p>
                <div className="space-y-2">
                  {transactions.map((t) => (
                    <div key={t.action + t.created_at} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 text-sm">
                      <span className="text-white/90">{t.label}</span>
                      <span className="text-white/50">{formatDate(t.created_at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showUpgrade && <UpgradeModal open onClose={() => setShowUpgrade(false)} />}
    </>
  )
}
