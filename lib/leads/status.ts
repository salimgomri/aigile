export const LEAD_STATUSES = [
  'nouveau',
  'contacte',
  'rdv_fait',
  'devis_envoye',
  'gagne',
  'perdu',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]
