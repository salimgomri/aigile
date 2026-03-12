'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { X, Loader2, Lock, Coffee } from 'lucide-react'

const PRESETS = [200, 500, 1000, 1500, 2000] // centimes: 2€, 5€, 10€, 15€, 20€
const MIN_AMOUNT = 100 // 1€
const MAX_AMOUNT = 99900 // 999€

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

export type BuyCoffeeSheetProps = {
  trigger: React.ReactNode
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

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-card border-l border-border shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Coffee className="w-6 h-6 text-aigile-gold" />
                Buy a coffee
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              <p className="text-muted-foreground">
                Soutiens le projet AIgile avec un montant libre. Chaque contribution compte !
              </p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Montant
                </label>
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
                          : 'bg-muted hover:bg-muted/80 text-foreground'
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
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                  placeholder="jean@example.com"
                />
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
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
        </>
      )}
    </>
  )
}
