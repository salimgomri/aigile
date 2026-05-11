'use client'

import { ExternalLink, X } from 'lucide-react'

import type { SourceUrl } from '@/lib/intelligence/types'
import { youtubeThumbnailUrlForPageUrl } from '@/lib/intelligence/media-metadata-shared'
import { cn } from '@/lib/utils'

export type ReaderFeedRow = {
  id: string
  url: string
  url_kind: string
  status: string
  thumbnail_url: string | null
  summary: string | null
  content: string | null
  transcript_text: string | null
}

type Props = {
  open: boolean
  onClose: () => void
  tierTitle: string
  groupName: string
  urls: SourceUrl[]
  rows: ReaderFeedRow[]
  language: 'fr' | 'en'
}

function rawTextFromRow(r: ReaderFeedRow): string {
  const a = (r.content ?? '').trim()
  if (a.length > 0) return a
  const b = (r.transcript_text ?? '').trim()
  if (b.length > 0) return b
  const c = (r.summary ?? '').trim()
  return c.length > 0 ? c : ''
}

export function IntelligenceSourceReaderModal({
  open,
  onClose,
  tierTitle,
  groupName,
  urls,
  rows,
  language,
}: Props) {
  const lang = language === 'fr' ? 'fr' : 'en'

  if (!open) return null

  const byUrl = new Map(rows.map((x) => [x.url, x]))

  return (
    <div className="fixed inset-0 z-[190] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intel-reader-title"
        className="relative flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/12 bg-background shadow-2xl sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border/80 px-5 py-4">
          <div className="min-w-0">
            <p id="intel-reader-title" className="truncate text-lg font-semibold text-foreground">
              {groupName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{tierTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <ul className="space-y-8">
            {urls.map((u) => {
              const row = byUrl.get(u.href)
              const thumb =
                row?.thumbnail_url?.trim() ||
                (u.kind === 'youtube' ? youtubeThumbnailUrlForPageUrl(u.href) : null)
              const raw = row ? rawTextFromRow(row) : ''
              const emptyMsg =
                lang === 'fr'
                  ? 'Pas encore de texte en base pour cette URL. Lancez « Synchroniser depuis YAML » puis « Analyser » sur la carte du flux, ou ouvrez le lien.'
                  : 'No stored text yet for this URL. Run YAML sync then Analyze on the feed card, or open the link.'

              return (
                <li key={u.href} className="rounded-xl border border-border/70 bg-card/50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div
                      className={cn(
                        'relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-28 sm:w-44',
                      )}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-muted-foreground">
                          {lang === 'fr' ? 'Pas de miniature' : 'No thumbnail'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <a
                        href={u.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1.5 break-all text-sm font-medium text-aigile-gold hover:underline"
                      >
                        <span>{u.href}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                      </a>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                        {u.kind}
                        {row ? ` · ${row.status}` : ''}
                      </p>
                      <pre className="mt-3 max-h-[min(340px,42vh)] overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/40 p-3 font-sans text-[13px] leading-relaxed text-foreground/95">
                        {raw.length > 0 ? raw : emptyMsg}
                      </pre>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
