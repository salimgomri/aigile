'use client'

import { useEffect, useState, type ReactNode } from 'react'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import { formatBookPrice, getBookCtaLabel } from '@/lib/book-config'
import { trackEvent } from '@/lib/gtag'
import { useBookProduct } from '@/lib/book-product-context'
import { useLanguage } from '@/components/language-provider'

type LandingBuyButtonProps = {
  className?: string
  source?: string
  children?: ReactNode
  showPrice?: boolean
  disabledClassName?: string
}

/**
 * Bouton Commander — déclenche le CheckoutSheet existant (aucune logique paiement custom).
 */
export function LandingBuyButton({
  className = 'ld-btn ld-btn--primary',
  source = 'landing_home',
  children,
  showPrice = true,
  disabledClassName = 'ld-btn ld-btn--primary ld-btn--disabled',
}: LandingBuyButtonProps) {
  const { language } = useLanguage()
  const { product } = useBookProduct()
  const [priceFormatted, setPriceFormatted] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/book/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.priceFormatted) setPriceFormatted(d.priceFormatted)
      })
      .catch(() => {})
  }, [])

  const price =
    priceFormatted ?? (product?.amount ? formatBookPrice(product.amount) : '69,00 €')
  const defaultLabel =
    language === 'fr' ? 'Acheter le livre' : 'Buy the book'
  const cta = getBookCtaLabel(language)
  const label = showPrice ? `${cta} · ${price}` : defaultLabel

  const handleClick = () => {
    trackEvent('book_order_click', {
      product: 's-a-l-i-m',
      value: 69,
      currency: 'EUR',
      source,
    })
  }

  if (!product) {
    return (
      <button type="button" disabled className={disabledClassName}>
        {defaultLabel}
      </button>
    )
  }

  return (
    <CheckoutSheet
      product={product}
      checkoutSource={source}
      trigger={
        <button type="button" className={className} onClick={handleClick}>
          {children ?? label}
        </button>
      }
    />
  )
}
