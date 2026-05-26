import { Suspense } from 'react'
import SalimMerciContent from './salim-merci-content'

export const metadata = {
  title: 'Commande confirmée · Le Système S.A.L.I.M.',
  robots: { index: false, follow: false },
}

export default function SalimMerciPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-aigile-navy/60 text-sm">Chargement…</p>
        </main>
      }
    >
      <SalimMerciContent />
    </Suspense>
  )
}
