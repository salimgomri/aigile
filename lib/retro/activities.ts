export type RetroPhase = 'set-stage' | 'gather-data' | 'generate-insights' | 'decide-what-to-do' | 'close'

export interface RetroActivity {
  id: string
  phase: RetroPhase
  name: string
  nameFr: string
  summary: string
  summaryFr: string
  duration: number
  description: string
  descriptionFr: string
  tags: string[]
  trustLevel?: 'low' | 'medium' | 'high'
  teamSizeMin?: number
  teamSizeMax?: number
}

/**
 * Curated retro activities mapped to patterns
 * Based on retro-tool-spec.md section 5
 */
export const RETRO_ACTIVITIES: Record<string, RetroActivity[]> = {
  // P1 - Silent Team (Low Psychological Safety)
  'silent-team': [
    {
      id: 'check-in',
      phase: 'set-stage',
      name: 'Check-in',
      nameFr: 'Tour de table',
      summary: 'Everyone shares how they feel in one word',
      summaryFr: 'Chacun partage son état en un mot',
      duration: 5,
      description: 'Go around the room and have everyone share how they\'re feeling in one word. This creates safety by giving everyone a voice from the start.',
      descriptionFr: 'Faites un tour de table où chacun partage son état en un mot. Cela crée de la sécurité en donnant la parole à tous dès le début.',
      tags: ['P1-silence', 'low-trust'],
      trustLevel: 'low'
    },
    {
      id: 'anonymous-cards',
      phase: 'gather-data',
      name: 'Anonymous Cards',
      nameFr: 'Cartes anonymes',
      summary: 'Write thoughts anonymously on cards',
      summaryFr: 'Écrire ses pensées anonymement sur des cartes',
      duration: 15,
      description: 'Have everyone write their thoughts on sticky notes without names. Collect and read them aloud. Anonymity helps people share difficult truths.',
      descriptionFr: 'Chacun écrit ses pensées sur des post-its sans nom. Collectez et lisez-les à voix haute. L\'anonymat aide à partager des vérités difficiles.',
      tags: ['P1-fear', 'P1-silence', 'low-trust'],
      trustLevel: 'low'
    },
    {
      id: 'safety-check',
      phase: 'set-stage',
      name: 'Safety Check',
      nameFr: 'Vérification de sécurité',
      summary: 'Rate psychological safety on a scale',
      summaryFr: 'Noter la sécurité psychologique sur une échelle',
      duration: 5,
      description: 'Ask everyone to rate on a scale of 1-5 how safe they feel speaking up. Discuss what would make it safer.',
      descriptionFr: 'Demandez à chacun de noter de 1 à 5 à quel point il se sent en sécurité pour s\'exprimer. Discutez de ce qui rendrait l\'environnement plus sûr.',
      tags: ['P1-silence', 'low-trust'],
      trustLevel: 'low'
    },
    {
      id: 'circles-questions',
      phase: 'generate-insights',
      name: 'Circles & Questions',
      nameFr: 'Cercles et questions',
      summary: 'Use concentric circles to explore issues at different depths',
      summaryFr: 'Utiliser des cercles concentriques pour explorer les problèmes à différentes profondeurs',
      duration: 20,
      description: 'Draw concentric circles. Inner circle = easy to discuss, outer = difficult. Place topics and progressively discuss from easy to hard.',
      descriptionFr: 'Dessinez des cercles concentriques. Cercle intérieur = facile à discuter, extérieur = difficile. Placez les sujets et discutez progressivement du facile au difficile.',
      tags: ['P1-fear', 'medium-trust'],
      trustLevel: 'medium'
    },
    {
      id: 'simple-actions',
      phase: 'decide-what-to-do',
      name: 'Simple Actions',
      nameFr: 'Actions simples',
      summary: 'Pick one small, achievable action',
      summaryFr: 'Choisir une petite action réalisable',
      duration: 10,
      description: 'Focus on ONE simple action the team can control. Make it specific and achievable to build confidence.',
      descriptionFr: 'Concentrez-vous sur UNE action simple que l\'équipe peut contrôler. Rendez-la spécifique et réalisable pour construire la confiance.',
      tags: ['P1-hesitation', 'P3-helplessness'],
      trustLevel: 'low'
    },
    {
      id: 'appreciate',
      phase: 'close',
      name: 'Appreciation Circle',
      nameFr: 'Cercle d\'appréciation',
      summary: 'Share one appreciation for someone',
      summaryFr: 'Partager une appréciation pour quelqu\'un',
      duration: 5,
      description: 'Go around and have each person share one appreciation for a teammate. Builds positive energy and trust.',
      descriptionFr: 'Faites un tour où chacun partage une appréciation pour un coéquipier. Construit de l\'énergie positive et de la confiance.',
      tags: ['P1-silence', 'P4-fragmentation'],
      trustLevel: 'low'
    }
  ],

  // P3 - Repetitive Complaints (Learned Helplessness)
  'repetitive-complaints': [
    {
      id: 'check-in-energy',
      phase: 'set-stage',
      name: 'Energy Level Check',
      nameFr: 'Niveau d\'énergie',
      summary: 'Share current energy level',
      summaryFr: 'Partager son niveau d\'énergie actuel',
      duration: 5,
      description: 'Have everyone share their energy level on a scale. Acknowledge that frustration might be high.',
      descriptionFr: 'Chacun partage son niveau d\'énergie sur une échelle. Reconnaissez que la frustration peut être élevée.',
      tags: ['P3-frustration'],
      trustLevel: 'medium'
    },
    {
      id: 'timeline',
      phase: 'gather-data',
      name: 'Timeline',
      nameFr: 'Ligne de temps',
      summary: 'Map events on a timeline',
      summaryFr: 'Cartographier les événements sur une ligne de temps',
      duration: 15,
      description: 'Draw a timeline of the sprint/period. Mark events that affected the team. See patterns.',
      descriptionFr: 'Dessinez une ligne de temps du sprint/période. Marquez les événements qui ont affecté l\'équipe. Voyez les patterns.',
      tags: ['P3-stagnation'],
      trustLevel: 'medium'
    },
    {
      id: 'five-whys',
      phase: 'generate-insights',
      name: 'Five Whys',
      nameFr: 'Cinq pourquoi',
      summary: 'Ask "why" five times to find root causes',
      summaryFr: 'Demander "pourquoi" cinq fois pour trouver les causes racines',
      duration: 20,
      description: 'Pick the most recurring complaint. Ask "why" five times to dig to the root cause. Stop treating symptoms.',
      descriptionFr: 'Choisissez la plainte la plus récurrente. Demandez "pourquoi" cinq fois pour creuser jusqu\'à la cause racine. Arrêtez de traiter les symptômes.',
      tags: ['P3-frustration', 'P3-stagnation'],
      trustLevel: 'medium'
    },
    {
      id: 'circle-of-influence',
      phase: 'decide-what-to-do',
      name: 'Circle of Influence',
      nameFr: 'Cercle d\'influence',
      summary: 'Separate what we can control from what we can\'t',
      summaryFr: 'Séparer ce qu\'on peut contrôler de ce qu\'on ne peut pas',
      duration: 15,
      description: 'Draw two circles: things we control vs things we don\'t. Focus actions ONLY on what\'s in our control.',
      descriptionFr: 'Dessinez deux cercles : ce qu\'on contrôle vs ce qu\'on ne contrôle pas. Concentrez les actions UNIQUEMENT sur ce qui est dans notre contrôle.',
      tags: ['P3-helplessness', 'P3-frustration'],
      trustLevel: 'medium'
    },
    {
      id: 'smart-actions',
      phase: 'decide-what-to-do',
      name: 'SMART Actions',
      nameFr: 'Actions SMART',
      summary: 'Make actions Specific, Measurable, Achievable, Relevant, Time-bound',
      summaryFr: 'Rendre les actions Spécifiques, Mesurables, Atteignables, Pertinentes, Temporelles',
      duration: 15,
      description: 'For each action: Who does what, by when, how do we measure success? No vague "we should try to..."',
      descriptionFr: 'Pour chaque action : Qui fait quoi, pour quand, comment mesure-t-on le succès ? Pas de vague "on devrait essayer de..."',
      tags: ['P3-stagnation', 'PB-facilitation'],
      trustLevel: 'medium'
    },
    {
      id: 'temperature-reading',
      phase: 'close',
      name: 'Temperature Reading',
      nameFr: 'Prise de température',
      summary: 'Rate how hopeful we feel about change',
      summaryFr: 'Noter à quel point on se sent optimiste sur le changement',
      duration: 5,
      description: 'On a scale of 1-5, how hopeful do you feel that things will actually change this time?',
      descriptionFr: 'Sur une échelle de 1 à 5, à quel point êtes-vous optimiste que les choses changeront vraiment cette fois ?',
      tags: ['P3-frustration'],
      trustLevel: 'medium'
    }
  ],

  // PC - Tensions (Open Conflict)
  'tensions': [
    {
      id: 'esvp',
      phase: 'set-stage',
      name: 'ESVP',
      nameFr: 'ESVP',
      summary: 'Explorer, Shopper, Vacationer, Prisoner - how do you feel being here?',
      summaryFr: 'Explorateur, Touriste, Vacancier, Prisonnier - comment vous sentez-vous ici ?',
      duration: 5,
      description: 'Anonymous vote: Are you an Explorer (eager), Shopper (interested), Vacationer (here for break), or Prisoner (forced)? Shows engagement level.',
      descriptionFr: 'Vote anonyme : Êtes-vous Explorateur (enthousiaste), Touriste (intéressé), Vacancier (pause), ou Prisonnier (forcé) ? Montre le niveau d\'engagement.',
      tags: ['PC-tension', 'low-trust'],
      trustLevel: 'low'
    },
    {
      id: 'constellation',
      phase: 'gather-data',
      name: 'Constellation',
      nameFr: 'Constellation',
      summary: 'Physical positioning to show agreements/disagreements',
      summaryFr: 'Positionnement physique pour montrer accords/désaccords',
      duration: 15,
      description: 'Ask questions, people position themselves in the room based on their answer. Makes differences visible without direct confrontation.',
      descriptionFr: 'Posez des questions, les gens se positionnent dans la pièce selon leur réponse. Rend les différences visibles sans confrontation directe.',
      tags: ['PC-conflict', 'medium-trust'],
      trustLevel: 'medium'
    },
    {
      id: 'agreement-scale',
      phase: 'generate-insights',
      name: 'Agreement Scale',
      nameFr: 'Échelle d\'accord',
      summary: 'Find areas of agreement and disagreement',
      summaryFr: 'Trouver les zones d\'accord et de désaccord',
      duration: 20,
      description: 'List statements. Rate agreement 1-5. Find where we agree (build on that) and where we disagree (discuss constructively).',
      descriptionFr: 'Listez des affirmations. Notez l\'accord de 1 à 5. Trouvez où on est d\'accord (construisez là-dessus) et où on diffère (discutez constructivement).',
      tags: ['PC-tension', 'PC-conflict'],
      trustLevel: 'medium'
    },
    {
      id: 'working-agreements',
      phase: 'decide-what-to-do',
      name: 'Working Agreements',
      nameFr: 'Accords de travail',
      summary: 'Create explicit team norms',
      summaryFr: 'Créer des normes d\'équipe explicites',
      duration: 20,
      description: 'Co-create explicit agreements: How do we handle disagreements? How do we communicate? What behaviors are not OK?',
      descriptionFr: 'Co-créez des accords explicites : Comment gérons-nous les désaccords ? Comment communiquons-nous ? Quels comportements ne sont pas OK ?',
      tags: ['PC-conflict', 'PC-toxicity'],
      trustLevel: 'medium'
    },
    {
      id: 'team-promise',
      phase: 'close',
      name: 'Team Promise',
      nameFr: 'Promesse d\'équipe',
      summary: 'One commitment each person makes to the team',
      summaryFr: 'Un engagement que chaque personne prend envers l\'équipe',
      duration: 10,
      description: 'Each person shares one specific commitment they make to improve team dynamics.',
      descriptionFr: 'Chaque personne partage un engagement spécifique qu\'elle prend pour améliorer la dynamique d\'équipe.',
      tags: ['PC-tension'],
      trustLevel: 'medium'
    }
  ],

  // P2 - Lack of Purpose
  'lack-purpose': [
    {
      id: 'purpose-check',
      phase: 'set-stage',
      name: 'Purpose Check',
      nameFr: 'Vérification du sens',
      summary: 'Why does our work matter?',
      summaryFr: 'Pourquoi notre travail a-t-il de l\'importance ?',
      duration: 5,
      description: 'Quick round: In one sentence, why does our work matter? Surface different understandings.',
      descriptionFr: 'Tour rapide : En une phrase, pourquoi notre travail est-il important ? Faites ressortir les différentes compréhensions.',
      tags: ['P2-purpose', 'P2-meaning'],
      trustLevel: 'medium'
    },
    {
      id: 'value-stream',
      phase: 'gather-data',
      name: 'Value Stream',
      nameFr: 'Chaîne de valeur',
      summary: 'Map how our work creates value for users',
      summaryFr: 'Cartographier comment notre travail crée de la valeur pour les utilisateurs',
      duration: 20,
      description: 'Draw the path from our work to user value. Where are we disconnected from the outcome?',
      descriptionFr: 'Dessinez le chemin de notre travail à la valeur utilisateur. Où sommes-nous déconnectés du résultat ?',
      tags: ['P2-purpose', 'P2-vision'],
      trustLevel: 'medium'
    },
    {
      id: 'remember-the-future',
      phase: 'generate-insights',
      name: 'Remember the Future',
      nameFr: 'Se souvenir du futur',
      summary: 'Imagine success 6 months from now',
      summaryFr: 'Imaginer le succès dans 6 mois',
      duration: 20,
      description: 'It\'s 6 months from now and we\'ve succeeded. What does that look like? Work backwards to now.',
      descriptionFr: 'Dans 6 mois on a réussi. À quoi ça ressemble ? Revenez en arrière jusqu\'à maintenant.',
      tags: ['P2-vision', 'P2-meaning'],
      trustLevel: 'medium'
    },
    {
      id: 'north-star',
      phase: 'decide-what-to-do',
      name: 'North Star',
      nameFr: 'Étoile du nord',
      summary: 'Define our guiding metric/goal',
      summaryFr: 'Définir notre métrique/objectif directeur',
      duration: 15,
      description: 'What ONE metric or outcome would prove we\'re successful? Align actions to that.',
      descriptionFr: 'Quelle métrique ou résultat UNiQUE prouverait qu\'on a réussi ? Alignez les actions là-dessus.',
      tags: ['P2-purpose', 'P2-vision'],
      trustLevel: 'medium'
    },
    {
      id: 'letter-from-future',
      phase: 'close',
      name: 'Letter from Future',
      nameFr: 'Lettre du futur',
      summary: 'Write a letter from your future self thanking the team',
      summaryFr: 'Écrire une lettre de son futur soi remerciant l\'équipe',
      duration: 10,
      description: 'Each person writes a short letter from their future self thanking the team for the positive changes made.',
      descriptionFr: 'Chaque personne écrit une courte lettre de son futur soi remerciant l\'équipe pour les changements positifs faits.',
      tags: ['P2-meaning'],
      trustLevel: 'medium'
    }
  ],

  // P4 - No Team (Fragmentation)
  'no-team': [
    {
      id: 'one-word',
      phase: 'set-stage',
      name: 'One Word',
      nameFr: 'Un mot',
      summary: 'Describe the team in one word',
      summaryFr: 'Décrire l\'équipe en un mot',
      duration: 5,
      description: 'Everyone shares one word that describes how the team feels right now. See commonalities and differences.',
      descriptionFr: 'Chacun partage un mot qui décrit comment l\'équipe se sent maintenant. Voyez les points communs et les différences.',
      tags: ['P4-fragmentation'],
      trustLevel: 'medium'
    },
    {
      id: 'team-radar',
      phase: 'gather-data',
      name: 'Team Radar',
      nameFr: 'Radar d\'équipe',
      summary: 'Rate team aspects on multiple dimensions',
      summaryFr: 'Noter les aspects d\'équipe sur plusieurs dimensions',
      duration: 15,
      description: 'Create a radar chart: Communication, Collaboration, Trust, Shared Goals, etc. See gaps.',
      descriptionFr: 'Créez un diagramme radar : Communication, Collaboration, Confiance, Objectifs partagés, etc. Voyez les écarts.',
      tags: ['P4-silos', 'P4-fragmentation'],
      trustLevel: 'medium'
    },
    {
      id: 'sailboat',
      phase: 'generate-insights',
      name: 'Sailboat',
      nameFr: 'Bateau à voile',
      summary: 'What moves us forward, what holds us back',
      summaryFr: 'Ce qui nous fait avancer, ce qui nous retient',
      duration: 20,
      description: 'Draw a sailboat: wind = what pushes us forward, anchor = what holds us back, rocks = risks, island = goal. Discuss together.',
      descriptionFr: 'Dessinez un bateau à voile : vent = ce qui nous pousse, ancre = ce qui nous retient, rochers = risques, île = but. Discutez ensemble.',
      tags: ['P4-fragmentation', 'team-building'],
      trustLevel: 'medium'
    },
    {
      id: 'team-commitments',
      phase: 'decide-what-to-do',
      name: 'Team Commitments',
      nameFr: 'Engagements d\'équipe',
      summary: 'What can we commit to as a TEAM',
      summaryFr: 'À quoi pouvons-nous nous engager en tant qu\'ÉQUIPE',
      duration: 15,
      description: 'Focus on collective commitments, not individual ones. Use "we" not "I". Build shared ownership.',
      descriptionFr: 'Concentrez-vous sur les engagements collectifs, pas individuels. Utilisez "nous" pas "je". Construisez l\'ownership partagé.',
      tags: ['P4-isolation', 'P4-silos'],
      trustLevel: 'medium'
    },
    {
      id: 'plus-delta',
      phase: 'close',
      name: 'Plus/Delta',
      nameFr: 'Plus/Delta',
      summary: 'What to keep, what to change',
      summaryFr: 'Ce qu\'on garde, ce qu\'on change',
      duration: 5,
      description: 'Simple: Plus (keep doing), Delta (change). Quick way to close with clear takeaways.',
      descriptionFr: 'Simple : Plus (continuer), Delta (changer). Façon rapide de clore avec des conclusions claires.',
      tags: ['simple', 'closing'],
      trustLevel: 'medium'
    }
  ],

  // P5 - Burnout (Overload)
  'burnout': [
    {
      id: 'battery-level',
      phase: 'set-stage',
      name: 'Battery Level',
      nameFr: 'Niveau de batterie',
      summary: 'Show your energy level as a battery percentage',
      summaryFr: 'Montrer son niveau d\'énergie en pourcentage de batterie',
      duration: 5,
      description: 'Draw your battery level (0-100%). Acknowledge exhaustion. This isn\'t a productivity meeting.',
      descriptionFr: 'Dessinez votre niveau de batterie (0-100%). Reconnaissez l\'épuisement. Ce n\'est pas une réunion de productivité.',
      tags: ['P5-burnout', 'P5-overload'],
      trustLevel: 'medium'
    },
    {
      id: 'time-analysis',
      phase: 'gather-data',
      name: 'Time Analysis',
      nameFr: 'Analyse du temps',
      summary: 'Where does our time actually go?',
      summaryFr: 'Où va réellement notre temps ?',
      duration: 15,
      description: 'Pie chart: How much time on planned work vs interruptions vs meetings vs firefighting? Reality check.',
      descriptionFr: 'Camembert : Combien de temps sur le travail planifié vs interruptions vs réunions vs urgences ? Réalité.',
      tags: ['P5-pressure', 'PD-delivery'],
      trustLevel: 'medium'
    },
    {
      id: 'drop-continue-add',
      phase: 'generate-insights',
      name: 'Drop/Continue/Add',
      nameFr: 'Arrêter/Continuer/Ajouter',
      summary: 'What should we STOP doing?',
      summaryFr: 'Qu\'est-ce qu\'on devrait ARRÊTER de faire ?',
      duration: 20,
      description: 'Three columns: DROP (stop doing), CONTINUE (keep), ADD (start). Focus heavily on DROP first!',
      descriptionFr: 'Trois colonnes : ARRÊTER, CONTINUER, AJOUTER. Concentrez-vous d\'abord sur ARRÊTER !',
      tags: ['P5-overload', 'P5-pressure'],
      trustLevel: 'medium'
    },
    {
      id: 'wip-limits',
      phase: 'decide-what-to-do',
      name: 'WIP Limits',
      nameFr: 'Limites de WIP',
      summary: 'Set explicit work-in-progress limits',
      summaryFr: 'Définir des limites explicites de travail en cours',
      duration: 15,
      description: 'Define: Max tasks per person, max team WIP. Say NO to new work when at limit. Protect the team.',
      descriptionFr: 'Définissez : Max tâches par personne, max WIP équipe. Dites NON au nouveau travail à la limite. Protégez l\'équipe.',
      tags: ['P5-overload', 'PD-delivery'],
      trustLevel: 'medium'
    },
    {
      id: 'gratitude',
      phase: 'close',
      name: 'Gratitude',
      nameFr: 'Gratitude',
      summary: 'One thing you\'re grateful for',
      summaryFr: 'Une chose pour laquelle vous êtes reconnaissant',
      duration: 5,
      description: 'End on a positive note. One thing you\'re grateful for about the team or the week.',
      descriptionFr: 'Terminez sur une note positive. Une chose pour laquelle vous êtes reconnaissant envers l\'équipe ou la semaine.',
      tags: ['positive', 'closing'],
      trustLevel: 'medium'
    }
  ]
}

