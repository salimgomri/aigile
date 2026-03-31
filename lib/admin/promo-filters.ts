/**
 * Codes promo considérés comme tests internes (exclure des stats « business » par défaut).
 */
export const INTERNAL_TEST_COUPON_CODES = ['TEST100'] as const

export function isInternalTestCoupon(coupon: string | null | undefined): boolean {
  const c = coupon?.trim()
  if (!c) return false
  const u = c.toUpperCase()
  return INTERNAL_TEST_COUPON_CODES.some((code) => code.toUpperCase() === u)
}

/** Filtre optionnel sur le champ coupon (sous-chaîne, insensible à la casse). */
export function matchesCouponSubstring(coupon: string | null | undefined, needle: string | undefined): boolean {
  const n = needle?.trim()
  if (!n) return true
  if (n === '__none__') return !coupon?.trim()
  return (coupon ?? '').toLowerCase().includes(n.toLowerCase())
}
