import { PatternCode } from './patterns'

export type QuestionId = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7' | 'Q8'

export interface PatternWeights {
  [key: string]: number
}

export interface Answer {
  id: string
  text: string
  textFr: string
  patterns: PatternWeights
}

export interface Question {
  id: QuestionId
  text: string
  textFr: string
  answers: Answer[]
}

export const QUESTIONNAIRE: Question[] = [
  {
    id: 'Q1',
    text: 'What is the atmosphere during retrospectives?',
    textFr: 'Quelle est l\'ambiance en rétrospective ?',
    answers: [
      {
        id: 'Q1A1',
        text: 'Silent, people hesitate to speak',
        textFr: 'Silencieuse, hésitation à parler',
        patterns: { P1: 2 }
      },
      {
        id: 'Q1A2',
        text: 'Friendly but superficial',
        textFr: 'Conviviale mais superficielle',
        patterns: { PA: 1, PB: 1 }
      },
      {
        id: 'Q1A3',
        text: 'Tense, unspoken tensions',
        textFr: 'Tendue, non-dits/tensions',
        patterns: { PC: 2, P1: 1 }
      },
      {
        id: 'Q1A4',
        text: 'Bored, always the same thing',
        textFr: 'Ennuyée, toujours la même chose',
        patterns: { PB: 2 }
      },
      {
        id: 'Q1A5',
        text: 'Energetic and constructive',
        textFr: 'Énergique et constructive',
        patterns: {}
      }
    ]
  },
  {
    id: 'Q2',
    text: 'How does the team react during a retro when an uncomfortable topic comes up?',
    textFr: 'Réaction pendant la rétro à un sujet inconfortable ?',
    answers: [
      {
        id: 'Q2A1',
        text: 'We change the subject / minimize it',
        textFr: 'On change de sujet / on minimise',
        patterns: { P1: 2, PA: 1 }
      },
      {
        id: 'Q2A2',
        text: 'Conflict or personal attacks',
        textFr: 'Conflit ou attaques personnelles',
        patterns: { PC: 2, P1: 1 }
      },
      {
        id: 'Q2A3',
        text: 'We listen politely but don\'t dig deeper',
        textFr: 'On écoute poliment mais on ne creuse pas',
        patterns: { PA: 1, PB: 1, P1: 1 }
      },
      {
        id: 'Q2A4',
        text: 'Calm analysis and search for solutions',
        textFr: 'Analyse calme et recherche de solutions',
        patterns: {}
      },
      {
        id: 'Q2A5',
        text: 'One person monopolizes, others stay quiet',
        textFr: 'Une personne monopolise, les autres se taisent',
        patterns: { PB: 2, P1: 1 }
      }
    ]
  },
  {
    id: 'Q3',
    text: 'What happens between retros when a problem comes back?',
    textFr: 'Ce qui se passe entre les rétros quand un problème revient ?',
    answers: [
      {
        id: 'Q3A1',
        text: 'We don\'t talk about it until the next retro',
        textFr: 'On n\'en parle plus jusqu\'à la prochaine rétro',
        patterns: { P3: 2, PB: 1 }
      },
      {
        id: 'Q3A2',
        text: 'We try an action then give up if it doesn\'t work quickly',
        textFr: 'On essaie une action puis on abandonne',
        patterns: { P3: 2 }
      },
      {
        id: 'Q3A3',
        text: 'We talk about it everywhere but nothing changes in how we work',
        textFr: 'On en parle partout mais rien ne change',
        patterns: { P3: 2, PB: 1 }
      },
      {
        id: 'Q3A4',
        text: 'We really adapt our rules/process and the problem disappears',
        textFr: 'On adapte réellement nos règles/process',
        patterns: {}
      },
      {
        id: 'Q3A5',
        text: 'We escalate almost everything to management without acting ourselves',
        textFr: 'On escalade au management sans agir nous-mêmes',
        patterns: { P3: 2, P1: 1 }
      }
    ]
  },
  {
    id: 'Q4',
    text: 'How is collaboration within the team?',
    textFr: 'Collaboration dans l\'équipe ?',
    answers: [
      {
        id: 'Q4A1',
        text: 'Silos, little mutual help',
        textFr: 'Silos, peu d\'entraide',
        patterns: { P4: 2 }
      },
      {
        id: 'Q4A2',
        text: 'Clans, people who don\'t talk to each other',
        textFr: 'Clans, personnes qui ne se parlent pas',
        patterns: { PC: 2, P4: 1 }
      },
      {
        id: 'Q4A3',
        text: 'Unbalanced: some carry everything, others do minimum',
        textFr: 'Déséquilibrée: certains portent tout',
        patterns: { P5: 2, P4: 1 }
      },
      {
        id: 'Q4A4',
        text: 'Superficial, we work together without real connection',
        textFr: 'Superficielle, sans vraie connexion',
        patterns: { PA: 1, P2: 1 }
      },
      {
        id: 'Q4A5',
        text: 'Fluid and supportive',
        textFr: 'Fluide et solidaire',
        patterns: {}
      }
    ]
  },
  {
    id: 'Q5',
    text: 'What is your team\'s main current challenge?',
    textFr: 'Défi principal actuel ?',
    answers: [
      {
        id: 'Q5A1',
        text: 'Lack of confidence to say things',
        textFr: 'Manque de confiance pour dire les choses',
        patterns: { P1: 3 }
      },
      {
        id: 'Q5A2',
        text: 'Loss of meaning: "Why are we doing this?"',
        textFr: 'Perte de sens: "Pourquoi on fait ça ?"',
        patterns: { P2: 3 }
      },
      {
        id: 'Q5A3',
        text: 'Feeling that "nothing changes" despite retros',
        textFr: 'Sentiment que "rien ne change"',
        patterns: { P3: 3 }
      },
      {
        id: 'Q5A4',
        text: 'Work overload, imminent burnout',
        textFr: 'Surcharge de travail, burnout imminent',
        patterns: { P5: 3 }
      },
      {
        id: 'Q5A5',
        text: 'Conflicts or interpersonal tensions',
        textFr: 'Conflits ou tensions interpersonnelles',
        patterns: { PC: 3 }
      }
    ]
  },
  {
    id: 'Q6',
    text: 'How does the team manage workload?',
    textFr: 'Gestion de la charge de travail ?',
    answers: [
      {
        id: 'Q6A1',
        text: 'Overwhelmed (too much WIP, impossible deadlines)',
        textFr: 'Débordée (trop de WIP, deadlines impossibles)',
        patterns: { P5: 2 }
      },
      {
        id: 'Q6A2',
        text: 'Inefficient (lots of effort, few results)',
        textFr: 'Inefficace (beaucoup d\'efforts, peu de résultats)',
        patterns: { P3: 1, PD: 1 }
      },
      {
        id: 'Q6A3',
        text: 'Uneven (some overloaded, others idle)',
        textFr: 'Inégale (certains surchargés, d\'autres désœuvrés)',
        patterns: { P4: 2 }
      },
      {
        id: 'Q6A4',
        text: 'Rushed (going fast at the expense of quality)',
        textFr: 'Bâclée (aller vite au détriment de la qualité)',
        patterns: { PD: 2, P5: 1 }
      },
      {
        id: 'Q6A5',
        text: 'Balanced and sustainable',
        textFr: 'Équilibrée et soutenable',
        patterns: {}
      }
    ]
  },
  {
    id: 'Q7',
    text: 'What about the quality of work?',
    textFr: 'Qualité du travail ?',
    answers: [
      {
        id: 'Q7A1',
        text: 'Growing technical debt, declining quality',
        textFr: 'Dette technique croissante, qualité en baisse',
        patterns: { PD: 2 }
      },
      {
        id: 'Q7A2',
        text: 'Frequent bugs, production incidents',
        textFr: 'Bugs fréquents, incidents prod',
        patterns: { PD: 2, P5: 1 }
      },
      {
        id: 'Q7A3',
        text: '"Done" but not "well done"',
        textFr: '"Fait" mais pas "bien fait"',
        patterns: { PD: 2 }
      },
      {
        id: 'Q7A4',
        text: 'Variable quality depending on people',
        textFr: 'Qualité variable selon les personnes',
        patterns: { P4: 1 }
      },
      {
        id: 'Q7A5',
        text: 'Good quality, team proud of the work',
        textFr: 'Bonne qualité, équipe fière du travail',
        patterns: {}
      }
    ]
  },
  {
    id: 'Q8',
    text: 'Desired retrospective duration?',
    textFr: 'Durée souhaitée pour la rétrospective ?',
    answers: [
      {
        id: 'Q8A1',
        text: '30 minutes',
        textFr: '30 minutes',
        patterns: {}
      },
      {
        id: 'Q8A2',
        text: '45 minutes',
        textFr: '45 minutes',
        patterns: {}
      },
      {
        id: 'Q8A3',
        text: '60 minutes',
        textFr: '60 minutes',
        patterns: {}
      },
      {
        id: 'Q8A4',
        text: '90 minutes',
        textFr: '90 minutes',
        patterns: {}
      }
    ]
  }
]

export function getDurationFromAnswers(answers: Record<QuestionId, string>): number {
  const q8Answer = answers.Q8
  if (!q8Answer) return 60

  switch (q8Answer) {
    case 'Q8A1': return 30
    case 'Q8A2': return 45
    case 'Q8A3': return 60
    case 'Q8A4': return 90
    default: return 60
  }
}
