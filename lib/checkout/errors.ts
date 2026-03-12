/**
 * Messages d'erreur explicites pour le checkout et paiements
 */
export const ERROR_MESSAGES: Record<string, string> = {
  insufficient_funds: 'Fonds insuffisants — essaie avec une autre carte',
  card_declined: 'Carte refusée — vérifie les informations ou essaie une autre carte',
  expired_card: 'Carte expirée — utilise une carte valide',
  incorrect_cvc: 'CVC incorrect',
  address_incomplete: 'Adresse de livraison incomplète — vérifie tous les champs obligatoires',
  coupon_expired: 'Ce code promo a expiré',
  coupon_maxed: 'Ce code promo a atteint son nombre maximum d\'utilisations',
  product_unavailable: 'Ce produit n\'est plus disponible',
  shipping_required: 'Une adresse de livraison est requise pour le livre physique',
  default: 'Une erreur inattendue s\'est produite — contacte salim@aigile.lu',
}

export function getCheckoutErrorMessage(code?: string): string {
  return (code && ERROR_MESSAGES[code]) ?? ERROR_MESSAGES.default
}
