/**
 * P10 - Source de vérité unique pour les coûts crédits
 * Importer depuis ici dans TOUS les composants
 */

/** PDF actions - pour "premier PDF gratuit" */
export const PDF_ACTIONS = [
  'dashboard_pdf',
  'skill_pdf',
  'dora_pdf',
  'okr_pdf',
  'retro_pdf',
  'scoring_pdf',
] as const

export const CREDIT_ACTIONS = {
  retro_ai_plan: { cost: 3, label: 'Plan rétro IA', tool: '/retro' },
  retro_random: { cost: 1, label: 'Rétro aléatoire', tool: '/retro' },
  dora_ai_reco: { cost: 2, label: 'Recommandations DORA', tool: '/dora' },
  okr_ai_summary: { cost: 2, label: 'Résumé OKR manager', tool: '/okr' },
  okr_checkin_summary: { cost: 1, label: 'Synthèse IA OKR Check-in', tool: '/okr-checkin' },
  okr_checkin_create: { cost: 0, label: 'OKR Check-in Sprint', tool: '/okr-checkin' },
  dashboard_narrative: { cost: 2, label: 'Génération narrative Dashboard Manager', tool: '/dashboard-manager' },
  skill_ai_reco: { cost: 2, label: 'Recommandation Skill Matrix', tool: '/skill-matrix' },
  dashboard_pdf: { cost: 1, label: 'Export PDF Dashboard Manager', tool: '/dashboard-manager' },
  skill_pdf: { cost: 1, label: 'Export PDF Skill Matrix', tool: '/skill-matrix' },
  dora_pdf: { cost: 1, label: 'Export PDF DORA', tool: '/dora' },
  okr_pdf: { cost: 1, label: 'Export PDF OKR', tool: '/okr' },
  retro_pdf: { cost: 1, label: 'Export PDF Rétro', tool: '/retro' },
  scoring_pdf: { cost: 1, label: 'Export PDF Scoring livraison', tool: '/scoring-deliverable' },
  scoring_deliverable: { cost: 2, label: 'Scoring livraison', tool: '/scoring-deliverable' },
  westrum_submit: { cost: 0, label: 'Westrum Culture Survey', tool: '/dashboard/westrum' },
  salim_qa_answer: { cost: 1, label: 'Réponse S.A.L.I.M. Q&A Lab', tool: '/salim-qa' },
  salim_qa_fiche: { cost: 1, label: 'Fiche S.A.L.I.M. Q&A Lab', tool: '/salim-qa' },
  salim_qa_bundle: { cost: 2, label: 'Réponse + fiche S.A.L.I.M. Q&A Lab', tool: '/salim-qa' },
} as const

export type CreditAction = keyof typeof CREDIT_ACTIONS

/** Actions d'ajout de crédits (bonus, achat pack) — pour l'historique + / - */
export const CREDIT_ADDITIONS = {
  book_bonus: { label: 'Bonus livre S.A.L.I.M', amount: 10 },
  credits_pack: { label: 'Pack crédits', amount: 10 }, // peut varier selon le pack
} as const

export type CreditAddition = keyof typeof CREDIT_ADDITIONS

/** Extrait le tool_slug du path (ex: /retro → retro, /skill-matrix → skill-matrix) */
export function getToolSlugForAction(action: CreditAction): string | null {
  const config = CREDIT_ACTIONS[action]
  if (!config?.tool) return null
  return config.tool.replace(/^\//, '') // /retro → retro
}
