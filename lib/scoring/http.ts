/**
 * Helpers HTTP scoring (auth, cadrage, erreurs) — pas de logique métier de calcul.
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import type { CadrageAnswers, DetailLevel, RespondentRole, ScoringSession } from '@/types/scoring'

const C2_SCOPE: Record<CadrageAnswers['C2'], string> = {
  a: 'single_team',
  b: 'multi_team',
  c: 'art',
}

const C4_TO_ROLE: Record<CadrageAnswers['C4'], RespondentRole> = {
  a: 'non-tech',
  b: 'intermediate',
  c: 'expert',
}

const C5_TO_DETAIL: Record<CadrageAnswers['C5'], DetailLevel> = {
  a: 'short',
  b: 'medium',
  c: 'long',
}

const ROLE_TO_C4: Record<RespondentRole, CadrageAnswers['C4']> = {
  'non-tech': 'a',
  intermediate: 'b',
  expert: 'c',
}

const DETAIL_TO_C5: Record<DetailLevel, CadrageAnswers['C5']> = {
  short: 'a',
  medium: 'b',
  long: 'c',
}

function isAbc(v: unknown): v is 'a' | 'b' | 'c' {
  return v === 'a' || v === 'b' || v === 'c'
}

export function parseCadrageFromBody(body: unknown): CadrageAnswers | null {
  if (!body || typeof body !== 'object') return null
  const o = body as Record<string, unknown>
  const c = o.cadrage
  if (!c || typeof c !== 'object') return null
  const z = c as Record<string, unknown>
  if (!isAbc(z.C2) || !isAbc(z.C4) || !isAbc(z.C5) || !isAbc(z.C7)) return null
  return { C2: z.C2, C4: z.C4, C5: z.C5, C7: z.C7 }
}

export function parseCadrageFromQuery(searchParams: URLSearchParams): CadrageAnswers | null {
  const c2 = searchParams.get('C2')
  const c4 = searchParams.get('C4')
  const c5 = searchParams.get('C5')
  const c7 = searchParams.get('C7')
  if (!isAbc(c2) || !isAbc(c4) || !isAbc(c5) || !isAbc(c7)) return null
  return { C2: c2, C4: c4, C5: c5, C7: c7 }
}

export function cadrageToSessionFields(c: CadrageAnswers) {
  return {
    org_context: c.C2,
    scope: C2_SCOPE[c.C2],
    respondent_role: C4_TO_ROLE[c.C4],
    detail_level: C5_TO_DETAIL[c.C5],
    ia_cadrage_raw: c.C7,
    ia_dimension_active: c.C7 !== 'b',
  }
}

export function sessionRowToCadrage(row: {
  org_context: string | null
  respondent_role: string | null
  detail_level: string | null
  ia_cadrage_raw: string | null
}): CadrageAnswers | null {
  const c2 = row.org_context
  const c4 = row.respondent_role ? ROLE_TO_C4[row.respondent_role as RespondentRole] : null
  const c5 = row.detail_level ? DETAIL_TO_C5[row.detail_level as DetailLevel] : null
  const c7 = row.ia_cadrage_raw
  if (!isAbc(c2) || !c4 || !c5 || !isAbc(c7)) return null
  return { C2: c2, C4: c4, C5: c5, C7: c7 }
}

export async function getAuthedUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

type ErrorCode =
  | 'INVALID_BODY'
  | 'SESSION_ALREADY_COMPLETE'
  | 'AUTH_REQUIRED'
  | 'INSUFFICIENT_CREDITS'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CALCULATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'LOCK_UNAVAILABLE'

export function jsonError(
  status: number,
  code: ErrorCode,
  message: string,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, code, ...extra }, { status })
}

/** Ligne scoring_sessions → ScoringSession (champs optionnels complétés si présents en DB). */
export function mapSessionRow(row: Record<string, unknown>): ScoringSession {
  const critical = row.critical_flags as string[] | null
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    team_name: (row.team_name as string | null) ?? null,
    sprint_number: (row.sprint_number as string | null) ?? null,
    sprint_end_date: (row.sprint_end_date as string | null) ?? null,
    org_context: (row.org_context as string | null) ?? null,
    scope: (row.scope as string | null) ?? null,
    respondent_role: (row.respondent_role as RespondentRole | null) ?? null,
    detail_level: (row.detail_level as DetailLevel | null) ?? null,
    ia_cadrage_raw: (row.ia_cadrage_raw as string | null) ?? null,
    ia_dimension_active: Boolean(row.ia_dimension_active),
    score_global: row.score_global != null ? Number(row.score_global) : null,
    rag_global: (row.rag_global as ScoringSession['rag_global']) ?? null,
    blocking_rule_applied: Boolean(row.blocking_rule_applied),
    blocking_criticals_count: Number(row.blocking_criticals_count ?? 0),
    critical_flags: (critical ?? []) as ScoringSession['critical_flags'],
    weights_used: (row.weights_used as ScoringSession['weights_used']) ?? null,
    excluded_dimensions: (row.excluded_dimensions as string[] | null) ?? null,
    report_markdown: (row.report_markdown as string | null) ?? null,
    status: row.status as ScoringSession['status'],
    created_at: String(row.created_at),
    completed_at: row.completed_at != null ? String(row.completed_at) : null,
    score_d0: numOrNull(row.score_d0),
    score_d1: numOrNull(row.score_d1),
    score_d2: numOrNull(row.score_d2),
    score_d3: numOrNull(row.score_d3),
    score_d4: numOrNull(row.score_d4),
    score_d5: numOrNull(row.score_d5),
    score_d6: numOrNull(row.score_d6),
    score_d7: numOrNull(row.score_d7),
    score_d8: numOrNull(row.score_d8),
    rag_d0: (row.rag_d0 as ScoringSession['rag_d0']) ?? null,
    rag_d1: (row.rag_d1 as ScoringSession['rag_d1']) ?? null,
    rag_d2: (row.rag_d2 as ScoringSession['rag_d2']) ?? null,
    rag_d3: (row.rag_d3 as ScoringSession['rag_d3']) ?? null,
    rag_d4: (row.rag_d4 as ScoringSession['rag_d4']) ?? null,
    rag_d5: (row.rag_d5 as ScoringSession['rag_d5']) ?? null,
    rag_d6: (row.rag_d6 as ScoringSession['rag_d6']) ?? null,
    rag_d7: (row.rag_d7 as ScoringSession['rag_d7']) ?? null,
    rag_d8: (row.rag_d8 as ScoringSession['rag_d8']) ?? null,
  }
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
