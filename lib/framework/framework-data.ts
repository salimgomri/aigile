/** AIgile Framework content — Cadre AIgile v1.4 (FR + EN). */

/** PDF du guide de référence — fichiers dans public/downloads/ */
export const FRAMEWORK_GUIDE_PDF_FR = '/downloads/aigile-framework-guide.pdf'
export const FRAMEWORK_GUIDE_PDF_EN = '/downloads/aigile-framework-reference-guide-EN.pdf'

/** Affiche framework (PNG) */
export const FRAMEWORK_POSTER_IMAGE = '/images/aigile-framework.png'
export const FRAMEWORK_POSTER_DOWNLOAD_NAME = 'aigile-framework.png'

export const SUMMARY_ICONS = ['triangle-alert', 'compass', 'scale'] as const

export const STATE_ICONS: Record<string, string> = {
  funnel: 'inbox',
  framed: 'frame',
  analyzed: 'search',
  ready: 'check-circle',
  doing: 'hammer',
  done: 'flag',
  cancelled: 'x-circle',
}

export const PHASE_ICONS = ['compass', 'check-square', 'rocket'] as const
export const ROLE_ICONS = ['user', 'users', 'shield', 'shield-check', 'users-round', 'bot'] as const

export type FrameworkLang = 'fr' | 'en'

export type WorkflowState = {
  id: string
  label: string
  decider: string
  purpose: string
  entry: string
  exit: string
  ai: string
  human: string
  dor: string
  dod: string
  lateral?: boolean
}

export const STRINGS = {
  fr: {
    uiEyebrowFramework: 'Le cadre AIgile',
    uiEyebrowCycle: 'Le cycle',
    uiCycleTitle: 'Six états, une sortie latérale',
    uiCycleIntro:
      "Cliquez un état pour voir sa Definition of Ready, sa Definition of Done, et le partage des responsabilités entre l'IA et l'humain.",
    uiAnytime: 'à tout moment',
    uiEyebrowPhases: 'Phases',
    uiPhasesTitle: 'Trois phases',
    uiEyebrowMessage: 'Message central',
    uiEyebrowRoles: 'Rôles',
    uiRolesTitle: 'Qui fait quoi',
    uiWhoDecides: 'Qui décide',
    uiStateLabel: 'État',
    uiLateralExit: 'Sortie latérale',
    uiEntry: 'Entrée (DoR)',
    uiExit: 'Sortie (DoD)',
    uiAiResp: 'Responsabilité IA',
    uiHumanResp: 'Responsabilité humaine',
    uiDoR: 'DoR',
    uiDoD: 'DoD',
    uiClose: 'Fermer',
    downloadGuideFr: 'Télécharger le guide (FR)',
    downloadGuideEn: 'Download reference guide (EN)',
    downloadPoster: "Télécharger l'affiche",
    uiEyebrowArticles: 'Série LinkedIn',
    uiArticlesTitle: 'Articles du cadre AIgile',
    uiArticlesIntro:
      'Trois publications pour comprendre le geste central du cadre, le rôle du Scrum Master et le rythme des sprints à l’ère de l’IA.',
    articleReadOnLinkedIn: 'Lire sur LinkedIn',
    articleComingSoon: 'Bientôt',
    articleComingSoonHint: 'Lien non disponible pour le moment — cet article sera publié prochainement.',
    footer: 'Extrait du livre The S.A.L.I.M. System · aigile.lu',
  },
  en: {
    uiEyebrowFramework: 'The AIgile framework',
    uiEyebrowCycle: 'The cycle',
    uiCycleTitle: 'Six states, one lateral exit',
    uiCycleIntro:
      'Click a state to see its Definition of Ready, its Definition of Done, and how responsibility splits between AI and human.',
    uiAnytime: 'at any time',
    uiEyebrowPhases: 'Phases',
    uiPhasesTitle: 'Three phases',
    uiEyebrowMessage: 'Core message',
    uiEyebrowRoles: 'Roles',
    uiRolesTitle: 'Who does what',
    uiWhoDecides: 'Who decides',
    uiStateLabel: 'State',
    uiLateralExit: 'Lateral exit',
    uiEntry: 'Entry (DoR)',
    uiExit: 'Exit (DoD)',
    uiAiResp: 'AI responsibility',
    uiHumanResp: 'Human responsibility',
    uiDoR: 'DoR',
    uiDoD: 'DoD',
    uiClose: 'Close',
    downloadGuideFr: 'Download guide (FR)',
    downloadGuideEn: 'Download reference guide (EN)',
    downloadPoster: 'Download poster',
    uiEyebrowArticles: 'LinkedIn series',
    uiArticlesTitle: 'AIgile framework articles',
    uiArticlesIntro:
      'Three posts on the framework’s core move, the Scrum Master’s role, and sustainable sprint pace in the age of AI.',
    articleReadOnLinkedIn: 'Read on LinkedIn',
    articleComingSoon: 'Coming soon',
    articleComingSoonHint: 'Link not available yet — this article will be published soon.',
    footer: 'From the book The S.A.L.I.M. System · aigile.lu',
  },
} as const

