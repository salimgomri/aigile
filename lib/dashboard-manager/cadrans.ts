export type CadranType = 'value' | 'binary'
export type RagColor = '' | 'vert' | 'ambre' | 'rouge'

export type CadranConfig = {
  id: string
  title: string
  type: CadranType
  ph?: string
  desc: string
  seuils: string[]
}

export const CADRANS: CadranConfig[] = [
  {
    id: 'ontime',
    title: 'On Time',
    type: 'value',
    ph: '85 %',
    desc: 'Sprint Goal atteint\nSource : Sprint Review',
    seuils: ['V ≥ 90 %', 'A 70–89 %', 'R < 70 %'],
  },
  {
    id: 'onbudget',
    title: 'On Budget',
    type: 'binary',
    desc: 'Vélocité stable 3 sprints\nSource : outil vélocité',
    seuils: ['V stable ±15 %', 'R rupture 3 sprints+'],
  },
  {
    id: 'onscope',
    title: 'On Scope',
    type: 'binary',
    desc: 'DoD respectée / stories\nSource : Sprint Review',
    seuils: ['V DoD 100 %', 'A compromis documenté'],
  },
  {
    id: 'qualite',
    title: 'Qualité',
    type: 'value',
    ph: '18 %',
    desc: 'DORA CFR\nSource : Pipeline CI/CD',
    seuils: ['V CFR < 5 %', 'A 5–15 %', 'R > 15 %'],
  },
  {
    id: 'maturite',
    title: 'Maturité équipe',
    type: 'value',
    ph: '7.2',
    desc: 'Team Health Check\nSource : Retro',
    seuils: ['V 7+ / 10', 'A 5–6', 'R < 5'],
  },
  {
    id: 'bienetre',
    title: 'Bien-être',
    type: 'value',
    ph: '3.8',
    desc: 'Happiness Index\nSource : Niko-Niko quotidien',
    seuils: ['V 4+ / 5', 'A 3–3,9', 'R < 3'],
  },
]

export const RAG_COLORS: Record<
  RagColor,
  { bg: string; border: string; text: string; subtext: string; seuil: string | null; seuilBorder: string }
> = {
  vert: {
    bg: '#1A7A3C',
    border: '#1A7A3C',
    text: '#fff',
    subtext: 'rgba(255,255,255,.65)',
    seuil: 'rgba(255,255,255,.55)',
    seuilBorder: 'rgba(255,255,255,.2)',
  },
  ambre: {
    bg: '#B85C00',
    border: '#B85C00',
    text: '#fff',
    subtext: 'rgba(255,255,255,.65)',
    seuil: 'rgba(255,255,255,.55)',
    seuilBorder: 'rgba(255,255,255,.2)',
  },
  rouge: {
    bg: '#B01B1B',
    border: '#B01B1B',
    text: '#fff',
    subtext: 'rgba(255,255,255,.65)',
    seuil: 'rgba(255,255,255,.55)',
    seuilBorder: 'rgba(255,255,255,.2)',
  },
  '': {
    bg: '#F2F2F2',
    border: '#DEDEDE',
    text: '#0D0D0D',
    subtext: '#888',
    seuil: null,
    seuilBorder: '#DEDEDE',
  },
}

export const WORD_MAP: Record<Exclude<RagColor, ''>, string> = {
  vert: 'OUI',
  ambre: 'ATTENTION',
  rouge: 'NON',
}

export const TRENDS = ['↑', '→', '↓'] as const
export const SPARK_LABELS = ['S-5', 'S-4', 'S-3', 'S-2', 'S-1', 'S actuel'] as const
