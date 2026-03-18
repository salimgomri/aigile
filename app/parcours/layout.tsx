import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parcours',
  description:
    'Lanceur, Stabilisateur, Mesureur ou Augmenteur — identifiez votre profil et découvrez les chapitres et outils adaptés.',
  alternates: { canonical: 'https://aigile.lu/parcours' },
}

export default function ParcoursLayout({ children }: { children: React.ReactNode }) {
  return children
}
