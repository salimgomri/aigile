import { isInternalTestCoupon } from '@/lib/admin/promo-filters'

/** Statuts qui comptent comme une commande payée. */
export const SALIM_PAID_STATUSES = ['paid', 'fulfilled', 'shipped', 'complete'] as const

export const SALIM_ORDER_FORMATS = ['book_sale', 'book_preorder', 'fiches_salim', 'bundle_salim'] as const

export type SalimOrderFormat = (typeof SALIM_ORDER_FORMATS)[number]

export type SalimOrderRow = {
  product_id: string | null
  status: string | null
  amount_total: number | null
  coupon_code: string | null
  quantity: number | null
}

export type SalimFormatCount = {
  format: SalimOrderFormat
  paidOrders: number
}

export function summarizePaidOrdersByFormat(rows: SalimOrderRow[]): SalimFormatCount[] {
  const counts = new Map<SalimOrderFormat, number>(SALIM_ORDER_FORMATS.map((format) => [format, 0]))

  for (const row of rows) {
    if (!row.status || !SALIM_PAID_STATUSES.includes(row.status as (typeof SALIM_PAID_STATUSES)[number])) continue
    if (isInternalTestCoupon(row.coupon_code)) continue
    if ((row.amount_total ?? 0) <= 0) continue
    const format = row.product_id
    if (!format || !counts.has(format as SalimOrderFormat)) continue
    const quantity = typeof row.quantity === 'number' && row.quantity >= 1 ? Math.floor(row.quantity) : 1
    counts.set(format as SalimOrderFormat, (counts.get(format as SalimOrderFormat) ?? 0) + quantity)
  }

  return SALIM_ORDER_FORMATS.map((format) => ({
    format,
    paidOrders: counts.get(format) ?? 0,
  }))
}
