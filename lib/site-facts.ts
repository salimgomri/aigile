/**
 * Source unique de vérité — faits site aigile.lu (chiffres, légal, CTA).
 * Ne pas dupliquer ces constantes dans les pages.
 */

export const START_YEAR = 2003

/** Année courante − 2003. Valeur finale à afficher dans le HTML (pas un compteur depuis 0). */
export function yearsOfExperience(referenceDate = new Date()): number {
  return referenceDate.getFullYear() - START_YEAR
}

export const BOOK_PAGES = 477
export const BOOK_CHAPTERS = 19
export const PEOPLE_COACHED_LABEL = '1 000+'
export const PEOPLE_COACHED_PHRASE = '1 000+ personnes accompagnées'
export const BANK_TEAMS = 16
export const BANK_TEAMS_PHRASE = '16 équipes en banque'
export const OPENCLASSROOMS = 'Mentor Product Manager chez OpenClassrooms'

export const TAGLINE_IA = "L'IA propose, l'humain décide."
export const TAGLINE_LIVRE_COACHING = "Le livre expose le système. Le coaching l'installe."

export const DIAGNOSTIC_URL = '/diagnostic'
export const DIAGNOSTIC_DURATION = '30 min'

export const VAT_MENTION = 'TVA non applicable, art. 293 B du CGI'
/** Visible sur /mentions-legales et /cgv — à confirmer avec le comptable. */
export const VAT_FRANCHISE_TODO = '[À CONFIRMER si le seuil de franchise est dépassé]'

export const LEGAL = {
  legalName: 'Salim GOMRI EI',
  commercialName: 'GO-COACH',
  brand: 'AIgile.lu',
  form: 'Entrepreneur individuel (EI)',
  regime: 'micro-entrepreneur',
  siren: '891 268 245',
  siret: '891 268 245 00018',
  tvaIntra: 'FR38891268245',
  rcs: 'Non inscrit au RCS',
  rne: 'inscrit au RNE le 13/11/2020',
  ape: '70.22Z',
  apeLabel: 'Conseil pour les affaires et autres conseils de gestion',
  exercise: 'exercice libéral non réglementé',
  address: "50 Grand'Rue, 57280 Maizières-lès-Metz, France",
  publicationDirector: 'Salim GOMRI',
  /** Hébergeur détecté dans le dépôt : VPS Hetzner (Helsinki). À confirmer. */
  hosterDetected: 'Hetzner Online GmbH (VPS « systeme-salim », Helsinki) — [À COMPLÉTER : confirmation, adresse et téléphone]',
} as const

const PLACEHOLDER_EMAIL = '[À COMPLÉTER]'

function envOrPlaceholder(name: string): string {
  const v = process.env[name]?.trim()
  return v || PLACEHOLDER_EMAIL
}

/** E-mail affiché (pages légales et contact public). Jamais de Gmail en dur. */
export function getContactEmail(): string {
  return envOrPlaceholder('CONTACT_EMAIL')
}

export function getSupportEmail(): string {
  const v = process.env.SUPPORT_EMAIL?.trim()
  if (v) return v
  const contact = process.env.CONTACT_EMAIL?.trim()
  return contact || PLACEHOLDER_EMAIL
}

export function isContactEmailReady(): boolean {
  const e = getContactEmail()
  return e.includes('@') && !e.includes('[À COMPLÉTER]')
}

export const LINKEDIN_URL = 'https://www.linkedin.com/in/salimgomri/'

/**
 * Fiche Amazon du livre — [LIEN AMAZON] tant que Salim n’a pas fourni l’URL.
 * Prix constatés d’après l’audit du 27/10/2026 (79 € / 59 € / 138 €). Ne pas modifier sans accord.
 */
export const AMAZON_URL =
  process.env.NEXT_PUBLIC_AMAZON_URL?.trim() || process.env.AMAZON_URL?.trim() || '[LIEN AMAZON]'
export const AMAZON_PRICES = {
  book: 79,
  fiches: 59,
  bundle: 138,
} as const
export const AMAZON_PRICES_CHECKED_AT = '[À COMPLÉTER : date de vérification]'

