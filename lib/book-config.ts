/**
 * Livre S.A.L.I.M — Variable pour basculer Précommander ↔ Commander
 *
 * false = Précommander / Pre-order (livre pas encore publié)
 * true  = Commander / Buy (livre publié)
 *
 * Précommande terminée : vente au prix catalogue (book_sale).
 */
export const BOOK_IS_PUBLISHED = true

/** Prix barré affiché (réf. Amazon) — centimes EUR */
export const BOOK_COMPARE_AT_CENTIMES = 7900

/** Fiches pratiques — prix barré (réf. Amazon) */
export const FICHES_COMPARE_AT_CENTIMES = 5900

/** Collection — valeur Amazon (79 € livre + 59 € fiches) */
export const BUNDLE_COMPARE_AT_CENTIMES = 13800

export const BOOK_SALE_CENTIMES = 6500
export const FICHES_SALE_CENTIMES = 4900
export const BUNDLE_SALE_CENTIMES = 11000

export function formatBookPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

export function getBookCtaLabel(language: 'fr' | 'en'): string {
  return BOOK_IS_PUBLISHED
    ? language === 'fr'
      ? 'Commander'
      : 'Buy'
    : language === 'fr'
      ? 'Précommander'
      : 'Pre-order'
}