export const FRAMEWORK_META = {
  fr: {
    subtitle: 'Guide de référence · v1.4 · Salim Gomri · Juillet 2026',
    manifesto:
      "Le cadre AIgile organise le développement de produits avec l'IA : les humains posent le cadre, l'IA produit dedans, et rien de plus.",
  },
  en: {
    subtitle: 'Reference guide · v1.4 · Salim Gomri · July 2026',
    manifesto:
      'The AIgile framework organizes product development with AI: humans set the frame, AI produces inside it, and nothing more.',
  },
} as const

export const SUMMARY_CARDS = {
  fr: [
    { eyebrow: 'Problème', title: 'Le contrôle après coup', body: "L'IA produit, les humains relisent après. Le coût est déjà englouti quand on vérifie." },
    { eyebrow: 'Principe', title: 'Le cadre contraint, il ne prescrit pas', body: "Les humains définissent le périmètre, l'architecture, les données et les exclusions avant que l'IA produise." },
    { eyebrow: 'Règle', title: "L'IA déclare, l'humain décide", body: "Toute transition IA porte son artefact d'audit et reste révocable." },
  ],
  en: [
    { eyebrow: 'Problem', title: 'Control after the fact', body: 'AI produces, humans review after. By the time anyone checks, the cost is already sunk.' },
    { eyebrow: 'Principle', title: "The frame constrains, it doesn't prescribe", body: 'Humans define scope, architecture, data, and exclusions before AI produces anything.' },
    { eyebrow: 'Rule', title: 'AI declares, the human decides', body: 'Every AI transition carries an audit artifact and stays revocable.' },
  ],
} as const

