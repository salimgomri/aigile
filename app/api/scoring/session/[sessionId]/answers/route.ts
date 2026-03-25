import { NextResponse } from 'next/server'
import type { DimensionId } from '@/types/scoring'
import { getAuthedUserId, jsonError } from '@/lib/scoring/http'
import { supabaseAdmin } from '@/lib/supabase'

const DIM_IDS = new Set<DimensionId>([
  'd0',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  'd8',
])

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const userId = await getAuthedUserId()
    if (!userId) {
      return jsonError(401, 'AUTH_REQUIRED', 'Authentication required')
    }

    const { sessionId } = await params

    const { data: row, error: fetchError } = await supabaseAdmin
      .from('scoring_sessions')
      .select('id, user_id, status')
      .eq('id', sessionId)
      .maybeSingle()

    if (fetchError || !row) {
      return jsonError(404, 'NOT_FOUND', 'Session not found')
    }
    if (row.user_id !== userId) {
      return jsonError(403, 'FORBIDDEN', 'This session does not belong to you')
    }
    if (row.status === 'complete') {
      return jsonError(400, 'SESSION_ALREADY_COMPLETE', 'Session is already complete')
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonError(400, 'INVALID_BODY', 'Invalid JSON body')
    }

    const answers = (body as { answers?: unknown })?.answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return jsonError(400, 'INVALID_BODY', 'answers array is required')
    }

    const rows: Array<{
      session_id: string
      dimension_id: string
      question_id: string
      answer_key: string
      score_value: number
    }> = []

    for (const item of answers) {
      if (!item || typeof item !== 'object') {
        return jsonError(400, 'INVALID_BODY', 'Invalid answer entry')
      }
      const a = item as Record<string, unknown>
      const questionId = a.questionId
      const dimensionId = a.dimensionId
      const answerKey = a.answerKey
      const scoreValue = a.scoreValue
      if (
        typeof questionId !== 'string' ||
        typeof dimensionId !== 'string' ||
        typeof answerKey !== 'string' ||
        typeof scoreValue !== 'number' ||
        !Number.isFinite(scoreValue)
      ) {
        return jsonError(400, 'INVALID_BODY', 'Each answer needs questionId, dimensionId, answerKey, scoreValue')
      }
      if (!DIM_IDS.has(dimensionId as DimensionId)) {
        return jsonError(400, 'INVALID_BODY', 'Invalid dimensionId')
      }
      rows.push({
        session_id: sessionId,
        dimension_id: dimensionId,
        question_id: questionId,
        answer_key: answerKey,
        score_value: scoreValue,
      })
    }

    const { error: upsertError } = await supabaseAdmin
      .from('scoring_answers')
      .upsert(rows, { onConflict: 'session_id,question_id' })

    if (upsertError) {
      console.error('[scoring/answers] upsert:', upsertError)
      return jsonError(500, 'INTERNAL_ERROR', 'Failed to save answers')
    }

    return NextResponse.json({ saved: rows.length })
  } catch (e) {
    console.error('[scoring/answers] POST:', e)
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
