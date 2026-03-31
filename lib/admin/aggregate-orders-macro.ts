/**
 * Agrège des lignes `orders` comme la vue v_user_purchases (totaux globaux, pas par acheteur).
 */
export type OrderMacroRow = {
  buyer_email: string | null
  product_type: string | null
  amount_total: number | null
}

export function aggregateOrdersMacroTotals(rows: OrderMacroRow[]) {
  let totalRevenueCentimes = 0
  let totalBooks = 0
  let totalCreditsPacks = 0
  let totalProMonthly = 0
  let totalProAnnual = 0
  let totalDayPasses = 0

  const buyerKeys = new Set<string>()

  for (const r of rows) {
    totalRevenueCentimes += r.amount_total ?? 0
    const email = (r.buyer_email ?? '').trim().toLowerCase()
    if (email) buyerKeys.add(email)

    switch (r.product_type) {
      case 'book_physical':
        totalBooks += 1
        break
      case 'credits_pack':
        totalCreditsPacks += 1
        break
      case 'subscription_monthly':
        totalProMonthly += 1
        break
      case 'subscription_annual':
        totalProAnnual += 1
        break
      case 'day_pass':
        totalDayPasses += 1
        break
      default:
        break
    }
  }

  return {
    totalBuyers: buyerKeys.size,
    totalOrders: rows.length,
    totalBooks,
    totalCreditsPacks,
    totalProMonthly,
    totalProAnnual,
    totalDayPasses,
    totalRevenueCentimes,
  }
}
