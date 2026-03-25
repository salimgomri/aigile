'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

type FlagRow = {
  slug: string
  label_fr: string
  label_en: string
  teaser_fr: string | null
  teaser_en: string | null
  launch_at: string
  tool_path: string
  invite_only: boolean
  updated_at?: string
}

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FlagRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = () => {
    fetch('/api/admin/feature-flags')
      .then((r) => r.json())
      .then((d) => {
        if (d.flags)
          setFlags(
            d.flags.map((f: FlagRow) => ({
              ...f,
              invite_only: f.invite_only !== false,
            }))
          )
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const updateField = (slug: string, field: keyof FlagRow, value: string | boolean) => {
    setFlags((prev) => prev.map((f) => (f.slug === slug ? { ...f, [field]: value } : f)))
  }

  const save = async (slug: string) => {
    const row = flags.find((f) => f.slug === slug)
    if (!row) return
    setSaving(slug)
    setMessage(null)
    const launchIso = new Date(row.launch_at).toISOString()
    const res = await fetch(`/api/admin/feature-flags/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        launch_at: launchIso,
        teaser_fr: row.teaser_fr,
        teaser_en: row.teaser_en,
        label_fr: row.label_fr,
        label_en: row.label_en,
        tool_path: row.tool_path,
        invite_only: row.invite_only,
      }),
    })
    setSaving(null)
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setMessage(j.error || 'Erreur sauvegarde')
      return
    }
    setMessage('Enregistré.')
    load()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Chargement…
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feature flags</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Date de lancement : avant cette date, visiteurs = écran &quot;Coming soon&quot;. Les admins voient toujours
          l’outil complet. Après lancement, cochez « Accès sur invitation » pour limiter aux emails listés dans Accès /
          promos.
        </p>
      </div>

      {message && (
        <p className="text-sm text-aigile-gold" role="status">
          {message}
        </p>
      )}

      {flags.map((f) => (
        <div key={f.slug} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <code className="text-sm bg-muted px-2 py-1 rounded">{f.slug}</code>
            <span className="text-xs text-muted-foreground">
              {f.tool_path} — maj {f.updated_at ? new Date(f.updated_at).toLocaleString('fr-FR') : '—'}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Label FR</span>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={f.label_fr}
                onChange={(e) => updateField(f.slug, 'label_fr', e.target.value)}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Label EN</span>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={f.label_en}
                onChange={(e) => updateField(f.slug, 'label_en', e.target.value)}
              />
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <input
              type="checkbox"
              className="mt-1 rounded border-border"
              checked={f.invite_only}
              onChange={(e) => updateField(f.slug, 'invite_only', e.target.checked)}
            />
            <span className="text-sm">
              <span className="font-medium text-foreground">Accès sur invitation seulement</span>
              <span className="block text-muted-foreground text-xs mt-0.5">
                Si coché : après la date de lancement, seuls les admins et les emails invités (page Accès / promos)
                voient l’outil. Si décoché : tout utilisateur connecté peut y accéder.
              </span>
            </span>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-aigile-gold">Date / heure de lancement (UTC côté serveur)</span>
            <input
              type="datetime-local"
              className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={toDatetimeLocalValue(f.launch_at)}
              onChange={(e) => {
                const v = e.target.value
                if (!v) return
                const d = new Date(v)
                updateField(f.slug, 'launch_at', d.toISOString())
              }}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Teaser FR (envie / FOMO)</span>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={f.teaser_fr ?? ''}
              onChange={(e) => updateField(f.slug, 'teaser_fr', e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Teaser EN</span>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={f.teaser_en ?? ''}
              onChange={(e) => updateField(f.slug, 'teaser_en', e.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={() => save(f.slug)}
            disabled={saving === f.slug}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aigile-gold hover:bg-book-orange text-black text-sm font-semibold disabled:opacity-50"
          >
            {saving === f.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      ))}

      {flags.length === 0 && <p className="text-muted-foreground">Aucun flag — exécute la migration SQL 023.</p>}
    </div>
  )
}
