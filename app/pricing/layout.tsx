import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs AIgile | Abonnements Coaching Agile Luxembourg France',
  description:
    'Pro €16/mois illimité - Outils AI + Dashboard équipe agile France/Luxembourg/Belgique',
  alternates: { canonical: 'https://aigile.lu/pricing' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
