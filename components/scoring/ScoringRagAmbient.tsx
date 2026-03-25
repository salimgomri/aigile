'use client'

import type { RAGStatus } from '@/types/scoring'

/** Fond d’ambiance teinté RAG (vert / orange / rouge) — sous le contenu, au-dessus du fond page */
export function ScoringRagAmbient({ rag }: { rag: RAGStatus }) {
  const isGreen = rag === 'green'
  const isRed = rag === 'red'
  const primary = isGreen
    ? 'from-emerald-500/30 via-green-500/18'
    : isRed
      ? 'from-red-500/28 via-rose-600/15'
      : 'from-amber-500/28 via-orange-500/20'
  const secondary = isGreen
    ? 'from-lime-400/18 via-emerald-600/12'
    : isRed
      ? 'from-orange-600/18 via-red-900/15'
      : 'from-yellow-500/20 via-amber-600/14'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden
    >
      <div
        className={`absolute left-[5%] top-[12%] h-[min(92vw,580px)] w-[min(92vw,580px)] animate-pulse rounded-full bg-gradient-to-br ${primary} to-transparent blur-3xl`}
      />
      <div
        className={`absolute bottom-[8%] right-[5%] h-[min(100vw,680px)] w-[min(100vw,680px)] animate-pulse rounded-full bg-gradient-to-br ${secondary} to-transparent blur-3xl`}
        style={{ animationDelay: '1s' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-slate-950/20 to-black/70" />
    </div>
  )
}
