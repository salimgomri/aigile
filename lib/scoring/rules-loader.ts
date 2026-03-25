import 'server-only'

import scoringModelJson from './data/scoring_model.json'
import questionBankJson from './data/question_bank.json'
import tipsJson from './data/tips.json'

import type { CadrageAnswers } from '@/types/scoring'
import type {
  ClientSafeModel,
  ClientSafeQuestion,
  QuestionBank,
  ScoringModel,
  TipsMap,
} from '@/lib/scoring/schema'

const scoringModel = scoringModelJson as unknown as ScoringModel
const questionBank = questionBankJson as unknown as QuestionBank
const tips = tipsJson as unknown as TipsMap

let validated = false

export function validateRules(): void {
  if (validated) return
  const model = scoringModel
  const bank = questionBank
  for (const q of bank.questions) {
    if (!model.scales[q.scale_id]) {
      throw new Error(`[validateRules] scale_id "${q.scale_id}" introuvable pour ${q.id}`)
    }
    if (!model.dimensions[q.dimension]) {
      throw new Error(`[validateRules] dimension "${q.dimension}" introuvable pour ${q.id}`)
    }
  }
  validated = true
}

export function getScoringModel(): ScoringModel {
  validateRules()
  return scoringModel
}

export function getQuestionBank(): QuestionBank {
  validateRules()
  return questionBank
}

export function getTips(): TipsMap {
  validateRules()
  return tips
}

export function getClientSafeData(cadrage: CadrageAnswers): {
  questions: ClientSafeQuestion[]
  model: ClientSafeModel
} {
  validateRules()
  const model = scoringModel
  const bank = questionBank

  const questions: ClientSafeQuestion[] = bank.questions
    .filter((q) => {
      if (q.dimension === 'd8' && cadrage.C7 === 'b') return false
      return true
    })
    .map(({ weight_per_role: _w, ...rest }) => rest) as ClientSafeQuestion[]

  const modelOut: ClientSafeModel = {
    rag_thresholds: model.rag_thresholds,
    dimensions: model.dimensions,
    blocking_rule: model.blocking_rule,
    scales: model.scales,
  }

  return { questions, model: modelOut }
}
