'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function DiagnosticForm() {
  const search = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/leads/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          role: data.get('role'),
          motif: data.get('motif'),
          message: data.get('message'),
          consent: data.get('consent') === 'on',
          website: data.get('website'),
          from: data.get('from'),
          utm_source: data.get('utm_source'),
          utm_medium: data.get('utm_medium'),
          utm_campaign: data.get('utm_campaign'),
          utm_content: data.get('utm_content'),
          source: 'diagnostic',
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
      setMessage("L'envoi n'a pas fonctionné. Réessayez dans un instant.")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="hidden" name="from" value={search.get('from') ?? ''} />
      <input type="hidden" name="motif" value={search.get('motif') ?? 'diagnostic'} />
      <input type="hidden" name="utm_source" value={search.get('utm_source') ?? ''} />
      <input type="hidden" name="utm_medium" value={search.get('utm_medium') ?? ''} />
      <input type="hidden" name="utm_campaign" value={search.get('utm_campaign') ?? ''} />
      <input type="hidden" name="utm_content" value={search.get('utm_content') ?? ''} />
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="diag-website">Site</label>
        <input id="diag-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Field id="diag-name" name="name" label="Nom" required />
      <Field id="diag-email" name="email" label="E-mail professionnel" type="email" required />
      <Field id="diag-company" name="company" label="Entreprise" />
      <Field id="diag-role" name="role" label="Rôle" />
      <div>
        <label htmlFor="diag-message" className="block text-sm font-medium mb-1">
          Contexte (facultatif)
        </label>
        <textarea
          id="diag-message"
          name="message"
          rows={4}
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5"
        />
      </div>
      <label className="flex gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4" />
        <span>
          J&apos;accepte d&apos;être recontacté au sujet de ce diagnostic flash. Détails : politique
          de confidentialité.
        </span>
      </label>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="min-h-[48px] w-full rounded-full bg-aigile-gold px-5 py-3 font-semibold text-aigile-navy hover:bg-book-orange disabled:opacity-60"
      >
        Envoyer ma demande
      </button>
      {status === 'ok' ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          Merci. Votre demande est enregistrée. Je vous recontacte pour caler 30 minutes.
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

function Field({
  id,
  name,
  label,
  type = 'text',
  required = false,
}: {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5"
      />
    </div>
  )
}
