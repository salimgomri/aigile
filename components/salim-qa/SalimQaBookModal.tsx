'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import { SalimQaBookPitch } from './SalimQaBookPitch'
import { formatBookPrice, getBookCtaLabel } from '@/lib/book-config'
import { trackEvent } from '@/lib/gtag'
import { useBookProduct } from '@/lib/book-product-context'

type BuyBookVariant = 'gold' | 'gold-lg' | 'secondary' | 'landing'

type SalimQaBuyBookButtonProps = {
  language: 'fr' | 'en'
  variant?: BuyBookVariant
  trackSource?: string
  className?: string
  style?: CSSProperties
  fullWidth?: boolean
  onClick?: () => void
}

/** Même flux checkout que la landing (#book) : CheckoutSheet + prix /api/book/pricing */
export function SalimQaBuyBookButton({
  language,
  variant = 'gold',
  trackSource = 'salim_qa',
  className,
  style,
  fullWidth,
  onClick,
}: SalimQaBuyBookButtonProps) {
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
  const label = `${getBookCtaLabel(language)} · ${price}`

  const handleClick = () => {
    onClick?.()
    trackEvent('salim_qa_book_click', { source: trackSource })
    trackEvent('book_order_click', { product: 's-a-l-i-m', source: trackSource })
  }

  const variantClass =
    variant === 'gold-lg'
      ? 'sq-btn-gold-lg'
      : variant === 'gold'
        ? 'sq-btn-gold'
        : variant === 'landing'
          ? 'sq-btn-landing'
          : undefined

  const secondaryStyle: CSSProperties =
    variant === 'secondary'
      ? {
          width: fullWidth ? '100%' : undefined,
          padding: 10,
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 11,
          background: '#fff',
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          ...style,
        }
      : style ?? {}

  if (!product) {
    return (
      <button
        type="button"
        disabled
        className={[variantClass, fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
        style={variant === 'secondary' ? secondaryStyle : style}
      >
        {getBookCtaLabel(language)}
      </button>
    )
  }

  return (
    <CheckoutSheet
      product={product}
      checkoutSource="salim_qa"
      trigger={
        <button
          type="button"
          className={[variantClass, fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
          style={variant === 'secondary' ? secondaryStyle : style}
          onClick={handleClick}
        >
          {variant === 'secondary' ? (
            language === 'fr' ? (
              'Acheter le livre'
            ) : (
              'Buy the book'
            )
          ) : (
            <span style={{ position: 'relative' }}>{label}</span>
          )}
        </button>
      }
    />
  )
}

/** Bloc paywall réutilisable dans cartes / modal détail */
export function SalimQaPaywallBlock({
  onUnlock,
  language,
  hasFiche,
  page,
  canUnlock,
  cost = 1,
  onBookClick,
}: {
  onUnlock: () => void
  language: 'fr' | 'en'
  hasFiche?: boolean
  page?: string | number | null
  canUnlock: boolean
  cost?: number
  onBookClick?: () => void
}) {
  const unlockLabel = canUnlock
    ? language === 'fr'
      ? `Débloquer la réponse complète (${cost} crédit)`
      : `Unlock full answer (${cost} credit)`
    : language === 'fr'
      ? 'Recharger des crédits'
      : 'Top up credits'

  return (
    <div className="sq-paywall">
      <p style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.5, color: '#3A3A36' }}>
        {language === 'fr' ? (
          <>
            Aperçu seulement — réponse complète{hasFiche ? ' et fiche (schéma)' : ''} dans{' '}
            <em>Le Système S.A.L.I.M.</em>
            {page ? ` · page ${page}` : ''}
          </>
        ) : (
          <>
            Preview only — full answer{hasFiche ? ' and sheet (diagram)' : ''} in{' '}
            <em>The S.A.L.I.M. System</em>
            {page ? ` · page ${page}` : ''}
          </>
        )}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button type="button" className="sq-btn-gold w-full" onClick={onUnlock}>
          {unlockLabel}
        </button>
        <SalimQaBookPitch
          language={language}
          layout="mini"
          trackSource="salim_qa_paywall"
          onClick={onBookClick}
        />
      </div>
    </div>
  )
}
