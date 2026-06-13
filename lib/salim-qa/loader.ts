import 'server-only'

import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'
import type { SalimQaQuestion } from './types'

const QA_DIR = path.join(process.cwd(), 'config', 'qa')

let cache: SalimQaQuestion[] | null = null

function normalizeMultiline(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

function norm(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function parseChapterFromId(id: string): number {
  const m = id.match(/P(\d+)-CH(\d+)/)
  return m ? Number.parseInt(m[2], 10) : 0
}

function hasFiche(q: SalimQaQuestion): boolean {
  return !!(q.ficheLiee || q.schemasLies.length > 0)
}

export function loadAllSalimQaQuestions(): SalimQaQuestion[] {
  if (cache) return cache

  const files = fs.readdirSync(QA_DIR).filter((f) => f.endsWith('.yml') && !f.startsWith('._'))
  const all: SalimQaQuestion[] = []

  const pushQuestion = (
    q: Record<string, unknown>,
    meta: { partie?: number; nom_partie?: string; chapitre?: number; titre?: string }
  ) => {
    const id = typeof q.id === 'string' ? q.id : ''
    const question = normalizeMultiline(q.question)
    const reponse = normalizeMultiline(q.reponse)
    if (!id || !question || !reponse) return

    const dims = Array.isArray(q.dimensions)
      ? q.dimensions.filter((d): d is string => typeof d === 'string')
      : []

    const ficheFor = Array.isArray(q.fiche_destinee_a)
      ? q.fiche_destinee_a.filter((d): d is string => typeof d === 'string')
      : []

    const schemas = Array.isArray(q.schemas_lies)
      ? q.schemas_lies.filter((d): d is string => typeof d === 'string')
      : []

    const chapitre = meta.chapitre ?? parseChapterFromId(id)

    all.push({
      id,
      role: typeof q.role === 'string' ? q.role : '',
      question,
      reponse,
      douleur: normalizeMultiline(q.douleur_terrain),
      dimensions: dims,
      chapter: chapitre,
      chapterTitle: meta.titre ?? '',
      partie: meta.partie ?? 0,
      partieName: meta.nom_partie ?? '',
      cible: typeof q.cible === 'string' ? q.cible : undefined,
      ficheLiee: typeof q.fiche_liee === 'string' ? q.fiche_liee : null,
      ficheDestineeA: ficheFor,
      schemasLies: schemas,
      statutReponse: typeof q.statut_reponse === 'string' ? q.statut_reponse : undefined,
      page:
        typeof q.page === 'number' || typeof q.page === 'string'
          ? q.page
          : null,
    })
  }

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(QA_DIR, file), 'utf8')
      const data = parse(raw) as unknown

      if (Array.isArray(data)) {
        for (const chapter of data) {
          if (!chapter || typeof chapter !== 'object') continue
          const block = chapter as Record<string, unknown>
          const chapitreNum =
            typeof block.chapitre === 'number'
              ? block.chapitre
              : typeof block.id === 'string' && block.id.startsWith('CH')
                ? Number.parseInt(block.id.replace(/\D/g, ''), 10) || 0
                : 0
          const meta = {
            partie: typeof block.partie === 'number' ? block.partie : undefined,
            chapitre: chapitreNum,
            titre: typeof block.titre === 'string' ? block.titre : undefined,
          }
          for (const q of (block.questions as Array<Record<string, unknown>>) ?? []) {
            pushQuestion(q, meta)
          }
        }
        continue
      }

      const doc = data as {
        meta?: {
          partie?: number
          nom_partie?: string
          chapitre?: number
          titre?: string
        }
        questions?: Array<Record<string, unknown>>
      }

      const meta = doc.meta ?? {}
      for (const q of doc.questions ?? []) {
        pushQuestion(q, meta)
      }
    } catch (err) {
      console.error(`[salim-qa/loader] skip ${file}:`, err)
    }
  }

  all.sort((a, b) => a.partie - b.partie || a.chapter - b.chapter || a.id.localeCompare(b.id))
  cache = all
  return all
}

export function getSalimQaQuestionById(id: string): SalimQaQuestion | null {
  return loadAllSalimQaQuestions().find((q) => q.id === id) ?? null
}

export function getSalimQaFacets(): {
  roles: string[]
  cibles: string[]
  dimensions: string[]
  chapters: number[]
  total: number
} {
  const all = loadAllSalimQaQuestions()
  const roles = new Set<string>()
  const cibles = new Set<string>()
  const dimensions = new Set<string>()
  const chapters = new Set<number>()

  for (const q of all) {
    if (q.role) roles.add(q.role)
    if (q.cible) cibles.add(q.cible)
    for (const d of q.dimensions) dimensions.add(d)
    if (q.chapter) chapters.add(q.chapter)
  }

  return {
    roles: [...roles].sort(),
    cibles: [...cibles].sort(),
    dimensions: [...dimensions].sort(),
    chapters: [...chapters].sort((a, b) => a - b),
    total: all.length,
  }
}

export function filterSalimQaQuestions(opts: {
  terms?: string[]
  role?: string
  cible?: string
  fiche?: 'all' | 'avec' | 'sans'
  dimension?: string
  chapter?: string
  limit?: number
  offset?: number
}): { items: SalimQaQuestion[]; total: number } {
  const {
    terms = [],
    role = '',
    cible = '',
    fiche = 'all',
    dimension = '',
    chapter = '',
    limit = 20,
    offset = 0,
  } = opts

  let filtered = loadAllSalimQaQuestions()

  if (fiche === 'avec') filtered = filtered.filter((q) => hasFiche(q))
  if (fiche === 'sans') filtered = filtered.filter((q) => !hasFiche(q))
  if (role) filtered = filtered.filter((q) => q.role === role)
  if (cible && cible !== 'all') filtered = filtered.filter((q) => q.cible === cible)
  if (dimension) filtered = filtered.filter((q) => q.dimensions.includes(dimension))
  if (chapter) filtered = filtered.filter((q) => String(q.chapter) === chapter)

  const activeTerms = terms.map((t) => t.trim()).filter(Boolean)
  if (activeTerms.length > 0 && activeTerms.join('').length >= 3) {
    filtered = filtered.filter((q) => {
      const haystack = norm(
        [q.question, q.douleur, q.chapterTitle, q.role, q.ficheLiee ?? ''].join(' ')
      )
      return activeTerms.every((t) => haystack.includes(norm(t)))
    })

    filtered.sort((a, b) => {
      const fa = hasFiche(a) ? 1 : 0
      const fb = hasFiche(b) ? 1 : 0
      if (fa !== fb) return fb - fa
      const rel = (q: SalimQaQuestion) => {
        const nq = norm(q.question)
        return activeTerms.reduce((acc, t) => {
          const nt = norm(t)
          let i = nq.indexOf(nt)
          let c = 0
          while (i >= 0) {
            c++
            i = nq.indexOf(nt, i + Math.max(1, nt.length))
          }
          return acc + c
        }, 0)
      }
      return rel(b) - rel(a) || a.id.localeCompare(b.id)
    })
  }

  const total = filtered.length
  return { items: filtered.slice(offset, offset + limit), total }
}

/** @deprecated use filterSalimQaQuestions */
export function searchSalimQaQuestions(opts: {
  q?: string
  role?: string
  limit?: number
  offset?: number
}) {
  const terms = opts.q?.trim() ? [opts.q.trim()] : []
  return filterSalimQaQuestions({
    terms,
    role: opts.role,
    limit: opts.limit,
    offset: opts.offset,
  })
}

export function getSalimQaRoles(): string[] {
  return getSalimQaFacets().roles
}
