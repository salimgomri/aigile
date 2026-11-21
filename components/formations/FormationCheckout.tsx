'use client'

import { useState } from 'react'
import { getCheckoutErrorMessage } from '@/lib/checkout/errors'
import { VAT_MENTION } from '@/lib/site-facts'

export function FormationCheckout() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [acceptCgv, setAcceptCgv] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        {loading ? 'Redirection…' : 'S’inscrire et payer'}
      </button>
      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
