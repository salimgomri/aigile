import { NextResponse } from 'next/server'
import type { RAGStatus, SessionSummary } from '@/types/scoring'
import { getAuthedUserId, jsonError } from '@/lib/scoring/http'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const userId = await getAuthedUserId()
    if (!userId) {
      return jsonError(401, 'AUTH_REQUIRED', 'Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const before = searchParams.get('before')
    const teamName = searchParams.get('teamName')

    let q = supabaseAdmin
      .from('scoring_sessions')
      .select(
        'id, team_name, sprint_number, score_global, rag_global, blocking_rule_applied, completed_at'
      )
      .eq('user_id', userId)
      .eq('status', 'complete')

    if (before) {
      const t = Date.parse(before)
      if (!Number.isFinite(t)) {
        return jsonError(400, 'INVALID_BODY', 'Invalid before cursor')
      }
      q = q.lt('completed_at', new Date(t).toISOString())
    }

    if (teamName != null && teamName !== '') {
      q = q.eq('team_name', teamName)
    }

    const { data: rows, error } = await q.order('completed_at', { ascending: false }).limit(21)

    if (error) {
      console.error('[scoring/history]:', error)
      return jsonError(500, 'INTERNAL_ERROR', 'Failed to load history')
    }

    const list = rows ?? []
    const hasMore = list.length > 20
    const page = hasMore ? list.slice(0, 20) : list

    const sessions: SessionSummary[] = page.map((r) => ({
      id: String(r.id),
      teamName: (r.team_name as string | null) ?? null,
      sprintNumber: (r.sprint_number as string | null) ?? null,
      scoreGlobal: Number(r.score_global),
      ragGlobal: r.rag_global as RAGStatus,
      blockingRuleApplied: Boolean(r.blocking_rule_applied),
      completedAt: String(r.completed_at),
    }))

    return NextResponse.json({ sessions, hasMore })
  } catch (e) {
    console.error('[scoring/history] GET:', e)
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
