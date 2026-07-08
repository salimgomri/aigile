'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { PulseButton } from '@/components/admin/pulse-button'
import { useAdminIntelligencePulse } from '@/components/admin/use-admin-intelligence-pulse'

type Layout = 'landing' | 'dashboard' | 'hub'

export function AdminIntelligenceToolCard({ layout = 'landing' }: { layout?: Layout }) {
  const { language } = useLanguage()
  const { loaded, variant, acknowledge } = useAdminIntelligencePulse()

  const shimmer = (
    <div className="h-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-aigile-gold/28 to-transparent opacity-90" />
  )

  if (!loaded) {
    if (layout === 'dashboard' || layout === 'hub') {
      return (
        <div
          className={layout === 'hub' ? 'db-tool-tile db-tool-tile--disabled animate-pulse min-h-[160px]' : 'min-h-[104px] animate-pulse rounded-2xl border border-border bg-muted/20'}
          aria-hidden
        />
      )
    }
    return (
      <li className="min-h-[220px] animate-pulse rounded-2xl border border-border bg-muted/20 p-5" aria-hidden />
    )
  }

  if (layout === 'hub') {
    return (
      <Link href="/admin/intelligence" className="db-intel-tile" onClick={acknowledge}>
        <PulseButton variant={variant} shimmerLayer={shimmer} className="db-intel-tile__inner">
          <div className="db-intel-tile__row">
            <span className="db-tool-tile__icon">
              <Sparkles size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <span className="db-tool-tile__live" aria-hidden />
          </div>
          <h2 className="!m-0 text-[17px] font-bold tracking-tight">Intelligence</h2>
          <p className="!m-0 text-[13.5px] leading-relaxed text-[var(--ld-muted)]">
            {language === 'fr'
              ? 'Veille opérationnelle : flux YAML, vitalité, transcripts.'
              : 'Operational radar: YAML feed, vitality, transcripts.'}
          </p>
          <span className="db-tool-tile__cta">
            {language === 'fr' ? 'Ouvrir' : 'Open'}
            <ArrowRight size={14} aria-hidden />
          </span>
        </PulseButton>
      </Link>
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
                ? 'Veille opérationnelle : flux YAML, vitalité, transcripts.'
                : 'Operational radar: YAML feed, vitality, transcripts.'}
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
              Intelligence workspace
            </span>
            <span className="mt-2 text-sm text-muted-foreground">
              Flux synchronisé, collector doctrine, mode lecture.
            </span>
            <span className="text-xs text-muted-foreground/80" lang="en">
              Feed sync, doctrine synthesis, reader mode.
            </span>
          </div>
        </PulseButton>
      </Link>
    </li>
  )
}
