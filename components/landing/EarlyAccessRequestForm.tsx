'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

type Props = {
  language: 'fr' | 'en'
  toolSlug?: string
  className?: string
}

export function EarlyAccessRequestForm({ language, toolSlug = 'scoring_deliverable', className = '' }: Props) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    if (!email.trim().includes('@')) {
      setFeedback({ type: 'err', text: language === 'fr' ? 'Email invalide.' : 'Invalid email.' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/tool-early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          tool_slug: toolSlug,
          message: message.trim() || null,
        }),
      })
      const j = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        duplicate?: boolean
        alreadyApproved?: boolean
        error?: string
        message?: string
      }
      if (!res.ok) {
        setFeedback({ type: 'err', text: j.error || (language === 'fr' ? 'Erreur.' : 'Error.') })
        return
      }
      if (j.alreadyApproved) {
        setFeedback({
          type: 'ok',
          text:
            language === 'fr'
              ? 'Vous avez déjà accès early adopter avec cet email.'
              : 'You already have early adopter access with this email.',
        })
        return
      }
      if (j.duplicate) {
        setFeedback({
          type: 'ok',
          text:
            language === 'fr'
              ? 'Demande déjà enregistrée — nous vous recontactons bientôt.'
              : 'Request already submitted — we’ll be in touch soon.',
        })
        return
      }
      setFeedback({
        type: 'ok',
        text:
          language === 'fr'
            ? 'Demande envoyée. Vous recevrez un email après validation.'
            : 'Request sent. You’ll get an email once approved.',
      })
      setEmail('')
      setMessage('')
    } catch {
      setFeedback({ type: 'err', text: language === 'fr' ? 'Réseau indisponible.' : 'Network error.' })
    } finally {
      setLoading(false)
    }
  }

  const fr = language === 'fr'

  return (
    <form onSubmit={submit} className={`space-y-3 ${className}`}>
      <p className="text-sm font-semibold text-foreground">{fr ? 'Demander un early access' : 'Request early access'}</p>
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={fr ? 'votre@email.com' : 'you@example.com'}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={fr ? 'Contexte (optionnel)…' : 'Context (optional)…'}
        rows={2}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-aigile-gold px-4 py-2.5 text-sm font-bold text-black hover:bg-book-orange disabled:opacity-60 sm:w-auto"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {fr ? 'Envoyer la demande' : 'Send request'}
      </button>
      {feedback && (
        <p className={`text-sm ${feedback.type === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
          {feedback.text}
        </p>
      )}
    </form>
  )
}
