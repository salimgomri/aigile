'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { translations } from '@/lib/translations'
import { useSession, signOut } from '@/lib/auth-client'
import { useCredits } from '@/lib/credits/CreditContext'
import CreditsCountBadge from '@/components/credits/CreditsCountBadge'
import { LandingBuyButton } from './LandingBuyButton'

type LandingNavbarProps = {
  onNav: (id: string) => void
}

export function LandingNavbar({ onNav }: LandingNavbarProps) {
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const { data: session, isPending } = useSession()
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
          { id: 'hero', label: 'Le livre' },
          { id: 'inside', label: 'Contenu' },
          { id: 'framework', label: 'Framework', href: '/framework' },
          { id: 'tools', label: 'Outils' },
          { id: 'buy', label: 'Acheter' },
        ]
      : [
          { id: 'hero', label: 'The book' },
          { id: 'inside', label: 'Inside' },
          { id: 'framework', label: 'Framework', href: '/framework' },
          { id: 'tools', label: 'Tools' },
          { id: 'buy', label: 'Buy' },
        ]

  return (
    <>
      <header className={`ld-nav ${scrolled ? 'ld-nav--scrolled' : ''}`}>
        <div className="ld-nav__inner">
          <Link href="/" className="ld-logo" aria-label="AIGILE.LU">
            <span className="ld-logo__mark">A</span>
            <span className="ld-logo__text">AIGILE.LU</span>
          </Link>

          <nav className="ld-nav__center" aria-label="Primary">
            {navItems.map((item) =>
              'href' in item && item.href ? (
                <Link key={item.id} href={item.href} className="ld-nav__link">
                  {item.label}
                </Link>
              ) : (
                <button key={item.id} type="button" onClick={() => onNav(item.id)}>
                  {item.label}
                </button>
              ),
            )}
          </nav>

          <div className="ld-nav__right">
            <div className="ld-lang" role="group" aria-label="Language">
              <button
                type="button"
                className={language === 'en' ? 'is-active' : ''}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={language === 'fr' ? 'is-active' : ''}
                onClick={() => setLanguage('fr')}
              >
                FR
              </button>
            </div>

            <div className="ld-nav__auth ld-nav__auth--desktop">
              {isPending ? (
                <span className="ld-nav__pulse" aria-hidden />
              ) : session ? (
                <>
                  <span className="ld-nav__user">
                    <User size={14} aria-hidden />
                    <span className="ld-nav__user-name">{userDisplayName}</span>
                  </span>
                  <CreditsCountBadge />
                  <button type="button" className="ld-nav__ghost" onClick={() => signOut()}>
                    <LogOut size={14} aria-hidden />
                    {t['nav-signout']}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="ld-nav__ghost">
                    {t['nav-signin']}
                  </Link>
                  <Link href="/register" className="ld-nav__register">
                    {t['nav-signup']}
                  </Link>
                </>
              )}
            </div>

            <LandingBuyButton
              className="ld-btn ld-btn--gold ld-btn--nav"
              source="landing_home_nav"
              showPrice={false}
            />

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
            {navItems.map((item) =>
              'href' in item && item.href ? (
                <Link key={item.id} href={item.href} className="ld-nav__mobile-link" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNav(item.id)
                    setOpen(false)
                  }}
                >
                  {item.label}
                </button>
              ),
            )}
            <div className="ld-lang ld-lang--mobile">
              <button
                type="button"
                className={language === 'en' ? 'is-active' : ''}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button
                type="button"
                className={language === 'fr' ? 'is-active' : ''}
                onClick={() => setLanguage('fr')}
              >
                Français
              </button>
            </div>
            <div className="ld-nav__auth ld-nav__auth--mobile">
              {session ? (
                <>
                  <span className="ld-nav__user">
                    <User size={14} />
                    {userDisplayName}
                  </span>
                  <CreditsCountBadge />
                  <button type="button" className="ld-nav__ghost" onClick={() => signOut()}>
                    {t['nav-signout']}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="ld-nav__ghost" onClick={() => setOpen(false)}>
                    {t['nav-signin']}
                  </Link>
                  <Link href="/register" className="ld-nav__register" onClick={() => setOpen(false)}>
                    {t['nav-signup']}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <div className="ld-nav-spacer" aria-hidden />
    </>
  )
}
