'use client'

import { useEffect, useMemo } from 'react'
import { ExternalLink, X } from 'lucide-react'

import type { SourceUrl } from '@/lib/intelligence/types'
import {
  faviconUrlForPageUrl,
  normalizeIntelUrl,
  youtubeThumbnailUrlForPageUrl,
} from '@/lib/intelligence/media-metadata-shared'
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

function primaryRawFromRow(r: ReaderFeedRow | undefined): {
  body: string
  source: 'content' | 'transcript' | 'none'
} {
  if (!r) return { body: '', source: 'none' }
  const c = (r.content ?? '').trim()
  if (c.length > 0) return { body: c, source: 'content' }
  const t = (r.transcript_text ?? '').trim()
  if (t.length > 0) return { body: t, source: 'transcript' }
  return { body: '', source: 'none' }
}

function buildRowLookup(rows: ReaderFeedRow[]): Map<string, ReaderFeedRow> {
  const m = new Map<string, ReaderFeedRow>()
  for (const row of rows) {
    m.set(row.url, row)
    m.set(normalizeIntelUrl(row.url), row)
  }
  return m
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

  const lookup = useMemo(() => buildRowLookup(rows), [rows])

  useEffect(() => {
    if (!open) return
    console.log('[IntelReaderModal]', { tierTitle, groupName, urls, rows })
  }, [open, tierTitle, groupName, urls, rows])

  if (!open) return null

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
              const row = lookup.get(u.href) ?? lookup.get(normalizeIntelUrl(u.href))
              const { body, source } = primaryRawFromRow(row)
              const thumb =
                row?.thumbnail_url?.trim() ||
                (u.kind === 'youtube' ? youtubeThumbnailUrlForPageUrl(u.href) : null) ||
                faviconUrlForPageUrl(u.href)

              const summaryDb = (row?.summary ?? '').trim()

              const sourceHint =
                source === 'content'
                  ? lang === 'fr'
                    ? '(colonne content)'
                    : '(content column)'
                  : source === 'transcript'
                    ? lang === 'fr'
                      ? '(colonne transcript_text)'
                      : '(transcript_text column)'
                    : ''

              const technicalEmpty =
                lang === 'fr'
                  ? [
                      '--- Diagnostic ---',
                      `Aucune donnée brute dans content ni transcript_text pour cette entrée.`,
                      row ? `id : ${row.id}` : 'id : (ligne feed introuvable — mismatch URL ?)',
                      row ? `statut : ${row.status}` : '',
                      row
                        ? `len(content)=${(row.content ?? '').length} · len(transcript_text)=${(row.transcript_text ?? '').length} · len(summary)=${(row.summary ?? '').length}`
                        : '',
                      row?.transcript_error
                        ? `transcript_error : ${row.transcript_error}`
                        : 'transcript_error : (vide)',
                      '',
                      'Actions : vérifier Supabase intel_feed_items pour cette URL ; relancer « Analyser » ; contrôler que l’API /feed renvoie bien les colonnes snake_case.',
                    ]
                      .filter(Boolean)
                      .join('\n')
                  : [
                      '--- Diagnostics ---',
                      `No raw text in content or transcript_text.`,
                      row ? `id: ${row.id}` : 'id: (no feed row — URL mismatch?)',
                      row ? `status: ${row.status}` : '',
                      row
                        ? `len(content)=${(row.content ?? '').length} · len(transcript_text)=${(row.transcript_text ?? '').length} · len(summary)=${(row.summary ?? '').length}`
                        : '',
                      row?.transcript_error ? `transcript_error: ${row.transcript_error}` : 'transcript_error: (empty)',
                      '',
                      'Check intel_feed_items in Supabase; re-run Analyze; verify GET /feed returns snake_case columns.',
                    ]
                      .filter(Boolean)
                      .join('\n')

              return (
                <li key={u.href} className="rounded-xl border border-border/70 bg-card/50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div
                      className={cn(
                        'relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:h-28 sm:w-44',
                      )}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="px-2 text-center text-[10px] text-muted-foreground">
                          {lang === 'fr' ? 'Aperçu indisponible' : 'No preview'}
                        </span>
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
                        {row ? ` · ${row.status}` : ''} {sourceHint}
                      </p>

                      {body.length > 0 ? (
                        <pre className="mt-3 max-h-[min(420px,48vh)] overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/40 p-3 font-sans text-[13px] leading-relaxed text-foreground/95">
                          {body}
                        </pre>
                      ) : (
                        <>
                          {summaryDb.length > 0 ? (
                            <p className="mt-2 rounded border border-amber-500/35 bg-amber-950/20 px-2 py-1.5 text-[11px] text-amber-100/90">
                              {lang === 'fr'
                                ? `Résumé BDD uniquement (pas de corps brut) — ${summaryDb.slice(0, 320)}${summaryDb.length > 320 ? '…' : ''}`
                                : `DB summary only (no raw body) — ${summaryDb.slice(0, 320)}${summaryDb.length > 320 ? '…' : ''}`}
                            </p>
                          ) : null}
                          <pre className="mt-3 max-h-[min(260px,32vh)] overflow-auto whitespace-pre-wrap break-words rounded-md border border-red-500/30 bg-red-950/15 p-3 font-mono text-[11px] leading-snug text-red-100/95">
                            {technicalEmpty}
                          </pre>
                        </>
                      )}
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
