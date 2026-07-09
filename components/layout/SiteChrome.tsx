'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, User, X } from 'lucide-react'
import { AigileLogo } from '@/components/brand/AigileLogo'
import { LandingBuyButton } from '@/components/landing-v2/LandingBuyButton'
import { useLanguage } from '@/components/language-provider'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import {
  getPrimaryNavActiveId,
  HOME_SCROLL_SECTIONS,
  PRIMARY_NAV_ITEMS,
  type SubNavItem,
} from '@/lib/navigation/site-nav'
import { useSession, signOut } from '@/lib/auth-client'
import { useCredits } from '@/lib/credits/CreditContext'
import CreditsCountBadge from '@/components/credits/CreditsCountBadge'
import { translations } from '@/lib/translations'

export type SiteChromeProps = {
  /** Scroll fluide vers une section (home uniquement) */
  onHomeSectionNav?: (sectionId: string) => void
  /** Barre secondaire (framework, manifeste, …) */
  subNav?: {
    contextFr: string
    contextEn: string
    items: SubNavItem[]
  }
  buySource?: string
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function SiteChrome({ onHomeSectionNav, subNav, buySource = 'site_nav' }: SiteChromeProps) {
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const pathname = usePathname()
  const isHome = pathname === '/'
  const lang = language === 'fr' ? 'fr' : 'en'

  const { data: session, isPending } = useSession()
  const { status } = useCredits()
  const [scrolled, setScrolled] = useState(false)
  const [subNavScrolled, setSubNavScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const homeScrollSection = useScrollSpy([...HOME_SCROLL_SECTIONS], {
    enabled: isHome,
    offset: subNav ? 132 : 88,
  })

  const subSectionIds = subNav?.items.map((item) => item.sectionId) ?? []
  const subScrollSection = useScrollSpy(subSectionIds, {
    enabled: Boolean(subNav) && subSectionIds.length > 0,
    offset: 132,
  })

  const activePrimaryId = getPrimaryNavActiveId(pathname, isHome ? homeScrollSection : null)

  const userDisplayName = status?.isAdmin
    ? 'Admin'
    : session?.user?.name || session?.user?.email?.split('@')[0] || ''

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      setSubNavScrolled(window.scrollY > 48)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handlePrimarySection = (sectionId: string) => {
    if (isHome && onHomeSectionNav) {
      onHomeSectionNav(sectionId)
    } else if (isHome) {
      scrollToSection(sectionId)
    } else {
      window.location.href = `/#${sectionId}`
    }
    setOpen(false)
  }

  const handleSubSection = (sectionId: string) => {
    scrollToSection(sectionId)
    setOpen(false)
  }

  const primaryItems = PRIMARY_NAV_ITEMS.map((item) => ({
    ...item,
    label: lang === 'fr' ? item.labelFr : item.labelEn,
    isActive: activePrimaryId === item.id,
  }))

  const subItems =
    subNav?.items.map((item) => ({
      ...item,
      label: lang === 'fr' ? item.labelFr : item.labelEn,
      isActive: subScrollSection === item.sectionId,
    })) ?? []

  const contextLabel = subNav ? (lang === 'fr' ? subNav.contextFr : subNav.contextEn) : null

  return (
    <>
      <header className={`ld-nav ${scrolled ? 'ld-nav--scrolled' : ''}`}>
        <div className="ld-nav__inner">
          <Link href="/" className="ld-logo" aria-label="AIgile — Accueil">
            <AigileLogo size="nav" priority />
          </Link>

          <nav className="ld-nav__center" aria-label="Site">
            {primaryItems.map((item) => {
              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`ld-nav__link${item.isActive ? ' is-active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  className={item.isActive ? 'is-active' : undefined}
                  onClick={() => item.sectionId && handlePrimarySection(item.sectionId)}
                >
                  {item.label}
                </button>
              )
            })}
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

            <LandingBuyButton className="ld-btn ld-btn--gold ld-btn--nav" source={buySource} showPrice={false} />

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

        {open ? (
          <MobileNav
            primaryItems={primaryItems}
            subItems={subItems}
            contextLabel={contextLabel}
            onPrimarySection={handlePrimarySection}
            onSubSection={handleSubSection}
            language={language}
            setLanguage={setLanguage}
            session={session}
            userDisplayName={userDisplayName}
            t={t}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </header>

      <div className="ld-nav-spacer" aria-hidden />

      {subNav ? (
        <nav
          className={`ld-subnav${subNavScrolled ? ' ld-subnav--scrolled' : ''}`}
          aria-label={contextLabel ?? 'Page'}
        >
          <div className="ld-subnav__inner">
            {contextLabel ? <span className="ld-subnav__context">{contextLabel}</span> : null}
            <div className="ld-subnav__track">
              {subItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`ld-subnav__link${item.isActive ? ' is-active' : ''}`}
                  onClick={() => handleSubSection(item.sectionId)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </>
  )
}

type MobileNavProps = {
  primaryItems: Array<{ id: string; label: string; href?: string; sectionId?: string; isActive: boolean }>
  subItems: Array<{ id: string; label: string; sectionId: string; isActive: boolean }>
  contextLabel: string | null
  onPrimarySection: (id: string) => void
  onSubSection: (id: string) => void
  language: string
  setLanguage: (l: 'fr' | 'en') => void
  session: ReturnType<typeof useSession>['data']
  userDisplayName: string
  t: (typeof translations)['fr'] | (typeof translations)['en']
  onClose: () => void
}

function MobileNav({
  primaryItems,
  subItems,
  contextLabel,
  onPrimarySection,
  onSubSection,
  language,
  setLanguage,
  session,
  userDisplayName,
  t,
  onClose,
}: MobileNavProps) {
  return (
    <div className="ld-nav__mobile">
      <p className="ld-nav__mobile-label">{language === 'fr' ? 'Site' : 'Site'}</p>
      {primaryItems.map((item) =>
        item.href ? (
          <Link
            key={item.id}
            href={item.href}
            className={`ld-nav__mobile-link${item.isActive ? ' is-active' : ''}`}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.id}
            type="button"
            className={item.isActive ? 'is-active' : undefined}
            onClick={() => item.sectionId && onPrimarySection(item.sectionId)}
          >
            {item.label}
          </button>
        ),
      )}

      {subItems.length > 0 ? (
        <>
          <p className="ld-nav__mobile-label ld-nav__mobile-label--sub">{contextLabel}</p>
          {subItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.isActive ? 'is-active' : undefined}
              onClick={() => onSubSection(item.sectionId)}
            >
              {item.label}
            </button>
          ))}
        </>
      ) : null}

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
            <Link href="/login" className="ld-nav__ghost" onClick={onClose}>
              {t['nav-signin']}
            </Link>
            <Link href="/register" className="ld-nav__register" onClick={onClose}>
              {t['nav-signup']}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
