import Link from 'next/link'
import { IBM_Plex_Sans, Inter } from 'next/font/google'

import { AdminIntelligenceClient } from '@/components/admin/admin-intelligence-client'
import { loadIntelligenceSources } from '@/lib/intelligence/load-sources'

import './intelligence-apple.css'

const interIntel = Inter({
  subsets: ['latin'],
  variable: '--font-inter-intel',
  display: 'swap',
})

const ibmIntel = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-intel',
  display: 'swap',
})

export default function AdminIntelligencePage() {
  const sources = loadIntelligenceSources()

  return (
    <div className={`${interIntel.variable} ${ibmIntel.variable} min-h-[calc(100vh-4rem)]`}>
      <div className="border-b border-[var(--ia-line,#e6e6ec)] bg-[#fbfbfd]/90 px-4 py-2 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2 text-sm">
          <Link href="/admin/orders" className="font-medium text-[#353a45] underline-offset-4 hover:text-[#0b1220] hover:underline">
            ← Administration
          </Link>
          <span className="text-[#6e7480]">Intelligence · charte « Veilles » (UTC)</span>
        </div>
      </div>
      <AdminIntelligenceClient sources={sources} />
    </div>
  )
}
