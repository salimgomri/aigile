import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rétrospective IA | Outils Retro AI Coaching Agile Luxembourg France',
  description:
    '9 dysfonctions Scrum diagnostiquées par IA - Essai gratuit pour équipes France/Luxembourg/Belgique',
  alternates: { canonical: 'https://aigile.lu/retro' },
}

export default function RetroLayout({ children }: { children: React.ReactNode }) {
  return children
}
