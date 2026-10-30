'use client'

import Link from 'next/link'
import { trackEvent } from '@/lib/gtag'

type CtaLinkProps = {
  href: string
  cta: string
  variant: 'home-v2' | 'home-legacy'
  className?: string
  children: React.ReactNode
}

export function CtaLink({ href, cta, variant, className, children }: CtaLinkProps) {
  const url = new URL(href, 'https://aigile.lu')
  if (url.pathname === '/diagnostic' && !url.searchParams.get('from')) {
    url.searchParams.set('from', variant)
  }
  const nextHref = `${url.pathname}${url.search}${url.hash}`

  return (
    <Link
      href={nextHref}
      data-cta={cta}
      className={className}
      onClick={() => trackEvent('cta_click', { variant, cta })}
    >
      {children}
    </Link>
  )
}
