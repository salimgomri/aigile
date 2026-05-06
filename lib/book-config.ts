/**
 * Livre S.A.L.I.M — Variable pour basculer Précommander ↔ Commander
 *
 * false = Précommander / Pre-order (livre pas encore publié)
 * true  = Commander / Buy (livre publié)
 *
 * Précommande terminée : vente au prix catalogue (book_sale).
 */
export const BOOK_IS_PUBLISHED = true

export function getBookCtaLabel(language: 'fr' | 'en'): string {
  return BOOK_IS_PUBLISHED
    ? language === 'fr'
      ? 'Commander'
      : 'Buy'
    : language === 'fr'
      ? 'Précommander'
      : 'Pre-order'
}
