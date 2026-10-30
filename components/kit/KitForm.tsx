'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CONSENT_KIT_TEXT } from '@/lib/leads/kit-copy'

type KitFormProps = {
  compact?: boolean
  source: string
  contactEmail?: string
}

export function KitForm({ compact = false, source, contactEmail = '[À COMPLÉTER]' }: KitFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const contact = contactEmail

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/leads/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: data.get('prenom'),
          email: data.get('email'),
          consent_kit: data.get('consent_kit') === 'on',
          consent_news: data.get('consent_news') === 'on',
          website: data.get('website'),
          source,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setMessage(json.error || "L'envoi n'a pas fonctionné.")
        return
      }
      setStatus('ok')
      form.reset()
    } catch {
      setStatus('error')
      setMessage(
        `L'envoi n'a pas fonctionné. Réessayez ou écrivez-nous à ${contact}.`,
      )
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor={`${source}-website`}>Site web</label>
        <input id={`${source}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {!compact ? (
        <div>
          <label htmlFor={`${source}-prenom`} className="block text-sm font-medium mb-1">
            Prénom <span className="text-gray-500 font-normal">(facultatif)</span>
          </label>
          <input
            id={`${source}-prenom`}
            name="prenom"
            type="text"
            autoComplete="given-name"
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-aigile-navy"
          />
        </div>
      ) : null}
      <div>
        <label htmlFor={`${source}-email`} className="block text-sm font-medium mb-1">
          E-mail professionnel <span className="text-red-600">*</span>
        </label>
        <input
          id={`${source}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="prenom.nom@entreprise.com"
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-aigile-navy"
        />
      </div>
      <label className="flex gap-3 text-sm leading-snug">
        <input type="checkbox" name="consent_kit" className="mt-1 h-4 w-4" />
        <span>{CONSENT_KIT_TEXT}</span>
      </label>
      {!compact ? (
        <label className="flex gap-3 text-sm leading-snug text-gray-700">
          <input type="checkbox" name="consent_news" className="mt-1 h-4 w-4" />
          <span>
            J&apos;accepte aussi de recevoir ensuite, environ une fois par mois, des nouvelles
            d&apos;AIgile (articles, outils, formations).{' '}
            <mark className="todo-mark">[À CONFIRMER : fréquence]</mark>
          </span>
        </label>
      ) : null}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full min-h-[48px] rounded-full bg-aigile-gold px-5 py-3 font-semibold text-aigile-navy hover:bg-book-orange disabled:opacity-60"
      >
        {compact ? 'Recevoir le kit' : 'Recevoir le kit gratuit'}
      </button>
      <p className="text-xs text-gray-600">
        {compact ? (
          <>
            Désinscription en un clic. Détails :{' '}
            <Link href="/privacy" className="underline">
              Politique de confidentialité
            </Link>
            .
          </>
        ) : (
          <>
            Vos données (prénom, e-mail) sont traitées par Salim GOMRI EI (GO-COACH), éditeur
            d&apos;AIgile.lu, pour vous envoyer le kit et les e-mails demandés, sur la base de votre
            consentement. Elles sont transmises à notre outil d&apos;envoi d&apos;e-mails{' '}
            <mark className="todo-mark">[À CHOISIR : Brevo / Kit / autre]</mark> et conservées
            jusqu&apos;à votre désinscription, puis{' '}
            <mark className="todo-mark">[À COMPLÉTER : durée, ex. 3 ans après le dernier contact]</mark>{' '}
            au maximum. Vous pouvez retirer votre consentement à tout moment et exercer vos droits
            en écrivant à{' '}
            {contact.includes('@') ? (
              <a href={`mailto:${contact}`} className="underline">
                {contact}
              </a>
            ) : (
              <mark className="todo-mark">{contact}</mark>
            )}
            . Vous pouvez aussi saisir la CNIL. En savoir plus :{' '}
            <Link href="/privacy" className="underline">
              Politique de confidentialité
            </Link>
            .
          </>
        )}
      </p>
      {status === 'ok' ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          Merci ! Vérifiez votre boîte mail : le kit arrive dans quelques minutes. Pensez à regarder
          dans les indésirables.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  )
}
