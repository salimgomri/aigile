import type { Metadata } from 'next'
import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { KitForm } from '@/components/kit/KitForm'
import { CtaLink } from '@/components/home-v2/CtaLink'
import {
  BOOK_PAGES,
  DIAGNOSTIC_URL,
  TAGLINE_IA,
  getContactEmail,
  yearsOfExperience,
} from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Kit gratuit : 5 signaux que votre livraison dérape | AIgile',
  description:
    "Auto-diagnostic en 10 minutes, 5 prompts IA prêts à l'emploi et une checklist DoR/DoD pour repérer un retard de livraison avant votre prochain comité. Gratuit.",
}

export default function KitPage() {
  const years = yearsOfExperience()
  const contact = getContactEmail()

  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy">
      <PremiumNavbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-book-orange mb-3">
            Kit gratuit · Managers, Scrum Masters, Product Owners · Banque et assurance
          </p>
          <h1 className="text-4xl font-bold mb-4">
            Livraison en retard : les 5 signaux à repérer avant votre prochain comité
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Et comment l&apos;IA aide à les corriger, sans lui laisser la décision. Un kit PDF de 10
            pages, à remplir seul ou avec votre équipe en 10 minutes.
          </p>
          <ul className="space-y-3 mb-10 text-gray-800">
            <li>
              <strong>Savoir où ça coince, en 10 minutes</strong> : un auto-diagnostic noté sur 15
              affirmations concrètes.
            </li>
            <li>
              <strong>Arriver au comité avec des faits</strong> : l&apos;écart entre ce qui est
              « fini » dans l&apos;outil et ce qui est réellement livré.
            </li>
            <li>
              <strong>Gagner du temps avec l&apos;IA, sans perdre la main</strong> : 5 prompts et une
              grille de vérification humaine.
            </li>
            <li>
              <strong>Une checklist DoR / DoD « IA incluse »</strong>.
            </li>
            <li>
              <strong>Pensé pour les environnements régulés</strong>.
            </li>
          </ul>
          <p className="text-sm text-gray-700 mb-8">
            Écrit par Salim Gomri, coach agile depuis 2003 ({years} ans de terrain) et auteur du{' '}
            <em>Système S.A.L.I.M.</em> ({BOOK_PAGES} pages). <em>{TAGLINE_IA}</em>
          </p>
          <div className="rounded-2xl bg-white border border-black/10 p-6">
            <KitForm source="kit" contactEmail={contact} />
          </div>
          <p className="mt-8 text-sm">
            Vous préférez en parler directement ? Le diagnostic flash dure 30 minutes, il est
            gratuit.{' '}
            <CtaLink href={DIAGNOSTIC_URL} cta="diagnostic-kit" variant="home-v2" className="underline font-semibold">
              Réserver un diagnostic
            </CtaLink>
          </p>
          <p className="mt-4 text-sm">
            <Link href="/" className="underline">
              ← Accueil
            </Link>
          </p>
        </div>
      </div>
      <PremiumFooter />
    </main>
  )
}
