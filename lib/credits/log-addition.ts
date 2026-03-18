/**
 * Log des ajouts de crédits (bonus livre, pack) dans credit_transactions
 * Pour afficher +10 dans l'historique utilisateur
 */
import { supabaseAdmin } from '@/lib/supabase'
import type { CreditAddition } from './actions'

export async function logCreditAddition(
  userId: string,
  addition: CreditAddition,
  amount?: number
): Promise<void> {
  const config = { book_bonus: 10, credits_pack: 10 } as const
  const delta = amount ?? config[addition]
  await supabaseAdmin.from('credit_transactions').insert({
    user_id: userId,
    action: addition,
    cost: 0,
    delta,
    plan_at_time: 'free',
    tool_slug: null,
  })
}
