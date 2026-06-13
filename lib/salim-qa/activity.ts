import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'
import type { SalimQaUnlockState } from './unlock-scope'
import type { SalimQaActivityAction } from './types'

type UnlockRow = {
  question_id: string
  unlock_answer?: boolean | null
  unlock_fiche?: boolean | null
}

export async function logSalimQaActivity(input: {
  action: SalimQaActivityAction
  userId?: string | null
  visitorId?: string | null
  questionId?: string | null
  query?: string | null
  metadata?: Record<string, unknown> | null
}) {
  const { error } = await supabaseAdmin.from('salim_qa_activities').insert({
    user_id: input.userId ?? null,
    visitor_id: input.visitorId ?? null,
    action: input.action,
    question_id: input.questionId ?? null,
    query: input.query ?? null,
    metadata: input.metadata ?? null,
  })

  if (error) {
    console.error('[salim-qa/activity]', error)
  }
}

function rowToState(row: UnlockRow | null | undefined): SalimQaUnlockState {
  if (!row) return { answer: false, fiche: false }
  return {
    answer: !!row.unlock_answer,
    fiche: !!row.unlock_fiche,
  }
}

export async function getUnlockStatesByUser(userId: string): Promise<Map<string, SalimQaUnlockState>> {
  const { data, error } = await supabaseAdmin
    .from('salim_qa_unlocks')
    .select('question_id, unlock_answer, unlock_fiche')
    .eq('user_id', userId)

  if (error) {
    console.error('[salim-qa/unlocks]', error)
    return new Map()
  }

  const map = new Map<string, SalimQaUnlockState>()
  for (const row of data ?? []) {
    map.set(row.question_id, rowToState(row))
  }
  return map
}

export async function getQuestionUnlockState(
  userId: string,
  questionId: string
): Promise<SalimQaUnlockState> {
  const { data, error } = await supabaseAdmin
    .from('salim_qa_unlocks')
    .select('question_id, unlock_answer, unlock_fiche')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle()

  if (error) {
    console.error('[salim-qa/unlocks/check]', error)
    return { answer: false, fiche: false }
  }

  return rowToState(data ?? undefined)
}

/** @deprecated */
export async function getUnlockedQuestionIds(userId: string): Promise<Set<string>> {
  const states = await getUnlockStatesByUser(userId)
  return new Set([...states.entries()].filter(([, s]) => s.answer).map(([id]) => id))
}

/** @deprecated */
export async function isQuestionUnlocked(userId: string, questionId: string): Promise<boolean> {
  const state = await getQuestionUnlockState(userId, questionId)
  return state.answer
}

export async function recordQuestionUnlock(
  userId: string,
  questionId: string,
  flags: Partial<SalimQaUnlockState>
) {
  const current = await getQuestionUnlockState(userId, questionId)
  const next: SalimQaUnlockState = {
    answer: flags.answer ?? current.answer,
    fiche: flags.fiche ?? current.fiche,
  }

  const { error } = await supabaseAdmin.from('salim_qa_unlocks').upsert(
    {
      user_id: userId,
      question_id: questionId,
      unlock_answer: next.answer,
      unlock_fiche: next.fiche,
    },
    { onConflict: 'user_id,question_id' }
  )

  if (error) {
    console.error('[salim-qa/unlocks/record]', error)
    throw error
  }

  return next
}
