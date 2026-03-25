import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'

type Props = {
  toolLabel: string
  language: 'fr' | 'en'
}

export default function ToolAccessDenied({ toolLabel, language }: Props) {
  const copy =
    language === 'fr'
      ? {
          title: 'Accès sur invitation',
          body: `L’outil « ${toolLabel} » est réservé aux comptes autorisés. Si vous pensez devoir y accéder, contactez-nous.`,
          home: 'Retour à l’accueil',
        }
      : {
          title: 'Invitation-only access',
          body: `« ${toolLabel} » is available to authorized accounts only. If you believe you should have access, please get in touch.`,
          home: 'Back to home',
        }

  return (
    <main className="min-h-screen bg-background">
      <PremiumNavbar />
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{copy.title}</h1>
        <p className="text-muted-foreground leading-relaxed">{copy.body}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-aigile-gold hover:bg-book-orange text-black font-semibold px-6 py-3 text-sm"
        >
          {copy.home}
        </Link>
      </div>
      <PremiumFooter />
    </main>
  )
}