export const WORKFLOW_STATES: Record<FrameworkLang, WorkflowState[]> = {
  fr: [
    { id: 'funnel', label: 'Funnel', decider: 'Le PO ou le BA', purpose: "Capter une idée, une demande ou une opportunité avant qu'elle ne devienne une feature formelle.", entry: 'Une idée, une demande ou une opportunité existe.', exit: 'Besoin formulé : problème, valeur attendue, hors périmètre.', ai: 'Aide à formuler et clarifier le besoin brut si sollicitée.', human: 'Le PO ou le BA capte, formule et qualifie le besoin.', dor: "— (point d'entrée du flux)", dod: 'Problème, valeur attendue et hors-périmètre écrits noir sur blanc.' },
    { id: 'framed', label: 'Framed', decider: 'Le duo (référent business + référent IT)', purpose: "Poser le cadre avant toute production IA : périmètre, architecture, données, exclusions, conformité.", entry: 'Besoin formulé, duo nommé.', exit: 'Cadre posé (périmètre, architecture, données, exclusions), conformité IA vérifiée, coût du retard et t-shirt size posés : WSJF provisoire.', ai: 'Aucune — ce statut est humain de bout en bout.', human: 'Le duo cadre la feature ; le référent business en reste responsable du début à la fin.', dor: 'Besoin formulé, duo nommé.', dod: 'Cadre complet + conformité IA + WSJF provisoire.' },
    { id: 'analyzed', label: 'Analyzed', decider: "L'IA déclare, le duo valide", purpose: 'Produire l\'analyse fonctionnelle/technique, découper en stories, estimer et prioriser — sous contrôle du duo.', entry: 'Cadre posé, entrées de qualité disponibles.', exit: 'Analyses livrées, découpe en stories estimées, priorisation proposée, synthèse consolidée, piste d\'audit complète, validation duo close.', ai: 'Analyse, découpe, estime, synthétise, retravaille selon les retours du duo. Déclare le travail terminé.', human: 'Le duo valide ou renvoie (boucle duo, jusqu\'à 3 tours) ; documente les réserves IT.', dor: 'Cadre posé, entrées de qualité disponibles.', dod: 'Validation duo close : amendements traités, WSJF recalé, réserves documentées.' },
    { id: 'ready', label: 'Ready', decider: "L'équipe", purpose: "Faire contester et valider le ready par l'équipe, story par story, avant le développement.", entry: 'Synthèse validée par le duo, pré-lecture envoyée avant la séance.', exit: 'Présentation en pair faite, conversation story par story tenue, DoR par story satisfaite, estimations votées, priorisation validée par l\'équipe.', ai: 'Retravaille les micro-ajustements demandés en séance.', human: "L'équipe conteste et valide le ready ; la conversation reste humaine et obligatoire.", dor: 'Synthèse validée par le duo, pré-lecture envoyée.', dod: "Ready validé par l'équipe, story par story." },
    { id: 'doing', label: 'Doing', decider: 'Le garant de feature', purpose: "Développer la feature dans le cadre posé, avec l'IA en exécutant supervisé.", entry: 'Garant nommé, feature dans le Sprint Goal, capacité respectée.', exit: "Stories terminées, tests des critères au vert, code généré relu, DoD d'explicabilité tenue au niveau feature.", ai: 'Développe une part des stories, dans le cadre — jamais au-delà.', human: "Le garant pilote l'IA, relit ce qu'elle génère, porte le statut de la feature.", dor: 'Garant nommé, feature dans le Sprint Goal, capacité respectée.', dod: "Une à deux features en Doing par équipe ; DoD d'explicabilité tenue." },
    { id: 'done', label: 'Done', decider: 'La Review', purpose: 'Exposer la feature livrée et mesurer le bénéfice réel selon le plan de mesure.', entry: 'DoD tenue, feature exposée.', exit: 'Présentée en Review, bénéfice mesuré selon le plan. Done ne veut pas dire bénéfice confirmé : la mesure vient après.', ai: 'Aucune — ce statut est un jalon de présentation et de mesure humaine.', human: "Le garant présente en Review ce qui a marché et n'a pas marché avec l'IA.", dor: 'DoD tenue, feature exposée.', dod: 'Présentée en Review + bénéfice mesuré (ou plan de mesure lancé).' },
    { id: 'cancelled', label: 'Cancelled', lateral: true, decider: 'Le business, à tout moment', purpose: 'Sortir proprement du flux une feature qui ne doit plus avancer, à tout moment du cycle.', entry: 'Décision business documentée.', exit: 'Impacts clôturés, historique conservé, sortie propre du flux.', ai: "Aucune — la décision d'arrêt est strictement humaine.", human: 'Le business décide et documente ; le garant clôture les impacts.', dor: 'Décision business documentée.', dod: 'Impacts clôturés, historique conservé.' },
  ],
  en: [
    { id: 'funnel', label: 'Funnel', decider: 'The PO or the BA', purpose: 'Capture an idea, request, or opportunity before it becomes a formal feature.', entry: 'An idea, request, or opportunity exists.', exit: 'Need formulated: problem, expected value, out of scope.', ai: 'Helps formulate and clarify the raw need, if asked.', human: 'The PO or BA captures, formulates, and qualifies the need.', dor: '— (entry point of the flow)', dod: 'Problem, expected value, and out-of-scope written down in black and white.' },
    { id: 'framed', label: 'Framed', decider: 'The duo (business referent + IT referent)', purpose: 'Set the frame before any AI production: scope, architecture, data, exclusions, compliance.', entry: 'Need formulated, duo named.', exit: 'Frame set (scope, architecture, data, exclusions), AI compliance checked, cost-of-delay and t-shirt size set: provisional WSJF.', ai: 'None — this state is human end to end.', human: 'The duo frames the feature; the business referent stays responsible from start to finish.', dor: 'Need formulated, duo named.', dod: 'Complete frame + AI compliance + provisional WSJF.' },
    { id: 'analyzed', label: 'Analyzed', decider: 'AI declares, the duo validates', purpose: 'Produce the functional/technical analysis, split into stories, estimate, and propose prioritization — under the duo\'s control.', entry: 'Frame set, quality inputs available.', exit: 'Analyses delivered, split into estimated stories, prioritization proposed, synthesis consolidated, full audit trail, duo validation closed.', ai: 'Analyzes, splits, estimates, synthesizes, reworks per the duo\'s feedback. Declares the work done.', human: 'The duo validates or sends back (duo loop, up to 3 rounds); documents IT reservations.', dor: 'Frame set, quality inputs available.', dod: 'Duo validation closed: amendments handled, WSJF recalculated, reservations documented.' },
    { id: 'ready', label: 'Ready', decider: 'The team', purpose: 'Have the team challenge and validate readiness, story by story, before development.', entry: 'Synthesis validated by the duo, pre-read sent before the session.', exit: 'Pair presentation done, story-by-story conversation held, per-story DoR satisfied, estimates voted, prioritization validated by the team.', ai: 'Reworks the micro-adjustments requested in session.', human: 'The team challenges and validates readiness; the conversation stays human and mandatory.', dor: 'Synthesis validated by the duo, pre-read sent.', dod: 'Readiness validated by the team, story by story.' },
    { id: 'doing', label: 'Doing', decider: 'The feature owner ("garant")', purpose: 'Develop the feature inside the set frame, with AI as a supervised executor.', entry: 'Owner named, feature in the Sprint Goal, capacity respected.', exit: 'Stories done, acceptance tests green, generated code reviewed, feature-level explainability DoD held.', ai: 'Develops part of the stories, inside the frame — never beyond it.', human: 'The owner steers the AI, reviews what it generates, carries the feature\'s status.', dor: 'Owner named, feature in the Sprint Goal, capacity respected.', dod: 'One to two features in Doing per team; explainability DoD held.' },
    { id: 'done', label: 'Done', decider: 'The Review', purpose: 'Present the shipped feature and measure the actual benefit per the measurement plan.', entry: 'DoD held, feature presented.', exit: 'Presented in Review, benefit measured per plan. Done doesn\'t mean benefit confirmed — measurement comes after.', ai: 'None — this state is a human presentation and measurement milestone.', human: 'The owner presents in Review what worked and didn\'t with AI.', dor: 'DoD held, feature presented.', dod: 'Presented in Review + benefit measured (or measurement plan launched).' },
    { id: 'cancelled', label: 'Cancelled', lateral: true, decider: 'The business, at any time', purpose: 'Cleanly exit the flow for a feature that should no longer move forward, at any point in the cycle.', entry: 'Business decision documented.', exit: 'Impacts closed out, history kept, clean exit from the flow.', ai: 'None — the stop decision is strictly human.', human: 'The business decides and documents; the owner closes out impacts.', dor: 'Business decision documented.', dod: 'Impacts closed out, history kept.' },
  ],
}

