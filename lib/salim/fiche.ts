import { BOOK_SALE_CENTIMES, formatBookPrice } from '@/lib/book-config'

/** Une seule édition vendue sur la fiche /salim. */
export const SALIM_EDITION_ID = 'book_sale' as const

export const SALIM_EDITION_LABEL = 'Le Système S.A.L.I.M. · livre'

/** Prix du livre, centimes. Aligné sur le catalogue encaissé. */
export const SALIM_BOOK_CENTIMES = BOOK_SALE_CENTIMES

/**
 * Port forfaitaire encaissé avec le livre, centimes.
 * Doit rester égal à `book_sale.shippingFee` dans lib/payments/catalog.ts.
 */
export const SALIM_SHIPPING_CENTIMES = 500

/** Prix total livré affiché : livre + port. Un seul prix. */
export const SALIM_DELIVERED_CENTIMES = SALIM_BOOK_CENTIMES + SALIM_SHIPPING_CENTIMES

export const SALIM_PRICE_LABEL = formatBookPrice(SALIM_DELIVERED_CENTIMES)

export const SALIM_SUBTITLE = 'Livre · port compris dans le prix.'

export const SALIM_EXCERPT_PATH = '/salim/extrait'
export const SALIM_PURCHASE_PATH = '/salim/achat'

export const SALIM_LINKS = {
  extrait: SALIM_EXCERPT_PATH,
  achat: SALIM_PURCHASE_PATH,
} as const

export type SalimLinkSlug = keyof typeof SALIM_LINKS

export function isSalimLinkSlug(value: string): value is SalimLinkSlug {
  return value === 'extrait' || value === 'achat'
}

/**
 * Passage déjà publié par Salim Gomri sur aigile.lu
 * (lib/landing/book-landing-copy.ts). Ce n'est pas un chapitre inédit.
 * La confirmation que ce passage est l'extrait de la fiche reste à écrire par Salim.
 */
export const SALIM_EXCERPT = {
  source: 'lib/landing/book-landing-copy.ts',
  rights: 'Auteur : Salim Gomri. Texte déjà publié par lui sur aigile.lu.',
  validation: 'à confirmer par Salim',
  paragraphs: [
    'Scrum Augmenté, Livré en Incrémental et Mesuré : les humains posent le cadre, l’IA produit dedans, et vous suivez la maturité de livraison sprint après sprint.',
    'On ne fait pas plus agile. On fait AIgile : augmenter le Scrum avec l’IA, sans laisser l’IA décider.',
  ],
} as const
