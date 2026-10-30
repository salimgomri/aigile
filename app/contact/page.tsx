import type { Metadata } from 'next'
import Link from 'next/link'
import PremiumNavbar from '@/components/premium-navbar'
import PremiumFooter from '@/components/landing/premium-footer'
import { DIAGNOSTIC_URL, LEGAL, getContactEmail } from '@/lib/site-facts'

export const metadata: Metadata = {
  title: 'Contact | AIgile',
  description: 'Contacter Salim Gomri — AIgile.lu',
}

export default function ContactPage() {
  const email = getContactEmail()

  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy">
      <PremiumNavbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="mb-4">
            {LEGAL.legalName} ({LEGAL.commercialName}) · {LEGAL.address}
          </p>
          <p className="mb-6">
            E-mail :{' '}
            {email.includes('@') ? (
              <a className="underline" href={`mailto:${email}`}>
                {email}
              </a>
            ) : (
              <mark className="todo-mark">{email}</mark>
            )}
          </p>
          <p>
            Pour un échange de 30 minutes :{' '}
            <Link href={DIAGNOSTIC_URL} className="underline font-semibold">
              réserver un diagnostic flash
            </Link>
            .
          </p>
        </div>
      </div>
      <PremiumFooter />
    </main>
  )
}
