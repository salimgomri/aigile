import 'server-only'

import {
  calendarDateInTimeZone,
  civilDateMinusDays,
  DEFAULT_INTEL_DIGEST_TZ,
  isPublishedOnDigestDay as isPublishedOnDigestDayTz,
} from '@/lib/intelligence/digest-calendar-shared'

/** Fuseau du digest « news du jour » (calendrier local pour filtrer pubDate). */
export const INTEL_DIGEST_TZ = process.env.INTEL_DIGEST_TIMEZONE?.trim() || DEFAULT_INTEL_DIGEST_TZ

export { calendarDateInTimeZone, civilDateMinusDays }

/** YYYY-MM-DD du jour courant dans le fuseau digest. */
export function digestDateToday(): string {
  return calendarDateInTimeZone(new Date(), INTEL_DIGEST_TZ)
}

/** pubDate tombe-t-elle sur le jour digest YYYY-MM-DD (même calendrier que digest_date) ? */
export function isPublishedOnDigestDay(publishedAt: Date, digestDateYmd: string): boolean {
  return isPublishedOnDigestDayTz(publishedAt, digestDateYmd, INTEL_DIGEST_TZ)
}
