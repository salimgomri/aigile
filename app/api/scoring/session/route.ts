import { NextResponse } from 'next/server'
import {
  cadrageToSessionFields,
  getAuthedUserId,
  jsonError,
  parseCadrageFromBody,
} from '@/lib/scoring/http'
import { supabaseAdmin } from '@/lib/supabase'

type DebitRpcResult = {
  success?: boolean
  error?: string
  current?: number
  required?: number
  remaining?: number
}

export async function POST(request: Request) {
  let sessionId: string | null = null
  try {
    const userId = await getAuthedUserId()
    if (!userId) {
      return jsonError(401, 'AUTH_REQUIRED', 'Authentication required')
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonError(400, 'INVALID_BODY', 'Invalid JSON body')
    }

    const cadrage = parseCadrageFromBody(body)
    if (!cadrage) {
      return jsonError(400, 'INVALID_BODY', 'Complete cadrage (C2, C4, C5, C7) is required')
    }

    const o = body as Record<string, unknown>
    const teamName = o.teamName != null ? String(o.teamName) : null
    const sprintNumber = o.sprintNumber != null ? String(o.sprintNumber) : null
    const sprintEndDate =
      o.sprintEndDate != null && o.sprintEndDate !== ''
        ? String(o.sprintEndDate)
        : null

    const fields = cadrageToSessionFields(cadrage)

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('scoring_sessions')
      .insert({
        user_id: userId,
        team_name: teamName,
        sprint_number: sprintNumber,
        sprint_end_date: sprintEndDate,
        ...fields,
        status: 'draft',
      })
      .select('id')
      .single()

    if (insertError || !inserted?.id) {
      console.error('[scoring/session] insert:', insertError)
      return jsonError(500, 'INTERNAL_ERROR', 'Failed to create session')
    }

    sessionId = inserted.id as string

    const { data: debitRaw, error: rpcError } = await supabaseAdmin.rpc('debit_credits_for_scoring', {
      p_user_id: userId,
      p_session_id: sessionId,
    })

    if (rpcError) {
      console.error('[scoring/session] debit rpc:', rpcError)
      await supabaseAdmin.from('scoring_sessions').delete().eq('id', sessionId)
      return jsonError(500, 'INTERNAL_ERROR', 'Credit debit failed')
    }

    const debit = debitRaw as DebitRpcResult

    if (!debit?.success) {
      await supabaseAdmin.from('scoring_sessions').delete().eq('id', sessionId)

      if (debit.error === 'insufficient_credits') {
        return jsonError(402, 'INSUFFICIENT_CREDITS', 'Insufficient credits', {
          current: debit.current ?? 0,
          required: debit.required ?? 2,
        })
      }
      if (debit.error === 'lock_unavailable') {
        return jsonError(503, 'LOCK_UNAVAILABLE', 'Credit lock unavailable — retry shortly')
      }
      if (debit.error === 'user_not_found') {
        return jsonError(404, 'NOT_FOUND', 'User credits not found')
      }
      return jsonError(500, 'INTERNAL_ERROR', 'Credit debit failed')
    }

    const { error: metricsError } = await supabaseAdmin.from('scoring_metrics_log').insert({
      user_id: userId,
      session_id: sessionId,
      event_type: 'session_started',
      org_context: cadrage.C2,
      ia_active: fields.ia_dimension_active,
    })

    if (metricsError) {
      console.error('[scoring/session] metrics:', metricsError)
    }

    return NextResponse.json({
      sessionId,
      creditsRemaining: debit.remaining ?? 0,
    })
  } catch (e) {
    console.error('[scoring/session] POST:', e)
    if (sessionId) {
      await supabaseAdmin.from('scoring_sessions').delete().eq('id', sessionId)
    }
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
