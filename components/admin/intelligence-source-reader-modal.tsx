'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
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
  transcript_error: string | null
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

/** Découpe un flux brut en paragraphes lisibles (double saut de ligne, sinon lignes). */
function splitReadingBody(text: string): string[] {
  const n = text.replace(/\r\n/g, '\n').trim()
  if (!n) return []
  const blocks = n
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (blocks.length > 1) return blocks
  return n
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const lookup = useMemo(() => buildRowLookup(rows), [rows])

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open || !mounted || typeof document === 'undefined') return null

  const shell = (
    <div
      className="fixed inset-0 z-[10020] flex items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
      role="presentation"
    >
      <button
        type="button"
        aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intel-reader-title"
        className={cn(
          'relative flex max-h-[min(88vh,820px)] w-full max-w-[min(100%,42rem)] flex-col overflow-hidden rounded-[22px]',
          'border border-white/[0.09] bg-[#0d0d0f]/[0.97] shadow-[0_25px_80px_-12px_rgba(0,0,0,0.65)]',
          'ring-1 ring-white/[0.06]',
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div className="min-w-0 font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
            <p id="intel-reader-title" className="truncate text-[17px] font-semibold tracking-[-0.02em] text-white">
              {groupName}
            </p>
            <p className="mt-0.5 truncate text-[12px] font-medium tracking-wide text-white/45">{tierTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white"
            aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <ul className="space-y-10">
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
                    ? 'content'
                    : 'content'
                  : source === 'transcript'
                    ? lang === 'fr'
                      ? 'transcript'
                      : 'transcript'
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

              const paragraphs = splitReadingBody(body)

              return (
                <li
                  key={u.href}
                  className="rounded-[18px] border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div
                      className={cn(
                        'relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/35 sm:h-32 sm:w-[11.5rem]',
                      )}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="px-2 text-center text-[11px] text-white/40">
                          {lang === 'fr' ? 'Aperçu indisponible' : 'No preview'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
                      <a
                        href={u.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1.5 break-all text-[14px] font-medium text-[#e8c770] hover:text-[#f0d78a]"
                      >
                        <span>{u.href}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                      </a>
                      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/38">
                        {u.kind}
                        {row ? ` · ${row.status}` : ''}
                        {sourceHint ? ` · ${sourceHint}` : ''}
                      </p>

                      {body.length > 0 ? (
                        <article
                          className="mt-5 max-w-[62ch] border-t border-white/[0.06] pt-5"
                          lang={lang}
                        >
                          {paragraphs.map((p, i) => (
                            <p
                              key={i}
                              className="mb-4 text-[15px] font-normal leading-[1.65] tracking-[-0.011em] text-[#ececec] last:mb-0"
                            >
                              {p}
                            </p>
                          ))}
                        </article>
                      ) : (
                        <>
                          {summaryDb.length > 0 ? (
                            <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-950/25 px-3 py-2 text-[12px] leading-snug text-amber-100/90">
                              {lang === 'fr'
                                ? `Résumé BDD uniquement (pas de corps brut) — ${summaryDb.slice(0, 320)}${summaryDb.length > 320 ? '…' : ''}`
                                : `DB summary only (no raw body) — ${summaryDb.slice(0, 320)}${summaryDb.length > 320 ? '…' : ''}`}
                            </p>
                          ) : null}
                          <pre className="mt-4 max-h-[min(260px,32vh)] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-red-500/25 bg-red-950/20 p-3 font-mono text-[11px] leading-snug text-red-100/95">
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

  return createPortal(shell, document.body)
}
