import Link from 'next/link'
import { getStripeReadClient } from '@/lib/stripe-read'
import { paymentStatusPaid, productFromSession } from '@/lib/downloads/session-guards'
import { getSupportEmail, DIAGNOSTIC_URL } from '@/lib/site-facts'
import { LegalFooterLinks } from '@/components/legal/LegalFooterLinks'
import { Price } from '@/components/ui/Price'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Téléchargement',
  robots: { index: false, follow: false },
}

export default async function TelechargementPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const support = getSupportEmail()

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-[#f3ede7] text-aigile-navy px-4 py-16">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">Lien invalide</h1>
          <p className="mb-4">Ce lien de téléchargement est incomplet.</p>
          <p>
            Support : {support.includes('@') ? <a className="underline" href={`mailto:${support}`}>{support}</a> : <mark className="todo-mark">{support}</mark>}
          </p>
        </div>
      </main>
    )
  }

  const stripe = getStripeReadClient()
  if (!stripe) {
    return <Fail support={support} />
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })
  } catch {
    return <Fail support={support} />
  }

  if (!paymentStatusPaid(session)) {
    return <Fail support={support} title="Paiement non confirmé" />
  }

  const product = productFromSession(session)
  if (!product) {
    return <Fail support={support} title="Paiement non confirmé" />
  }

  const firstName =
    session.customer_details?.name?.split(' ')[0] ||
    (session.metadata?.buyer_name as string | undefined) ||
    ''

  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy px-4 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2">Merci{firstName ? ` ${firstName}` : ''}</h1>
        <p className="mb-6">Votre commande <strong>{product.nom}</strong> est confirmée.</p>
        {product.fichierCle ? (
          <a
            href={`/api/telechargement?session_id=${encodeURIComponent(sessionId)}&produit=${encodeURIComponent(product.slug)}`}
            className="inline-flex min-h-[48px] items-center rounded-full bg-aigile-gold px-6 py-3 font-semibold text-aigile-navy"
          >
            Télécharger
          </a>
        ) : (
          <p>Ce produit n&apos;a pas de fichier à télécharger (livre papier ou place de formation).</p>
        )}
        <p className="mt-6 text-sm text-gray-600">Votre reçu arrive par e-mail.</p>
        <p className="text-sm mt-2">
          Support :{' '}
          {support.includes('@') ? (
            <a className="underline" href={`mailto:${support}`}>
              {support}
            </a>
          ) : (
            <mark className="todo-mark">{support}</mark>
          )}
        </p>
        <p className="text-xs mt-2">
          <Price amount={product.prix / 100} audience={product.audience} />
        </p>
        <div className="mt-10 flex flex-col gap-3">
          <Link href="/kit" className="underline">
            Recevoir le kit gratuit
          </Link>
          <Link href={DIAGNOSTIC_URL} className="underline">
            Réserver un diagnostic de 30 min
          </Link>
        </div>
        <LegalFooterLinks className="mt-16" />
      </div>
    </main>
  )
}

function Fail({
  support,
  title = 'Paiement non confirmé',
}: {
  support: string
  title?: string
}) {
  return (
    <main className="min-h-screen bg-[#f3ede7] text-aigile-navy px-4 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p>
          Support :{' '}
          {support.includes('@') ? (
            <a className="underline" href={`mailto:${support}`}>
              {support}
            </a>
          ) : (
            <mark className="todo-mark">{support}</mark>
          )}
        </p>
      </div>
    </main>
  )
}
