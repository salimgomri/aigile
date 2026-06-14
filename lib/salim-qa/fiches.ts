import 'server-only'

import fs from 'fs'
import path from 'path'
import type { SalimQaQuestion } from './types'

/** Dossier privé des SVG — jamais dans `public/` */
export const FICHES_DIR = path.join(process.cwd(), 'config', 'fp')

/** IDs question autorisés en query `q=` (ex. P4-CH13-SM-01 ou CH14-CA-03) */
export const SALIM_QA_QUESTION_ID_RE = /^(?:P\d+-)?CH\d+-[A-Z0-9-]+$/i

/** Alias YAML (FP-P4-CH14-*) → fichiers réels (FP-IV-14.*) */
const FICHE_ALIASES: Record<string, string> = {
  'FP-P4-CH14-traduction-01': 'FP-IV-14.1-traduction',
  'FP-P4-CH14-6questions-01': 'FP-IV-14.2-6questions',
  'FP-P4-CH14-profils-01': 'FP-IV-14.3-profils',
  'FP-P4-CH14-regles-or-01': 'FP-IV-14.4-regles-or',
  'FP-P4-CH14-okr-30min-01': 'FP-IV-14.5-okr-30min',
  'FP-P4-CH14-suivi-decisions-01': 'FP-IV-14.6-suivi-decisions',
  'FP-P4-CH14-roadmap-01': 'FP-IV-14.7-roadmap-glissant',
  'FP-P4-CH14-arguments-scrum-01': 'FP-IV-14.8-arguments-scrum',
}

let availableStemsCache: Set<string> | null = null

function getAvailableStems(): Set<string> {
  if (availableStemsCache) return availableStemsCache
  try {
    availableStemsCache = new Set(
      fs
        .readdirSync(FICHES_DIR)
        .filter((f) => f.endsWith('.svg'))
        .map((f) => f.slice(0, -4))
    )
  } catch {
    availableStemsCache = new Set()
  }
  return availableStemsCache
}

export function parseFicheLiee(raw: unknown): string[] {
  if (typeof raw === 'string' && raw.trim()) return [raw.trim()]
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.trim())
  }
  return []
}

/** Asset IDs liés à une question (FP-* puis SVG-*) — ordre stable pour `&i=` */
export function getFicheAssetIds(question: SalimQaQuestion): string[] {
  const seen = new Set<string>()
  const ids: string[] = []
  for (const id of [...question.ficheLiees, ...question.schemasLies]) {
    if (!id || seen.has(id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

function safeSvgPath(filename: string): string | null {
  const base = path.basename(filename)
  if (!base.endsWith('.svg') || base.includes('..')) return null
  const resolved = path.resolve(FICHES_DIR, base)
  if (!resolved.startsWith(path.resolve(FICHES_DIR) + path.sep)) return null
  return fs.existsSync(resolved) ? resolved : null
}

function fuzzyResolveStem(assetId: string): string | null {
  const m = assetId.match(/^FP-P\d+-CH\d+-(.+?)(?:-\d+)?$/i)
  if (!m) return null
  const slug = m[1].toLowerCase()
  for (const stem of getAvailableStems()) {
    if (stem.toLowerCase().includes(slug)) return stem
  }
  return null
}

/** Résout un asset ID (FP-* ou SVG-*) vers un fichier dans config/fp/ */
export function resolveFicheSvgByAssetId(assetId: string): string | null {
  const id = assetId.trim()
  if (!id || id.includes('..') || id.includes('/')) return null

  const direct = safeSvgPath(`${id}.svg`)
  if (direct) return direct

  const alias = FICHE_ALIASES[id]
  if (alias) {
    const aliased = safeSvgPath(`${alias}.svg`)
    if (aliased) return aliased
  }

  const fuzzyStem = fuzzyResolveStem(id)
  if (fuzzyStem) {
    const fuzzy = safeSvgPath(`${fuzzyStem}.svg`)
    if (fuzzy) return fuzzy
  }

  return null
}

/** Fichiers SVG disponibles pour une question (seulement ceux présents sur disque) */
export function listFicheSvgPathsForQuestion(question: SalimQaQuestion): string[] {
  return getFicheAssetIds(question)
    .map((id) => resolveFicheSvgByAssetId(id))
    .filter((p): p is string => !!p)
}

export function getFicheSvgForQuestion(question: SalimQaQuestion, index = 0): string | null {
  const paths = listFicheSvgPathsForQuestion(question)
  return paths[index] ?? null
}

export function countFicheAssets(question: SalimQaQuestion): number {
  return listFicheSvgPathsForQuestion(question).length
}

export function isValidSalimQaQuestionId(id: string): boolean {
  return SALIM_QA_QUESTION_ID_RE.test(id)
}
