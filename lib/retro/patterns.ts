// Pattern taxonomy based on retro-tool-spec.md

export type PatternCode = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'PA' | 'PB' | 'PC' | 'PD'

export interface Pattern {
  code: PatternCode
  name: string
  nameFr: string
  description: string
  descriptionFr: string
  symptoms: string[]
  symptomsFr: string[]
  rootCauses: string[]
  rootCausesFr: string[]
  tags: string[]
}

export const PATTERNS: Record<PatternCode, Pattern> = {
  P1: {
    code: 'P1',
    name: 'Low Psychological Safety',
    nameFr: 'Sécurité psychologique basse',
    description: 'People don\'t dare to say what they think, fear of consequences',
    descriptionFr: 'Les gens n\'osent pas dire ce qu\'ils pensent, peur des conséquences',
    symptoms: [
      'Silence in meetings',
      '2-3 people monopolizing discussions',
      'False consensus',
      'Elephant in the room',
      'External blame'
    ],
    symptomsFr: [
      'Silence en réunion',
      '2-3 personnes monopolisent',
      'Faux consensus',
      'Éléphant dans la pièce',
      'Blâme externe'
    ],
    rootCauses: [
      'Fear of judgment or retaliation',
      'Hierarchical power dynamics',
      'Past negative experiences',
      'Lack of trust in leadership'
    ],
    rootCausesFr: [
      'Peur du jugement ou des représailles',
      'Dynamiques de pouvoir hiérarchiques',
      'Expériences négatives passées',
      'Manque de confiance envers la direction'
    ],
    tags: ['P1-silence', 'P1-fear', 'P1-hesitation']
  },
  P2: {
    code: 'P2',
    name: 'Loss of Meaning / Unclear Direction',
    nameFr: 'Perte de sens / direction floue',
    description: 'Team doesn\'t understand why they do what they do or where it\'s going',
    descriptionFr: 'L\'équipe ne comprend pas pourquoi elle fait ce qu\'elle fait ni où ça va',
    symptoms: [
      '"We don\'t know why we\'re doing this"',
      'Changing priorities',
      'Feature factory mentality',
      'Cynicism',
      'Empty rituals'
    ],
    symptomsFr: [
      '"On ne sait pas pourquoi on fait ça"',
      'Priorités changeantes',
      'Usine à features',
      'Cynisme',
      'Rituels vides'
    ],
    rootCauses: [
      'Lack of product vision',
      'Poor communication from leadership',
      'Disconnect from customer value',
      'Too much focus on output vs outcome'
    ],
    rootCausesFr: [
      'Manque de vision produit',
      'Mauvaise communication de la direction',
      'Déconnexion de la valeur client',
      'Trop de focus sur l\'output vs l\'outcome'
    ],
    tags: ['P2-purpose', 'P2-vision', 'P2-meaning']
  },
  P3: {
    code: 'P3',
    name: 'Learned Helplessness (Actions Without Impact)',
    nameFr: 'Impuissance apprise (actions sans impact)',
    description: 'Problems are known but nothing really changes',
    descriptionFr: 'Les problèmes sont connus mais rien ne change vraiment',
    symptoms: [
      'Same complaints every sprint',
      'Actions never completed',
      '"We already tried that"',
      'Blocking dependencies',
      'Frustration'
    ],
    symptomsFr: [
      'Mêmes plaintes chaque sprint',
      'Actions jamais réalisées',
      '"On a déjà essayé"',
      'Dépendances bloquantes',
      'Frustration'
    ],
    rootCauses: [
      'Lack of empowerment',
      'Organizational constraints',
      'No follow-through on commitments',
      'Systemic issues not addressed'
    ],
    rootCausesFr: [
      'Manque d\'autonomie',
      'Contraintes organisationnelles',
      'Pas de suivi des engagements',
      'Problèmes systémiques non adressés'
    ],
    tags: ['P3-helplessness', 'P3-frustration', 'P3-stagnation']
  },
  P4: {
    code: 'P4',
    name: 'Fragmentation / Lack of Cohesion',
    nameFr: 'Fragmentation / manque de cohésion',
    description: 'Group of individuals more than a team',
    descriptionFr: 'Groupe d\'individus plus qu\'une équipe',
    symptoms: [
      'Silos',
      'No mutual help',
      'Individual goals > collective goals',
      'Remote people invisible',
      'Subgroups / clans'
    ],
    symptomsFr: [
      'Silos',
      'Pas d\'entraide',
      'Objectifs individuels > collectifs',
      'Personnes en remote invisibles',
      'Sous-groupes / clans'
    ],
    rootCauses: [
      'Lack of shared goals',
      'Poor team building',
      'Misaligned incentives',
      'Geographic or functional silos'
    ],
    rootCausesFr: [
      'Manque d\'objectifs partagés',
      'Mauvais team building',
      'Incentives mal alignés',
      'Silos géographiques ou fonctionnels'
    ],
    tags: ['P4-silos', 'P4-fragmentation', 'P4-isolation']
  },
  P5: {
    code: 'P5',
    name: 'Overload / Unsustainable Pressure',
    nameFr: 'Surcharge / pression insoutenable',
    description: 'Team in permanent overheating, no bandwidth for improvement',
    descriptionFr: 'Équipe en surchauffe permanente, pas de bande passante pour l\'amélioration',
    symptoms: [
      'Visible burnout',
      'Permanent urgency mode',
      'Constant interruptions',
      'Explosive technical debt',
      'Degraded quality'
    ],
    symptomsFr: [
      'Burnout visible',
      'Mode urgence permanent',
      'Interruptions constantes',
      'Dette technique explosive',
      'Qualité dégradée'
    ],
    rootCauses: [
      'Unrealistic commitments',
      'Too much WIP',
      'No time for improvement',
      'External pressure without pushback'
    ],
    rootCausesFr: [
      'Engagements irréalistes',
      'Trop de WIP',
      'Pas de temps pour l\'amélioration',
      'Pression externe sans résistance'
    ],
    tags: ['P5-burnout', 'P5-overload', 'P5-pressure']
  },
  PA: {
    code: 'PA',
    name: 'Dysfunctional Agile Rituals (Scrum Theatre)',
    nameFr: 'Rituels agile dysfonctionnels (Scrum Theatre)',
    description: 'Daily = report to boss, retro "to check the box", endless plannings',
    descriptionFr: 'Daily = rapport au chef, rétro "pour cocher la case", plannings interminables',
    symptoms: [
      'Meetings feel like theater',
      'No real collaboration',
      'Rituals without value',
      'Going through the motions'
    ],
    symptomsFr: [
      'Les réunions semblent du théâtre',
      'Pas de vraie collaboration',
      'Rituels sans valeur',
      'On fait semblant'
    ],
    rootCauses: [
      'Misunderstanding of agile values',
      'Command and control culture',
      'No team ownership'
    ],
    rootCausesFr: [
      'Incompréhension des valeurs agiles',
      'Culture command and control',
      'Pas d\'ownership d\'équipe'
    ],
    tags: ['PA-theatre', 'PA-rituals', 'PA-dysfunction']
  },
  PB: {
    code: 'PB',
    name: 'Retro Facilitation Problems',
    nameFr: 'Problèmes de facilitation en rétro',
    description: 'Boring retro, repetitive format, 2-3 people dominate, vague actions, going in circles',
    descriptionFr: 'Rétro ennuyeuse, format répétitif, 2-3 personnes dominent, actions vagues, on tourne en rond',
    symptoms: [
      'Low engagement',
      'Same format every time',
      'Vague action items',
      'Dominant voices',
      'No progress'
    ],
    symptomsFr: [
      'Faible engagement',
      'Même format à chaque fois',
      'Actions vagues',
      'Voix dominantes',
      'Pas de progrès'
    ],
    rootCauses: [
      'Lack of facilitation skills',
      'No variety in activities',
      'Poor action item follow-through'
    ],
    rootCausesFr: [
      'Manque de compétences en facilitation',
      'Pas de variété dans les activités',
      'Mauvais suivi des actions'
    ],
    tags: ['PB-facilitation', 'PB-boring', 'PB-dominance']
  },
  PC: {
    code: 'PC',
    name: 'Open Conflict / Toxicity',
    nameFr: 'Conflit ouvert / toxicité',
    description: 'Interpersonal clashes, personal attacks, passive aggressiveness, territorial wars',
    descriptionFr: 'Clashes interpersonnels, attaques personnelles, agressivité passive, guerres de territoires',
    symptoms: [
      'Personal attacks',
      'Passive aggressive behavior',
      'Territorial disputes',
      'Toxic atmosphere'
    ],
    symptomsFr: [
      'Attaques personnelles',
      'Comportement passif-agressif',
      'Disputes territoriales',
      'Atmosphère toxique'
    ],
    rootCauses: [
      'Unresolved conflicts',
      'Personality clashes',
      'Misaligned goals',
      'Lack of conflict resolution skills'
    ],
    rootCausesFr: [
      'Conflits non résolus',
      'Chocs de personnalités',
      'Objectifs mal alignés',
      'Manque de compétences en résolution de conflits'
    ],
    tags: ['PC-conflict', 'PC-toxicity', 'PC-tension']
  },
  PD: {
    code: 'PD',
    name: 'Technical / Delivery Problems',
    nameFr: 'Problèmes techniques / delivery',
    description: 'Frequent bugs, prod incidents, unmanageable tech debt, painful deployments, no DoD, constant rework',
    descriptionFr: 'Bugs fréquents, incidents prod, dette technique ingérable, déploiements douloureux, pas de DoD, rework constant',
    symptoms: [
      'Frequent production issues',
      'Growing technical debt',
      'Painful deployments',
      'No definition of done',
      'Constant rework'
    ],
    symptomsFr: [
      'Problèmes prod fréquents',
      'Dette technique croissante',
      'Déploiements douloureux',
      'Pas de definition of done',
      'Rework constant'
    ],
    rootCauses: [
      'Lack of technical practices',
      'Pressure to deliver fast',
      'No time for quality',
      'Missing CI/CD'
    ],
    rootCausesFr: [
      'Manque de pratiques techniques',
      'Pression pour livrer vite',
      'Pas de temps pour la qualité',
      'Absence de CI/CD'
    ],
    tags: ['PD-technical', 'PD-quality', 'PD-delivery']
  }
}

export interface PatternScore {
  code: PatternCode
  score: number
  name: string
  nameFr: string
}

export interface PatternDetectionResult {
  primary: PatternScore
  secondary: PatternScore[]
  allScores: Record<PatternCode, number>
}
