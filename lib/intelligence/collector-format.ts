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
  /** Ligne `intel_feed_items` résolue pour cette entrée */
  feedItemId?: string
  vitality_score?: number | null
  summary?: string | null
  content?: string | null
  thumbnail_url?: string | null
  primaryUrl?: string | null
  feedStatus?: 'pending' | 'analyzing' | 'ready' | 'error'
  /** Aucune ligne BDD pour cette sélection (sync requise) */
  feedPending?: boolean
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

function sentencesFromText(raw: string, max = 5): string[] {
  const s = raw.replace(/\s+/g, ' ').trim()
  if (!s) return []
  const parts = s.split(/(?<=[.!?])\s+/).filter((p) => p.length > 16)
  const out = parts.slice(0, max).map((p) => p.slice(0, 140))
  if (out.length === 0 && s.length > 0) out.push(s.slice(0, 200))
  return out
}

/** Points clés pour Smart Copy : contenu réel d’abord, sinon thème YAML, sinon message d’attente. */
export function keyPointsForSmartCopy(item: CollectorItem, lang: 'fr' | 'en'): string[] {
  const fromDb = sentencesFromText((item.content ?? '').trim(), 5)
  if (fromDb.length > 0) return fromDb
  const fromSummary = sentencesFromText((item.summary ?? '').trim(), 3)
  if (fromSummary.length > 0) return fromSummary

  if (item.feedPending || item.feedStatus === 'pending' || item.feedStatus === 'analyzing') {
    return [
      lang === 'fr' ? 'Contenu en cours de collecte — synchronisez ou lancez l’analyse.' : 'Content pending — sync or run analysis.',
    ]
  }

  const theme = getCollectorTheme(item.groupName)
  return lang === 'fr' ? theme.keyPointsFr.slice(0, 5) : theme.keyPointsEn.slice(0, 5)
}

/** Doctrine heuristique sans IA (thèmes YAML + paires), utilisée en secours client. */
export function buildDailyDoctrineHeuristic(items: CollectorItem[], lang: 'fr' | 'en'): string {
  const withSummary = items.filter((i) => (i.summary ?? '').trim().length > 0)
  if (withSummary.length >= 2) {
    const [x, y] = withSummary.slice(0, 2)
    const a = (x.summary ?? '').trim()
    const b = (y.summary ?? '').trim()
    return lang === 'fr'
      ? `${a} · ${b} — convergence : reliez intention stratégique et preuve terrain.`
      : `${a} · ${b} — converge strategic intent with ground truth.`
  }
  if (withSummary.length === 1) {
    const s = (withSummary[0]!.summary ?? '').trim()
    const v = withSummary[0]!.vitality_score
    const score =
      typeof v === 'number' && Number.isFinite(v)
        ? lang === 'fr'
          ? ` Vitalité ${Math.round(v)}.`
          : ` Vitality ${Math.round(v)}.`
        : ''
    return lang === 'fr' ? `${s} — axe du jour.${score}` : `${s} — today’s line.${score}`
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

  if (items.length === 0) {
    return lang === 'fr'
      ? 'Sélectionnez des sources synchronisées pour générer votre doctrine du jour.'
      : 'Pick synced sources to generate today’s doctrine.'
  }

  if (lang === 'fr') {
    return `${fragments.join(' · ')} — convergence : clarifiez le problème utilisateur avant d’accélérer la distribution.`
  }
  return `${fragments.join(' · ')} — converge: clarify the user problem before scaling distribution.`
}

export function formatSmartCopyForGpt(items: CollectorItem[], lang: 'fr' | 'en', doctrineLine: string): string {
  const when = humanTimeNow(lang)

  const header =
    lang === 'fr'
      ? `=== Doctrine du jour (${when}) ===\n${doctrineLine}\n\n=== Sources ===\n`
      : `=== Daily doctrine (${when}) ===\n${doctrineLine}\n\n=== Sources ===\n`

  const lines = items.map((item) => {
    const keys = keyPointsForSmartCopy(item, lang)
    const points = keys.join(' · ')
    const label =
      item.primaryUrl && item.primaryUrl.length > 0
        ? `${item.groupName} — ${item.primaryUrl}`
        : item.groupName
    return `[${label}] | ${when} | ${points}`
  })

  return `${header}${lines.join('\n')}\n`
}
