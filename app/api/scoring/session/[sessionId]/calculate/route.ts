import { NextResponse } from 'next/server'
import { computeFullScore } from '@/lib/scoring/engine'
import { getQuestionBank, getScoringModel, getTips } from '@/lib/scoring/rules-loader'
import { generateMarkdownReport } from '@/lib/scoring/report-generator'
import type { QuestionDef } from '@/lib/scoring/schema'
import { getActiveQuestions } from '@/lib/scoring/routing'
import {
  getAuthedUserId,
  jsonError,
  sessionRowToCadrage,
} from '@/lib/scoring/http'
import type { RespondentRole } from '@/types/scoring'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const userId = await getAuthedUserId()
    if (!userId) {
      return jsonError(401, 'AUTH_REQUIRED', 'Authentication required')
    }

    const { sessionId } = await params

    const { data: sessionRow, error: sessionErr } = await supabaseAdmin
      .from('scoring_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle()

    if (sessionErr || !sessionRow) {
      return jsonError(404, 'NOT_FOUND', 'Session not found')
    }
    if (sessionRow.user_id !== userId) {
      return jsonError(403, 'FORBIDDEN', 'This session does not belong to you')
    }
    if (sessionRow.status === 'complete') {
      return jsonError(400, 'SESSION_ALREADY_COMPLETE', 'Session is already complete')
    }

    const { data: answerRows, error: ansErr } = await supabaseAdmin
      .from('scoring_answers')
      .select('question_id, answer_key, score_value')
      .eq('session_id', sessionId)

    if (ansErr) {
      console.error('[scoring/calculate] answers:', ansErr)
      return jsonError(500, 'INTERNAL_ERROR', 'Failed to load answers')
    }

    const answers: Record<string, string> = {}
    for (const r of answerRows ?? []) {
      answers[String(r.question_id)] = String(r.answer_key)
    }

    const cadrage = sessionRowToCadrage(sessionRow)
    if (!cadrage) {
      return jsonError(500, 'INTERNAL_ERROR', 'Invalid session cadrage fields')
    }

    const role = sessionRow.respondent_role as RespondentRole | null
    if (!role) {
      return jsonError(500, 'INTERNAL_ERROR', 'Missing respondent_role on session')
    }

    const model = getScoringModel()
    const bank = getQuestionBank()
    const activeQuestions = getActiveQuestions(cadrage, bank.questions, answers) as QuestionDef[]

    let scoreResult
    try {
      scoreResult = computeFullScore(answers, cadrage, role, model, activeQuestions)
    } catch (e) {
      console.error('[scoring/calculate] computeFullScore:', e)
      return jsonError(500, 'CALCULATION_ERROR', 'Score calculation failed')
    }

    const tips = getTips()
    const reportMarkdown = generateMarkdownReport(
      {
        team_name: sessionRow.team_name,
        sprint_number: sessionRow.sprint_number,
      },
      scoreResult,
      tips,
      model,
      answers,
      activeQuestions
    )

    const excluded_dimensions = scoreResult.dimension_scores
      .filter((d) => d.excluded)
      .map((d) => d.id)

    const patch: Record<string, unknown> = {
      score_global: scoreResult.score_global,
      rag_global: scoreResult.rag_global,
      blocking_rule_applied: scoreResult.blocking_rule_applied,
      blocking_criticals_count: scoreResult.blocking_criticals_count,
      weights_used: scoreResult.weights_used,
      critical_flags: scoreResult.critical_flags,
      report_markdown: reportMarkdown,
      excluded_dimensions,
      status: 'complete',
      completed_at: new Date().toISOString(),
    }

    for (const ds of scoreResult.dimension_scores) {
      const n = ds.id.slice(1)
      patch[`score_d${n}`] = ds.score
      patch[`rag_d${n}`] = ds.rag
    }

    const { error: updErr } = await supabaseAdmin
      .from('scoring_sessions')
      .update(patch)
      .eq('id', sessionId)

    if (updErr) {
      console.error('[scoring/calculate] update session:', updErr)
      return jsonError(500, 'INTERNAL_ERROR', 'Failed to persist results')
    }

    const redCount = scoreResult.dimension_scores.filter(
      (d) => !d.excluded && d.rag === 'red'
    ).length
    const greenCount = scoreResult.dimension_scores.filter(
      (d) => !d.excluded && d.rag === 'green'
    ).length

    const { error: metricsErr } = await supabaseAdmin.from('scoring_metrics_log').insert({
      user_id: userId,
      session_id: sessionId,
      event_type: 'session_completed',
      score_global: scoreResult.score_global,
      rag_global: scoreResult.rag_global,
      blocking_rule_applied: scoreResult.blocking_rule_applied,
      org_context: sessionRow.org_context,
      ia_active: sessionRow.ia_dimension_active,
      dimensions_red_count: redCount,
      dimensions_green_count: greenCount,
      critical_flags_count: scoreResult.critical_flags.length,
    })

    if (metricsErr) {
      console.error('[scoring/calculate] metrics:', metricsErr)
    }

    return NextResponse.json({ scoreResult, reportMarkdown })
  } catch (e) {
    console.error('[scoring/calculate] POST:', e)
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
