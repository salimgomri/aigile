/**
 * Catalogue des produits numériques / liens de paiement (lot 9).
 * Distinct de lib/payments/catalog.ts (livre papier, abos, crédits) — ne pas fusionner.
 */

export type ProductAudience = 'b2c' | 'b2b'

export type DigitalProduct = {
  slug: string
  nom: string
  /** Centimes EUR (hypothèse à valider par Salim) */
  prix: number
  audience: ProductAudience
  paymentLinkUrlEnv: string
  paymentLinkIdEnv?: string
  fichierCle: string | null
  nomFichier: string | null
}

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    slug: 'cahier',
    nom: 'Cahier pratique (PDF)',
    prix: 1900,
    audience: 'b2c',
    paymentLinkUrlEnv: 'STRIPE_LINK_CAHIER_URL',
    paymentLinkIdEnv: 'STRIPE_LINK_CAHIER_ID',
    fichierCle: 'cahier.pdf',
    nomFichier: 'AIgile-Cahier-pratique.pdf',
  },
  {
    slug: 'livre-pdf',
    nom: 'Le Système S.A.L.I.M. (PDF)',
    prix: 3900,
    audience: 'b2c',
    paymentLinkUrlEnv: 'STRIPE_LINK_LIVRE_PDF_URL',
    paymentLinkIdEnv: 'STRIPE_LINK_LIVRE_PDF_ID',
    fichierCle: 'livre-pdf.pdf',
    nomFichier: 'AIgile-Systeme-SALIM.pdf',
  },
  {
    slug: 'pack',
    nom: 'Pack Système (PDF)',
    prix: 7900,
    audience: 'b2c',
    paymentLinkUrlEnv: 'STRIPE_LINK_PACK_URL',
    paymentLinkIdEnv: 'STRIPE_LINK_PACK_ID',
    fichierCle: 'pack.pdf',
    nomFichier: 'AIgile-Pack-Systeme.pdf',
  },
  {
    slug: 'licence-equipe',
    nom: 'Licence équipe',
    prix: 24900,
    audience: 'b2b',
    paymentLinkUrlEnv: 'STRIPE_LINK_LICENCE_URL',
    paymentLinkIdEnv: 'STRIPE_LINK_LICENCE_ID',
    fichierCle: 'licence-equipe.pdf',
    nomFichier: 'AIgile-Licence-equipe.pdf',
  },
  {
    slug: 'livre-papier',
    nom: 'Livre papier',
    prix: 6900,
    audience: 'b2c',
    paymentLinkUrlEnv: 'STRIPE_LINK_LIVRE_PAPIER_URL',
    fichierCle: null,
    nomFichier: null,
  },
  {
    slug: 'formation-a-place',
    nom: 'Place inter — formation Agile + IA : démarrer',
    prix: 29000,
    audience: 'b2c',
    paymentLinkUrlEnv: 'STRIPE_LINK_FORMATION_A_URL',
    paymentLinkIdEnv: 'STRIPE_LINK_FORMATION_A_ID',
    fichierCle: null,
    nomFichier: null,
  },
]

export function getDigitalProduct(slug: string): DigitalProduct | undefined {
  return DIGITAL_PRODUCTS.find((p) => p.slug === slug)
}

export function getPaymentLinkUrl(product: DigitalProduct): string | null {
  const v = process.env[product.paymentLinkUrlEnv]?.trim()
  return v && v.startsWith('http') ? v : null
}

export function getPaymentLinkId(product: DigitalProduct): string | null {
  if (!product.paymentLinkIdEnv) return null
  const v = process.env[product.paymentLinkIdEnv]?.trim()
  return v || null
}

export function isKnownPaymentLinkOrPrice(
  paymentLinkId: string | null | undefined,
  priceIds: string[],
): DigitalProduct | undefined {
  for (const p of DIGITAL_PRODUCTS) {
    const linkId = getPaymentLinkId(p)
    if (paymentLinkId && linkId && paymentLinkId === linkId) return p
  }
  return undefined
}

export function matchSessionToProduct(params: {
  paymentLinkId?: string | null
  priceIds?: string[]
  metadataSlug?: string | null
}): DigitalProduct | undefined {
  const { paymentLinkId, metadataSlug } = params
  if (metadataSlug) {
    const bySlug = getDigitalProduct(metadataSlug)
    if (bySlug) return bySlug
  }
  if (paymentLinkId) {
    for (const p of DIGITAL_PRODUCTS) {
      const id = getPaymentLinkId(p)
      if (id && id === paymentLinkId) return p
    }
  }
  return undefined
}
