'use client'

import { useMemo, useState } from 'react'
import { getCheckoutErrorMessage } from '@/lib/checkout/errors'
import {
  FORMATION_A_INTER,
  VAT_MENTION,
  clampFormationAInterPlaces,
  formationAInterTotalEuros,
  formationAInterUnitCentimes,
} from '@/lib/site-facts'
import { Price } from '@/components/ui/Price'

export function FormationCheckout() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [places, setPlaces] = useState(1)
  const [acceptCgv, setAcceptCgv] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const qty = clampFormationAInterPlaces(places)
  const unit = formationAInterUnitCentimes(qty) / 100
  const total = formationAInterTotalEuros(qty)

  const placeOptions = useMemo(
    () => Array.from({ length: FORMATION_A_INTER.seatsMax }, (_, i) => i + 1),
    [],
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!acceptCgv) {
      setError('Cochez la case CGV pour continuer (elle n’est pas précochée).')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'formation-a-place',
          buyerEmail: email,
          buyerName: name,
          quantity: qty,
          checkoutSource: 'formation_inscription',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (data?.url) {
        window.location.href = data.url
        return
      }
      setError(
        res.status === 503
          ? 'Paiement temporairement indisponible. Réessayez dans un instant.'
          : data?.error || getCheckoutErrorMessage(data?.code),
      )
    } catch {
      setError(getCheckoutErrorMessage(undefined))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 text-left space-y-4">
      <div>
        <label htmlFor="formation-places" className="block text-sm font-medium mb-1">
          Nombre de places
        </label>
        <select
          id="formation-places"
          value={qty}
          onChange={(e) => setPlaces(Number(e.target.value))}
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5"
        >
          {placeOptions.map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'place' : 'places'} — {FORMATION_A_INTER_UNIT_LABEL(n)}
            </option>
          ))}
        </select>
      </div>
      <p className="text-center">
        <span className="block text-sm text-gray-500">
          {unit} € / place × {qty}
        </span>
        <span className="text-3xl font-extrabold">
          <Price amount={total} audience="b2c" hideVat />
        </span>
      </p>
      <div>
        <label htmlFor="formation-name" className="block text-sm font-medium mb-1">
          Nom
        </label>
        <input
          id="formation-name"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5"
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="formation-email" className="block text-sm font-medium mb-1">
          E-mail
        </label>
        <input
          id="formation-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5"
          autoComplete="email"
        />
      </div>
      <label className="flex gap-3 text-sm leading-snug">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={acceptCgv}
          onChange={(e) => setAcceptCgv(e.target.checked)}
        />
        <span>
          Je demande l&apos;exécution de la formation avant la fin du délai de rétractation de 14
          jours, j&apos;accepte les{' '}
          <a href="/cgv#formations-prestations" className="underline" target="_blank" rel="noreferrer">
            CGV
          </a>
          , et je reconnais que {VAT_MENTION}.
        </span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[48px] rounded-full bg-aigile-gold px-6 py-3 font-semibold text-aigile-navy disabled:opacity-60"
      >
        {loading ? 'Redirection…' : `S’inscrire et payer — ${total} €`}
      </button>
      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}

function FORMATION_A_INTER_UNIT_LABEL(n: number): string {
  const unit = formationAInterUnitCentimes(n) / 100
  const total = formationAInterTotalEuros(n)
  return `${unit} € / pers. · ${total} €`
}
