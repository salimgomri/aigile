import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import ComingSoonTool from '@/components/feature-flag/ComingSoonTool'
import ToolAccessDenied from '@/components/feature-flag/ToolAccessDenied'
import { SalimQaExplorer } from '@/components/salim-qa/SalimQaExplorer'
import { getFeatureFlag } from '@/lib/feature-flags'
import { canAccessTool, shouldShowComingSoon } from '@/lib/tool-access'
import { Hanken_Grotesk, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import './salim-qa.css'

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'S.A.L.I.M. Q&A Lab | AIgile',
  description:
    'Bibliothèque de questions du Système S.A.L.I.M. — recherche, filtres, réponses extraites ou complètes.',
}

export default async function SalimQaPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const flag = await getFeatureFlag('salim_qa')
  if (!flag) notFound()

  const h = await headers()
  const accept = h.get('accept-language') || ''
  const lang = accept.toLowerCase().startsWith('en') ? 'en' : 'fr'

  if (await shouldShowComingSoon('salim_qa', session?.user?.email, { userId: session?.user?.id })) {
    return (
      <main className={`${hanken.variable} ${instrument.variable} ${jetbrains.variable} min-h-screen bg-[#F6F6F4]`}>
        <ComingSoonTool flag={flag} language={lang} />
      </main>
    )
  }

  if (!(await canAccessTool('salim_qa', session?.user?.email, { userId: session?.user?.id }))) {
    return (
      <ToolAccessDenied
        toolLabel={lang === 'fr' ? flag.label_fr : flag.label_en}
        language={lang}
      />
    )
  }

  return (
    <main className={`${hanken.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <SalimQaExplorer language={lang} />
    </main>
  )
}
