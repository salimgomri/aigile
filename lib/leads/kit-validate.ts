import { isValidEmail } from '@/lib/leads/utm'
import type { KitSubscribeInput, KitSubscribeResult } from '@/lib/leads/kit-handler-types'

export function validateKitInput(input: KitSubscribeInput): KitSubscribeResult | null {
  if (input.honeypot) return { ok: true, skipped: true }
  if (!isValidEmail(input.email)) {
    return { ok: false, error: 'Merci d’indiquer une adresse e-mail valide.', status: 400 }
  }
  if (!input.consentKit) {
    return { ok: false, error: 'Cochez la case pour recevoir le kit par e-mail.', status: 400 }
  }
  return null
}
