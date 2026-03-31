'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, AlertCircle, SkipForward } from 'lucide-react'

type SyncResult = {
  imported: number
  skipped: number
  skippedMissingEmail: number
  feesBackfilled: number
  errors: Array<{ sessionId: string; message: string }>
  has_more: boolean
  next_starting_after: string | null
}

export default function AdminStripeSyncPage() {
  const [limit, setLimit] = useState(50)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<SyncResult | null>(null)
  const [totals, setTotals] = useState({ imported: 0, skipped: 0, skippedMissingEmail: 0, feesBackfilled: 0 })

  async function runSync(nextCursor: string | null) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/stripe-orders-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limit,
          ...(nextCursor ? { starting_after: nextCursor } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erreur')
        return
      }
      const r = data as SyncResult
      setLastResult(r)
      setTotals((t) => ({
        imported: t.imported + r.imported,
        skipped: t.skipped + r.skipped,
        skippedMissingEmail: t.skippedMissingEmail + r.skippedMissingEmail,
        feesBackfilled: t.feesBackfilled + (r.feesBackfilled ?? 0),
      }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  function resetRun() {
    setLastResult(null)
    setTotals({ imported: 0, skipped: 0, skippedMissingEmail: 0, feesBackfilled: 0 })
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">Sync Stripe → commandes</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Importe depuis Stripe les sessions Checkout <strong>terminées</strong> qui ne sont pas encore dans la base.
        Les commandes déjà présentes ne sont pas dupliquées ; si <code className="text-xs bg-muted px-1 rounded">stripe_fee_amount</code> manque encore, la sync le remplit depuis Stripe. Pas d’emails ni de crédits.
      </p>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Sessions par lot (max 100)</span>
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(e) => setLimit(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 50)))}
            className="border border-border rounded-md px-3 py-2 bg-background w-28"
            disabled={loading}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            resetRun()
            void runSync(null)
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-aigile-gold text-black font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Synchronisation…' : 'Lancer la synchronisation'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {lastResult && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">Dernier lot</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>
                <strong>{lastResult.imported}</strong> importée(s)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <SkipForward className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>
                <strong>{lastResult.skipped}</strong> déjà en base (ignorée(s))
              </span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <span>
                <strong>{lastResult.skippedMissingEmail}</strong> sans email acheteur (ignorée(s))
              </span>
            </li>
            {(lastResult.feesBackfilled ?? 0) > 0 && (
              <li className="flex items-center gap-2 text-muted-foreground">
                <span>
                  <strong>{lastResult.feesBackfilled}</strong> ligne(s) déjà en base : frais Stripe complétés
                </span>
              </li>
            )}
          </ul>

          {lastResult.errors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-destructive mb-2">Erreurs</p>
              <ul className="text-xs font-mono space-y-1 max-h-40 overflow-auto">
                {lastResult.errors.map((e) => (
                  <li key={e.sessionId}>
                    {e.sessionId}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(totals.imported > lastResult.imported || totals.skipped > lastResult.skipped) && (
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Cumul session : {totals.imported} importée(s), {totals.skipped} ignorée(s) déjà en base,{' '}
              {totals.skippedMissingEmail} sans email
              {totals.feesBackfilled > 0 ? `, ${totals.feesBackfilled} frais Stripe complétés` : ''}.
            </p>
          )}

          {lastResult.has_more && lastResult.next_starting_after && (
            <button
              type="button"
              disabled={loading}
              onClick={() => void runSync(lastResult.next_starting_after)}
              className="mt-4 w-full rounded-md border border-border py-2 text-sm font-medium hover:bg-muted/50 disabled:opacity-50"
            >
              Charger le lot suivant ({lastResult.next_starting_after.slice(0, 14)}…)
            </button>
          )}

          {!lastResult.has_more && totals.imported + totals.skipped + totals.skippedMissingEmail > 0 && (
            <p className="text-sm text-muted-foreground">Fin de la liste Stripe pour cette recherche.</p>
          )}
        </div>
      )}
    </div>
  )
}
