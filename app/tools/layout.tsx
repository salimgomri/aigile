import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Outils AIgile | Retro AI Coaching Agile Luxembourg France Belgique',
  description:
    'Essai gratuit Retro AI (9 dysfonctions Scrum) + Niko-Niko pour équipes France/Luxembourg/Belgique',
  openGraph: {
    title: 'Outils AI Retro | Agile Coaching Luxembourg/France',
    images: ['/images/book-cover.jpg'],
    url: 'https://aigile.lu/tools',
  },
  alternates: { canonical: 'https://aigile.lu/tools' },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children
}
