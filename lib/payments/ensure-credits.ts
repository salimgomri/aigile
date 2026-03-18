/**
 * Crée user_credits si absent (edge case inscription / compte hors flux normal).
 * Utilise upsert avec ignoreDuplicates pour éviter les race conditions.
 */
import { supabaseAdmin } from '@/lib/supabase'
import { logCreditAddition } from '@/lib/credits/log-addition'

export async function ensureUserCredits(userId: string): Promise<void> {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setDate(1)
  nextMonth.setHours(0, 0, 0, 0)

  await supabaseAdmin.from('user_credits').upsert(
    {
      user_id: userId,
      plan: 'free',
      credits_remaining: 10,
      monthly_reset_at: nextMonth.toISOString(),
    },
    { onConflict: 'user_id', ignoreDuplicates: true }
  )
}

/**
 * Bonus 10 crédits pour acheteurs du livre qui s'inscrivent après achat (guest checkout).
 * Vérifie si l'email a une commande livre payée sans bonus encore attribué.
 */
export async function grantBookBonusIfEligible(userId: string, email: string): Promise<void> {
  if (!email?.trim()) return
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('buyer_email', email.trim().toLowerCase())
    .eq('product_type', 'book_physical')
    .eq('status', 'paid')
    .is('book_bonus_granted_at', null)
    .limit(1)
    .maybeSingle()

  if (!order) return

  await supabaseAdmin.rpc('increment_credits', { p_user_id: userId, p_amount: 10 })
  await logCreditAddition(userId, 'book_bonus', 10)
  await supabaseAdmin
    .from('orders')
    .update({ book_bonus_granted_at: new Date().toISOString() })
    .eq('id', order.id)
}
