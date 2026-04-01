import {
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns'
import { fr } from 'date-fns/locale'

const VALID_PATTERN = /^P[1-5]$|^P[ABCD]$/

export type RetroCreditRow = {
  action: string
  user_id: string
  created_at: string
  cost: number | null
  metadata: unknown
}

export type ScoringSessionRow = {
  user_id: string
  score_global: number | string | null
  rag_global: string | null
  completed_at: string | null
  created_at?: string | null
}

function parseScore(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined) return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

function extractRetroPattern(meta: unknown): string | null {
  if (!meta || typeof meta !== 'object') return null
  const code = (meta as Record<string, unknown>).retro_pattern_code
  if (typeof code !== 'string' || !VALID_PATTERN.test(code)) return null
  return code
}

export type RetroInsights = {
  totalUses: number
  uniqueUsers: number
  totalCreditsRecorded: number
  byAction: Array<{ action: string; count: number; uniqueUsers: number; creditsSum: number }>
  patternCounts: Array<{ code: string; count: number }>
  plansWithPatternRecorded: number
  plansAiTotal: number
  dailyLast30: Array<{ date: string; label: string; count: number }>
  avgUsesPerDayLast30: number
  activeDaysLast30: number
}

export type ScoringInsights = {
  completedSessions: number
  uniqueUsers: number
  scoreMin: number | null
  scoreMax: number | null
  scoreAvg: number | null
  scoreMedian: number | null
  ragCounts: Array<{ rag: string; count: number }>
  scoreBuckets: Array<{ range: string; count: number }>
  dailyLast30: Array<{ date: string; label: string; count: number }>
  monthlyCompleted: Array<{ month: string; label: string; count: number }>
}

export function aggregateRetroInsights(rows: RetroCreditRow[]): RetroInsights {
  const userSet = new Set<string>()
  let totalCreditsRecorded = 0
  const byActionMap = new Map<
    string,
    { count: number; users: Set<string>; creditsSum: number }
  >()
  const patternMap = new Map<string, number>()
  let plansWithPatternRecorded = 0
  let plansAiTotal = 0

  const today = startOfDay(new Date())
  const dayStart = subDays(today, 29)
  const dayKeys = eachDayOfInterval({ start: dayStart, end: today })
  const dailyMap = new Map<string, number>()
  for (const d of dayKeys) {
    dailyMap.set(format(d, 'yyyy-MM-dd'), 0)
  }

  for (const r of rows) {
    userSet.add(r.user_id)
    totalCreditsRecorded += r.cost ?? 0

    const slot = byActionMap.get(r.action) ?? {
      count: 0,
      users: new Set<string>(),
      creditsSum: 0,
    }
    slot.count += 1
    slot.users.add(r.user_id)
    slot.creditsSum += r.cost ?? 0
    byActionMap.set(r.action, slot)

    if (r.action === 'retro_ai_plan') {
      plansAiTotal += 1
      const code = extractRetroPattern(r.metadata)
      if (code) {
        plansWithPatternRecorded += 1
        patternMap.set(code, (patternMap.get(code) ?? 0) + 1)
      }
    }

    const day = r.created_at?.slice(0, 10)
    if (day && dailyMap.has(day)) {
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1)
    }
  }

  const byAction = [...byActionMap.entries()]
    .map(([action, v]) => ({
      action,
      count: v.count,
      uniqueUsers: v.users.size,
      creditsSum: v.creditsSum,
    }))
    .sort((a, b) => b.count - a.count)

  const patternCounts = [...patternMap.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)

  const dailyLast30 = [...dailyMap.entries()].map(([date, count]) => ({
    date,
    label: format(parseISO(date), 'd MMM', { locale: fr }),
    count,
  }))

  const sumLast30 = dailyLast30.reduce((s, d) => s + d.count, 0)
  const activeDaysLast30 = dailyLast30.filter((d) => d.count > 0).length
  const avgUsesPerDayLast30 = sumLast30 / 30

  return {
    totalUses: rows.length,
    uniqueUsers: userSet.size,
    totalCreditsRecorded,
    byAction,
    patternCounts,
    plansWithPatternRecorded,
    plansAiTotal,
    dailyLast30,
    avgUsesPerDayLast30,
    activeDaysLast30,
  }
}

function bucketLabel(low: number, high: number): string {
  return `${low}–${high}`
}

export function aggregateScoringInsights(rows: ScoringSessionRow[]): ScoringInsights {
  const scores: number[] = []
  const userSet = new Set<string>()
  const ragMap = new Map<string, number>()
  const bucketMap = new Map<string, number>()
  const monthlyMap = new Map<string, number>()

  const today = startOfDay(new Date())
  const dayStart = subDays(today, 29)
  const dayKeys = eachDayOfInterval({ start: dayStart, end: today })
  const dailyMap = new Map<string, number>()
  for (const d of dayKeys) {
    dailyMap.set(format(d, 'yyyy-MM-dd'), 0)
  }

  for (const r of rows) {
    const s = parseScore(r.score_global)
    if (s === null) continue
    userSet.add(r.user_id)
    scores.push(s)

    const rag = r.rag_global ?? '—'
    ragMap.set(rag, (ragMap.get(rag) ?? 0) + 1)

    const low = Math.min(80, Math.floor(s / 20) * 20)
    const key = bucketLabel(low, low + 20)
    bucketMap.set(key, (bucketMap.get(key) ?? 0) + 1)

    const timeRef = r.completed_at ?? r.created_at ?? null
    if (timeRef) {
      const d = parseISO(timeRef)
      const monthKey = format(d, 'yyyy-MM')
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) ?? 0) + 1)
      const day = timeRef.slice(0, 10)
      if (dailyMap.has(day)) {
        dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1)
      }
    }
  }

  scores.sort((a, b) => a - b)
  const n = scores.length
  const scoreMin = n ? scores[0] : null
  const scoreMax = n ? scores[n - 1] : null
  const scoreAvg = n ? scores.reduce((a, b) => a + b, 0) / n : null
  const scoreMedian =
    n === 0
      ? null
      : n % 2 === 1
        ? scores[(n - 1) / 2]
        : (scores[n / 2 - 1] + scores[n / 2]) / 2

  const orderBuckets = [0, 20, 40, 60, 80].map((low) => bucketLabel(low, low + 20))
  const scoreBuckets = orderBuckets.map((range) => ({
    range,
    count: bucketMap.get(range) ?? 0,
  }))

  const ragCounts = [...ragMap.entries()]
    .map(([rag, count]) => ({ rag, count }))
    .sort((a, b) => b.count - a.count)

  const dailyLast30 = [...dailyMap.entries()].map(([date, count]) => ({
    date,
    label: format(parseISO(date), 'd MMM', { locale: fr }),
    count,
  }))

  const monthlyCompleted = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month,
      label: format(parseISO(`${month}-01`), 'MMM yyyy', { locale: fr }),
      count,
    }))

  return {
    completedSessions: n,
    uniqueUsers: userSet.size,
    scoreMin,
    scoreMax,
    scoreAvg,
    scoreMedian,
    ragCounts,
    scoreBuckets,
    dailyLast30,
    monthlyCompleted,
  }
}
