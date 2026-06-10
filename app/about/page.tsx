import type { Metadata } from 'next'
import './about.css'
import { AboutClient } from './about-client'

export const metadata: Metadata = {
  title: { absolute: 'Salim Gomri — Agile Coach & Auteur | AIgile' },
  description:
    "Coaching agile, livre Le Système S.A.L.I.M., 21 ans d'expérience terrain. Luxembourg et remote.",
}

export default function AboutPage() {
  return <AboutClient />
}
