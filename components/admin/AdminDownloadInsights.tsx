'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Download } from 'lucide-react'
import type { DownloadInsights } from '@/lib/admin/aggregate-download-stats'

type Props = {
  insights: DownloadInsights
}

export function AdminDownloadInsights({ insights }: Props) {
  return (
    <div className="mb-8 p-6 rounded-xl border border-border bg-card">
      <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
        <Download className="w-5 h-5 text-aigile-gold" />
        Téléchargements ressources
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        Guides, affiches et manifeste (anonymes ou connectés). Exports PDF outils via crédits en bas.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xl font-bold text-foreground">{insights.totals.publicDownloads}</p>
          <p className="text-xs text-muted-foreground">Ressources publiques</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xl font-bold text-foreground">{insights.totals.last7DaysPublic}</p>
          <p className="text-xs text-muted-foreground">7 derniers jours</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xl font-bold text-foreground">{insights.totals.last30DaysPublic}</p>
          <p className="text-xs text-muted-foreground">30 derniers jours</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xl font-bold text-foreground">{insights.totals.toolPdfExports}</p>
          <p className="text-xs text-muted-foreground">Exports PDF outils</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Ressources publiques</p>
          <div className="space-y-2">
            {insights.publicAssets.map((a) => (
              <div key={a.asset} className="flex justify-between items-start gap-3 text-sm">
                <span>{a.label}</span>
                <span className="text-foreground font-medium text-right shrink-0">
                  {a.total_downloads} dl
                  {a.unique_users > 0 && ` · ${a.unique_users} users`}
                  {a.unique_visitors > 0 && ` · ${a.unique_visitors} visiteurs`}
                </span>
              </div>
            ))}
            {insights.publicAssets.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun téléchargement enregistré</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Exports PDF outils (crédits)</p>
          <div className="space-y-2">
            {insights.toolPdfExports.map((a) => (
              <div key={a.asset} className="flex justify-between items-center text-sm">
                <span>{a.label}</span>
                <span className="text-foreground font-medium">
                  {a.total_downloads} · {a.unique_users} users
                </span>
              </div>
            ))}
            {insights.toolPdfExports.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun export PDF</p>
            )}
          </div>
        </div>
      </div>

      {insights.recentPublic.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Derniers téléchargements publics</p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {insights.recentPublic.map((r, i) => (
              <div key={i} className="flex justify-between items-center text-xs gap-2">
                <span className="truncate">
                  {r.label}
                  {r.user_name || r.user_email
                    ? ` · ${r.user_name || r.user_email?.split('@')[0]}`
                    : ' · anonyme'}
                  {r.source ? ` (${r.source})` : ''}
                </span>
                <span className="text-muted-foreground shrink-0">
                  {format(new Date(r.created_at), 'd MMM HH:mm', { locale: fr })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
