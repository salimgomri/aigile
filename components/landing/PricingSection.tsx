/*
 * Pricing Section — Landing page
 * 3 cartes : Day Pass | Pro (recommandé) | Free
 * Toggle mensuel/annuel (annuel par défaut)
 * Boutons adaptés au statut utilisateur (useCredits)
 */

'use client'

import { useState, useEffect } from 'react'
import { useCredits } from '@/lib/credits/CreditContext'
import { useSession } from '@/lib/auth-client'
import { useLanguage } from '@/components/language-provider'
import { Check } from 'lucide-react'
import Link from 'next/link'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import type { Product } from '@/lib/payments/catalog'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

const DAY_PASS_FEATURES = [
  'Accès 24h',
  'Crédits ∞',
  'Tous outils',
  'Sans engagement',
]

const PRO_FEATURES = [
  'Crédits illimités',
  'Tous les outils',
  'Équipe illimitée',
  'Export PDF ∞',
  'Dashboard manager',
  '25 prompts IA',
]

const FREE_FEATURES = [
  '10 crédits à l\'inscription',
  'Niko-Niko',
  'Rétro (1×)',
  'DORA calcul',
]
const FREE_FEATURES_NEG = ['IA bloquée']

const FACILITATOR_ROLES = ['scrum_master', 'agile_coach', 'manager', 'product_owner']

