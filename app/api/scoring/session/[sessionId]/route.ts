import { NextResponse } from 'next/server'
import type { DimensionId, ScoringAnswer } from '@/types/scoring'
import { getAuthedUserId, jsonError, mapSessionRow } from '@/lib/scoring/http'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const userId = await getAuthedUserId()
    if (!userId) {
      return jsonError(401, 'AUTH_REQUIRED', 'Authentication required')
    }

    const { sessionId } = await params

    const [sessionRes, answersRes] = await Promise.all([
      supabaseAdmin.from('scoring_sessions').select('*').eq('id', sessionId).maybeSingle(),
      supabaseAdmin.from('scoring_answers').select('*').eq('session_id', sessionId),
    ])

    const row = sessionRes.data
    if (!row) {
      return jsonError(404, 'NOT_FOUND', 'Session not found')
    }
    if (row.user_id !== userId) {
      return jsonError(403, 'FORBIDDEN', 'This session does not belong to you')
    }

    const answers: ScoringAnswer[] = (answersRes.data ?? []).map((a) => ({
      id: a.id as string,
      session_id: String(a.session_id),
      dimension_id: a.dimension_id as DimensionId,
      question_id: String(a.question_id),
      answer_key: String(a.answer_key),
      score_value: Number(a.score_value),
      created_at: a.created_at != null ? String(a.created_at) : undefined,
    }))

    return NextResponse.json({
      session: mapSessionRow(row as Record<string, unknown>),
      answers,
    })
  } catch (e) {
    console.error('[scoring/session/:id] GET:', e)
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
