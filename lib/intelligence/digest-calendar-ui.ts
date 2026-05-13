import { calendarDateInTimeZone } from '@/lib/intelligence/digest-calendar-shared'

/** À garder aligné avec `INTEL_DIGEST_TIMEZONE` côté serveur si vous changez le fuseau. */
export const INTEL_DIGEST_UI_TZ =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_INTEL_DIGEST_TIMEZONE?.trim()
    ? process.env.NEXT_PUBLIC_INTEL_DIGEST_TIMEZONE.trim()
    : 'Europe/Paris'

const WEEK_ORDER_EN = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

/** Index 0 = lundi … 6 = dimanche (calendrier du fuseau digest UI). */
export function digestMondayFirstWeekdayIndex(timeZone = INTEL_DIGEST_UI_TZ): number {
  const todayYmd = calendarDateInTimeZone(new Date(), timeZone)
  const [y, m, d] = todayYmd.split('-').map(Number)
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const long = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' }).format(noonUtc)
  const idx = WEEK_ORDER_EN.indexOf(long as (typeof WEEK_ORDER_EN)[number])
  return idx >= 0 ? idx : 0
}

/** Décalages jour pour une bande Lu→Di (même convention que l’ancienne strip UTC). */
export function digestWeekOffsetsMonFirst(timeZone = INTEL_DIGEST_UI_TZ): number[] {
  const monIdx = digestMondayFirstWeekdayIndex(timeZone)
  return Array.from({ length: 7 }, (_, i) => monIdx - i)
}

export function digestTodayUi(timeZone = INTEL_DIGEST_UI_TZ): string {
  return calendarDateInTimeZone(new Date(), timeZone)
}

export type DigestDayLabel = {
  weekday: string
  day: number
  month: string
  isFuture: boolean
  iso: string
}

const MONTHS_FR_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const DAYS_MONDAY_FIRST_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

/** Libellés FR pour une date YYYY-MM-DD interprétée en fuseau digest UI. */
export function labelDigestIso(iso: string, todayYmd: string, timeZone = INTEL_DIGEST_UI_TZ): DigestDayLabel {
  const [y, m, d] = iso.split('-').map(Number)
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const wdEn = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' }).format(noonUtc)
  const monIdx = WEEK_ORDER_EN.indexOf(wdEn as (typeof WEEK_ORDER_EN)[number])
  const weekday = monIdx >= 0 ? DAYS_MONDAY_FIRST_FR[monIdx] : wdEn
  const dayNum = parseInt(new Intl.DateTimeFormat('en', { timeZone, day: 'numeric' }).format(noonUtc), 10)
  const moIdx = parseInt(new Intl.DateTimeFormat('en', { timeZone, month: 'numeric' }).format(noonUtc), 10) - 1
  const month = MONTHS_FR_SHORT[moIdx] ?? ''
  const isFuture = iso.localeCompare(todayYmd) > 0
  return { weekday, day: dayNum, month, isFuture, iso }
}
