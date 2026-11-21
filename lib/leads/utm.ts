export type Utm = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

export function pickUtm(input: Record<string, unknown> | URLSearchParams): Utm {
  const get = (key: string) => {
    if (input instanceof URLSearchParams) return input.get(key) || undefined
    const v = input[key]
    return typeof v === 'string' && v ? v : undefined
  }
  const utm: Utm = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
    const v = get(key)
    if (v) utm[key] = v
  }
  return utm
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim()) && email.length <= 254
}