export const PHASES = {
  fr: [
    { name: 'Cadrage', who: 'Duo, par feature', body: 'Poser le cadre (conformité IA incluse), évaluer le coût du retard et un t-shirt size, inviter le garant pressenti pour les features complexes.' },
    { name: 'Validation', who: 'Duo puis équipe', body: "La boucle duo valide ou amende l'analyse IA. Le Refinement fait contester le ready story par story, en équipe." },
    { name: 'Exécution', who: 'Garant, équipe, Review', body: 'Sprint Planning et stand-up au niveau feature. La Review expose les features livrées et le bénéfice mesuré.' },
  ],
  en: [
    { name: 'Framing', who: 'Duo, per feature', body: 'Set the frame (AI compliance included), assess cost of delay and a t-shirt size, invite the likely feature owner for complex features.' },
    { name: 'Validation', who: 'Duo, then team', body: 'The duo loop validates or amends the AI analysis. Refinement has the team challenge readiness story by story.' },
    { name: 'Execution', who: 'Owner, team, Review', body: 'Sprint Planning and stand-up happen at feature level. The Review presents shipped features and measured benefit.' },
  ],
} as const

export const ROLES = {
  fr: [
    { name: 'Product Owner', body: 'Unique responsable de la valeur du produit et du Product Backlog.' },
    { name: 'Duo de cadrage', body: 'Référent business (délégué par le PO) + référent IT, par feature. Le chapeau tourne ; le business reste responsable de bout en bout.' },
    { name: 'Garant de feature', body: "Pilote l'IA, relit ce qu'elle génère, porte le statut, présente en Review. Jamais deux features consécutives dans la même zone." },
    { name: 'Équipe', body: 'Conteste et valide le ready, développe une part des stories, inspecte le cycle en rétrospective.' },
    { name: 'IA', body: 'Analyse, découpe, estime, synthétise, retravaille, développe dans le cadre. Déclare ses travaux terminés. Ne décide rien.' },
  ],
  en: [
    { name: 'Product Owner', body: 'The sole owner of product value and the Product Backlog.' },
    { name: 'Framing duo', body: 'A business referent (delegated by the PO) + an IT referent, per feature. The hat rotates; the business referent stays responsible end to end.' },
    { name: 'Feature owner ("garant")', body: 'Steers the AI, reviews what it generates, carries the status, presents in Review. Never two consecutive features in the same area.' },
    { name: 'Team', body: 'Challenges and validates readiness, develops part of the stories, inspects the cycle in retrospective.' },
    { name: 'AI', body: 'Analyzes, splits, estimates, synthesizes, reworks, develops inside the frame. Declares its work done. Decides nothing.' },
  ],
} as const

export const CORE_MESSAGE = {
  fr: 'On fait AIgile, pas agile.',
  en: 'We do AIgile, not agile.',
} as const
