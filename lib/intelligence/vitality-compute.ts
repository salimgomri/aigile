import type { UrlKind } from '@/lib/intelligence/types'

const EMPIRE_TIER = 'empire_builders'
export const EMPIRE_VITALITY_MULTIPLIER = 2.0

/** URLs garanties « prêtes » pour démo produit (score élevé sans scrape réel). */
const DEMO_HIGH_VITALITY_URLS = new Set([
  'https://www.paulgraham.com/articles.html',
  'http://www.paulgraham.com/articles.html',
])

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url.trim())
    u.hash = ''
    let out = u.href
    if (out.endsWith('/') && u.pathname !== '/') out = out.slice(0, -1)
    return out
  } catch {
    return url.trim()
  }
}

function hashSignal(url: string): number {
  let h = 2166136261
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/** Plancher déterministe par palier (signal brut avant boost Empire). */
function tierFloor(tierId: string): number {
  switch (tierId) {
    case EMPIRE_TIER:
      return 26
    case 'wealth_architects':
      return 22
    case 'product_elite':
      return 24
    case 'agile_scale':
      return 21
    case 'coaching_leadership':
      return 19
    case 'podcasts_audio':
      return 18
    default:
      return 18
  }
}

export type VitalityComputeResult = {
  score: number
  empireBoostApplied: number
}

export function computeVitalityScore(input: {
  tierId: string
  url: string
  urlKind: UrlKind
}): VitalityComputeResult {
  const nu = normalizeUrl(input.url)
  if (DEMO_HIGH_VITALITY_URLS.has(nu) || DEMO_HIGH_VITALITY_URLS.has(input.url.trim())) {
    return { score: 94, empireBoostApplied: input.tierId === EMPIRE_TIER ? EMPIRE_VITALITY_MULTIPLIER : 1 }
  }

  const sig = hashSignal(nu) % 34
  const floor = tierFloor(input.tierId)
  let raw = floor + sig

  if (input.urlKind === 'podcast') raw += 4
  if (input.urlKind === 'youtube') raw += 3

  const empireBoost = input.tierId === EMPIRE_TIER ? EMPIRE_VITALITY_MULTIPLIER : 1
  let score = Math.round(raw * empireBoost)
  score = Math.min(100, Math.max(0, score))

  return { score, empireBoostApplied: empireBoost }
}

export const TRANSCRIPT_AUTO_THRESHOLD = 90

export function isDemoPaulArticlesUrl(url: string): boolean {
  const nu = normalizeUrl(url)
  return DEMO_HIGH_VITALITY_URLS.has(nu) || DEMO_HIGH_VITALITY_URLS.has(url.trim())
}
