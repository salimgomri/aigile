export type PrimaryNavItem = {
  id: string
  labelFr: string
  labelEn: string
  /** Scroll sur la home */
  sectionId?: string
  /** Lien externe (page ou ancre autre page) */
  href?: string
}

export type SubNavItem = {
  id: string
  labelFr: string
  labelEn: string
  sectionId: string
}

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { id: 'hero', labelFr: 'Le livre', labelEn: 'The book', sectionId: 'hero' },
  { id: 'inside', labelFr: 'Contenu', labelEn: 'Inside', sectionId: 'inside' },
  { id: 'framework', labelFr: 'Framework', labelEn: 'Framework', href: '/framework' },
  { id: 'tools', labelFr: 'Outils', labelEn: 'Tools', sectionId: 'tools' },
  { id: 'buy', labelFr: 'Acheter', labelEn: 'Buy', sectionId: 'buy' },
]

export const HOME_SCROLL_SECTIONS = ['hero', 'inside', 'framework', 'tools', 'buy'] as const

export const FRAMEWORK_SUB_NAV: SubNavItem[] = [
  { id: 'overview', labelFr: "Vue d'ensemble", labelEn: 'Overview', sectionId: 'fw-hero' },
  { id: 'articles', labelFr: 'Articles', labelEn: 'Articles', sectionId: 'fw-articles' },
  { id: 'cycle', labelFr: 'Le cycle', labelEn: 'The cycle', sectionId: 'fw-cycle' },
  { id: 'phases', labelFr: 'Phases & rôles', labelEn: 'Phases & roles', sectionId: 'fw-phases' },
]

export const MANIFESTO_SUB_NAV: SubNavItem[] = [
  { id: 'values', labelFr: 'Valeurs', labelEn: 'Values', sectionId: 'values' },
  { id: 'principles', labelFr: 'Principes', labelEn: 'Principles', sectionId: 'principles' },
  { id: 'about', labelFr: 'Auteur', labelEn: 'Author', sectionId: 'about' },
]

export function getPrimaryNavActiveId(pathname: string, scrollSection: string | null): string | null {
  if (pathname === '/framework') return 'framework'
  if (pathname === '/manifesto') return null
  if (pathname === '/') return scrollSection
  return null
}
