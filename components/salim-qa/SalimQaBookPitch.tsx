'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import CheckoutSheet from '@/components/checkout/CheckoutSheet'
import { formatBookPrice, getBookCtaLabel } from '@/lib/book-config'
import { getSalimYearsExperience } from '@/lib/salim-experience'
import { trackEvent } from '@/lib/gtag'
import { useBookProduct } from '@/lib/book-product-context'
import { translations } from '@/lib/translations'

type PitchLayout = 'strip' | 'bar' | 'card' | 'mini'

type SalimQaBookPitchProps = {
  language: 'fr' | 'en'
  layout: PitchLayout
  trackSource?: string
  onClick?: () => void
  className?: string
}

type PricingMeta = {
  priceFormatted: string
  compareAtFormatted: string
}

function useBookPricing() {
  const [pricing, setPricing] = useState<PricingMeta | null>(null)

  useEffect(() => {
    fetch('/api/book/pricing')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.priceFormatted) {
          setPricing({
            priceFormatted: d.priceFormatted,
            compareAtFormatted: d.compareAtFormatted,
          })
        }
      })
      .catch(() => {})
  }, [])

  return pricing
}

function getPitchCopy(language: 'fr' | 'en') {
  const years = getSalimYearsExperience()
  const t = translations[language]

  if (language === 'fr') {
    return {
      kicker: 'Source officielle du Q&A Lab',
      title: t['book-title'],
      subtitle: t['book-subtitle'],
      teaser: `Vous parcourez les vraies questions du terrain. Chaque réponse complète, chaque fiche pratique et ${years} ans de coaching agile condensés sont dans ce livre — pas un article, le système entier.`,
      hook: 'La réponse que vous cherchez est dans ce livre.',
      bullets: [
        '350+ questions-réponses comme celles-ci',
        'Fiches pratiques prêtes en sprint',
        'Scrum augmenté par l’IA — méthode Salim Gomri',
      ],
      delivery:
        'Livraison ou retrait en main propre · Prix direct aigile.lu',
      discover: 'Voir la page livre',
    }
  }

  return {
    kicker: 'Official source of the Q&A Lab',
    title: t['book-title'],
    subtitle: t['book-subtitle'],
    teaser: `You are browsing real field questions. Every full answer, every practical sheet and ${years} years of agile coaching are in this book — not a blog post, the full system.`,
    hook: 'The answer you are looking for is in this book.',
    bullets: [
      '350+ Q&As like the ones here',
      'Field sheets ready for your sprint',
      'AI-augmented Scrum — Salim Gomri’s method',
    ],
    delivery: 'Shipping or in-person pickup · Direct price on aigile.lu',
    discover: 'View book page',
  }
}

function PitchCover({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { w: 44, h: 60, className: 'sq-pitch-cover sq-pitch-cover--sm' },
    md: { w: 72, h: 96, className: 'sq-pitch-cover sq-pitch-cover--md' },
    lg: { w: 132, h: 176, className: 'sq-pitch-cover sq-pitch-cover--lg' },
  }[size]

  return (
    <div className={sizes.className}>
      <Image
        src="/images/book-cover.jpg"
        alt="Le Système S.A.L.I.M."
        width={sizes.w}
        height={sizes.h}
        className="sq-pitch-cover__img"
        priority={size === 'lg'}
      />
      <div className="sq-pitch-cover__glow" aria-hidden />
    </div>
  )
}

function PitchCta({
  language,
  trackSource,
  onClick,
  pricing,
  product,
  size = 'md',
}: {
  language: 'fr' | 'en'
  trackSource: string
  onClick?: () => void
  pricing: PricingMeta | null
  product: ReturnType<typeof useBookProduct>['product']
  size?: 'md' | 'lg'
}) {
  const price =
    pricing?.priceFormatted ??
    (product?.amount ? formatBookPrice(product.amount) : '69,00 €')
  const label = `${getBookCtaLabel(language)} · ${price}`

  const handleClick = () => {
    onClick?.()
    trackEvent('salim_qa_book_click', { source: trackSource })
    trackEvent('book_order_click', { product: 's-a-l-i-m', source: trackSource })
  }

  const className = size === 'lg' ? 'sq-pitch-cta sq-pitch-cta--lg' : 'sq-pitch-cta'

  if (!product) {
    return (
      <button type="button" disabled className={className}>
        {getBookCtaLabel(language)}
      </button>
    )
  }

  return (
    <CheckoutSheet
      product={product}
      checkoutSource="salim_qa"
      trigger={
        <button type="button" className={className} onClick={handleClick}>
          <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
        </button>
      }
    />
  )
}

