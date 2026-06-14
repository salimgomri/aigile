'use client'

import Link from 'next/link'
import { LogIn, LogOut } from 'lucide-react'
import { signOut, useSession } from '@/lib/auth-client'

const LOGIN_REDIRECT = '/login?redirect=%2Fsalim-qa'

type SalimQaAuthBarProps = {
  language: 'fr' | 'en'
  creditsRemaining: number | null
  isAdmin: boolean
  hasFullAccess: boolean
}

export function SalimQaAuthBar({
  language,
  creditsRemaining,
  isAdmin,
  hasFullAccess,
}: SalimQaAuthBarProps) {
  const { data: session, isPending } = useSession()

  const copy =
    language === 'fr'
      ? {
          login: 'Se connecter',
          register: 'Créer un compte',
          logout: 'Déconnexion',
          connected: (name: string) => `Connecté · ${name}`,
          adminBadge: 'Accès illimité (Admin)',
          proBadge: 'Accès illimité (Pro)',
          creditsLeft: (n: number) => `${n} crédit${n > 1 ? 's' : ''}`,
        }
      : {
          login: 'Log in',
          register: 'Sign up',
          logout: 'Log out',
          connected: (name: string) => `Signed in · ${name}`,
          adminBadge: 'Unlimited access (Admin)',
          proBadge: 'Unlimited access (Pro)',
          creditsLeft: (n: number) => `${n} credit${n > 1 ? 's' : ''}`,
        }

  if (isPending) {
    return <span className="sq-auth sq-auth--loading" aria-hidden />
  }

  if (!session) {
    return (
      <div className="sq-auth sq-auth--anon">
        <Link href={LOGIN_REDIRECT} className="sq-auth-btn sq-auth-btn--ghost">
          <LogIn size={13} strokeWidth={2.2} />
          {copy.login}
        </Link>
        <Link href="/register?redirect=%2Fsalim-qa" className="sq-auth-btn sq-auth-btn--gold">
          {copy.register}
        </Link>
      </div>
    )
  }

  const displayName =
    session.user.name?.split(' ')[0] ||
    session.user.email?.split('@')[0] ||
    (language === 'fr' ? 'Compte' : 'Account')

  return (
    <div className="sq-auth sq-auth--connected">
      {isAdmin ? (
        <span className="sq-access-badge sq-access-badge--pulse">{copy.adminBadge}</span>
      ) : hasFullAccess ? (
        <span className="sq-access-badge">{copy.proBadge}</span>
      ) : (
        <span className="sq-auth-credits">{copy.creditsLeft(creditsRemaining ?? 0)}</span>
      )}
      <span className="sq-auth-user">{copy.connected(displayName)}</span>
      <button
        type="button"
        className="sq-auth-btn sq-auth-btn--ghost"
        onClick={() => signOut()}
      >
        <LogOut size={13} strokeWidth={2.2} />
        {copy.logout}
      </button>
    </div>
  )
}
