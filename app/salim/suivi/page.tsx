import type { Metadata } from 'next'
import type { SalimFormatCount } from '@/lib/salim/suivi-summary'
import '../salim.css'

export const metadata: Metadata = {
  title: 'Suivi S.A.L.I.M.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const WINDOW_DAYS = 14

function isListedAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase())
}

export default async function SalimSuiviPage() {
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
  let visits: { extrait: number; achat: number } | null = null
  let orders: SalimFormatCount[] | null = null

  if (
    process.env.ADMIN_EMAILS &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { headers } = await import('next/headers')
      const { auth } = await import('@/lib/auth')
      const h = await headers()
      const session = await auth.api.getSession({ headers: h })
      if (isListedAdmin(session?.user?.email)) {
        const suivi = await import('@/lib/salim/suivi')
        visits = await suivi.readSalimLinkVisits(since)
        orders = await suivi.readSalimPaidOrdersByFormat(since)
      }
    } catch (error) {
      console.error('[salim/suivi]', error)
    }
  }

  return (
    <main className="salim-page min-h-screen bg-white text-aigile-navy">
      <article className="excerpt-article">
        <p className="excerpt-kicker">Lecture</p>
        <h1 className="text-3xl font-bold mb-4">Visites et commandes payées</h1>
        <p className="mb-6">
          Fenêtre : {WINDOW_DAYS} jours, depuis {since.slice(0, 10)}. Les visites comptent une fois par
          navigateur et par lien. Les commandes payées sont les statuts paid, fulfilled, shipped et complete,
          hors coupon TEST100 et hors montant nul.
        </p>
        {visits && orders ? (
          <>
            <h2 className="text-xl font-bold mt-8 mb-2">Visites par lien</h2>
            <ul>
              <li>Extrait (/salim/extrait) : {visits.extrait}</li>
              <li>Achat (/salim/achat) : {visits.achat}</li>
            </ul>
            <h2 className="text-xl font-bold mt-8 mb-2">Commandes payées par format</h2>
            <ul>
              {orders.map((row) => (
                <li key={row.format}>
                  {row.format} : {row.paidOrders}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Ces chiffres se lisent avec un compte admin. La page ne les affiche pas sans session.</p>
        )}
      </article>
    </main>
  )
}
