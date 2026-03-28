'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

type Props = {
  language: 'fr' | 'en'
  toolSlug?: string
  className?: string
  /** Fond sombre (hero landing) — bordures et texte lisibles sur noir */
  variant?: 'default' | 'heroDark'
  /** Titre du formulaire masqué (ex. modale avec titre dans l’en-tête) */
  hideHeading?: boolean
}

export function EarlyAccessRequestForm({
  language,
  toolSlug = 'scoring_deliverable',
  className = '',
  variant = 'default',
  hideHeading = false,
}: Props) {
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
  const isHero = variant === 'heroDark'
  const labelClass = isHero ? 'text-sm font-semibold text-white/90' : 'text-sm font-semibold text-foreground'
  const fieldClass = isHero
    ? 'w-full rounded-lg border border-white/20 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none ring-offset-2 ring-offset-[var(--aigile-black)] focus-visible:ring-2 focus-visible:ring-[#c9973a]/60'
    : 'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground'
  const textareaClass = isHero
    ? 'w-full resize-none rounded-lg border border-white/20 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-offset-2 ring-offset-[var(--aigile-black)] focus-visible:ring-2 focus-visible:ring-[#c9973a]/60'
    : 'w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground'
  const feedbackOk = isHero ? 'text-emerald-400/95' : 'text-green-600 dark:text-green-400'
  const feedbackErr = isHero ? 'text-red-400' : 'text-destructive'

  return (
    <form onSubmit={submit} className={`space-y-3 ${className}`}>
      {!hideHeading && <p className={labelClass}>{fr ? 'Demander un early access' : 'Request early access'}</p>}
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={fr ? 'votre@email.com' : 'you@example.com'}
        className={fieldClass}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={fr ? 'Contexte (optionnel)…' : 'Context (optional)…'}
        rows={2}
        className={textareaClass}
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
        <p className={`text-sm ${feedback.type === 'ok' ? feedbackOk : feedbackErr}`}>
          {feedback.text}
        </p>
      )}
    </form>
  )
}
