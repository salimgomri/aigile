'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSession } from '@/lib/auth-client'
import { useLanguage } from '@/components/language-provider'
import AppNavbar from '@/components/layout/AppNavbar'
import PremiumFooter from '@/components/landing/premium-footer'
import UpgradeModal from '@/components/UpgradeModal'
import {
  computeRag,
  formToChartPoint,
  getRankProgress,
  type DoraFormInput,
  type DoraRagResult,
} from '@/lib/dora-adapter'
import { pdf } from '@react-pdf/renderer'
import { DoraPdfDocument } from '@/lib/dora-pdf'
import {
  Rocket,
  Clock,
  AlertTriangle,
  Wrench,
  Sparkles,
  FileDown,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format } from 'date-fns'

const formSchema = z.object({
  deployFreq: z.number().min(0).max(100),
  leadTimeHours: z.number().min(0).max(10000),
  cfrPct: z.number().min(0).max(100),
  mttrHours: z.number().min(0).max(10000),
})

type FormValues = z.infer<typeof formSchema>

const RANK_COLORS = {
  elite: 'bg-green-500',
  high: 'bg-green-400',
  medium: 'bg-amber-500',
  low: 'bg-red-500',
}

const RANK_LABELS = { elite: 'ELITE', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' }

interface DoraEntry {
  id: string
  deploy_freq: number
  lead_time_hours: number
  cfr_pct: number
  mttr_hours: number
  created_at: string
}

export default function DoraPage() {
  const { data: session, isPending } = useSession()
  const { language } = useLanguage()
  const router = useRouter()
  const [ragResult, setRagResult] = useState<DoraRagResult | null>(null)
  const [entries, setEntries] = useState<DoraEntry[]>([])
  const [sprints, setSprints] = useState<{ id: string; number: number }[]>([])
  const [teamId, setTeamId] = useState<string | null>(null)
  const [credits, setCredits] = useState(5)
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [loadingRec, setLoadingRec] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deployFreq: 0,
      leadTimeHours: 0,
      cfrPct: 0,
      mttrHours: 0,
    },
  })

  // Redirect dev_team and guest to /
  useEffect(() => {
    if (isPending || !session) return
    const checkRole = async () => {
      try {
        const res = await fetch('/api/niko-niko/team')
        if (res.ok) {
          const data = await res.json()
          const role = data.role
          if (role === 'dev_team' || role === 'guest') {
            router.replace('/')
          } else {
            setTeamId(data.team?.id ?? null)
          }
        }
      } catch {
        // ignore
      }
    }
    checkRole()
  }, [session, isPending, router])

  // Fetch entries and credits when logged in
  useEffect(() => {
    if (!session) return
    fetch('/api/dora/entries')
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .catch(() => {})
    fetch('/api/dora/credits')
      .then((r) => r.json())
      .then((d) => setCredits(d.credits ?? 5))
      .catch(() => {})
  }, [session])

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const input: DoraFormInput = {
        deployFreq: values.deployFreq,
        leadTimeHours: values.leadTimeHours,
        cfrPct: values.cfrPct,
        mttrHours: values.mttrHours,
      }
      setRagResult(computeRag(input))

      if (session && teamId) {
        try {
          await fetch('/api/dora/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              teamId,
              deployFreq: values.deployFreq,
              leadTimeHours: values.leadTimeHours,
              cfrPct: values.cfrPct,
              mttrHours: values.mttrHours,
            }),
          })
          const res = await fetch('/api/dora/entries')
          const data = await res.json()
          setEntries(data.entries || [])
        } catch {
          // ignore
        }
      }
    },
    [session, teamId]
  )

  const handleAiRecommendations = async () => {
    if (!session) {
      router.push('/login?redirect=/dora')
      return
    }
    if (credits < 2) {
      setUpgradeModalOpen(true)
      return
    }
    const values = form.getValues()
    setLoadingRec(true)
    try {
      const res = await fetch('/api/dora/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployFreq: values.deployFreq,
          leadTimeHours: values.leadTimeHours,
          cfrPct: values.cfrPct,
          mttrHours: values.mttrHours,
        }),
      })
      const data = await res.json()
      if (res.status === 402) {
        setUpgradeModalOpen(true)
        return
      }
      setRecommendations(data.recommendations || '')
      if (res.ok) setCredits((c) => Math.max(0, c - 2))
    } catch {
      setRecommendations(language === 'fr' ? 'Erreur lors de la génération.' : 'Error generating recommendations.')
    } finally {
      setLoadingRec(false)
    }
  }

  const handleExportPdf = async () => {
    if (!session) {
      router.push('/login?redirect=/dora')
      return
    }
    if (!ragResult) return
    setLoadingPdf(true)
    try {
      const consumeRes = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dora_pdf' }),
      })
      if (!consumeRes.ok) {
        if (consumeRes.status === 403) setUpgradeModalOpen(true)
        return
      }
      const consumeData = await consumeRes.json()
      const blob = await pdf(
        <DoraPdfDocument
          date={format(new Date(), 'dd/MM/yyyy')}
          deployFreq={form.getValues('deployFreq')}
          leadTimeHours={form.getValues('leadTimeHours')}
          cfrPct={form.getValues('cfrPct')}
          mttrHours={form.getValues('mttrHours')}
          ragResult={ragResult}
          recommendations={recommendations || undefined}
        />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dora-aigile-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      if (consumeData.creditsRemaining !== undefined) setCredits(consumeData.creditsRemaining)
    } catch {
      setUpgradeModalOpen(true)
    } finally {
      setLoadingPdf(false)
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const hasTodayEntry = entries.some((e) => format(new Date(e.created_at), 'yyyy-MM-dd') === today)
  const chartData = [
    ...entries.map((e) =>
      formToChartPoint(
        {
          deployFreq: e.deploy_freq,
          leadTimeHours: e.lead_time_hours,
          cfrPct: e.cfr_pct,
          mttrHours: e.mttr_hours,
        },
        format(new Date(e.created_at), 'yyyy-MM-dd')
      )
    ),
    ...(ragResult && !hasTodayEntry
      ? [
          formToChartPoint(
            {
              deployFreq: form.getValues('deployFreq'),
              leadTimeHours: form.getValues('leadTimeHours'),
              cfrPct: form.getValues('cfrPct'),
              mttrHours: form.getValues('mttrHours'),
            },
            today
          ),
        ]
      : []),
  ].reverse()

  const isFr = language === 'fr'

  return (
    <main className="min-h-screen bg-background">
      <AppNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isFr ? 'Métriques DORA' : 'DORA Metrics'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isFr
            ? 'Calculez vos 4 métriques DORA et visualisez votre niveau de performance.'
            : 'Calculate your 4 DORA metrics and visualize your performance level.'}
        </p>

        {/* 1. Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-card border border-border mb-8"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {isFr ? 'Deployment Frequency' : 'Deployment Frequency'}
            </label>
            <input
              type="number"
              step="0.1"
              {...form.register('deployFreq', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border"
              placeholder="deploys/semaine"
            />
            <p className="text-xs text-muted-foreground mt-1">{isFr ? 'unité : deploys/semaine' : 'unit: deploys/week'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {isFr ? 'Lead Time for Changes' : 'Lead Time for Changes'}
            </label>
            <input
              type="number"
              step="0.5"
              {...form.register('leadTimeHours', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border"
              placeholder="heures"
            />
            <p className="text-xs text-muted-foreground mt-1">{isFr ? 'unité : heures' : 'unit: hours'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CFR {isFr ? '(Change Failure Rate)' : '(Change Failure Rate)'}
            </label>
            <input
              type="number"
              step="0.1"
              {...form.register('cfrPct', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border"
              placeholder="%"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isFr ? 'Taux d\'échec des changements · unité : %' : 'Change failure rate · unit: %'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              MTTR {isFr ? '(Mean Time To Recovery)' : '(Mean Time To Recovery)'}
            </label>
            <input
              type="number"
              step="0.5"
              {...form.register('mttrHours', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border"
              placeholder="heures"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isFr ? 'Temps moyen de restauration · unité : heures' : 'Mean time to recovery · unit: hours'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="px-8 py-3 bg-aigile-gold hover:bg-book-orange text-black font-bold rounded-full"
            >
              {isFr ? 'Calculer →' : 'Calculate →'}
            </button>
          </div>
        </form>

        {/* 2. RAG At-a-Glance */}
        {ragResult && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {isFr ? 'Affichage RAG At-a-Glance' : 'RAG At-a-Glance'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: 'deployFreq', icon: Rocket, label: 'Deploy Freq', data: ragResult.deployFreq },
                { key: 'leadTime', icon: Clock, label: 'Lead Time', data: ragResult.leadTime },
                { key: 'cfr', icon: AlertTriangle, label: 'CFR', sublabel: isFr ? 'Change Failure Rate' : 'Change Failure Rate', data: ragResult.cfr },
                { key: 'mttr', icon: Wrench, label: 'MTTR', sublabel: isFr ? 'Mean Time To Recovery' : 'Mean Time To Recovery', data: ragResult.mttr },
              ].map(({ icon: Icon, label, sublabel, data }) => (
                <div
                  key={label}
                  className={`p-4 rounded-xl border-2 ${
                    data.rank === 'elite' || data.rank === 'high'
                      ? 'border-green-500/50 bg-green-500/10'
                      : data.rank === 'medium'
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-foreground" />
                    <div>
                      <span className="font-semibold text-foreground">{label}</span>
                      {sublabel && (
                        <p className="text-xs text-muted-foreground">{sublabel}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground mb-2">{data.display}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${RANK_COLORS[data.rank]} transition-all`}
                      style={{ width: `${getRankProgress(data.rank) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold mt-1 uppercase">{RANK_LABELS[data.rank]}</p>
                </div>
              ))}
            </div>

            {/* Thresholds table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-semibold">{isFr ? 'Métrique' : 'Metric'}</th>
                    <th className="p-3 text-left text-green-600">Elite</th>
                    <th className="p-3 text-left text-green-500">High</th>
                    <th className="p-3 text-left text-amber-500">Medium</th>
                    <th className="p-3 text-left text-red-500">Low</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-3">Deploy Freq</td><td className="p-3">&gt;1/jour</td><td className="p-3">1/sem–1/jour</td><td className="p-3">1/mois–1/sem</td><td className="p-3">&lt;1/mois</td></tr>
                  <tr><td className="p-3">Lead Time</td><td className="p-3">&lt;1h</td><td className="p-3">1j–1sem</td><td className="p-3">1sem–1mois</td><td className="p-3">&gt;1mois</td></tr>
                  <tr><td className="p-3">CFR (Change Failure Rate)</td><td className="p-3">&lt;5%</td><td className="p-3">5–10%</td><td className="p-3">10–15%</td><td className="p-3">&gt;15%</td></tr>
                  <tr><td className="p-3">MTTR (Mean Time To Recovery)</td><td className="p-3">&lt;1h</td><td className="p-3">&lt;1jour</td><td className="p-3">&lt;1semaine</td><td className="p-3">&gt;1semaine</td></tr>
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-2">{isFr ? 'Seuils DORA (Research 2023)' : 'DORA Thresholds (Research 2023)'}</p>
            </div>
          </div>
        )}

        {/* 3. Charts */}
        {chartData.length >= 2 && (
          <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">{isFr ? 'Tendance' : 'Trend'}</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="deployment_frequency" name="Deploy Freq" stroke="#c9973a" strokeWidth={2} />
                  <Line type="monotone" dataKey="lead_time" name="Lead Time (h)" stroke="#138eec" strokeWidth={2} />
                  <Line type="monotone" dataKey="change_failure_rate" name="CFR (Change Failure Rate) %" stroke="#e8961e" strokeWidth={2} />
                  <Line type="monotone" dataKey="restore_time" name="MTTR (Mean Time To Recovery) h" stroke="#0f2240" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {ragResult && chartData.length < 2 && (
          <p className="text-muted-foreground mb-8">
            {isFr ? 'Saisis au moins 2 sprints pour voir la tendance.' : 'Enter at least 2 sprints to see the trend.'}
          </p>
        )}

        {/* 4. AI Recommendations */}
        <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {isFr ? 'Recommandations IA' : 'AI Recommendations'}
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              🔒 {isFr ? 'Recommandations IA · Pro uniquement' : 'AI Recommendations · Pro only'}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAiRecommendations}
                disabled={!ragResult || loadingRec}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-aigile-gold/20 text-aigile-gold font-medium hover:bg-aigile-gold/30 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isFr ? 'Obtenir des recommandations IA — 1 crédit' : 'Get AI recommendations — 1 credit'}
              </button>
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-aigile-gold/50 text-foreground"
              >
                {isFr ? 'Essayer Pro 19,99€/mois' : 'Try Pro €19.99/mo'}
              </button>
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-aigile-gold/50 text-foreground"
              >
                {isFr ? 'Day Pass 9,99€ — accès 24h' : 'Day Pass €9.99 — 24h access'}
              </button>
            </div>
            {recommendations && (
              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border whitespace-pre-wrap text-foreground">
                {recommendations}
              </div>
            )}
          </div>
        </div>

        {/* 5. PDF Export */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">{isFr ? 'Export PDF' : 'PDF Export'}</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {isFr ? 'Export PDF — 1 crédit' : 'PDF Export — 1 credit'}
          </p>
          <button
            onClick={handleExportPdf}
            disabled={!ragResult || loadingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-aigile-gold/50 hover:bg-aigile-gold/10 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {isFr ? 'Exporter PDF' : 'Export PDF'}
          </button>
        </div>
      </div>
      <PremiumFooter />
      <UpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} toolName="DORA Pro" />
    </main>
  )
}
