import { getSalimYearsExperience } from '@/lib/salim-experience'

export type BookLandingLang = 'fr' | 'en'

export function getBookLandingCopy(lang: BookLandingLang) {
  const years = getSalimYearsExperience()

  if (lang === 'fr') {
    return {
      heroEyebrow: 'Tome 1 · Édition Malis',
      heroTitle: 'Scrum Augmenté\nLivré en Incremental et Mesuré',
      heroSubtitle:
        'Le système S.A.L.I.M. : le guide pour cadrer l’IA, mesurer vos livraisons et optimiser chaque sprint avec des indicateurs clairs.',
      heroCta: 'Obtenir le livre',
      heroSecondary: 'Voir le framework',
      problemTitle: 'Le problème',
      problemBody:
        'L’IA produit en volume. Sans cadre ni mesure, l’équipe relit après coup. Le coût est déjà englouti quand on vérifie.',
      solutionTitle: 'La réponse S.A.L.I.M.',
      solutionBody:
        'Scrum Augmenté, Livré en Incrémental et Mesuré : les humains posent le cadre, l’IA produit dedans, et vous suivez la maturité de livraison sprint après sprint.',
      insideEyebrow: 'Dans le livre',
      insideTitle: 'Un système complet, pas un essai',
      insideLead:
        '19 chapitres, fiches pratiques et méthode terrain pour passer de l’expérimentation IA à une pratique mesurable en équipe.',
      insideBullets: [
        'Framework AIgile : 6 états, rôles, DoR/DoD avec l’IA sous contrôle humain',
        'Fiches pratiques à utiliser en sprint (rétro, cadrage, scoring)',
        'Indicateurs et quality gates pour objectiver la livraison logicielle',
        '350+ questions-réponses terrain (source du Q&A Lab)',
      ],
      stats: [
        { value: '19', label: 'chapitres' },
        { value: '350+', label: 'Q&R terrain' },
        { value: String(years), label: 'ans de coaching' },
        { value: 'S·A·L·I·M', label: 'un système' },
      ],
      proofQuote:
        '« On ne fait pas plus agile. On fait AIgile : augmenter le Scrum avec l’IA, sans laisser l’IA décider. »',
      proofAuthor: 'Salim Gomri · Agile Coach',
      frameworkEyebrow: 'Extraire du livre',
      frameworkTitle: 'Le cadre AIgile',
      frameworkDesc: 'Workflow interactif : Funnel → Done, avec sortie Cancelled. Cliquez chaque état pour voir DoR, DoD et responsabilités IA/humain.',
      frameworkCta: 'Explorer le framework',
      finalEyebrow: 'Prêt à lire',
      finalTitle: 'Commencez à mesurer ce que l’IA livre vraiment',
      finalLead:
        'Livraison ou retrait en main propre. Paiement sécurisé. Accès immédiat aux outils AIgile pour appliquer le livre dès le prochain sprint.',
      finalCta: 'Acheter maintenant',
      stickyCta: 'Acheter le livre',
      manifestoTitle: 'Appuyé sur le Manifeste Agile',
      manifestoQuote:
        'Nous suivons ces principes : les individus et leurs interactions plus que les processus et les outils.',
      learnMore: 'En savoir plus',
      footerRights: '© 2026 AIGILE.LU · Malis Edition',
      deliveryNote: 'Prix direct aigile.lu · Livraison ou retrait',
    }
  }

  return {
    heroEyebrow: 'Volume 1 · Malis Edition',
    heroTitle: 'Scrum Augmented\nDelivered Incrementally and Measured',
    heroSubtitle:
      'The S.A.L.I.M. System: frame AI, measure delivery, and optimize every sprint with clear indicators.',
    heroCta: 'Get the book',
    heroSecondary: 'See the framework',
    problemTitle: 'The problem',
    problemBody:
      'AI produces at scale. Without a frame or metrics, teams review after the fact. By the time anyone checks, the cost is already sunk.',
    solutionTitle: 'The S.A.L.I.M. answer',
    solutionBody:
      'Scrum Augmented, Delivered Incrementally & Measured: humans set the frame, AI produces inside it, and you track delivery maturity sprint over sprint.',
    insideEyebrow: 'Inside the book',
    insideTitle: 'A full system, not an essay',
    insideLead:
      '19 chapters, practical worksheets, and field-tested method to move from AI experimentation to measurable team practice.',
    insideBullets: [
      'AIgile framework: 6 states, roles, DoR/DoD with AI under human control',
      'Field worksheets for sprint use (retro, framing, scoring)',
      'Indicators and quality gates to objectify software delivery',
      '350+ field Q&As (source of the Q&A Lab)',
    ],
    stats: [
      { value: '19', label: 'chapters' },
      { value: '350+', label: 'field Q&As' },
      { value: String(years), label: 'years coaching' },
      { value: 'S·A·L·I·M', label: 'one system' },
    ],
    proofQuote:
      '“We don’t do more agile. We do AIgile: augment Scrum with AI without letting AI decide.”',
    proofAuthor: 'Salim Gomri · Agile Coach',
    frameworkEyebrow: 'From the book',
    frameworkTitle: 'The AIgile framework',
    frameworkDesc: 'Interactive workflow: Funnel → Done, with a Cancelled exit. Click each state for DoR, DoD, and AI vs human responsibilities.',
    frameworkCta: 'Explore the framework',
    finalEyebrow: 'Ready to read',
    finalTitle: 'Start measuring what AI actually delivers',
    finalLead:
      'Shipping or in-person pickup. Secure checkout. Immediate access to AIgile tools to apply the book on your next sprint.',
    finalCta: 'Buy now',
    stickyCta: 'Buy the book',
    manifestoTitle: 'Backed by the Agile Manifesto',
    manifestoQuote:
      'We follow these principles: Individuals and interactions over processes and tools.',
    learnMore: 'Learn more',
    footerRights: '© 2026 AIGILE.LU · Malis Edition',
    deliveryNote: 'Direct price on aigile.lu · Shipping or pickup',
  }
}
