/**
 * P10 - Logique métier crédits centralisée
 */
import { supabaseAdmin } from '@/lib/supabase'
import { getEmailForUserId, isAdminUserId } from '@/lib/admin'
import { CREDIT_ACTIONS, PDF_ACTIONS, getToolSlugForAction, type CreditAction } from './actions'
import {
  hasActiveToolCreditPromoForAction,
  listActiveToolCreditPromos,
  type ToolCreditPromoInfo,
} from './tool-promo'

export type CreditStatus = {
  plan: 'free' | 'day_pass' | 'pro_monthly' | 'pro_annual'
  isUnlimited: boolean
  creditsRemaining: number | null
  monthlyTotal: number
  nextResetAt: string | null
  dayPassExpiresAt: string | null
  dayPassTimeRemaining: string | null
  isAdmin?: boolean
  /** Promos illimités par outil (fenêtre + early adopter) */
  toolCreditPromos?: ToolCreditPromoInfo[]
}

export async function getCreditStatus(userId: string): Promise<CreditStatus | null> {
  if (await isAdminUserId(userId)) {
    return {
      plan: 'pro_monthly',
      isUnlimited: true,
      creditsRemaining: null,
      monthlyTotal: 10,
      nextResetAt: null,
      dayPassExpiresAt: null,
      dayPassTimeRemaining: null,
      isAdmin: true,
    }
  }

  const { data, error } = await supabaseAdmin
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null

  const dayPassActive =
    data.plan === 'day_pass' &&
    data.day_pass_expires_at &&
    new Date(data.day_pass_expires_at) > new Date()

  if (data.plan === 'day_pass' && !dayPassActive) {
    await supabaseAdmin
      .from('user_credits')
      .update({ plan: 'free', credits_remaining: 0 })
      .eq('user_id', userId)
    const { data: updated } = await supabaseAdmin.from('user_credits').select('*').eq('user_id', userId).single()
    if (!updated) return null
    data.plan = 'free'
    data.credits_remaining = 0
  }

  const isUnlimited =
    ['pro_monthly', 'pro_annual'].includes(data.plan) ||
    (data.plan === 'day_pass' && !!dayPassActive)

  let dayPassTimeRemaining: string | null = null
  if (dayPassActive && data.day_pass_expires_at) {
    const msLeft = new Date(data.day_pass_expires_at).getTime() - Date.now()
    const h = Math.floor(msLeft / 3600000)
    const m = Math.floor((msLeft % 3600000) / 60000)
    dayPassTimeRemaining = `${h}h ${m}min`
  }

  const email = await getEmailForUserId(userId)
  const toolCreditPromos = email ? await listActiveToolCreditPromos(email) : []

  return {
    plan: data.plan,
    isUnlimited,
    creditsRemaining: isUnlimited ? null : data.credits_remaining,
    monthlyTotal: 10,
    nextResetAt: data.plan === 'free' ? data.monthly_reset_at : null,
    dayPassExpiresAt: data.day_pass_expires_at ?? null,
    dayPassTimeRemaining,
    isAdmin: false,
    toolCreditPromos: toolCreditPromos.length ? toolCreditPromos : undefined,
  }
}

