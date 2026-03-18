/**
 * Livre S.A.L.I.M — Variable pour basculer Précommander ↔ Commander
 *
 * false = Précommander / Pre-order (livre pas encore publié)
 * true  = Commander / Buy (livre publié)
 *
 * Change cette valeur quand le livre est publié.
 */
export const BOOK_IS_PUBLISHED = false

export function getBookCtaLabel(language: 'fr' | 'en'): string {
  return BOOK_IS_PUBLISHED
    ? language === 'fr'
      ? 'Commander'
      : 'Buy'
    : language === 'fr'
      ? 'Précommander'
      : 'Pre-order'
}
