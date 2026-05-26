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
      Paiement sécurisé · Des questions ?{' '}
      <a href="mailto:salim@aigile.lu" className="hover:underline">
        salim@aigile.lu
      </a>
    </p>
  )
}

export function SalimOffers() {
  return (
    <section id="salim-offres" className="products-section">
      <h2>Choisis ton format</h2>
      <p className="section-subtitle">
        Disponibles uniquement sur aigile.lu · Livraison en France et au Luxembourg
      </p>

      <div className="products-grid">
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
          <p className="product-price-original">{formatBookPrice(BOOK_COMPARE_AT_CENTIMES)}</p>
          <p className="product-price-main">{formatBookPrice(BOOK_SALE_CENTIMES)}</p>
          <p className="product-price-note">Prix direct aigile.lu · prix Amazon barré ci-dessus</p>
          <p className="stock-tension">Expédition sous 48h · Stock limité pour l&apos;envoi postal</p>
          <OfferList
            items={[
              '10 plans d’action concrets, un par chapitre — applicable dès lundi',
              '73 erreurs terrain nommées avec le diagnostic et la correction',
              '93 prompts IA utilisables immédiatement dans ChatGPT ou Claude',
              'Le cadre complet : des rôles aux métriques jusqu’à l’IA dans le sprint',
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
              {getBookCtaLabel('fr')} · {formatBookPrice(BOOK_SALE_CENTIMES)}
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
          <p className="product-price-original">{formatBookPrice(FICHES_COMPARE_AT_CENTIMES)}</p>
          <p className="product-price-main">{formatBookPrice(FICHES_SALE_CENTIMES)}</p>
          <p className="product-price-note">Prix direct aigile.lu</p>
          <p className="stock-tension">Expédition sous 48h · Stock limité pour l&apos;envoi postal</p>
          <OfferList
            items={[
              'Toutes les fiches du système, format terrain — pas académique',
              'À garder ouvert sur le bureau pendant un sprint',
              'Utilisable seul, complémentaire au livre',
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
              Commander les fiches · {formatBookPrice(FICHES_SALE_CENTIMES)}
            </button>
            <Reassurance />
          </form>
        </article>

        <article className="product-card recommended">
          <span className="product-badge">Recommandé</span>
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
            Valeur Amazon : {formatBookPrice(BUNDLE_COMPARE_AT_CENTIMES)}
          </p>
          <p className="product-price-main">{formatBookPrice(BUNDLE_SALE_CENTIMES)}</p>
          <p className="product-price-note">Disponible uniquement sur aigile.lu</p>
          <p className="stock-tension">Expédition sous 48h · Stock limité pour l&apos;envoi postal</p>
          <OfferList
            items={[
              'Le livre pour comprendre. Le cahier pour faire. L’outil pour mesurer.',
              'Accès Early Access illimité au Scoring Deliverable sur aigile.lu',
              'Le système complet, rien à compléter',
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
              Commander la collection · {formatBookPrice(BUNDLE_SALE_CENTIMES)}
            </button>
            <Reassurance />
          </form>
        </article>
      </div>
    </section>
  )
}