/** Coût effectif (premier PDF gratuit) */
async function getEffectiveCost(userId: string, action: CreditAction): Promise<number> {
  const baseCost = CREDIT_ACTIONS[action].cost
  if (!PDF_ACTIONS.includes(action as (typeof PDF_ACTIONS)[number])) return baseCost

  const { count } = await supabaseAdmin
    .from('credit_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('action', [...PDF_ACTIONS])

  return (count ?? 0) === 0 ? 0 : baseCost
}

export async function canPerformAction(
  userId: string,
  action: CreditAction
): Promise<{ allowed: boolean; reason?: 'no_credits' | 'day_pass_expired' | 'not_pro' }> {
  const status = await getCreditStatus(userId)
  if (!status) return { allowed: false, reason: 'no_credits' }
  if (status.isUnlimited) return { allowed: true }
  const email = await getEmailForUserId(userId)
  if (email && (await hasActiveToolCreditPromoForAction(email, action))) return { allowed: true }
  if (status.creditsRemaining === null) return { allowed: true }
  const cost = await getEffectiveCost(userId, action)
  if (status.creditsRemaining < cost) {
    return { allowed: false, reason: 'no_credits' }
  }
  return { allowed: true }
}

export type ConsumeCreditsContext = {
  teamId?: string
  sprintId?: string
  /** Ex. { retro_pattern_code: 'P1' } pour retro_ai_plan */
  metadata?: Record<string, unknown>
}

export async function consumeCredits(
  userId: string,
  action: CreditAction,
  context?: ConsumeCreditsContext
): Promise<{ success: boolean; creditsRemaining: number | null }> {
  if (await isAdminUserId(userId)) {
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: userId,
      action,
      cost: 0,
      delta: 0,
      plan_at_time: 'pro_monthly',
      team_id: context?.teamId ?? null,
      sprint_id: context?.sprintId ?? null,
      tool_slug: getToolSlugForAction(action),
      metadata: context?.metadata ?? null,
    })
    return { success: true, creditsRemaining: null }
  }

  const promoEmail = await getEmailForUserId(userId)
  if (promoEmail && (await hasActiveToolCreditPromoForAction(promoEmail, action))) {
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: userId,
      action,
      cost: 0,
      delta: 0,
      plan_at_time: 'pro_monthly',
      team_id: context?.teamId ?? null,
      sprint_id: context?.sprintId ?? null,
      tool_slug: getToolSlugForAction(action),
      metadata: context?.metadata ?? null,
    })
    return { success: true, creditsRemaining: null }
  }

  const check = await canPerformAction(userId, action)
  if (!check.allowed) throw new Error('Insufficient credits')

  const effectiveCost = await getEffectiveCost(userId, action)

  const { data: credits } = await supabaseAdmin
    .from('user_credits')
    .select('plan, credits_remaining, credits_used_total')
    .eq('user_id', userId)
    .single()

  if (!credits) throw new Error('user_credits not found')

  const isUnlimited = ['pro_monthly', 'pro_annual', 'day_pass'].includes(credits.plan)

  const costToRecord = effectiveCost || CREDIT_ACTIONS[action].cost
  if (!isUnlimited && effectiveCost > 0) {
    await supabaseAdmin
      .from('user_credits')
      .update({
        credits_remaining: credits.credits_remaining - effectiveCost,
        credits_used_total: credits.credits_used_total + costToRecord,
      })
      .eq('user_id', userId)
  } else if (isUnlimited && costToRecord > 0) {
    await supabaseAdmin
      .from('user_credits')
      .update({ credits_used_total: credits.credits_used_total + costToRecord })
      .eq('user_id', userId)
  }

  await supabaseAdmin.from('credit_transactions').insert({
    user_id: userId,
    action,
    cost: effectiveCost,
    delta: -effectiveCost,
    plan_at_time: credits.plan,
    team_id: context?.teamId ?? null,
    sprint_id: context?.sprintId ?? null,
    tool_slug: getToolSlugForAction(action),
    metadata: context?.metadata ?? null,
  })

  const updated = await getCreditStatus(userId)
  return {
    success: true,
    creditsRemaining: updated?.creditsRemaining ?? null,
  }
}

export async function resetMonthlyCredits(userId: string) {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setDate(1)
  nextMonth.setHours(0, 0, 0, 0)

  await supabaseAdmin
    .from('user_credits')
    .update({
      credits_remaining: 10,
      monthly_reset_at: nextMonth.toISOString(),
    })
    .eq('user_id', userId)
    .eq('plan', 'free')
}

export { ensureUserCredits } from '@/lib/payments/ensure-credits'

/** Ajoute des crédits (ex: achat pack) - pour plan free uniquement */
export async function addCredits(userId: string, amount: number): Promise<void> {
  const { data } = await supabaseAdmin.from('user_credits').select('credits_remaining, plan').eq('user_id', userId).single()
  if (!data || data.plan !== 'free') return

  const newBalance = (data.credits_remaining ?? 0) + amount
  await supabaseAdmin.from('user_credits').update({ credits_remaining: newBalance }).eq('user_id', userId)
}
