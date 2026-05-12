'use client'

import { useMemo } from 'react'

import { IntelligenceAppleApp } from '@/components/admin/intelligence-apple-app'
import type { IntelligenceSourcesFile } from '@/lib/intelligence/types'

/** Palier masqué sur cette page (focus géants / stratégie — pas coaching RH). */
const EXCLUDED_INTELLIGENCE_TIER_IDS = new Set(['coaching_leadership'])

export function AdminIntelligenceClient({ sources }: { sources: IntelligenceSourcesFile }) {
  const filtered = useMemo(() => {
    return {
      ...sources,
      tiers: sources.tiers.filter((t) => !EXCLUDED_INTELLIGENCE_TIER_IDS.has(t.id)),
    }
  }, [sources])

  return <IntelligenceAppleApp sources={filtered} />
}
