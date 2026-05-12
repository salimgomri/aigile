'use client'

import { useMemo, useState, type ReactNode } from 'react'

import { IntelligenceImmersiveReader } from '@/components/admin/intelligence-immersive-reader'

import { IntelligenceSourcesMatrix } from '@/components/admin/intelligence-sources-matrix'
import { IntelligenceVitalityFeedDeck } from '@/components/admin/intelligence-vitality-feed-deck'
import { useLanguage } from '@/components/language-provider'
import type { IntelligenceSourcesFile } from '@/lib/intelligence/types'
import { cn } from '@/lib/utils'

/** Palier masqué sur cette page (focus géants / stratégie — pas coaching RH). */
const EXCLUDED_INTELLIGENCE_TIER_IDS = new Set(['coaching_leadership'])

function utcDayOffset(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function RotationDayNav({
  value,
  onChange,
  actions,
}: {
  value: string
  onChange: (isoDay: string) => void
  actions?: ReactNode
}) {
  const { language } = useLanguage()
  const fr = language === 'fr'

  const pills = [
    { label: fr ? "J (UTC)" : 'Today (UTC)', day: utcDayOffset(0) },
    { label: 'J-1', day: utcDayOffset(-1) },
    { label: 'J-2', day: utcDayOffset(-2) },
  ]

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/30 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {fr ? 'Jour de rotation (UTC)' : 'Rotation day (UTC)'}
        </span>
        {pills.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.day)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              value === p.day
                ? 'border-aigile-gold bg-aigile-gold/15 text-aigile-gold'
                : 'border-border/80 bg-background/60 text-muted-foreground hover:border-aigile-gold/40 hover:text-foreground',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="whitespace-nowrap text-xs uppercase tracking-wide">
            {fr ? 'Calendrier' : 'Calendar'}
          </span>
          <input
            type="date"
            value={value}
            onChange={(e) => {
              const v = e.target.value
              if (/^\d{4}-\d{2}-\d{2}$/.test(v)) onChange(v)
            }}
            className="rounded-lg border border-border/80 bg-background px-2 py-1.5 text-sm text-foreground"
          />
        </label>
        {actions}
      </div>
    </div>
  )
}

export function AdminIntelligenceClient({ sources }: { sources: IntelligenceSourcesFile }) {
  const [rotationDay, setRotationDay] = useState(() => utcDayOffset(0))

  const filtered = useMemo(() => {
    return {
      ...sources,
      tiers: sources.tiers.filter((t) => !EXCLUDED_INTELLIGENCE_TIER_IDS.has(t.id)),
    }
  }, [sources])

  return (
    <>
      <RotationDayNav
        value={rotationDay}
        onChange={setRotationDay}
        actions={<IntelligenceImmersiveReader rotationDay={rotationDay} tiers={filtered.tiers} />}
      />
      <IntelligenceVitalityFeedDeck rotationDay={rotationDay} />
      <IntelligenceSourcesMatrix data={filtered} rotationDay={rotationDay} />
    </>
  )
}