export default function PricingSection() {
  const { language } = useLanguage()
  const { status } = useCredits()
  const { data: session } = useSession()
  const userRole = (session?.user as { role?: string } | undefined)?.role ?? 'guest'
  const isFacilitator = FACILITATOR_ROLES.includes(userRole)
  const [isAnnual, setIsAnnual] = useState(true)
  const [dayPassProduct, setDayPassProduct] = useState<Product | null>(null)
  const [proMonthlyProduct, setProMonthlyProduct] = useState<Product | null>(null)
  const [proAnnualProduct, setProAnnualProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch('/api/products/upgrade')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { day_pass?: Product; pro_monthly?: Product; pro_annual?: Product } | null) => {
        if (!d) return
        setDayPassProduct(d.day_pass ?? null)
        setProMonthlyProduct(d.pro_monthly ?? null)
        setProAnnualProduct(d.pro_annual ?? null)
      })
      .catch(() => {})
  }, [])

  const isPro = status?.plan === 'pro_monthly' || status?.plan === 'pro_annual'
  const isFree = status?.plan === 'free'
  const isDayPass = status?.plan === 'day_pass'
  const isLoggedIn = !!status

  // Toggle synchro avec le plan actuel si connecté
  const isProAnnual = status?.plan === 'pro_annual'
  const toggleLocked = isPro
  const effectiveIsAnnual = toggleLocked ? isProAnnual : isAnnual

  const t = {
    title: language === 'fr' ? 'Choisis ton accès AIgile' : 'Choose your AIgile access',
    subtitle: language === 'fr'
      ? 'Commence gratuitement. Passe Pro quand tu es prêt.'
      : 'Start free. Go Pro when you\'re ready.',
    monthly: language === 'fr' ? 'Mensuel' : 'Monthly',
    annual: language === 'fr' ? 'Annuel' : 'Annual',
    save40: language === 'fr' ? 'Économisez 40€' : 'Save €40',
    dayPass: 'Day Pass',
    dayPassPrice: language === 'fr' ? 'aujourd\'hui' : 'today',
    pro: '★ Pro',
    recommended: language === 'fr' ? 'Recommandé' : 'Recommended',
    proMonthlyPrice: language === 'fr' ? '/mois' : '/mo',
    proAnnualNote: language === 'fr' ? 'OU 199,99€/an (-40€)' : 'OR €199.99/year (-€40)',
    free: 'Free',
    freePrice: language === 'fr' ? 'pour toujours' : 'forever',
    try: language === 'fr' ? 'Essayer' : 'Try',
    startPro: language === 'fr' ? 'Commencer Pro' : 'Start Pro',
    startFree: language === 'fr' ? 'Commencer gratis' : 'Start free',
    currentPlan: language === 'fr' ? 'Plan actuel' : 'Current plan',
    manageSubscription: language === 'fr' ? 'Gérer mon abonnement' : 'Manage subscription',
    includedInPlan: language === 'fr' ? 'Inclus dans ton plan' : 'Included in your plan',
    dayPassRenew: language === 'fr' ? 'Prolonger +1 jour' : 'Renew +1 day',
    dayPassExpiresIn: language === 'fr' ? 'Expire dans' : 'Expires in',
    dayPassUpgradeFacilitator: language === 'fr'
      ? 'Passe Pro pour préparer tes rétros sans limite.'
      : 'Go Pro to prepare your retros without limits.',
    dayPassUpgradeParticipant: language === 'fr'
      ? 'Passe Pro pour profiter des outils sans limite.'
      : 'Go Pro to enjoy the tools without limits.',
    reassurance: language === 'fr'
      ? '🔒 Paiement sécurisé Stripe  ·  Annulation à tout moment  ·  Facture disponible'
      : '🔒 Secure Stripe payment  ·  Cancel anytime  ·  Invoice available',
  }

  const proProduct = effectiveIsAnnual ? proAnnualProduct : proMonthlyProduct

  return (
    <section id="pricing" className="relative py-24 bg-[#0f2240]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-lg text-white/80">{t.subtitle}</p>

          {/* Toggle mensuel / annuel — verrouillé si Pro (plan actuel) */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => !toggleLocked && setIsAnnual(false)}
              disabled={toggleLocked}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                !effectiveIsAnnual
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              } ${toggleLocked ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
            >
              {t.monthly}
            </button>
            <button
              type="button"
              onClick={() => !toggleLocked && setIsAnnual(true)}
              disabled={toggleLocked}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                effectiveIsAnnual
                  ? 'bg-[#c9973a] text-black'
                  : 'text-white/60 hover:text-white'
              } ${toggleLocked ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
            >
              {t.annual}
              <span className="text-xs font-medium opacity-90">← {t.save40}</span>
            </button>
          </div>
        </div>

        {/* 3 cartes */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Day Pass */}
          <div
            className={`rounded-2xl p-6 flex flex-col transition-all ${
              isDayPass && isLoggedIn
                ? 'border-2 border-[#c9973a] bg-[#c9973a]/15 ring-2 ring-[#c9973a]/30'
                : isPro && isLoggedIn
                  ? 'border border-white/10 bg-white/5 opacity-60'
                  : 'border border-white/20 bg-white/5'
            }`}
          >
            <h3 className="text-xl font-bold text-white mb-1">Day Pass</h3>
            <p className="text-3xl font-bold text-[#c9973a] mb-1">
              {dayPassProduct ? formatPrice(dayPassProduct.amount) : '9,99 €'}
            </p>
            <p className={`text-sm text-white/60 ${isDayPass && isLoggedIn && status?.dayPassTimeRemaining ? 'mb-2' : 'mb-6'}`}>
              {t.dayPassPrice}
            </p>
            {isDayPass && isLoggedIn && status?.dayPassTimeRemaining && (
              <p className="text-sm font-medium text-[#c9973a] mb-6">
                ⏱ {t.dayPassExpiresIn} {status.dayPassTimeRemaining}
              </p>
            )}
            <ul className="space-y-3 mb-8 flex-1">
              {DAY_PASS_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/90 text-sm">
                  <Check className="w-4 h-4 text-[#c9973a] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {isDayPass && isLoggedIn ? (
              <div className="space-y-2">
                <div className="w-full py-3 rounded-full bg-white/15 text-white/80 text-center text-sm font-medium cursor-default select-none border border-[#c9973a]/40">
                  ✓ {t.currentPlan}
                </div>
                {dayPassProduct && (
                  <CheckoutSheet
                    product={dayPassProduct}
                    trigger={
                      <button className="w-full py-3 rounded-full bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold transition-all">
                        {t.dayPassRenew}
                      </button>
                    }
                  />
                )}
                <p className="text-xs text-white/60 text-center mt-2">
                  {isFacilitator ? t.dayPassUpgradeFacilitator : t.dayPassUpgradeParticipant}
                </p>
              </div>
            ) : isPro && isLoggedIn ? (
              <div className="w-full py-3 rounded-full bg-white/5 text-white/50 text-center text-sm font-medium cursor-not-allowed select-none">
                {t.includedInPlan}
              </div>
            ) : dayPassProduct ? (
              <CheckoutSheet
                product={dayPassProduct}
                trigger={
                  <button className="w-full py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                    {t.try} →
                  </button>
                }
              />
            ) : (
              <div className="w-full py-3 rounded-full bg-white/10 text-white/50 text-center text-sm">
                —
              </div>
            )}
          </div>

          {/* Pro — mise en avant */}
          <div
            className={`rounded-2xl p-6 flex flex-col relative shadow-lg scale-105 max-md:scale-100 transition-all ${
              isPro && isLoggedIn
                ? 'border-2 border-[#c9973a] bg-[#c9973a]/20 ring-2 ring-[#c9973a]/40'
                : 'border-2 border-[#c9973a] bg-[#c9973a]/10'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#c9973a] text-black text-xs font-bold rounded-full">
              ★ {t.recommended}
            </div>
            <h3 className="text-xl font-bold text-white mt-2 mb-1">{t.pro}</h3>
            {effectiveIsAnnual ? (
              <>
                <p className="text-3xl font-bold text-[#c9973a] mb-1">
                  {proAnnualProduct ? formatPrice(proAnnualProduct.amount) : '199,99 €'}
                  <span className="text-sm font-normal text-white/70">/an</span>
                </p>
                <p className="text-sm text-white/60 mb-6">
                  = 16,66€/mois · {t.save40}
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-[#c9973a] mb-1">
                  {proMonthlyProduct ? formatPrice(proMonthlyProduct.amount) : '19,99 €'}
                  <span className="text-sm font-normal text-white/70">{t.proMonthlyPrice}</span>
                </p>
                <p className="text-sm text-white/60 mb-6">{t.proAnnualNote}</p>
              </>
            )}
            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/90 text-sm">
                  <Check className="w-4 h-4 text-[#c9973a] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {isPro && isLoggedIn ? (
              <div className="space-y-2">
                <div className="w-full py-3 rounded-full bg-white/15 text-white/80 text-center text-sm font-medium cursor-default select-none border border-[#c9973a]/40">
                  ✓ {t.currentPlan}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/stripe/portal?return=' + encodeURIComponent('/dashboard'), {
                        credentials: 'include',
                      })
                      const data = await res.json()
                      if (data?.url) {
                        window.location.href = data.url
                      } else {
                        alert(data?.error || (language === 'fr' ? 'Impossible d\'ouvrir le portail.' : 'Unable to open portal.'))
                      }
                    } catch {
                      window.location.href = '/dashboard'
                    }
                  }}
                  className="block w-full text-center text-sm text-[#c9973a] hover:underline bg-transparent border-0 cursor-pointer"
                >
                  {t.manageSubscription}
                </button>
              </div>
            ) : proProduct ? (
              <CheckoutSheet
                product={proProduct}
                trigger={
                  <button className="w-full py-4 rounded-full bg-[#c9973a] hover:bg-[#E8961E] text-black font-semibold transition-all flex items-center justify-center gap-2">
                    {t.startPro} →
                  </button>
                }
              />
            ) : (
              <div className="w-full py-3 rounded-full bg-white/10 text-white/50 text-center text-sm">
                —
              </div>
            )}
          </div>

          {/* Free */}
          <div
            className={`rounded-2xl p-6 flex flex-col transition-all ${
              isFree && isLoggedIn
                ? 'border-2 border-[#c9973a] bg-[#c9973a]/15 ring-2 ring-[#c9973a]/30'
                : isPro && isLoggedIn
                  ? 'border border-white/10 bg-white/5 opacity-60'
                  : 'border border-white/20 bg-white/5'
            }`}
          >
            <h3 className="text-xl font-bold text-white mb-1">{t.free}</h3>
            <p className="text-3xl font-bold text-white mb-1">0 €</p>
            <p className="text-sm text-white/60 mb-6">{t.freePrice}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/90 text-sm">
                  <Check className="w-4 h-4 text-[#c9973a] flex-shrink-0" />
                  {f}
                </li>
              ))}
              {FREE_FEATURES_NEG.map((f) => (
                <li key={f} className="flex items-center gap-2 text-white/50 text-sm">
                  <span className="w-4 h-4 flex items-center justify-center text-red-400">✗</span>
                  {f}
                </li>
              ))}
            </ul>
            {isFree && isLoggedIn ? (
              <div className="w-full py-3 rounded-full bg-white/15 text-white/80 text-center text-sm font-medium cursor-default select-none border border-[#c9973a]/40">
                ✓ {t.currentPlan}
              </div>
            ) : isPro && isLoggedIn ? (
              <div className="w-full py-3 rounded-full bg-white/5 text-white/50 text-center text-sm font-medium cursor-not-allowed select-none">
                {t.includedInPlan}
              </div>
            ) : (
              <Link
                href="/register"
                className="w-full py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                {t.startFree}
              </Link>
            )}
          </div>
        </div>

        {/* Réassurance */}
        <p className="text-center text-sm text-white/60 mt-10">
          {t.reassurance}
        </p>
      </div>
    </section>
  )
}