/**
 * Get activities for a specific problem and filters
 */
export function getActivitiesForProblem(
  problemKey: string,
  duration: number = 60,
  trustLevel: 'low' | 'medium' | 'high' = 'medium',
  teamSize: number = 7
): RetroActivity[] {
  const activities = RETRO_ACTIVITIES[problemKey] || RETRO_ACTIVITIES['repetitive-complaints']
  
  // Filter by trust level
  let filtered = activities.filter(a => {
    if (!a.trustLevel) return true
    if (trustLevel === 'low') return a.trustLevel === 'low'
    if (trustLevel === 'medium') return a.trustLevel === 'low' || a.trustLevel === 'medium'
    return true
  })

  // Filter by team size if specified
  filtered = filtered.filter(a => {
    if (a.teamSizeMin && teamSize < a.teamSizeMin) return false
    if (a.teamSizeMax && teamSize > a.teamSizeMax) return false
    return true
  })

  // Ensure we have at least one activity per phase
  const phases: RetroPhase[] = ['set-stage', 'gather-data', 'generate-insights', 'decide-what-to-do', 'close']
  const selected: RetroActivity[] = []
  
  phases.forEach(phase => {
    const phaseActivities = filtered.filter(a => a.phase === phase)
    if (phaseActivities.length > 0) {
      selected.push(phaseActivities[0])
    }
  })

  return selected
}
