/** Suggestion produit complémentaire livre ↔ fiches (pas pour le bundle). */
export type SalimCrossSellTarget = 'book_sale' | 'fiches_salim'

const TARGET_IDS: Record<string, SalimCrossSellTarget> = {
  book_sale: 'fiches_salim',
  book_preorder: 'fiches_salim',
  fiches_salim: 'book_sale',
}

export function getSalimCrossSellTargetId(sourceProductId: string): SalimCrossSellTarget | null {
  return TARGET_IDS[sourceProductId] ?? null
}

export function isValidCrossSellAddon(primaryProductId: string, addonProductId: string): boolean {
  return getSalimCrossSellTargetId(primaryProductId) === addonProductId
}

export function getSalimCrossSellCopy(sourceProductId: string): {
  headline: string
  subline: string
  cta: string
  coverPath: string
} | null {
  const targetId = getSalimCrossSellTargetId(sourceProductId)
  if (!targetId) return null

  if (targetId === 'fiches_salim') {
    return {
      headline: 'Complète avec le cahier de fiches',
      subline: 'Le livre pour comprendre. Le cahier pour faire — à garder ouvert pendant le sprint.',
      cta: 'Commander les fiches',
      coverPath: '/images/book-cover-fiche.png',
    }
  }

  return {
    headline: 'Complète avec le livre',
    subline: '415 pages pour comprendre le système en profondeur — complément idéal aux fiches.',
    cta: 'Commander le livre',
    coverPath: '/images/book-cover.jpg',
  }
}
