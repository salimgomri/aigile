'use client'

import Link from 'next/link'
import { Sparkles, BookOpen, Clock } from 'lucide-react'
import type { ToolCreditPromoInfo } from '@/lib/credits/tool-promo'

type Props = {
  toolLabel: string
  language: 'fr' | 'en'
  promo: ToolCreditPromoInfo
}

function formatEndDate(iso: string, lang: 'fr' | 'en') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EarlyAdopterToolBanner({ toolLabel, language, promo }: Props) {
  const end = formatEndDate(promo.expiresAt, language)

  if (!promo.earlyAdopter) {
    const simple =
      language === 'fr'
        ? `Crédits illimités sur « ${toolLabel} » jusqu’au ${end}.`
        : `Unlimited credits on « ${toolLabel} » until ${end}.`
    return (
      <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground flex items-center gap-2">
        <Clock className="w-4 h-4 text-aigile-gold shrink-0" />
        {simple}
      </div>
    )
  }

  const copy =
    language === 'fr'
      ? {
          badge: 'Early adopter',
          title: `Vous pilotez « ${toolLabel} » en avant-première`,
          lead: `Crédits illimités sur cet outil jusqu’au ${end}. Testez à fond, cassez les limites, remontez ce qui coince — vous façonnez la suite.`,
          tension:
            'Cette fenêtre se referme : après cette date, l’usage repasse sur vos crédits ou un abonnement Pro. Profitez-en pour valider le jeu avec votre équipe.',
          book:
            'Le système S.A.L.I.M. du livre détaille comment ancrer ces pratiques dans l’organisation (cadre, rituels, passage à l’échelle). C’est la base pour ne pas rester sur un « joli outil » mais industrialiser le gain.',
          ctaBook: 'Découvrir le livre S.A.L.I.M.',
          ctaPro: 'Voir les offres Pro',
        }
      : {
          badge: 'Early adopter',
          title: `You’re shaping « ${toolLabel} » before everyone else`,
          lead: `Unlimited credits on this tool until ${end}. Push it, break assumptions, send feedback — you’re co-building what’s next.`,
          tension:
            'This window closes: after that, usage counts against your credits or a Pro plan. Use the time to prove value with your team.',
          book:
            'The S.A.L.I.M. system in the book explains how to embed these practices in the org (rituals, scaling). It turns a “cool tool” into durable leverage.',
          ctaBook: 'Explore the S.A.L.I.M. book',
          ctaPro: 'See Pro plans',
        }

  return (
    <div className="rounded-2xl border border-aigile-gold/40 bg-gradient-to-br from-aigile-gold/15 via-background to-book-orange/10 p-6 md:p-8 shadow-lg shadow-aigile-gold/10">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-aigile-gold/25 text-foreground px-3 py-1 text-xs font-bold uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          {copy.badge}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {end}
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{copy.title}</h2>
      <p className="text-sm md:text-base text-foreground/90 leading-relaxed mb-3">{copy.lead}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3 border-l-2 border-aigile-gold/60 pl-3">
        {copy.tension}
      </p>
      <p className="text-sm text-foreground/85 leading-relaxed mb-6 flex gap-2">
        <BookOpen className="w-5 h-5 shrink-0 text-aigile-gold mt-0.5" />
        <span>{copy.book}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/#book"
          className="inline-flex items-center justify-center rounded-full bg-aigile-gold hover:bg-book-orange text-black font-semibold px-6 py-2.5 text-sm transition-colors"
        >
          {copy.ctaBook}
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted text-foreground font-medium px-6 py-2.5 text-sm transition-colors"
        >
          {copy.ctaPro}
        </Link>
      </div>
    </div>
  )
}
