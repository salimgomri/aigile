import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { loadIntelligenceSources } from '@/lib/intelligence/load-sources'
import { IntelligenceVitalityFeedDeck } from '@/components/admin/intelligence-vitality-feed-deck'
import { IntelligenceSourcesMatrix } from '@/components/admin/intelligence-sources-matrix'

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
              Matrice des géants · sources d&apos;élite ·{' '}
              <span lang="en">bento · deep search · quality filter</span>
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

      <IntelligenceVitalityFeedDeck />

      <IntelligenceSourcesMatrix data={sources} />
    </div>
  )
}