export function SalimQaBookPitch({
  language,
  layout,
  trackSource = 'salim_qa_pitch',
  onClick,
  className = '',
}: SalimQaBookPitchProps) {
  const { product } = useBookProduct()
  const pricing = useBookPricing()
  const copy = getPitchCopy(language)
  const t = translations[language]

  if (layout === 'mini') {
    return (
      <div className={`sq-pitch sq-pitch--mini ${className}`.trim()}>
        <PitchCover size="sm" />
        <div className="sq-pitch__mini-copy">
          <div className="sq-pitch__title">{copy.title}</div>
          <p className="sq-pitch__teaser">{copy.hook}</p>
        </div>
        <PitchCta
          language={language}
          trackSource={trackSource}
          onClick={onClick}
          pricing={pricing}
          product={product}
        />
      </div>
    )
  }

  if (layout === 'strip') {
    return (
      <div className={`sq-pitch sq-pitch--strip ${className}`.trim()}>
        <PitchCover size="md" />
        <div className="sq-pitch__body">
          <div className="sq-brand-mono sq-pitch__kicker">{copy.kicker}</div>
          <div className="sq-pitch__title-row">
            <h3 className="sq-pitch__title sq-brand-serif">{copy.title}</h3>
            <span className="sq-pitch__subtitle">{copy.subtitle}</span>
          </div>
          <p className="sq-pitch__teaser">{copy.teaser}</p>
          <ul className="sq-pitch__bullets">
            {copy.bullets.map((b) => (
              <li key={b}>
                <Check size={14} strokeWidth={2.5} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="sq-pitch__aside">
          {pricing && (
            <div className="sq-pitch__price">
              <span className="sq-pitch__compare">{pricing.compareAtFormatted}</span>
              <span className="sq-pitch__amount">{pricing.priceFormatted}</span>
            </div>
          )}
          <PitchCta
            language={language}
            trackSource={trackSource}
            onClick={onClick}
            pricing={pricing}
            product={product}
            size="lg"
          />
          <Link href="/#book" className="sq-pitch__link">
            {copy.discover} ↗
          </Link>
        </div>
      </div>
    )
  }

  if (layout === 'bar') {
    return (
      <div className={`sq-pitch sq-pitch--bar ${className}`.trim()}>
        <PitchCover size="sm" />
        <div className="sq-pitch__bar-copy">
          <div className="sq-brand-mono sq-pitch__kicker sq-pitch__kicker--light">{copy.kicker}</div>
          <div className="sq-pitch__title sq-pitch__title--light">{copy.title}</div>
          <p className="sq-pitch__hook sq-pitch__hook--light">{copy.hook}</p>
        </div>
        <div className="sq-pitch__bar-aside">
          {pricing && (
            <div className="sq-pitch__price sq-pitch__price--light">
              <span className="sq-pitch__compare">{pricing.compareAtFormatted}</span>
              <span className="sq-pitch__amount">{pricing.priceFormatted}</span>
            </div>
          )}
          <PitchCta
            language={language}
            trackSource={trackSource}
            onClick={onClick}
            pricing={pricing}
            product={product}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`sq-pitch sq-pitch--card ${className}`.trim()}>
      <div className="sq-pitch__card-visual">
        <PitchCover size="lg" />
      </div>
      <div className="sq-pitch__card-copy">
        <div className="sq-brand-mono sq-pitch__kicker">{copy.kicker}</div>
        <h2 className="sq-pitch__title sq-pitch__title--card sq-brand-serif">{copy.title}</h2>
        <p className="sq-pitch__subtitle sq-pitch__subtitle--card">{copy.subtitle}</p>
        <p className="sq-pitch__teaser sq-pitch__teaser--card">{copy.teaser}</p>
        <ul className="sq-pitch__benefits">
          {[t['book-benefit-1'], t['book-benefit-2'], t['book-benefit-3']].map((b) => (
            <li key={b}>
              <Check size={18} strokeWidth={2.5} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {pricing && (
          <div className="sq-pitch__price sq-pitch__price--card">
            <span className="sq-pitch__compare">{pricing.compareAtFormatted}</span>
            <span className="sq-pitch__amount">{pricing.priceFormatted}</span>
            <span className="sq-pitch__delivery">{copy.delivery}</span>
          </div>
        )}
        <div className="sq-pitch__card-actions">
          <PitchCta
            language={language}
            trackSource={trackSource}
            onClick={onClick}
            pricing={pricing}
            product={product}
            size="lg"
          />
          <Link href="/#book" className="sq-pitch__secondary">
            {copy.discover}
          </Link>
        </div>
      </div>
    </div>
  )
}

type SalimQaBookOfferModalProps = {
  open: boolean
  language: 'fr' | 'en'
  trackSource?: string
  onClose: () => void
  onBookClick?: () => void
}

export function SalimQaBookOfferModal({
  open,
  language,
  trackSource = 'salim_qa_modal',
  onClose,
  onBookClick,
}: SalimQaBookOfferModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="sq-modal-overlay" onClick={onClose} role="presentation">
      <div className="sq-book-offer-modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <button type="button" className="sq-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <SalimQaBookPitch
          language={language}
          layout="card"
          trackSource={trackSource}
          onClick={onBookClick}
        />
      </div>
    </div>
  )
}
