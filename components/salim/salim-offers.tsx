'use client'

import Image from 'next/image'
import {
  BOOK_COMPARE_AT_CENTIMES,
  BOOK_SALE_CENTIMES,
  BUNDLE_COMPARE_AT_CENTIMES,
  BUNDLE_SALE_CENTIMES,
  FICHES_COMPARE_AT_CENTIMES,
  FICHES_SALE_CENTIMES,
  formatBookPrice,
  getBookCtaLabel,
} from '@/lib/book-config'
import { trackEvent } from '@/lib/gtag'
import { checkoutBundle, checkoutFiches, checkoutLivre } from '@/app/salim/actions'
import { AnimateIn } from './animate-in'
import { SalimContactLinks } from './salim-contact-links'

const COMPARE_ROWS = [
  { label: 'Cadre complet (415 pages)', book: true, fiches: false, bundle: true },
  { label: 'Fiches terrain sprint', book: false, fiches: true, bundle: true },
  { label: 'Scoring Deliverable (Early Access)', book: false, fiches: false, bundle: true },
  { label: 'Applicable dès lundi', book: true, fiches: true, bundle: true },
  { label: 'Système complet, rien à compléter', book: false, fiches: false, bundle: true },
] as const

function OfferList({ items }: { items: string[] }) {
  return (
    <ul className="product-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function Reassurance() {
  return (
    <p className="product-reassurance">
      Paiement sécurisé · Des questions ? <SalimContactLinks />
    </p>
  )
}

function CompareCell({ value }: { value: boolean }) {
  return (
    <td className={value ? 'compare-yes' : 'compare-no'} aria-label={value ? 'Inclus' : 'Non inclus'}>
      {value ? '✓' : '—'}
    </td>
  )
}

export function SalimOffers() {
  return (
    <section id="salim-offres" className="products-section">
      <AnimateIn>
        <h2>Choisis ton format</h2>
        <p className="section-subtitle">
          Disponibles uniquement sur aigile.lu · Livraison en France et au Luxembourg
        </p>
        <p className="offers-guide">
          <strong>Meilleur choix :</strong> la Collection — livre + cahier + outil de mesure. C&apos;est le
          système complet, sans complément à acheter plus tard.
        </p>
      </AnimateIn>

      <AnimateIn cascadeDelay={80} className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Livre</th>
              <th scope="col">Fiches</th>
              <th scope="col" className="compare-col-featured">
                Collection
                <span className="compare-badge">Meilleur choix</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <CompareCell value={row.book} />
                <CompareCell value={row.fiches} />
                <CompareCell value={row.bundle} />
              </tr>
            ))}
            <tr className="compare-price-row">
              <th scope="row">Prix aigile.lu</th>
              <td>{formatBookPrice(BOOK_SALE_CENTIMES)}</td>
              <td>{formatBookPrice(FICHES_SALE_CENTIMES)}</td>
              <td className="compare-col-featured">
                <span className="compare-price-main">{formatBookPrice(BUNDLE_SALE_CENTIMES)}</span>
                <span className="compare-price-ref">
                  vs {formatBookPrice(BUNDLE_COMPARE_AT_CENTIMES)} sur Amazon
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </AnimateIn>

      <div className="products-grid">
        <article className="product-card recommended featured-first">
          <span className="product-badge product-badge-strong">Meilleur choix</span>
          <div className="product-cover bundle">
            <Image
              src="/images/bundle-covers.png"
              alt="Collection S.A.L.I.M. · Livre et cahier de fiches"
              fill
              className="object-contain p-1"
              sizes="200px"
            />
          </div>
          <h3 className="product-title">Collection S.A.L.I.M.</h3>
          <p className="product-price-context">
            Valeur Amazon : {formatBookPrice(BUNDLE_COMPARE_AT_CENTIMES)} (79 € + 59 €)
          </p>
          <p className="product-price-main">{formatBookPrice(BUNDLE_SALE_CENTIMES)}</p>
          <p className="product-price-note">Ton prix direct · économie de 28 € vs Amazon</p>
          <p className="stock-tension">Expédition sous 48h · Stock limité pour l&apos;envoi postal</p>
          <OfferList
            items={[
              'Comprendre, faire, mesurer — le système complet',
              'Early Access illimité au Scoring Deliverable',
              'Rien à compléter après l’achat',
            ]}
          />
          <form id="salim-bundle-form" action={checkoutBundle}>
            <button
              type="submit"
              onClick={() =>
                trackEvent('bundle_order_click', {
                  product: 'bundle-salim',
                  value: 100,
                  currency: 'EUR',
                  source: 'salim_landing',
                })
              }
              className="product-cta gold cta-primary"
            >
              Commander la collection · {formatBookPrice(BUNDLE_SALE_CENTIMES)} · expédié sous 48h
            </button>
            <Reassurance />
          </form>
        </article>

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
          <p className="product-price-original">Amazon : {formatBookPrice(BOOK_COMPARE_AT_CENTIMES)}</p>
          <p className="product-price-main">{formatBookPrice(BOOK_SALE_CENTIMES)}</p>
          <p className="product-price-note">Prix direct aigile.lu · −14 € vs Amazon</p>
          <p className="stock-tension">Expédition sous 48h · Stock limité pour l&apos;envoi postal</p>
          <OfferList
            items={[
              '10 plans d’action concrets — applicable dès lundi',
              '73 erreurs terrain avec diagnostic et correction',
              '93 prompts IA prêts pour ChatGPT ou Claude',
            ]}
          />
          <form action={checkoutLivre}>
            <button
              type="submit"
              onClick={() =>
                trackEvent('book_order_click', {
                  product: 's-a-l-i-m',
                  value: 65,
                  currency: 'EUR',
                  source: 'salim_landing',
                })
              }
              className="product-cta navy"
            >
              {getBookCtaLabel('fr')} · {formatBookPrice(BOOK_SALE_CENTIMES)} · paiement sécurisé
            </button>
            <Reassurance />
          </form>
        </article>

        <article className="product-card">
          <div className="product-cover book">
            <Image
              src="/images/book-cover-fiche.png"
              alt="Le Système S.A.L.I.M., fiches pratiques"
              fill
              className="object-cover"
              sizes="120px"
              priority
            />
          </div>
          <h3 className="product-title">Le Système S.A.L.I.M.</h3>
          <p className="product-subtitle">Fiches pratiques</p>
          <p className="product-price-original">Amazon : {formatBookPrice(FICHES_COMPARE_AT_CENTIMES)}</p>
          <p className="product-price-main">{formatBookPrice(FICHES_SALE_CENTIMES)}</p>
          <p className="product-price-note">Prix direct aigile.lu · −14 € vs Amazon</p>
          <p className="stock-tension">Expédition sous 48h · Stock limité pour l&apos;envoi postal</p>
          <OfferList
            items={[
              'Fiches terrain — pas académique',
              'À garder ouvert pendant un sprint',
              'Complément idéal au livre',
            ]}
          />
          <form action={checkoutFiches}>
            <button
              type="submit"
              onClick={() =>
                trackEvent('fiches_order_click', {
                  product: 'fiches-salim',
                  value: 35,
                  currency: 'EUR',
                  source: 'salim_landing',
                })
              }
              className="product-cta navy"
            >
              Commander les fiches · {formatBookPrice(FICHES_SALE_CENTIMES)} · paiement sécurisé
            </button>
            <Reassurance />
          </form>
        </article>
      </div>
    </section>
  )
}
