'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { PulseButton } from '@/components/admin/pulse-button'
import { useAdminIntelligencePulse } from '@/components/admin/use-admin-intelligence-pulse'

type Layout = 'landing' | 'dashboard'

export function AdminIntelligenceToolCard({ layout = 'landing' }: { layout?: Layout }) {
  const { language } = useLanguage()
  const { loaded, variant, acknowledge } = useAdminIntelligencePulse()

  const shimmer = (
    <div className="h-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-aigile-gold/28 to-transparent opacity-90" />
  )

  if (!loaded) {
    if (layout === 'dashboard') {
      return (
        <div
          className="min-h-[104px] animate-pulse rounded-2xl border border-border bg-muted/20"
          aria-hidden
        />
      )
    }
    return (
      <li className="min-h-[220px] animate-pulse rounded-2xl border border-border bg-muted/20 p-5" aria-hidden />
    )
  }

  if (layout === 'dashboard') {
    return (
      <Link
        href="/admin/intelligence"
        className="block h-full rounded-2xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-aigile-gold focus-visible:ring-offset-2"
        onClick={acknowledge}
      >
        <PulseButton
          variant={variant}
          shimmerLayer={shimmer}
          className="group flex h-full min-h-[104px] items-center gap-4 border border-border bg-card p-6 transition-all duration-200 hover:border-aigile-gold/50 hover:shadow-lg"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-aigile-gold/20 transition-colors group-hover:bg-aigile-gold/30">
            <Sparkles className="h-7 w-7 text-aigile-gold" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-foreground">Intelligence</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {language === 'fr'
                ? 'Sources Master, vitalité · Sprint 1'
                : 'Master signals, vitality · Sprint 1'}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-aigile-gold" />
        </PulseButton>
      </Link>
    )
  }

  return (
    <li>
      <Link
        href="/admin/intelligence"
        className="block h-full rounded-2xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-aigile-gold focus-visible:ring-offset-2"
        onClick={acknowledge}
      >
        <PulseButton
          variant={variant}
          shimmerLayer={shimmer}
          className="flex h-full flex-col border border-border bg-card/50 transition-colors hover:border-aigile-gold/40 hover:bg-card"
        >
          <div className="flex h-full flex-col p-5">
            <Sparkles className="mb-3 h-8 w-8 text-aigile-gold/90" aria-hidden />
            <span className="font-semibold text-foreground">Intelligence</span>
            <span className="text-xs text-muted-foreground" lang="en">
              Living anchor · Sprint 1
            </span>
            <span className="mt-2 text-sm text-muted-foreground">
              Sources Master, vitalité et couche « âme » admin.
            </span>
            <span className="text-xs text-muted-foreground/80" lang="en">
              Master signals, vitality, admin soul layer.
            </span>
          </div>
        </PulseButton>
      </Link>
    </li>
  )
}
