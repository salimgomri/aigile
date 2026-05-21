'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FileDown, RotateCcw, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import UpgradeModal from '@/components/credits/UpgradeModal'
import { useCredits } from '@/lib/credits/CreditContext'
import { CREDIT_ACTIONS } from '@/lib/credits/actions'
import {
  CADRANS,
  RAG_COLORS,
  SPARK_LABELS,
  TRENDS,
  WORD_MAP,
  type RagColor,
} from '@/lib/dashboard-manager/cadrans'
import { computeGlobalScore, computeVelocityAvg, computeVelocityTrend } from '@/lib/dashboard-manager/score'
import {
  EMPTY_STATE,
  loadDashboardState,
  saveDashboardState,
  clearDashboardStorage,
  type DashboardManagerState,
} from '@/lib/dashboard-manager/storage'
import styles from './dashboard-manager.module.css'

function Editable({
  value,
  onChange,
  placeholder,
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || el.textContent === value) return
    el.textContent = value
  }, [value])
  return (
    <span
      ref={ref}
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={`${styles.editable} ${styles.editableEmpty} ${className}`}
      onInput={(e) => onChange(e.currentTarget.textContent || '')}
    />
  )
}

export default function DashboardManagerEditor() {
  const { language } = useLanguage()
  const { status, refresh: refreshCredits } = useCredits()
  const narrativeCost = CREDIT_ACTIONS.dashboard_narrative.cost
  const canAffordNarrative =
    status?.isUnlimited || (status?.creditsRemaining ?? 0) >= narrativeCost
  const fr = language === 'fr'
  const [state, setState] = useState<DashboardManagerState>(EMPTY_STATE)
  const [hydrated, setHydrated] = useState(false)
  const [narrativeLoading, setNarrativeLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    setState(loadDashboardState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveDashboardState(state)
  }, [state, hydrated])

  const global = useMemo(() => computeGlobalScore(state.ragState), [state.ragState])
  const velocityAvg = useMemo(() => computeVelocityAvg(state.sparkData), [state.sparkData])
  const velocityTrend = useMemo(() => computeVelocityTrend(state.sparkData), [state.sparkData])

  const setRag = useCallback((i: number, rag: RagColor) => {
    setState((s) => {
      const ragState = [...s.ragState]
      ragState[i] = rag
      return { ...s, ragState }
    })
  }, [])

  const applyManualFromAuto = useCallback(() => {
    if (state.manualOverride) return
    const scoreStr = global.scoreRounded === '--' ? '' : String(global.scoreRounded)
    setState((s) => ({
      ...s,
      manualScore: scoreStr,
      manualRag: global.autoRag,
    }))
  }, [state.manualOverride, global])

  useEffect(() => {
    applyManualFromAuto()
  }, [global.scoreRounded, global.autoRag, applyManualFromAuto])

  const handleReset = () => {
    if (!confirm(fr ? 'Réinitialiser tout le template ?' : 'Reset the entire template?')) return
    clearDashboardStorage()
    setState(EMPTY_STATE)
  }

  const handleNarrative = async () => {
    if (!canAffordNarrative) {
      setShowUpgrade(true)
      return
    }
    setNarrativeLoading(true)
    try {
      const res = await fetch('/api/dashboard-manager/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          header: state.header,
          ragState: state.ragState,
          values: state.values,
          globalAuto: {
            score: global.scoreRounded,
            word: global.autoWord,
            v: global.counts.vert,
            a: global.counts.ambre,
            r: global.counts.rouge,
          },
          globalManual: {
            score: state.manualScore,
            rag: state.manualRag,
            comment: state.manualComment,
          },
          velocity: { points: state.sparkData.join(', '), avg: velocityAvg, trend: velocityTrend },
          okr: state.okr,
          language,
        }),
      })
      if (!res.ok) {
        if (res.status === 402 || res.status === 403) setShowUpgrade(true)
        return
      }
      const data = await res.json()
      if (data.narrative) setState((s) => ({ ...s, narrative: data.narrative }))
      await refreshCredits()
    } finally {
      setNarrativeLoading(false)
    }
  }

  const handlePdf = async () => {
    setPdfLoading(true)
    try {
      const res = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dashboard_pdf' }),
      })
      if (!res.ok) {
        if (res.status === 403) setShowUpgrade(true)
        return
      }
      await refreshCredits()
      window.print()
    } finally {
      setPdfLoading(false)
    }
  }

  const autoCol = RAG_COLORS[global.autoRag || '']
  const manualCol = RAG_COLORS[state.manualRag || '']

  const sparkMax = Math.max(...state.sparkData.map((v) => v || 0), 1)

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-white/70">
        {fr ? 'Chargement…' : 'Loading…'}
      </div>
    )
  }

  return (
    <div className="pb-16">
      <div
        className={`${styles.noPrint} mx-auto mb-4 flex max-w-[297mm] flex-wrap items-center gap-3 px-4`}
      >
        <button
          type="button"
          onClick={handlePdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 rounded-sm bg-[#c8a84b] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#b8943e] disabled:opacity-50"
        >
          <FileDown className="h-3.5 w-3.5" />
          {fr ? 'Exporter PDF' : 'Export PDF'}
          <span className="opacity-70">· 1 cr.</span>
        </button>

        <button
          type="button"
          onClick={handleNarrative}
          disabled={narrativeLoading || !canAffordNarrative}
          className="inline-flex items-center gap-2 rounded-sm bg-[#c9973a] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-[#E8961E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {fr ? 'Narrative IA (P25)' : 'AI narrative (P25)'}
          <span className="opacity-80">
            · {narrativeCost} cr.
          </span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-sm bg-[#0d0d0d] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#333]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {fr ? 'Réinitialiser' : 'Reset'}
        </button>

        <span className="text-[10px] text-white/50">
          {fr
            ? 'Imprimer → Enregistrer en PDF · Paysage A4 · Marges : aucune'
            : 'Print → Save as PDF · A4 landscape · No margins'}
        </span>
      </div>

      <div className={styles.sheet}>
        {/* Header */}
        <div className="flex items-end justify-between border-b-2 border-[#0d0d0d] pb-[3mm]">
          <div>
            <div className="mb-0.5 text-[7.5pt] font-semibold uppercase tracking-[0.15em] text-[#888]">
              <span className="text-[#c8a84b]">AI</span>gile · Le Système S.A.L.I.M.
            </div>
            <div className="text-[14pt] font-bold tracking-tight">Dashboard Manager</div>
          </div>
          <div className="flex items-end gap-[5mm]">
            {(
              [
                ['team', fr ? 'Équipe' : 'Team', fr ? 'Équipe' : 'Team'],
                ['sprint', 'Sprint', 'N°'],
                ['period', fr ? 'Période' : 'Period', fr ? 'Mois / Année' : 'Month / Year'],
                ['sm', 'SM', fr ? 'Nom SM' : 'SM name'],
              ] as const
            ).map(([key, lbl, ph]) => (
              <div key={key} className="flex flex-col items-end gap-0.5">
                <div className="text-[6pt] font-semibold uppercase tracking-wider text-[#888]">{lbl}</div>
                <div className="min-w-[20mm] text-right text-[8.5pt] font-semibold">
                  <Editable
                    value={state.header[key]}
                    onChange={(v) =>
                      setState((s) => ({ ...s, header: { ...s.header, [key]: v } }))
                    }
                    placeholder={ph}
                  />
                </div>
              </div>
            ))}
            <div className="ml-[4mm] flex items-center gap-[3.5mm] border-l border-[#dedede] pl-[4mm]">
              {[
                { c: '#1A7A3C', t: fr ? 'Attendu' : 'On track', icon: '✓' },
                { c: '#B85C00', t: fr ? 'Tension' : 'Watch', icon: '!' },
                { c: '#B01B1B', t: fr ? 'Action' : 'Act', icon: '✕' },
              ].map((leg) => (
                <div key={leg.t} className="flex items-center gap-1 text-[6.5pt] text-[#888]">
                  <div
                    className="flex h-[9px] w-[9px] shrink-0 items-center justify-center rounded-full text-[5.5px] font-bold text-white"
                    style={{ background: leg.c }}
                  >
                    {leg.icon}
                  </div>
                  {leg.t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cadrans */}
        <div className="grid grid-cols-6 gap-[2.5mm]">
          {CADRANS.map((c, i) => {
            const rag = state.ragState[i]
            const col = RAG_COLORS[rag]
            return (
              <div
                key={c.id}
                className="flex flex-col gap-[1.5mm] rounded-[3px] border-[1.5px] p-[3mm] transition-colors"
                style={{ background: col.bg, borderColor: col.border }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="text-[7pt] font-bold uppercase tracking-wide"
                    style={{ color: col.text }}
                  >
                    {c.title}
                  </div>
                  <div className={`${styles.ragSel} flex gap-0.5`}>
                    {(['vert', 'ambre', 'rouge'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        title={r}
                        className={`flex h-3 w-3 items-center justify-center rounded-full text-[6.5px] font-bold text-white transition ${rag === r ? 'scale-110 opacity-100' : 'opacity-25 hover:opacity-55'}`}
                        style={{
                          background:
                            r === 'vert' ? '#1A7A3C' : r === 'ambre' ? '#B85C00' : '#B01B1B',
                        }}
                        onClick={() => setRag(i, r)}
                      >
                        {r === 'vert' ? '✓' : r === 'ambre' ? '!' : '✕'}
                      </button>
                    ))}
                  </div>
                </div>

                {c.type === 'binary' ? (
                  <div
                    className="text-[18pt] font-bold leading-none"
                    style={{ color: rag ? col.text : 'rgba(0,0,0,.18)' }}
                  >
                    {rag ? WORD_MAP[rag] : '--'}
                  </div>
                ) : (
                  <div
                    className="flex items-baseline gap-[1mm] font-mono text-[16pt] font-semibold leading-none"
                    style={{ color: rag ? col.text : 'rgba(0,0,0,.18)' }}
                  >
                    <Editable
                      value={state.values[i]}
                      onChange={(v) => {
                        const values = [...state.values]
                        values[i] = v
                        setState((s) => ({ ...s, values }))
                      }}
                      placeholder={c.ph ?? ''}
                      className={styles.cvalInput}
                    />
                    <button
                      type="button"
                      className={`${styles.trendBtn} text-[10pt] opacity-50 hover:opacity-100`}
                      style={{ color: rag ? col.text : undefined }}
                      onClick={() => {
                        const trends = [...state.trends]
                        trends[i] = (trends[i] + 1) % 3
                        setState((s) => ({ ...s, trends }))
                      }}
                    >
                      {TRENDS[state.trends[i]]}
                    </button>
                  </div>
                )}

                <div className="text-[6pt] leading-snug" style={{ color: col.subtext }}>
                  {c.desc.split('\n').map((line, li) => (
                    <span key={li}>
                      {li > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </div>

                {c.type === 'binary' && (
                  <>
                    <div
                      className="mt-[1mm] text-[5.5pt] font-bold uppercase tracking-wider"
                      style={{ color: col.subtext }}
                    >
                      Note
                    </div>
                    <Editable
                      value={state.notes[i]}
                      onChange={(v) => {
                        const notes = [...state.notes]
                        notes[i] = v
                        setState((s) => ({ ...s, notes }))
                      }}
                      placeholder={fr ? 'Commentaire…' : 'Comment…'}
                      className={`${styles.bnote} min-h-4 rounded-[2px] border px-1 py-0.5 text-[6.5pt] italic leading-snug`}
                    />
                  </>
                )}

                <div
                  className="mt-auto border-t pt-[1.5mm] font-mono text-[5.5pt]"
                  style={{ borderColor: col.seuilBorder }}
                >
                  {c.seuils.map((s, si) => (
                    <div
                      key={s}
                      style={{
                        color: rag
                          ? col.seuil ?? col.subtext
                          : si === 0
                            ? '#1A7A3C'
                            : si === 1
                              ? '#B85C00'
                              : '#B01B1B',
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Note globale */}
        <div className="flex overflow-hidden rounded-[3px] border-[1.5px] border-[#dedede]">
          <div
            className="flex min-w-[58mm] flex-col gap-0.5 border-r-[1.5px] p-[3mm_4mm] transition-colors"
            style={{ background: autoCol.bg, borderColor: autoCol.border }}
          >
            <div className="text-[6pt] font-bold uppercase tracking-wider" style={{ color: autoCol.subtext }}>
              {fr ? 'Note globale (auto)' : 'Global score (auto)'}
            </div>
            <div className="flex items-baseline gap-[2mm] font-mono text-[22pt] font-bold leading-none">
              <span style={{ color: global.autoRag ? autoCol.text : 'rgba(0,0,0,.18)' }}>
                {global.scoreRounded}
              </span>
              <span className="text-[11pt] opacity-50" style={{ color: global.autoRag ? autoCol.text : undefined }}>
                / 6
              </span>
            </div>
            <div className="text-[8pt] font-bold" style={{ color: global.autoRag ? autoCol.text : 'rgba(0,0,0,.18)' }}>
              {global.autoWord}
            </div>
            <div className="mt-[1mm] text-[6pt]" style={{ color: autoCol.subtext }}>
              V:{global.counts.vert} A:{global.counts.ambre} R:{global.counts.rouge}
            </div>
          </div>

          <div
            className="flex flex-1 flex-col gap-0.5 p-[3mm_4mm] transition-colors"
            style={{ background: manualCol.bg }}
          >
            <div className="flex items-center gap-[3mm]">
              <div className="text-[6pt] font-bold uppercase tracking-wider" style={{ color: manualCol.subtext }}>
                {fr ? 'Note manuelle' : 'Manual score'}
              </div>
              {state.manualOverride && (
                <span
                  className={`${styles.ngOverrideBadge} rounded-[10px] bg-black/10 px-1.5 py-px text-[5.5pt]`}
                  style={{ color: manualCol.text }}
                >
                  {fr ? 'modifié' : 'edited'}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-[2mm] font-mono text-[22pt] font-bold leading-none">
              <Editable
                value={state.manualScore}
                onChange={(v) =>
                  setState((s) => ({ ...s, manualOverride: true, manualScore: v }))
                }
                placeholder="--"
                className={styles.ngManualInput}
              />
              <span className="text-[11pt] opacity-50" style={{ color: state.manualRag ? manualCol.text : undefined }}>
                / 6
              </span>
            </div>
            <div className={`${styles.ngRagBtns} flex gap-[3mm] mt-[2mm]`}>
              {(['vert', 'ambre', 'rouge'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`rounded-[2px] border-[1.5px] border-transparent px-2 py-0.5 text-[7pt] font-bold text-white transition ${state.manualRag === r ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                  style={{
                    background: r === 'vert' ? '#1A7A3C' : r === 'ambre' ? '#B85C00' : '#B01B1B',
                  }}
                  onClick={() =>
                    setState((s) => ({ ...s, manualOverride: true, manualRag: r }))
                  }
                >
                  {r === 'vert' ? 'Vert' : r === 'ambre' ? 'Ambre' : 'Rouge'}
                </button>
              ))}
            </div>
            <div className="mt-[2mm] text-[6pt] font-bold uppercase tracking-wider" style={{ color: manualCol.subtext }}>
              {fr ? 'Commentaire' : 'Comment'}
            </div>
            <Editable
              value={state.manualComment}
              onChange={(v) =>
                setState((s) => ({ ...s, manualOverride: true, manualComment: v }))
              }
              placeholder={
                fr
                  ? 'Justification si note manuelle différente du calcul auto…'
                  : 'Rationale if manual score differs from auto…'
              }
              className={`${styles.ngComment} block w-full text-[7pt] italic leading-snug`}
            />
            {state.manualOverride && (
              <button
                type="button"
                className={`${styles.ngResetBtn} mt-[2mm] text-left text-[6pt] underline`}
                style={{ color: manualCol.text }}
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    manualOverride: false,
                    manualComment: '',
                    manualRag: global.autoRag,
                    manualScore: global.scoreRounded === '--' ? '' : String(global.scoreRounded),
                  }))
                }
              >
                {fr ? 'Revenir au calcul auto' : 'Revert to auto score'}
              </button>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[1.65fr_1fr] gap-[4mm]">
          <div className="flex flex-col gap-[2mm] rounded-[3px] border-[1.5px] border-[#dedede] bg-[#f2f2f2] p-[3mm_4mm]">
            <div className="text-[7pt] font-bold uppercase tracking-wide">
              {fr ? 'Vélocité — 6 derniers sprints' : 'Velocity — last 6 sprints'}
            </div>
            <div className={`${styles.sparkInputRow} flex gap-[2mm]`}>
              {SPARK_LABELS.map((lbl, i) => (
                <div key={lbl} className="flex flex-1 flex-col items-center gap-px">
                  <label className="font-mono text-[5.5pt] text-[#888]">{lbl}</label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    placeholder="pts"
                    value={state.sparkData[i] ?? ''}
                    onChange={(e) => {
                      const sparkData = [...state.sparkData]
                      sparkData[i] = e.target.value ? parseInt(e.target.value, 10) : null
                      setState((s) => ({ ...s, sparkData }))
                    }}
                    className={`w-full rounded-[2px] border px-0.5 py-0.5 text-center font-mono text-[7.5pt] font-semibold outline-none focus:border-[#c8a84b] ${i === 5 ? 'border-[#0d0d0d] bg-[#0d0d0d] text-white' : 'border-[#dedede] bg-white'}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex min-h-[55px] flex-1 items-end gap-[3mm] pt-[2mm]">
              {state.sparkData.map((v, i) => {
                const val = v || 0
                const h = val ? Math.max(4, Math.round((val / sparkMax) * 50)) : 4
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-[1.5mm]">
                    <div className="text-center font-mono text-[6pt] font-semibold">{val || ''}</div>
                    <div
                      className={`w-full rounded-t-[2px] ${i === 5 ? 'bg-[#0d0d0d]' : 'bg-[#d0d0d0]'}`}
                      style={{ height: h }}
                    />
                    <div className="text-center font-mono text-[5.5pt] text-[#888]">
                      {SPARK_LABELS[i].replace(' actuel', '')}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-[6.5pt] text-[#888]">
              {fr ? 'Moy. 3 sprints' : 'Avg. 3 sprints'} :{' '}
              <strong className="font-mono text-[#0d0d0d]">{velocityAvg}</strong>
              {' · '}
              {fr ? 'Tendance' : 'Trend'} : <span>{velocityTrend}</span>
            </div>
          </div>

          <div className="flex flex-col gap-[2mm] rounded-[3px] bg-[#0d0d0d] p-[3mm_4mm]">
            <div className="text-[7pt] font-bold uppercase tracking-wide text-white/45">OKR Check-in</div>
            <div className="border-b border-white/10 pb-[2mm] text-[7.5pt] font-semibold leading-snug text-white">
              <Editable
                value={state.okr.objective}
                onChange={(v) => setState((s) => ({ ...s, okr: { ...s.okr, objective: v } }))}
                placeholder={fr ? 'Objectif OKR du trimestre…' : 'Quarter OKR objective…'}
              />
            </div>
            {(
              [
                ['advance', fr ? 'Avancé' : 'Progress'],
                ['block', fr ? 'Frein' : 'Blocker'],
                ['adjust', fr ? 'Ajustement' : 'Adjustment'],
              ] as const
            ).map(([key, lbl]) => (
              <div key={key}>
                <div className="text-[5.5pt] font-bold uppercase tracking-wider text-white/35">{lbl}</div>
                <div className="text-[7pt] italic leading-snug text-white/80">
                  <Editable
                    value={state.okr[key]}
                    onChange={(v) => setState((s) => ({ ...s, okr: { ...s.okr, [key]: v } }))}
                    placeholder="…"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative */}
        <div className="flex gap-[4mm] rounded-[3px] border-[1.5px] border-[#dedede] bg-[#f4f4f4] p-[3mm_4mm]">
          <div
            className="shrink-0 self-center text-[6pt] font-bold uppercase tracking-wider text-[#888]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {fr ? 'Narrative IA' : 'AI narrative'}
          </div>
          <Editable
            value={state.narrative}
            onChange={(v) => setState((s) => ({ ...s, narrative: v }))}
            placeholder={
              fr
                ? 'Générez la narrative (2 crédits) ou collez le texte P25 — factuel, orienté action, 200 mots max.'
                : 'Generate narrative (2 credits) or paste P25 text — factual, action-oriented, 200 words max.'
            }
            className={`${styles.narBody} min-h-7 flex-1 text-[7pt] italic leading-relaxed`}
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#d0d0d0] pt-[2mm]">
          <div className="text-[6pt] text-[#888]">
            Dashboard {fr ? 'généré via' : 'via'}{' '}
            <strong className="font-semibold text-[#c8a84b]">aigile.lu</strong> · Le Système S.A.L.I.M. · Prompt P25
          </div>
          <div className="font-mono text-[6pt] text-[#888]">
            Sprint {state.header.sprint || '--'} · {state.header.period || '--'} ·{' '}
            {fr ? 'Mis à jour par le SM' : 'Updated by SM'}
          </div>
        </div>
      </div>

      {showUpgrade && <UpgradeModal open onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}
