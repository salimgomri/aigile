export const WESTRUM_QUESTIONS = [
  {
    id: 'q1' as const,
    text: "Dans mon équipe, l'information circule librement vers ceux qui en ont besoin.",
  },
  {
    id: 'q2' as const,
    text: "Dans mon équipe, les échecs conduisent à l'enquête, pas à la punition.",
  },
  {
    id: 'q3' as const,
    text: 'Dans mon organisation, les nouvelles idées sont bien accueillies.',
  },
  {
    id: 'q4' as const,
    text: 'Dans mon organisation, la collaboration entre équipes est encouragée et récompensée.',
  },
  {
    id: 'q5' as const,
    text: "Dans mon organisation, les responsabilités en cas d'échec sont partagées collectivement.",
  },
  {
    id: 'q6' as const,
    text: 'Dans mon organisation, les messagers de mauvaises nouvelles ne sont pas punis.',
  },
] as const

export type WestrumQuestionId = (typeof WESTRUM_QUESTIONS)[number]['id']

export type WestrumScores = Record<WestrumQuestionId, number>

export type WestrumNiveau = 'pathologique' | 'bureaucratique' | 'generative'

export const WESTRUM_TARGET_SCORE = 5.5

export const WESTRUM_LEVEL_COLORS = {
  pathologique: '#dc2626',
  bureaucratique: '#d97706',
  generative: '#16a34a',
} as const

export const WESTRUM_LEVEL_LABELS = {
  pathologique: 'PATHOLOGIQUE',
  bureaucratique: 'BUREAUCRATIQUE',
  generative: 'GÉNÉRATIVE',
} as const

export const WESTRUM_CONTEXT_MESSAGES: Record<WestrumNiveau, string> = {
  pathologique:
    "La peur règne dans ton organisation. L'information est cachée ou utilisée comme arme. Les pratiques agiles ne tiendront pas dans ce contexte. Commence par nommer ce que tu vois.",
  bureaucratique:
    'Les règles prédominent sur les résultats. C\'est un terrain viable mais fragile. La progression vers une culture générative passe par la relation manager et la sécurité psychologique.',
  generative:
    "Ton organisation crée les conditions de la performance durable. L'information circule. Les erreurs servent à apprendre. Continue à mesurer trimestriellement.",
}
