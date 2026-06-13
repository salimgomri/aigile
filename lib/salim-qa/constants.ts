export const SALIM_THEME_LETTERS: Record<string, string> = {
  S: 'Scrum',
  A: 'Augmenté',
  L: 'Livré',
  I: 'Incrémental',
  M: 'Mesuré',
}

export const ROLE_LABELS: Record<string, { fr: string; en: string }> = {
  SM: { fr: 'Scrum Master', en: 'Scrum Master' },
  PO: { fr: 'Product Owner', en: 'Product Owner' },
  DEV: { fr: 'Équipe Dev', en: 'Developer' },
  CA: { fr: 'Coach Agile', en: 'Agile Coach' },
  MG: { fr: 'Manager', en: 'Manager' },
  DC: { fr: 'Décideur', en: 'Executive' },
  DIR: { fr: 'Direction', en: 'Executive' },
  RTE: { fr: 'RTE', en: 'RTE' },
}

export const CIBLE_LABELS: Record<string, { fr: string; en: string }> = {
  MANAGER: { fr: 'Manager', en: 'Manager' },
  PRATICIEN_AGILE: { fr: 'Praticien agile', en: 'Agile practitioner' },
  DECIDEUR: { fr: 'Dirigeant', en: 'Executive' },
  DIRIGEANT: { fr: 'Dirigeant', en: 'Executive' },
}

export const DIM_LABELS: Record<string, { fr: string; en: string }> = {
  qui: { fr: 'Qui', en: 'Who' },
  quoi: { fr: 'Quoi', en: 'What' },
  comment: { fr: 'Comment', en: 'How' },
  quand: { fr: 'Quand', en: 'When' },
  valeur: { fr: 'Valeur', en: 'Value' },
  combien: { fr: 'Combien', en: 'How much' },
  ou: { fr: 'Où', en: 'Where' },
  pourquoi: { fr: 'Pourquoi', en: 'Why' },
}

export const STATUT_LABELS: Record<string, { fr: string; en: string; color: string }> = {
  confirmee: { fr: 'Confirmée', en: 'Confirmed', color: '#1F8A5B' },
  provisoire: { fr: 'À valider', en: 'To validate', color: '#C2920E' },
  a_valider: { fr: 'À valider', en: 'To validate', color: '#C2920E' },
}