export function amazonUrlIsReady(): boolean {
  return AMAZON_URL.startsWith('http')
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-WMG8QLND8X'

export const CONSENT_STORAGE_KEY = 'aigile_consent'
/** [À CONFIRMER : 6] mois */
export const CONSENT_MAX_AGE_MONTHS = 6

export type HomeVariant = 'legacy' | 'v2'

export function getHomeVariant(): HomeVariant {
  return process.env.HOME_VARIANT === 'v2' ? 'v2' : 'legacy'
}

export function areFormationsPublished(): boolean {
  return process.env.FORMATIONS_PUBLISHED === 'true'
}

export const KIT_PDF_PUBLIC_PATH = '/kit/aigile-kit-5-signaux.pdf'

export function getKitPdfUrl(): string {
  return process.env.KIT_PDF_URL?.trim() || KIT_PDF_PUBLIC_PATH
}

export const SITE_URL = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_URL?.trim() || 'https://aigile.lu'

/**
 * Témoignages autorisés par Salim (textes de la page de vente / site).
 * Fonctions : uniquement celles déjà publiées dans le dépôt — aucune n’y figurait → ne pas inventer.
 */
export const TESTIMONIALS = [
  {
    quote:
      "Il ne s'est pas contenté de nous enseigner des frameworks. Il nous a fait comprendre les changements de culture et de mindset nécessaires à chaque niveau de l'organisation.",
    name: 'Nicolas Schell',
    role: '9 ans de collaboration',
  },
  {
    quote:
      "Il a su créer un environnement de travail plus fluide, plus humain et plus collaboratif, que ce soit pour débloquer des situations concrètes ou renforcer la dynamique d'équipe.",
    name: 'Nouna Sehili',
    role: '[À COMPLÉTER : fonction]',
  },
  {
    quote:
      "Salim est un servant leader qui fera tout pour aider l'équipe. Et il n'hésitera pas à la mettre face à ses responsabilités lors d'une rétro qui conclut un très mauvais sprint.",
    name: 'David Mansy',
    role: '[À COMPLÉTER : fonction] · transformation digitale, secteur bancaire',
  },
] as const

export const PROBLEM_SIGNALS = [
  {
    title: "L'adoption ne décolle pas",
    body: 'Le nouveau fonctionnement existe sur le papier, les équipes reviennent à leurs anciens réflexes.',
  },
  {
    title: 'Les délais glissent',
    body: 'Dépendances jamais levées à temps, prévisions devenues décoratives.',
  },
  {
    title: 'Vous livrez sans impact métier',
    body: 'Backlog plein, démos régulières, aucun indicateur métier qui bouge.',
  },
  {
    title: 'Le sponsor a disparu',
    body: 'Décisions reportées, moins de points de pilotage.',
  },
  {
    title: "Plus personne n'y croit",
    body: 'Rituels vides, irritants non traités, fatigue du changement.',
  },
] as const

export const SALIM_METHOD_STEPS = [
  {
    letter: 'S',
    title: 'Scrum',
    body: 'On garde le cadre que vos équipes connaissent.',
  },
  {
    letter: 'A',
    title: 'Augmenté',
    body: "L'IA produit à l'intérieur d'un cadre posé par des humains (périmètre, données, exclusions).",
  },
  {
    letter: 'L',
    title: 'Livré',
    body: "On regarde ce qui arrive vraiment chez l'utilisateur, pas ce qui est « done » dans l'outil.",
  },
  {
    letter: 'I',
    title: 'Incrémental',
    body: 'Des pas courts, révocables, visibles en comité.',
  },
  {
    letter: 'M',
    title: 'Mesuré',
    body: 'La maturité de livraison suivie sprint après sprint (scoring, quality gates, culture).',
  },
] as const

export const WORK_STEPS = [
  {
    title: 'Diagnostic (30 min, gratuit)',
    body: "Une photo nette des 5 signaux, 2 à 3 priorités. Compte rendu d'une page sous 24 h.",
  },
  {
    title: 'Un premier pas court',
    body: 'Diagnostic approfondi, Sprint Day ou Sprint court de 4 à 6 semaines.',
  },
  {
    title: 'Installation et autonomie',
    body: "Vos équipes reprennent la main avec le livre, le cahier et les outils. Si vous pouvez continuer seuls, je vous le dis.",
  },
] as const
