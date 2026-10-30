'use client'

import { useState } from 'react'

export function FormationRequestForm({ defaultFormation = '' }: { defaultFormation?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('loading')
    try {
      const res = await fetch('/api/leads/formation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          role: data.get('role'),
          formation: data.get('formation'),
          people_count: data.get('people_count'),
          period: data.get('period'),
          format: data.get('format'),
          message: data.get('message'),
          consent: data.get('consent') === 'on',
          website: data.get('website'),
          source: 'formation',
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
      setMessage("L'envoi n'a pas fonctionné.")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" id="demande" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="f-website">Site</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Field id="f-name" name="name" label="Nom" required />
      <Field id="f-email" name="email" label="E-mail professionnel" type="email" required />
      <Field id="f-company" name="company" label="Entreprise" required />
      <Field id="f-role" name="role" label="Rôle" />
      <div>
        <label htmlFor="f-formation" className="block text-sm font-medium mb-1">
          Formation
        </label>
        <select
          id="f-formation"
          name="formation"
          defaultValue={defaultFormation}
          className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5"
        >
          <option value="agile-ia-demarrer">Agile + IA : démarrer (A)</option>
          <option value="livraison-fiable-ia">Livraison fiable avec l&apos;IA (B)</option>
          <option value="sur-mesure">Sur mesure</option>
        </select>
      </div>
      <Field id="f-people" name="people_count" label="Nombre de personnes" />
      <Field id="f-period" name="period" label="Période souhaitée" />
      <div>
        <label htmlFor="f-format" className="block text-sm font-medium mb-1">
          Format
        </label>
        <select id="f-format" name="format" className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5">
          <option value="intra-site">Intra sur site</option>
          <option value="distanciel">Distanciel</option>
        </select>
      </div>
      <div>
        <label htmlFor="f-message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea id="f-message" name="message" rows={4} className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5" />
      </div>
      <label className="flex gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4" />
        <span>J&apos;accepte d&apos;être recontacté au sujet de cette demande de formation.</span>
      </label>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="min-h-[48px] w-full rounded-full bg-aigile-gold px-5 py-3 font-semibold text-aigile-navy disabled:opacity-60"
      >
        Demander un programme
      </button>
      {status === 'ok' ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Demande envoyée. Merci.</p>
      ) : null}
      {status === 'error' ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{message}</p>
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
