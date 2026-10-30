'use client'

import Link from 'next/link'
import { CONSENT_REOPEN_EVENT } from '@/lib/consent'

const LINKS = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgv', label: 'CGV' },
  { href: '/privacy', label: 'Politique de confidentialité' },
  { href: '/contact', label: 'Contact' },
] as const

type LegalFooterLinksProps = {
  className?: string
  invert?: boolean
}

export function LegalFooterLinks({ className = '', invert = false }: LegalFooterLinksProps) {
  const linkClass = invert
    ? 'text-white/80 hover:text-aigile-gold underline-offset-2 hover:underline'
    : 'text-gray-600 hover:text-aigile-navy underline-offset-2 hover:underline'

  return (
    <nav aria-label="Informations légales" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={linkClass}>
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={`${linkClass} underline-offset-2 hover:underline`}
            onClick={() => {
              window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))
            }}
          >
            Gestion des cookies
          </button>
        </li>
      </ul>
    </nav>
  )
}
