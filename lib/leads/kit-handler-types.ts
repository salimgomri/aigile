import type { Utm } from '@/lib/leads/utm'

export type KitSubscribeInput = {
  email: string
  firstName?: string
  consentKit: boolean
  consentNews: boolean
  honeypot?: string
  source?: string
  utm?: Utm
}

export type KitSubscribeResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string; status: number }
