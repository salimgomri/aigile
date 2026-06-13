import 'server-only'

import { supabaseAdmin } from '@/lib/supabase'
import type { SalimQaActivityAction } from './types'

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

export async function getUnlockedQuestionIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from('salim_qa_unlocks')
    .select('question_id')
    .eq('user_id', userId)

  if (error) {
    console.error('[salim-qa/unlocks]', error)
    return new Set()
  }

  return new Set((data ?? []).map((r) => r.question_id))
}

export async function isQuestionUnlocked(userId: string, questionId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('salim_qa_unlocks')
    .select('id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle()

  if (error) {
    console.error('[salim-qa/unlocks/check]', error)
    return false
  }

  return !!data
}

export async function recordQuestionUnlock(userId: string, questionId: string) {
  const { error } = await supabaseAdmin.from('salim_qa_unlocks').upsert(
    { user_id: userId, question_id: questionId },
    { onConflict: 'user_id,question_id', ignoreDuplicates: true }
  )

  if (error) {
    console.error('[salim-qa/unlocks/record]', error)
    throw error
  }
}
