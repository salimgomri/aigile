import type { RagColor } from './cadrans'

const STORAGE_KEY = 'aigile_dashboard_manager_v1'

export type DashboardManagerState = {
  header: { team: string; sprint: string; period: string; sm: string }
  ragState: RagColor[]
  values: string[]
  notes: string[]
  trends: number[]
  manualOverride: boolean
  manualRag: RagColor
  manualScore: string
  manualComment: string
  sparkData: (number | null)[]
  okr: { objective: string; advance: string; block: string; adjust: string }
  narrative: string
}

export const EMPTY_STATE: DashboardManagerState = {
  header: { team: '', sprint: '', period: '', sm: '' },
  ragState: ['', '', '', '', '', ''],
  values: ['', '', '', '', '', ''],
  notes: ['', '', '', '', '', ''],
  trends: [0, 0, 0, 0, 0, 0],
  manualOverride: false,
  manualRag: '',
  manualScore: '',
  manualComment: '',
  sparkData: [null, null, null, null, null, null],
  okr: { objective: '', advance: '', block: '', adjust: '' },
  narrative: '',
}

export function loadDashboardState(): DashboardManagerState {
  if (typeof window === 'undefined') return EMPTY_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as Partial<DashboardManagerState>
    return { ...EMPTY_STATE, ...parsed }
  } catch {
    return EMPTY_STATE
  }
}

export function saveDashboardState(state: DashboardManagerState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // quota / private mode
  }
}

export function clearDashboardStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
