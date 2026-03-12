/**
 * Crée user_credits si absent (edge case inscription / compte hors flux normal).
 * Utilise upsert avec ignoreDuplicates pour éviter les race conditions.
 */
import { supabaseAdmin } from '@/lib/supabase'

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
