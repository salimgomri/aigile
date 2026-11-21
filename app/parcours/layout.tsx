import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parcours',
  description:
    'Lanceur, Stabilisateur, Mesureur ou Augmenteur — identifiez votre profil et découvrez les chapitres et outils adaptés.',
  robots: { index: false, follow: false },
}

export default function ParcoursLayout({ children }: { children: React.ReactNode }) {
  return children
}
