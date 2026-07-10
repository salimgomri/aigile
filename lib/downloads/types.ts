export const DOWNLOAD_ASSETS = [
  'framework_guide_fr',
  'framework_guide_en',
  'framework_poster',
  'manifesto_pdf',
] as const

export type DownloadAsset = (typeof DOWNLOAD_ASSETS)[number]

export const DOWNLOAD_ASSET_LABELS: Record<DownloadAsset, string> = {
  framework_guide_fr: 'Guide framework (FR)',
  framework_guide_en: 'Guide framework (EN)',
  framework_poster: 'Affiche framework',
  manifesto_pdf: 'Manifeste PDF',
}
