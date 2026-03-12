'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from '@/lib/auth-client'
import { X, Loader2, Lock, Coffee } from 'lucide-react'

const PRESETS = [200, 500, 1000, 1500, 2000] // centimes: 2€, 5€, 10€, 15€, 20€
const MIN_AMOUNT = 100 // 1€
const MAX_AMOUNT = 99900 // 999€

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

export type BuyCoffeeSheetProps = {
  trigger: React.ReactNode | ((onOpen: () => void) => React.ReactNode)
}

export default function BuyCoffeeSheet({ trigger }: BuyCoffeeSheetProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState(500) // 5€ par défaut
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const n = session?.user?.name || session?.user?.email?.split('@')[0] || ''
    const e = session?.user?.email || ''
    setName(n)
    setEmail(e)
  }, [session?.user?.name, session?.user?.email])

  const effectiveAmount = customAmount.trim()
    ? Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, Math.round(parseFloat(customAmount.replace(',', '.')) * 100) || MIN_AMOUNT))
    : amount

  const handleSubmit = async () => {
    setError('')
    if (!email?.trim()) {
      setError('Email requis')
      return
    }
    if (effectiveAmount < MIN_AMOUNT) {
      setError('Montant minimum 1,00 €')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'buy_coffee',
          buyerEmail: email,
          buyerName: name || email.split('@')[0],
          customAmount: effectiveAmount,
        }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setError(data?.error ?? 'Erreur lors de la création du paiement')
        setLoading(false)
      }
    } catch {
      setError('Erreur réseau')
      setLoading(false)
    }
  }

  const handleOpen = () => setOpen(true)
  const triggerNode = typeof trigger === 'function' ? trigger(handleOpen) : trigger

  return (
    <>
      <div
        onClick={typeof trigger !== 'function' ? handleOpen : undefined}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
      >
        {triggerNode}
      </div>
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              className="fixed z-[99999] bg-card border-l border-border shadow-2xl overflow-y-auto flex flex-col"
              style={{ top: 0, right: 0, bottom: 0, width: 'min(100vw, 32rem)' }}
            >
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Buy a coffee</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {/* RÉCAPITULATIF */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Récapitulatif
                </h3>
                <div className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="w-14 h-14 rounded-lg bg-aigile-gold/20 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-7 h-7 text-aigile-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">Buy a coffee</p>
                    <p className="text-sm text-muted-foreground">
                      Soutiens le projet AIgile avec un montant libre. Chaque contribution compte !
                    </p>
                    <p className="text-lg font-bold text-aigile-gold mt-2">
                      {formatPrice(effectiveAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* MONTANT */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Montant
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setAmount(c)
                        setCustomAmount('')
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !customAmount && amount === c
                          ? 'bg-aigile-gold text-black'
                          : 'bg-background border border-border text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {formatPrice(c)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Montant personnalisé (€)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                  />
                  <span className="text-muted-foreground text-sm">€</span>
                </div>
              </div>

              {/* TES INFORMATIONS */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Tes informations
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Prénom et Nom
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-aigile-gold">{formatPrice(effectiveAmount)}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || effectiveAmount < MIN_AMOUNT}
                className="w-full py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Offrir {formatPrice(effectiveAmount)}
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Paiement sécurisé Stripe
              </p>
            </div>
          </div>
          </>,
          document.body
        )}
    </>
  )
}
