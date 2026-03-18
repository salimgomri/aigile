'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'
import { X, Loader2, Lock, Book, LogIn, UserPlus } from 'lucide-react'
import { z } from 'zod'
import type { Product } from '@/lib/payments/catalog'
import { COUNTRIES } from '@/lib/countries'
import { getCheckoutErrorMessage } from '@/lib/checkout/errors'

function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

function buildCheckoutSchema(product: Product) {
  return z
    .object({
      buyerName: z.string().min(2, 'Nom requis'),
      buyerEmail: z.string().email('Email invalide'),
      inPersonPickup: z.boolean().default(false),
      shipping: z
        .object({
          name: z.string().optional(),
          address1: z.string().optional(),
          address2: z.string().optional(),
          city: z.string().optional(),
          postal: z.string().optional(),
          country: z.string().optional(),
          phone: z.string().optional(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (product.requiresShipping && !data.inPersonPickup) {
        if (!data.shipping?.address1?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['shipping', 'address1'], message: 'Adresse requise' })
        }
        if (!data.shipping?.city?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['shipping', 'city'], message: 'Ville requise' })
        }
        if (!data.shipping?.postal?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['shipping', 'postal'], message: 'Code postal requis' })
        }
        if (!data.shipping?.country?.trim()) {
          ctx.addIssue({ code: 'custom', path: ['shipping', 'country'], message: 'Pays requis' })
        }
      }
    })
}

const AUTH_REQUIRED_TYPES = ['subscription_monthly', 'subscription_annual', 'day_pass', 'credits_pack'] as const
function productRequiresAuth(product: Product): boolean {
  return AUTH_REQUIRED_TYPES.includes(product.type as (typeof AUTH_REQUIRED_TYPES)[number])
}

export type CheckoutSheetProps = {
  product: Product | null
  trigger: React.ReactNode
  defaultEmail?: string
  defaultName?: string
  defaultOpen?: boolean
}

