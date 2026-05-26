'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/payments/catalog'
import {
  BOOK_COMPARE_AT_CENTIMES,
  FICHES_COMPARE_AT_CENTIMES,
  formatBookPrice,
} from '@/lib/book-config'
import { getSalimCrossSellCopy, getSalimCrossSellTargetId } from '@/lib/payments/salim-cross-sell'

type AddonPricing = {
  product: Product
  priceFormatted: string
  compareAtFormatted?: string
}

type SalimCrossSellAddonProps = {
  sourceProductId: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onAddonProduct?: (product: Product | null) => void
  className?: string
}

export default function SalimCrossSellAddon({
  sourceProductId,
  checked,
  onCheckedChange,
  onAddonProduct,
  className = '',
}: SalimCrossSellAddonProps) {
  const copy = getSalimCrossSellCopy(sourceProductId)
  const targetId = getSalimCrossSellTargetId(sourceProductId)
  const [addon, setAddon] = useState<AddonPricing | null>(null)

  useEffect(() => {
    if (!targetId) {
      onAddonProduct?.(null)
      return
    }
    fetch('/api/book/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        let next: AddonPricing | null = null
        if (targetId === 'fiches_salim' && d.fiches?.product) {
          next = {
            product: d.fiches.product,
            priceFormatted: d.fiches.priceFormatted,
            compareAtFormatted: d.fiches.compareAtFormatted,
          }
        } else if (targetId === 'book_sale' && d.product) {
          next = {
            product: d.product,
            priceFormatted: d.priceFormatted,
            compareAtFormatted: d.compareAtFormatted,
          }
        }
        setAddon(next)
        onAddonProduct?.(next?.product ?? null)
      })
      .catch(() => onAddonProduct?.(null))
  }, [targetId, onAddonProduct])

  if (!copy || !targetId || !addon) return null

  const compareAt =
    addon.compareAtFormatted ??
    formatBookPrice(targetId === 'fiches_salim' ? FICHES_COMPARE_AT_CENTIMES : BOOK_COMPARE_AT_CENTIMES)

  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors ${
        checked
          ? 'border-aigile-gold bg-aigile-gold/10'
          : 'border-aigile-gold/30 bg-aigile-gold/5 hover:border-aigile-gold/50'
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-aigile-gold"
      />
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md shadow-sm">
        <Image src={copy.coverPath} alt="" fill className="object-cover" sizes="56px" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-aigile-gold">
          Complète ta commande
        </p>
        <p className="text-sm font-semibold text-foreground leading-snug">{copy.headline}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{copy.subline}</p>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs text-muted-foreground line-through">{compareAt}</span>
          <span className="text-sm font-bold text-foreground">+{addon.priceFormatted}</span>
        </div>
      </div>
    </label>
  )
}
