'use client'

import { useEffect, useState } from 'react'
import { Loader2, Trash2, UserPlus } from 'lucide-react'

type FlagRow = { slug: string; label_fr: string }

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminAccessPage() {
  const [flags, setFlags] = useState<FlagRow[]>([])
  const [toolSlug, setToolSlug] = useState('')
  const [invites, setInvites] = useState<{ id: string; email: string; created_at: string }[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [promos, setPromos] = useState<
    { id: string; email: string; tool_slug: string; expires_at: string; early_adopter: boolean; note: string | null }[]
  >([])
  const [promoToolSlug, setPromoToolSlug] = useState('')
  const [promoEmail, setPromoEmail] = useState('')
  const [promoNote, setPromoNote] = useState('')
  const [promoExpires, setPromoExpires] = useState('')
  const [promoEarlyAdopter, setPromoEarlyAdopter] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingInvites, setLoadingInvites] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const loadFlags = () => {
    fetch('/api/admin/feature-flags')
      .then((r) => r.json())
      .then((d) => {
        if (d.flags) {
          setFlags(d.flags.map((f: { slug: string; label_fr: string }) => ({ slug: f.slug, label_fr: f.label_fr })))
          if (d.flags.length && !toolSlug) setToolSlug(d.flags[0].slug)
        }
      })
      .finally(() => setLoading(false))
  }

  const loadInvites = (slug: string) => {
    if (!slug) return
    setLoadingInvites(true)
    fetch(`/api/admin/tool-invites?tool_slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.invites) setInvites(d.invites)
      })
      .finally(() => setLoadingInvites(false))
  }

  const loadPromos = () => {
    fetch('/api/admin/credit-promos')
      .then((r) => r.json())
      .then((d) => {
        if (d.promos) setPromos(d.promos)
      })
  }

  useEffect(() => {
    loadFlags()
    loadPromos()
  }, [])

  useEffect(() => {
    if (toolSlug) loadInvites(toolSlug)
  }, [toolSlug])

  useEffect(() => {
    if (flags.length === 0) return
    if (!promoToolSlug) setPromoToolSlug(flags[0].slug)
    if (!promoExpires) {
      const d30 = new Date()
      d30.setDate(d30.getDate() + 30)
      setPromoExpires(toDatetimeLocalValue(d30.toISOString()))
    }
  }, [flags, promoToolSlug, promoExpires])

  const addInvite = async () => {
    setMessage(null)
    const res = await fetch('/api/admin/tool-invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_slug: toolSlug, email: inviteEmail }),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(j.error || 'Erreur')
      return
    }
    setInviteEmail('')
    loadInvites(toolSlug)
  }

  const removeInvite = async (email: string) => {
    setMessage(null)
    const res = await fetch('/api/admin/tool-invites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_slug: toolSlug, email }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setMessage(j.error || 'Erreur')
      return
    }
    loadInvites(toolSlug)
  }

  const addPromo = async () => {
    setMessage(null)
    const expiresIso = promoExpires ? new Date(promoExpires).toISOString() : ''
    if (!expiresIso || Number.isNaN(new Date(expiresIso).getTime())) {
      setMessage('Date de fin invalide')
      return
    }
    const res = await fetch('/api/admin/credit-promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: promoEmail,
        tool_slug: promoToolSlug,
        expires_at: expiresIso,
        early_adopter: promoEarlyAdopter,
        note: promoNote || null,
      }),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(j.error || 'Erreur')
      return
    }
    setPromoEmail('')
    setPromoNote('')
    loadPromos()
  }

  const removePromo = async (email: string, slug: string) => {
    setMessage(null)
    const res = await fetch('/api/admin/credit-promos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tool_slug: slug }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setMessage(j.error || 'Erreur')
      return
    }
    loadPromos()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Chargement…
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Accès et licences promo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Invitations par outil (emails) et promos crédits illimités par outil jusqu’à une date, avec option early
          adopter (bannière + livre / pricing).
        </p>
      </div>

      {message && (
        <p className="text-sm text-destructive" role="status">
          {message}
        </p>
      )}

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Invitations par outil</h2>
        <p className="text-sm text-muted-foreground">
          Quand « Accès sur invitation seulement » est activé sur le feature flag, seuls ces emails (et les admins)
          accèdent à l’outil après la date de lancement.
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Outil</span>
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm min-w-[200px]"
              value={toolSlug}
              onChange={(e) => setToolSlug(e.target.value)}
            >
              {flags.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.label_fr} ({f.slug})
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 flex-1 min-w-[200px]">
            <span className="text-xs font-medium text-muted-foreground">Email à inviter</span>
            <input
              type="email"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </label>
          <button
            type="button"
            onClick={addInvite}
            disabled={!inviteEmail.includes('@')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aigile-gold hover:bg-book-orange text-black text-sm font-semibold disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {loadingInvites ? (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement des invitations…
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {invites.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground">Aucun email invité pour cet outil.</li>
            )}
            {invites.map((i) => (
              <li key={i.id} className="px-4 py-2 flex items-center justify-between gap-2 text-sm">
                <span>{i.email}</span>
                <button
                  type="button"
                  onClick={() => removeInvite(i.email)}
                  className="text-destructive hover:underline inline-flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Retirer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Crédits illimités par outil (promo)</h2>
        <p className="text-sm text-muted-foreground">
          S’applique uniquement aux actions de l’outil choisi (ex. skill_matrix → Skill Matrix). Jusqu’à la date de fin,
          pas de débit de crédits sur cet outil. Early adopter : bannière avec tension + livre S.A.L.I.M. + lien Pro.
          Compte utilisateur requis (même email).
        </p>
        <div className="grid sm:grid-cols-2 gap-3 items-end">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Outil</span>
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={promoToolSlug}
              onChange={(e) => setPromoToolSlug(e.target.value)}
            >
              {flags.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.label_fr} ({f.slug})
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Fin de la promo (local)</span>
            <input
              type="datetime-local"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={promoExpires}
              onChange={(e) => setPromoExpires(e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Email</span>
            <input
              type="email"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={promoEmail}
              onChange={(e) => setPromoEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </label>
          <label className="flex items-start gap-2 sm:col-span-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <input
              type="checkbox"
              className="mt-1 rounded border-border"
              checked={promoEarlyAdopter}
              onChange={(e) => setPromoEarlyAdopter(e.target.checked)}
            />
            <span className="text-sm text-muted-foreground">
              Tag early adopter (bannière marketing + livre + pricing)
            </span>
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs font-medium text-muted-foreground">Note interne (optionnel)</span>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={promoNote}
              onChange={(e) => setPromoNote(e.target.value)}
              placeholder="Partenaire, beta…"
            />
          </label>
          <button
            type="button"
            onClick={addPromo}
            disabled={!promoEmail.includes('@') || !promoExpires}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aigile-gold hover:bg-book-orange text-black text-sm font-semibold disabled:opacity-50 sm:col-span-2 w-fit"
          >
            <UserPlus className="w-4 h-4" />
            Enregistrer la promo
          </button>
        </div>

        <ul className="divide-y divide-border rounded-lg border border-border text-sm">
          {promos.length === 0 && (
            <li className="px-4 py-3 text-muted-foreground">Aucune promo enregistrée.</li>
          )}
          {promos.map((p) => (
            <li key={`${p.email}-${p.tool_slug}`} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div>
                  <span className="font-medium">{p.email}</span>
                  <code className="ml-2 text-xs bg-muted px-1 rounded">{p.tool_slug}</code>
                  {p.early_adopter && (
                    <span className="ml-2 text-xs font-semibold text-aigile-gold">early adopter</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  jusqu’au {new Date(p.expires_at).toLocaleString('fr-FR')}
                  {p.note ? ` — ${p.note}` : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePromo(p.email, p.tool_slug)}
                className="text-destructive hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <Trash2 className="w-4 h-4" /> Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
