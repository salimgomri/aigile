import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Manager | Le Système S.A.L.I.M. | AIgile',
  description:
    'Tableau de bord manager — 6 cadrans RAG, vélocité, OKR et narrative IA pour Scrum Masters et managers agile.',
  alternates: { canonical: 'https://aigile.lu/dashboard-manager' },
}

export default function DashboardManagerLayout({ children }: { children: React.ReactNode }) {
  return children
}
