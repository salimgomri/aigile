'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { translations } from '@/lib/translations'
import { useSession, signOut } from '@/lib/auth-client'
import { useCredits } from '@/lib/credits/CreditContext'
import CreditsCountBadge from '@/components/credits/CreditsCountBadge'
import { LandingBuyButton } from '@/components/landing-v2/LandingBuyButton'

export function FrameworkNavbar() {
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
          { id: 'cycle', label: 'Le cycle', href: '#fw-cycle' },
          { id: 'phases', label: 'Phases & rôles', href: '#fw-phases' },
          { id: 'book', label: 'Le livre', href: '/#buy' },
        ]
      : [
          { id: 'cycle', label: 'The cycle', href: '#fw-cycle' },
          { id: 'phases', label: 'Phases & roles', href: '#fw-phases' },
          { id: 'book', label: 'The book', href: '/#buy' },
        ]

  const scrollTo = (hash: string) => {
    if (hash.startsWith('#')) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

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
              item.href.startsWith('#') ? (
                <button key={item.id} type="button" onClick={() => scrollTo(item.href)}>
                  {item.label}
                </button>
              ) : (
                <Link key={item.id} href={item.href} className="ld-nav__link">
                  {item.label}
                </Link>
              ),
            )}
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

            <LandingBuyButton className="ld-btn ld-btn--gold ld-btn--nav" source="framework_nav" showPrice={false} />

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
            <Link href="/" className="ld-nav__mobile-link" onClick={() => setOpen(false)}>
              {language === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    scrollTo(item.href)
                    setOpen(false)
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <Link key={item.id} href={item.href} className="ld-nav__mobile-link" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ),
            )}
            <div className="ld-lang ld-lang--mobile">
              <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')}>
                English
              </button>
              <button type="button" className={language === 'fr' ? 'is-active' : ''} onClick={() => setLanguage('fr')}>
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
