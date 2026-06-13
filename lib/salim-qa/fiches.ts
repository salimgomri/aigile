import 'server-only'

import fs from 'fs'
import path from 'path'
import type { SalimQaQuestion } from './types'

/** Dossier privé des SVG — jamais dans `public/` */
export const FICHES_DIR = path.join(process.cwd(), 'config', 'fp')

/** IDs question autorisés en query `q=` (ex. P4-CH13-SM-01) */
export const SALIM_QA_QUESTION_ID_RE = /^P\d+-CH\d+-[A-Z0-9-]+$/i

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

/** Résout un asset ID (FP-* ou SVG-*) vers un fichier dans config/fp/ */
export function resolveFicheSvgByAssetId(assetId: string): string | null {
  const id = assetId.trim()
  if (!id || id.includes('..') || id.includes('/')) return null
  return safeSvgPath(`${id}.svg`)
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
