'use client'

import { SiteChrome } from '@/components/layout/SiteChrome'

type LandingNavbarProps = {
  onNav: (id: string) => void
}

export function LandingNavbar({ onNav }: LandingNavbarProps) {
  return <SiteChrome onHomeSectionNav={onNav} buySource="landing_home_nav" />
}
