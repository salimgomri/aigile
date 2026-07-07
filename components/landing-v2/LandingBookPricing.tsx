'use client'

import { useEffect, useState } from 'react'
import { formatBookPrice } from '@/lib/book-config'
import { useBookProduct } from '@/lib/book-product-context'

type LandingBookPricingProps = {
  className?: string
  showCompare?: boolean
}

export function LandingBookPricing({ className = 'ld-price', showCompare = true }: LandingBookPricingProps) {
  const { product } = useBookProduct()
  const [meta, setMeta] = useState<{ priceFormatted: string; compareAtFormatted?: string } | null>(null)

  useEffect(() => {
    fetch('/api/book/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.priceFormatted) {
          setMeta({
            priceFormatted: d.priceFormatted,
            compareAtFormatted: d.compareAtFormatted,
          })
        }
      })
      .catch(() => {})
  }, [])

  const price = meta?.priceFormatted ?? (product?.amount ? formatBookPrice(product.amount) : '69,00 €')
  const compare = meta?.compareAtFormatted

  return (
    <div className={className}>
      {showCompare && compare ? <span className="ld-price__compare">{compare}</span> : null}
      <span className="ld-price__amount">{price}</span>
    </div>
  )
}
