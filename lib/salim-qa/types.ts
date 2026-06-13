export type SalimQaQuestion = {
  id: string
  role: string
  question: string
  reponse: string
  douleur: string
  dimensions: string[]
  chapter: number
  chapterTitle: string
  partie: number
  partieName: string
  cible?: string
  ficheLiees: string[]
  ficheDestineeA: string[]
  schemasLies: string[]
  statutReponse?: string
  page?: string | number | null
}

export type SalimQaQuestionPublic = {
  id: string
  role: string
  question: string
  douleur: string
  dimensions: string[]
  answerPreview: string
  isUnlocked: boolean
  canReadFull: boolean
  answerFull?: string
  chapter: number
  chapterTitle: string
  partie: number
  partieName: string
  cible?: string
  hasFiche: boolean
  ficheCount: number
  ficheDestineeA: string[]
  statutReponse?: string
  page?: string | number | null
}

export type SalimQaActivityAction =
  | 'search'
  | 'question_view'
  | 'unlock_attempt'
  | 'unlock_success'
  | 'unlock_denied'
  | 'recharge_click'
  | 'book_click'
  | 'book_click'

export type SalimQaFacets = {
  roles: string[]
  cibles: string[]
  dimensions: string[]
  chapters: number[]
  total: number
}
