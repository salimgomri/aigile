import type { SourceUrl } from '@/lib/intelligence/types'
import {
  COLLECTOR_PAIR_DOCTRINES_EN,
  COLLECTOR_PAIR_DOCTRINES_FR,
  getCollectorTheme,
  pairKey,
} from '@/lib/intelligence/collector-themes'

export type CollectorItem = {
  tierId: string
  tierTitle: string
  groupName: string
  urls: SourceUrl[]
}

export function humanTimeNow(lang: 'fr' | 'en'): string {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

export function buildDailyDoctrine(items: CollectorItem[], lang: 'fr' | 'en'): string {
  if (items.length === 0) {
    return lang === 'fr'
      ? 'Sélectionnez des sources pour générer votre doctrine du jour.'
      : 'Pick sources to generate today’s doctrine.'
  }

  const names = items.map((i) => i.groupName)

  if (items.length >= 2) {
    const [a, b] = [...names].sort((x, y) => x.localeCompare(y, 'fr')).slice(0, 2)
    const key = pairKey(a, b)
    const pairs = lang === 'fr' ? COLLECTOR_PAIR_DOCTRINES_FR : COLLECTOR_PAIR_DOCTRINES_EN
    const hit = pairs[key]
    if (hit) return hit
  }

  if (items.length === 1) {
    const t = getCollectorTheme(items[0]!.groupName)
    const thesis = lang === 'fr' ? t.thesisFr : t.thesisEn
    return lang === 'fr' ? `${thesis} — votre axe stratégique du jour.` : `${thesis} — your strategic line for today.`
  }

  const fragments = names.slice(0, 3).map((n) => {
    const t = getCollectorTheme(n)
    return lang === 'fr' ? t.thesisFr : t.thesisEn
  })

  if (lang === 'fr') {
    return `${fragments.join(' · ')} — convergence : clarifiez le problème utilisateur avant d’accélérer la distribution.`
  }
  return `${fragments.join(' · ')} — converge: clarify the user problem before scaling distribution.`
}

export function formatSmartCopyForGpt(items: CollectorItem[], lang: 'fr' | 'en'): string {
  const when = humanTimeNow(lang)
  const doctrine = buildDailyDoctrine(items, lang)

  const header =
    lang === 'fr'
      ? `=== Doctrine du jour (${when}) ===\n${doctrine}\n\n=== Sources ===\n`
      : `=== Daily doctrine (${when}) ===\n${doctrine}\n\n=== Sources ===\n`

  const lines = items.map((item) => {
    const theme = getCollectorTheme(item.groupName)
    const keys = lang === 'fr' ? theme.keyPointsFr : theme.keyPointsEn
    const points = keys.join(' · ')
    return `[${item.groupName}] | ${when} | ${points}`
  })

  return `${header}${lines.join('\n')}\n`
}
