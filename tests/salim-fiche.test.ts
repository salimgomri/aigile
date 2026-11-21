import { describe, expect, it } from 'vitest'
import { getProduct } from '@/lib/payments/catalog'
import {
  SALIM_BOOK_CENTIMES,
  SALIM_DELIVERED_CENTIMES,
  SALIM_EDITION_ID,
  SALIM_EXCERPT,
  SALIM_EXCERPT_PATH,
  SALIM_LINKS,
  SALIM_PRICE_LABEL,
  SALIM_PURCHASE_PATH,
  SALIM_SHIPPING_CENTIMES,
  SALIM_SUBTITLE,
} from '@/lib/salim/fiche'
import { summarizePaidOrdersByFormat } from '@/lib/salim/suivi-summary'

describe('fiche S.A.L.I.M.', () => {
  it('affiche un seul prix, égal au total livré du catalogue', () => {
    const book = getProduct(SALIM_EDITION_ID)
    expect(book?.amount).toBe(SALIM_BOOK_CENTIMES)
    expect(book?.shippingFee).toBe(SALIM_SHIPPING_CENTIMES)
    expect(SALIM_DELIVERED_CENTIMES).toBe(6900 + 500)
    expect(SALIM_PRICE_LABEL).toBe('74,00 €')
    expect(SALIM_SUBTITLE.toLowerCase()).not.toContain('uniquement')
    expect(SALIM_SUBTITLE.toLowerCase()).not.toContain('amazon')
  })

  it('sépare le lien extrait et le lien achat', () => {
    expect(SALIM_EXCERPT_PATH).not.toBe(SALIM_PURCHASE_PATH)
    expect(SALIM_LINKS.extrait).toBe('/salim/extrait')
    expect(SALIM_LINKS.achat).toBe('/salim/achat')
    expect(SALIM_EXCERPT.paragraphs.length).toBeGreaterThan(0)
    expect(SALIM_EXCERPT.validation).toBe('à confirmer par Salim')
  })
})

describe('commandes payées par format', () => {
  it('compte les commandes payées et ignore le reste', () => {
    const rows = summarizePaidOrdersByFormat([
      { product_id: 'book_sale', status: 'paid', amount_total: 7400, coupon_code: null, quantity: 1 },
      { product_id: 'book_sale', status: 'paid', amount_total: 7400, coupon_code: 'TEST100', quantity: 1 },
      { product_id: 'fiches_salim', status: 'pending', amount_total: 5400, coupon_code: null, quantity: 1 },
      { product_id: 'bundle_salim', status: 'fulfilled', amount_total: 11500, coupon_code: null, quantity: 2 },
      { product_id: 'pro_monthly', status: 'paid', amount_total: 1999, coupon_code: null, quantity: 1 },
    ])
    expect(rows).toEqual([
      { format: 'book_sale', paidOrders: 1 },
      { format: 'book_preorder', paidOrders: 0 },
      { format: 'fiches_salim', paidOrders: 0 },
      { format: 'bundle_salim', paidOrders: 2 },
    ])
  })
})
