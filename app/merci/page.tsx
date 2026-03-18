'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Zap, Sparkles, Package, LogIn } from 'lucide-react'
import { useSession } from '@/lib/auth-client'

type SessionData = {
  productType: string
  productId: string
  productTitle: string
  inPersonPickup: boolean
  buyerEmail?: string | null
  shipping: {
    name: string
    address1: string
    address2?: string
    city: string
    postal: string
    country: string
    countryName: string
    phone?: string
  } | null
  amountTotal: number
}

function MerciContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { data: authSession } = useSession()
  const [data, setData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(!!sessionId)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => setData(json))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (sessionId && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement…</div>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-checkmark">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Merci pour votre commande</h1>
          <p className="text-muted-foreground mb-8">Votre paiement a bien été enregistré.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors"
          >
            Accéder au dashboard
          </Link>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Merci pour votre commande</h1>
          <p className="text-muted-foreground mb-8">Votre paiement a bien été enregistré.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors"
          >
            Accéder au dashboard
          </Link>
        </div>
      </main>
    )
  }

  const { productType, productTitle, inPersonPickup, shipping } = data
  const isBook = productType === 'book_physical'
  const isDayPass = productType === 'day_pass'
  const isSubscription = productType.startsWith('subscription_')
  const isCredits = productType === 'credits_pack'

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* book_physical */}
        {isBook && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-checkmark">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Merci pour ta commande !</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {productTitle} est en route.
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Package className="w-5 h-5" />
              <span>Expédition sous 7–10 jours après publication</span>
            </div>
            {shipping && (
              <div className="text-left p-4 rounded-xl bg-muted/30 border border-border mb-8">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Adresse de livraison</p>
                <p className="text-foreground">
                  {shipping.name}<br />
                  {shipping.address1}
                  {shipping.address2 && <><br />{shipping.address2}</>}<br />
                  {shipping.postal} {shipping.city}<br />
                  {shipping.countryName}
                  {shipping.phone && <><br />Tél : {shipping.phone}</>}
                </p>
              </div>
            )}
            {inPersonPickup && (
              <p className="text-muted-foreground mb-8">
                En main propre — Salim te contactera pour convenir d&apos;un rendez-vous.
              </p>
            )}
            <div className="p-4 rounded-xl bg-aigile-gold/10 border border-aigile-gold/30 mb-8">
              <p className="text-sm font-medium text-foreground mb-2">
                Pendant que tu attends — Essaie AIgile Rétro
              </p>
              <Link
                href="/retro"
                className="inline-flex items-center justify-center px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors"
              >
                Lancer une rétro IA
              </Link>
            </div>
            {!authSession?.user && (
              <div className="p-4 rounded-xl bg-aigile-gold/10 border border-aigile-gold/30 mb-8">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Inscris-toi et reçois 10 crédits en plus !
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Crée un compte AIgile pour accéder aux outils rétro IA et profiter de 10 crédits bonus offerts aux acheteurs du livre.
                </p>
                <Link
                  href={`/register${sessionId ? `?redirect=${encodeURIComponent(`/merci?session_id=${sessionId}`)}` : ''}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors"
                >
                  S&apos;inscrire — 10 crédits offerts
                </Link>
                <p className="text-xs text-muted-foreground mt-3">
                  Déjà un compte ?{' '}
                  <Link
                    href={`/login${sessionId ? `?redirect=${encodeURIComponent(`/merci?session_id=${sessionId}`)}` : ''}`}
                    className="text-aigile-gold hover:underline"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            )}
          </>
        )}

        {/* day_pass */}
        {isDayPass && (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6 animate-checkmark">
              <Zap className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Ton Day Pass est actif !</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tu as 24h d&apos;accès illimité à tous les outils.
            </p>
            <Link
              href="/retro"
              className="inline-flex items-center justify-center px-8 py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors text-lg"
            >
              Accéder à AIgile Rétro →
            </Link>
          </>
        )}

        {/* subscription */}
        {isSubscription && (
          <>
            <div className="w-20 h-20 rounded-full bg-aigile-gold/20 flex items-center justify-center mx-auto mb-6 animate-checkmark">
              <Sparkles className="w-10 h-10 text-aigile-gold" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenue dans AIgile Pro !</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tous les outils sont débloqués. Crédits illimités.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors text-lg"
            >
              Aller sur le Dashboard →
            </Link>
          </>
        )}

        {/* credits_pack */}
        {isCredits && (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6 animate-checkmark">
              <Zap className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Tes crédits ont été ajoutés !</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tu peux continuer à utiliser AIgile.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors text-lg"
            >
              Continuer sur AIgile →
            </Link>
          </>
        )}

        {/* Fallback (buy_coffee, etc.) */}
        {!isBook && !isDayPass && !isSubscription && !isCredits && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-checkmark">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Merci pour ta commande !</h1>
            <p className="text-muted-foreground mb-8">
              Votre paiement a bien été enregistré.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-colors"
            >
              Accéder au dashboard
            </Link>
            {!authSession?.user && (
              <div className="p-4 rounded-xl bg-muted/30 border border-border mt-8">
                <p className="text-sm font-medium text-foreground mb-2">
                  Tu as déjà un compte AIgile ?
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Connecte-toi pour accéder à ton espace.
                </p>
                <Link
                  href={`/login${sessionId ? `?redirect=${encodeURIComponent(`/merci?session_id=${sessionId}`)}` : ''}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-aigile-gold/50 rounded-full text-aigile-gold font-medium hover:bg-aigile-gold/10 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </Link>
              </div>
            )}
          </>
        )}

        <p className="mt-12">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function MerciPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement…</div>
        </div>
      }
    >
      <MerciContent />
    </Suspense>
  )
}
