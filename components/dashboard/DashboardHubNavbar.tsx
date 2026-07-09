'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, Menu, User, X } from 'lucide-react'
import { AigileLogo } from '@/components/brand/AigileLogo'
import { useLanguage } from '@/components/language-provider'
import { translations } from '@/lib/translations'
import { useSession, signOut } from '@/lib/auth-client'
import { useCredits } from '@/lib/credits/CreditContext'
import CreditsCountBadge from '@/components/credits/CreditsCountBadge'

export function DashboardHubNavbar() {
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const { data: session } = useSession()
  const { status } = useCredits()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const userDisplayName = status?.isAdmin
    ? 'Admin'
    : session?.user?.name || session?.user?.email?.split('@')[0] || ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems =
    language === 'fr'
      ? [
          { href: '/', label: 'Accueil' },
          { href: '/parcours', label: 'Parcours' },
          { href: '/#buy', label: 'Le livre' },
        ]
      : [
          { href: '/', label: 'Home' },
          { href: '/parcours', label: 'Journey' },
          { href: '/#buy', label: 'The book' },
        ]

  return (
    <>
      <header className={`ld-nav ${scrolled ? 'ld-nav--scrolled' : ''}`}>
        <div className="ld-nav__inner">
          <Link href="/" className="ld-logo" aria-label="AIgile — Accueil">
            <AigileLogo size="nav" />
          </Link>

          <nav className="ld-nav__center" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="ld-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ld-nav__right">
            <div className="ld-lang" role="group" aria-label="Language">
              <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')}>
                EN
              </button>
              <button type="button" className={language === 'fr' ? 'is-active' : ''} onClick={() => setLanguage('fr')}>
                FR
              </button>
            </div>

            <div className="ld-nav__auth ld-nav__auth--desktop">
              <span className="ld-nav__user">
                <User size={14} aria-hidden />
                <span className="ld-nav__user-name">{userDisplayName}</span>
              </span>
              <CreditsCountBadge />
              <button type="button" className="ld-nav__ghost" onClick={() => signOut()}>
                <LogOut size={14} aria-hidden />
                {t['nav-signout']}
              </button>
            </div>

            <button
              type="button"
              className="ld-nav__burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="ld-nav__mobile">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="ld-nav__mobile-link" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="ld-lang ld-lang--mobile">
              <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')}>
                English
              </button>
              <button type="button" className={language === 'fr' ? 'is-active' : ''} onClick={() => setLanguage('fr')}>
                Français
              </button>
            </div>
            <div className="ld-nav__auth ld-nav__auth--mobile">
              <span className="ld-nav__user">
                <User size={14} />
                {userDisplayName}
              </span>
              <CreditsCountBadge />
              <button type="button" className="ld-nav__ghost" onClick={() => signOut()}>
                {t['nav-signout']}
              </button>
            </div>
          </div>
        )}
      </header>
      <div className="ld-nav-spacer" aria-hidden />
    </>
  )
}
