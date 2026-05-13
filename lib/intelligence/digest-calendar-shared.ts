/** Fuseau par défaut aligné sur `INTEL_DIGEST_TIMEZONE` (serveur) — dupliquer via NEXT_PUBLIC côté client si besoin. */
export const DEFAULT_INTEL_DIGEST_TZ = 'Europe/Paris'

export function calendarDateInTimeZone(d: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/** Soustrait des jours calendaires grégoriens à une date YYYY-MM-DD (UTC date-only math). */
export function civilDateMinusDays(ymd: string, daysBack: number): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const x = new Date(Date.UTC(y, m - 1, d))
  x.setUTCDate(x.getUTCDate() - daysBack)
  return x.toISOString().slice(0, 10)
}

export function isPublishedOnDigestDay(publishedAt: Date, digestDateYmd: string, digestTz: string): boolean {
  return calendarDateInTimeZone(publishedAt, digestTz) === digestDateYmd
}
