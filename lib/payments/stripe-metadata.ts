/**
 * Limites Stripe sur les metadata : valeur ≤ 500 caractères par clé.
 * @see https://docs.stripe.com/api/metadata
 */

export function stripeMetaValue(value: unknown): string {
  const t = String(value ?? '').trim()
  if (t.length <= 500) return t
  return `${t.slice(0, 497)}...`
}

export function clampStripeMetadata(meta: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(meta)) {
    out[k] = stripeMetaValue(v)
  }
  return out
}
