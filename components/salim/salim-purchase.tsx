'use client'

import { trackEvent } from '@/lib/gtag'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import type { Product } from '@/lib/payments/catalog'
import { SALIM_DELIVERED_CENTIMES, SALIM_EDITION_ID, SALIM_PRICE_LABEL } from '@/lib/salim/fiche'

export function SalimPurchase({ book }: { book: Product | null }) {

  return (
    <CheckoutSheet
      product={book}
      checkoutSource="salim_landing"
      trigger={
        <button
          type="button"
          onClick={() =>
            trackEvent('book_order_click', {
              product: SALIM_EDITION_ID,
              value: SALIM_DELIVERED_CENTIMES / 100,
              currency: 'EUR',
              source: 'salim_achat',
            })
          }
          className="product-cta navy"
        >
          Payer · {SALIM_PRICE_LABEL} livré
        </button>
      }
    />
  )
}
