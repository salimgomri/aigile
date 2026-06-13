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
  ficheLiee?: string | null
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
  ficheLiee?: string | null
  ficheDestineeA: string[]
  hasFiche: boolean
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
