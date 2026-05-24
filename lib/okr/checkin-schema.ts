import { z } from 'zod'

export const CheckInSchema = z.object({
  sprintId: z.string().uuid(),
  avance: z.string().trim().min(10).max(500),
  frein: z.string().trim().min(10).max(500),
  ajustement: z.string().trim().min(10).max(500),
})

export type CheckInInput = z.infer<typeof CheckInSchema>

export const OKR_QUESTIONS = {
  avance: 'Qu\'est-ce qui a avancé ce sprint sur nos OKRs ?',
  frein: 'Qu\'est-ce qui freine l\'atteinte de nos OKRs ?',
  ajustement: 'Quel ajustement on décide pour le prochain sprint ?',
} as const

export function truncate(text: string, max = 80): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}