export default function CheckoutSheet({
  product,
  trigger,
  defaultEmail = '',
  defaultName = '',
  defaultOpen = false,
}: CheckoutSheetProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(defaultOpen)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [inPersonPickup, setInPersonPickup] = useState(false)
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [postal, setPostal] = useState('')
  const [country, setCountry] = useState('LU')
  const [phone, setPhone] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [couponApplied, setCouponApplied] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [discount, setDiscount] = useState<{ label: string; amount: number } | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Ouvrir automatiquement si defaultOpen (ex: retour après login)
  useEffect(() => {
    if (defaultOpen && product) setOpen(true)
  }, [defaultOpen, product?.id])

  // Pré-remplir avec session si connecté (priorité aux props)
  useEffect(() => {
    const n = defaultName || session?.user?.name || session?.user?.email?.split('@')[0] || ''
    const e = defaultEmail || session?.user?.email || ''
    setName(n)
    setEmail(e)
  }, [defaultName, defaultEmail, session?.user?.name, session?.user?.email])

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const locale = navigator.language.toUpperCase()
      if (locale.startsWith('FR')) setCountry('FR')
      else if (locale.startsWith('DE')) setCountry('DE')
      else if (locale.startsWith('EN')) setCountry('GB')
    }
  }, [])

  const requiresShipping = product?.requiresShipping ?? false
  const showAddress = requiresShipping && !inPersonPickup
  const requiresAuth = product ? productRequiresAuth(product) : false
  const showAuthCTA = requiresAuth && !session?.user
  // Toujours rediriger vers /pricing pour les produits auth (Day Pass, Pro) — page dédiée avec auto-open
  const authRedirectBase = '/pricing'
  const showCoupon = product?.type !== 'buy_coffee'
  const shippingFee = inPersonPickup ? 0 : (product?.shippingFee ?? 0)
  const qty = product?.type === 'book_physical' ? Math.max(1, Math.min(99, quantity)) : 1
  const subtotal = (product?.amount ?? 0) * qty
  const total = Math.max(0, subtotal - (discount?.amount ?? 0) + shippingFee)

  const handleApplyCoupon = useCallback(async () => {
    if (!product || !couponInput.trim()) return
    setCouponError('')
    setCouponLoading(true)
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), productId: product.id }),
      })
      const data = await res.json()
      if (data.valid) {
        setCouponApplied(couponInput.trim().toUpperCase())
        setDiscount({ label: data.discountLabel, amount: data.discountAmount })
      } else {
        setCouponError(data.reason ?? 'Code invalide')
        setCouponApplied(null)
        setDiscount(null)
      }
    } catch {
      setCouponError('Erreur de vérification')
      setCouponApplied(null)
      setDiscount(null)
    } finally {
      setCouponLoading(false)
    }
  }, [product, couponInput])

  const handleSubmit = useCallback(async () => {
    if (!product) return
    setError('')
    setFieldErrors({})

    const schema = buildCheckoutSchema(product)
    const result = schema.safeParse({
      buyerName: name,
      buyerEmail: email,
      inPersonPickup,
      shipping: showAddress ? { name, address1, address2, city, postal, country, phone } : undefined,
    })

    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = (issue.path[issue.path.length - 1] ?? '') as string
        if (key && issue.message) errors[key] = issue.message
      }
      setFieldErrors(errors)
      setError('Veuillez corriger les champs ci-dessous.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerEmail: email,
          buyerName: name,
          quantity: product.type === 'book_physical' ? qty : undefined,
          inPersonPickup: requiresShipping ? inPersonPickup : undefined,
          couponCode: couponApplied ?? undefined,
          ...(requiresShipping &&
            !inPersonPickup && {
              shipping: { name, address1, address2, city, postal, country, phone },
            }),
        }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        const errCode = data?.code ?? (data?.missing?.length ? 'address_incomplete' : undefined)
        setError(res.status === 401 ? 'Connectez-vous pour procéder au paiement' : data?.error ?? getCheckoutErrorMessage(errCode))
        setLoading(false)
      }
    } catch (err) {
      const stripeError = (err as { code?: string })?.code
      setError(getCheckoutErrorMessage(stripeError))
      setLoading(false)
    }
  }, [
    product,
    requiresShipping,
    name,
    email,
    address1,
    address2,
    city,
    postal,
    country,
    phone,
    inPersonPickup,
    couponApplied,
    showAddress,
    qty,
  ])

  if (!product) return null

  const Trigger = (
    <div onClick={() => setOpen(true)} className="cursor-pointer">
      {trigger}
    </div>
  )

  const FormMessage = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="text-sm text-destructive mt-1">{fieldErrors[field]}</p>
    ) : null

  return (
    <>
      {Trigger}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-lg bg-card border-l border-border shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{product.title}</h2>
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
                    {product.type === 'book_physical' ? (
                      <Book className="w-7 h-7 text-aigile-gold" />
                    ) : (
                      <Lock className="w-7 h-7 text-aigile-gold" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{product.title}</p>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {product.type === 'book_physical' && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-muted-foreground">Quantité</label>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)))}
                            className="w-16 px-3 py-1.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                          />
                        </div>
                      )}
                      <p className="text-lg font-bold text-aigile-gold">
                        {formatPrice(product.amount)}
                        {qty > 1 && (
                          <span className="text-sm font-normal text-muted-foreground">
                            {' '}× {qty} = {formatPrice(subtotal)}
                          </span>
                        )}
                        {product.isRecurring && (
                          <span className="text-sm font-normal text-muted-foreground">
                            {product.type.includes('annual') ? '/an' : '/mois'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TES INFORMATIONS — ou S'inscrire/Se connecter si produit nécessite auth */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {showAuthCTA ? 'Compte requis' : 'Tes informations'}
                </h3>
                {showAuthCTA ? (
                  <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">
                      Connecte-toi ou crée un compte pour procéder au paiement.
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href={`/register?redirect=${encodeURIComponent(`${authRedirectBase}?open=${product.id}`)}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-aigile-gold/50 text-aigile-gold font-semibold hover:bg-aigile-gold/10 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        S&apos;inscrire
                      </Link>
                      <Link
                        href={`/login?redirect=${encodeURIComponent(`${authRedirectBase}?open=${product.id}`)}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-aigile-gold/20 text-aigile-gold font-semibold hover:bg-aigile-gold/30 transition-colors border border-aigile-gold/50"
                      >
                        <LogIn className="w-4 h-4" />
                        Se connecter
                      </Link>
                    </div>
                  </div>
                ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Prénom et Nom *
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                      placeholder="Jean Dupont"
                    />
                    <FormMessage field="buyerName" />
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
                    <FormMessage field="buyerEmail" />
                  </div>

                  {requiresShipping && product.freeShippingInPerson && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inPersonPickup}
                        onChange={(e) => setInPersonPickup(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-aigile-gold focus:ring-aigile-gold"
                      />
                      <span className="text-sm text-foreground">
                        Je récupère le livre en main propre (gratuit)
                      </span>
                    </label>
                  )}

                  {showAddress && (
                    <div className="space-y-4 pt-2 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Adresse de livraison
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Adresse *
                        </label>
                        <input
                          type="text"
                          required
                          value={address1}
                          onChange={(e) => setAddress1(e.target.value)}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                          placeholder="1 rue de la Paix"
                        />
                        <FormMessage field="address1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Complément
                        </label>
                        <input
                          type="text"
                          value={address2}
                          onChange={(e) => setAddress2(e.target.value)}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                          placeholder="Apt 4"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Ville *
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                            placeholder="Luxembourg"
                          />
                          <FormMessage field="city" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Code postal *
                          </label>
                          <input
                            type="text"
                            required
                            value={postal}
                            onChange={(e) => setPostal(e.target.value)}
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                            placeholder="L-1234"
                          />
                          <FormMessage field="postal" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Pays *
                        </label>
                        <select
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <FormMessage field="country" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                          placeholder="+352 123 456 789"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommandé pour le transporteur
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* CODE PROMO — livre, Day Pass, Pro (pas buy_coffee) */}
              {showCoupon && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Code promo
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase())
                        setCouponError('')
                      }}
                      placeholder="CODE"
                      className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aigile-gold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2.5 border border-aigile-gold/50 rounded-lg text-aigile-gold font-medium hover:bg-aigile-gold/10 transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Appliquer'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-destructive mt-2">{couponError}</p>
                  )}
                  {couponApplied && discount && discount.amount > 0 && (
                    <p className="text-sm text-green-500 mt-2">
                      Réduction {formatPrice(discount.amount)} appliquée ({discount.label})
                    </p>
                  )}
                </div>
              )}

              {/* TOTAL */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {discount && discount.amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Réduction {couponApplied}</span>
                    <span className="text-green-500">-{formatPrice(discount.amount)}</span>
                  </div>
                )}
                {requiresShipping && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-foreground">
                      {inPersonPickup ? 'Gratuite' : formatPrice(shippingFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-aigile-gold">{formatPrice(total)}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {showAuthCTA ? (
                <Link
                  href={`/login?redirect=${encodeURIComponent(`${authRedirectBase}?open=${product.id}`)}`}
                  className="w-full py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Se connecter et payer
                  <span className="text-lg">→</span>
                </Link>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-aigile-gold hover:bg-book-orange text-black font-semibold rounded-full transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Procéder au paiement
                      <span className="text-lg">→</span>
                    </>
                  )}
                </button>
              )}
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
