export type UrlKind = 'web' | 'youtube' | 'podcast' | 'rss'

export type SourceUrl = {
  href: string
  kind: UrlKind
}

export type IntelligenceSourceGroup = {
  name: string
  urls: SourceUrl[]
}

export type IntelligenceTierLayout = {
  bento_column_span: number
  variant: string
}

export type IntelligenceTier = {
  id: string
  rank: string
  title_fr: string
  title_en: string
  tagline_fr: string
  tagline_en: string
  layout: IntelligenceTierLayout
  groups: IntelligenceSourceGroup[]
}

export type IntelligenceSourcesFile = {
  version: number
  youtube_min_duration_minutes: number
  tiers: IntelligenceTier[]
}
