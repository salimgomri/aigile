import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { AdminIntelligenceClient } from '@/components/admin/admin-intelligence-client'
import { loadIntelligenceSources } from '@/lib/intelligence/load-sources'

export default function AdminIntelligencePage() {
  const sources = loadIntelligenceSources()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-9 w-9 text-aigile-gold/90" aria-hidden />
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Intelligence</h1>
            <p className="text-sm text-muted-foreground">
              Sources Visionnaires, Empire, Wealth… · lecture · transcripts · export
            </p>
          </div>
        </div>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-aigile-gold hover:text-book-orange"
        >
          ← Administration
        </Link>
      </div>

      <AdminIntelligenceClient sources={sources} />
    </div>
  )
}
