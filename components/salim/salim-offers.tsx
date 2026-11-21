'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimateIn } from './animate-in'
import { SALIM_EDITION_LABEL, SALIM_EXCERPT_PATH, SALIM_PRICE_LABEL, SALIM_PURCHASE_PATH, SALIM_SUBTITLE } from '@/lib/salim/fiche'

export function SalimOffers() {
  return (
    <section id="salim-offres" className="products-section">
      <AnimateIn>
        <h2>{SALIM_EDITION_LABEL}</h2>
        <p className="section-subtitle">{SALIM_SUBTITLE}</p>
      </AnimateIn>

      <div className="products-grid products-grid-single">
        <article className="product-card">
          <div className="product-cover book">
            <Image
              src="/images/book-cover.jpg"
              alt="Le Système S.A.L.I.M."
              fill
              className="object-cover"
              sizes="120px"
              priority
            />
          </div>
          <h3 className="product-title">Le Système S.A.L.I.M.</h3>
          <p className="product-price-main">{SALIM_PRICE_LABEL}</p>
          <p className="product-price-note">Prix total livré, port compris</p>
          <p className="salim-two-links">
            <Link href={SALIM_EXCERPT_PATH}>Lire l’extrait</Link>
            <Link href={SALIM_PURCHASE_PATH}>Acheter le livre</Link>
          </p>
        </article>
      </div>
    </section>
  )
}
