'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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
import './dashboard-manager-print.css'

const RAG_BTN_BG = { vert: '#1A7A3C', ambre: '#B85C00', rouge: '#B01B1B' } as const

function Editable({
  value,
  onChange,
  placeholder,
  className = '',
  style,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  className?: string
  style?: CSSProperties
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
      style={style}
      onInput={(e) => onChange(e.currentTarget.textContent || '')}
    />
  )
}

function PrintRagMark({ rag }: { rag: RagColor }) {
  if (!rag) return null
  const sym = rag === 'vert' ? '✓' : rag === 'ambre' ? '!' : '✕'
  return (
    <span className={`${styles.printRag} dm-printOnly`} style={{ color: RAG_COLORS[rag].text }}>
      {sym}
    </span>
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

  useEffect(() => {
    const onBefore = () => window.scrollTo(0, 0)
    window.addEventListener('beforeprint', onBefore)
    return () => window.removeEventListener('beforeprint', onBefore)
  }, [])

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
    <div className={styles.root} data-dashboard-manager-print>
      <div className={`${styles.controls} dm-screenOnly`} data-no-print>
        <button
          type="button"
          onClick={handlePdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 rounded-sm bg-[#c8a84b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#b8943e] disabled:opacity-50"
        >
          <FileDown className="h-4 w-4" />
          {fr ? 'Exporter PDF' : 'Export PDF'}
          <span className="opacity-70">· 1 cr.</span>
        </button>

        <button
          type="button"
          onClick={handleNarrative}
          disabled={narrativeLoading || !canAffordNarrative}
          className="inline-flex items-center gap-2 rounded-sm bg-[#c9973a] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#E8961E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {fr ? 'Narrative IA (P25)' : 'AI narrative (P25)'}
          <span className="opacity-80">· {narrativeCost} cr.</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-sm bg-[#0d0d0d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#333]"
        >
          <RotateCcw className="h-4 w-4" />
          {fr ? 'Réinitialiser' : 'Reset'}
        </button>

        <p className="w-full text-xs leading-relaxed text-white/55 sm:w-auto">
          {fr
            ? 'PDF : Paysage · A4 · Marges « Aucune » · Cocher « Graphiques d’arrière-plan »'
            : 'PDF: Landscape · A4 · Margins None · Enable Background graphics'}
        </p>
      </div>

      <div className={`${styles.sheet} dm-sheet`}>
        <header className={styles.header}>
          <div>
            <div className={styles.brand}>
              <span className={styles.brandGold}>AI</span>gile · Le Système S.A.L.I.M.
            </div>
            <h1 className={styles.title}>Dashboard Manager</h1>
          </div>
          <div className={styles.headerMeta}>
            {(
              [
                ['team', fr ? 'Équipe' : 'Team', fr ? 'Équipe' : 'Team'],
                ['sprint', 'Sprint', 'N°'],
                ['period', fr ? 'Période' : 'Period', fr ? 'Mois / Année' : 'Month / Year'],
                ['sm', 'SM', fr ? 'Nom SM' : 'SM name'],
              ] as const
            ).map(([key, lbl, ph]) => (
              <div key={key} className={styles.metaField}>
                <div className={styles.metaLbl}>{lbl}</div>
                <div className={styles.metaVal}>
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
            <div className={styles.legend}>
              {[
                { c: '#1A7A3C', t: fr ? 'Attendu' : 'On track', icon: '✓' },
                { c: '#B85C00', t: fr ? 'Tension' : 'Watch', icon: '!' },
                { c: '#B01B1B', t: fr ? 'Action' : 'Act', icon: '✕' },
              ].map((leg) => (
                <div key={leg.t} className={styles.legItem}>
                  <span className={styles.legDot} style={{ background: leg.c }}>
                    {leg.icon}
                  </span>
                  {leg.t}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className={styles.cadransGrid}>
          {CADRANS.map((c, i) => {
            const rag = state.ragState[i]
            const col = RAG_COLORS[rag]
            const seuilCls = [styles.slV, styles.slA, styles.slR]
            return (
              <div
                key={c.id}
                className={styles.cadran}
                style={{ background: col.bg, borderColor: col.border }}
              >
                <div className={styles.cadranHdr}>
                  <div className={styles.cadranTitle} style={{ color: col.text }}>
                    {c.title}
                  </div>
                  <PrintRagMark rag={rag} />
                  <div className={`${styles.ragSel} dm-ragSel dm-screenOnly`}>
                    {(['vert', 'ambre', 'rouge'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        title={r}
                        className={`${styles.ragBtn} ${rag === r ? styles.ragBtnOn : ''}`}
                        style={{ background: RAG_BTN_BG[r] }}
                        onClick={() => setRag(i, r)}
                      >
                        {r === 'vert' ? '✓' : r === 'ambre' ? '!' : '✕'}
                      </button>
                    ))}
                  </div>
                </div>

                {c.type === 'binary' ? (
                  <div className={styles.bword} style={{ color: rag ? col.text : 'rgba(0,0,0,.2)' }}>
                    {rag ? WORD_MAP[rag] : '—'}
                  </div>
                ) : (
                  <div className={styles.cvalRow} style={{ color: rag ? col.text : 'rgba(0,0,0,.2)' }}>
                    <Editable
                      value={state.values[i]}
                      onChange={(v) => {
                        const values = [...state.values]
                        values[i] = v
                        setState((s) => ({ ...s, values }))
                      }}
                      placeholder={c.ph ?? ''}
                      className="dm-cvalInput"
                    />
                    <button
                      type="button"
                      className={`${styles.trendBtn} dm-trendBtn dm-screenOnly`}
                      style={{ color: rag ? col.text : undefined }}
                      onClick={() => {
                        const trends = [...state.trends]
                        trends[i] = (trends[i] + 1) % 3
                        setState((s) => ({ ...s, trends }))
                      }}
                    >
                      {TRENDS[state.trends[i]]}
                    </button>
                    <span className={`${styles.printRag} dm-printOnly`} style={{ fontSize: '11pt' }}>
                      {TRENDS[state.trends[i]]}
                    </span>
                  </div>
                )}

                <div className={styles.cadranDesc} style={{ color: col.subtext }}>
                  {c.desc.split('\n').map((line, li) => (
                    <span key={li}>
                      {li > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </div>

                {c.type === 'binary' && (
                  <>
                    <div className={styles.bnoteLbl} style={{ color: col.subtext }}>
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
                      className={`${styles.bnote} dm-bnote`}
                      style={{
                        background: rag ? 'rgba(255,255,255,.12)' : '#fff',
                        borderColor: rag ? 'rgba(255,255,255,.25)' : undefined,
                        color: rag ? col.text : undefined,
                      }}
                    />
                  </>
                )}

                <div className={styles.cadranSeuils} style={{ borderColor: col.seuilBorder }}>
                  {c.seuils.map((s, si) => (
                    <div
                      key={s}
                      className={!rag ? seuilCls[si] ?? '' : undefined}
                      style={{
                        color: rag ? (col.seuil ?? col.subtext) : undefined,
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

        <div className={styles.noteGlobale}>
          <div
            className={styles.ngAuto}
            style={{ background: autoCol.bg, borderColor: autoCol.border }}
          >
            <div className={styles.ngLbl} style={{ color: autoCol.subtext }}>
              {fr ? 'Note globale (auto)' : 'Global score (auto)'}
            </div>
            <div className={styles.ngScore}>
              <span style={{ color: global.autoRag ? autoCol.text : 'rgba(0,0,0,.2)' }}>
                {global.scoreRounded}
              </span>
              <span className={styles.ngDen} style={{ color: global.autoRag ? autoCol.text : undefined }}>
                / 6
              </span>
            </div>
            <div
              className={styles.ngRagWord}
              style={{ color: global.autoRag ? autoCol.text : 'rgba(0,0,0,.2)' }}
            >
              {global.autoWord}
            </div>
            <div className={styles.ngDetail} style={{ color: autoCol.subtext }}>
              V:{global.counts.vert} · A:{global.counts.ambre} · R:{global.counts.rouge}
            </div>
          </div>

          <div className={styles.ngManual} style={{ background: manualCol.bg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3mm' }}>
              <div className={styles.ngLbl} style={{ color: manualCol.subtext }}>
                {fr ? 'Note manuelle' : 'Manual score'}
              </div>
              {state.manualOverride && (
                <span
                  className={`${styles.ngOverride} dm-ngOverride dm-screenOnly`}
                  style={{ color: manualCol.text }}
                >
                  {fr ? 'modifié' : 'edited'}
                </span>
              )}
            </div>
            <div className={styles.ngScore}>
              <Editable
                value={state.manualScore}
                onChange={(v) =>
                  setState((s) => ({ ...s, manualOverride: true, manualScore: v }))
                }
                placeholder="—"
                className={`${styles.ngManualInput} dm-ngManualInput`}
                style={{ color: state.manualRag ? manualCol.text : 'rgba(0,0,0,.2)' }}
              />
              <span className={styles.ngDen} style={{ color: state.manualRag ? manualCol.text : undefined }}>
                / 6
              </span>
            </div>
            <div className={`${styles.ngRagBtns} dm-ngRagBtns dm-screenOnly`}>
              {(['vert', 'ambre', 'rouge'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.ngRagBtn} ${state.manualRag === r ? styles.ngRagBtnOn : ''}`}
                  style={{ background: RAG_BTN_BG[r] }}
                  onClick={() => setState((s) => ({ ...s, manualOverride: true, manualRag: r }))}
                >
                  {r === 'vert' ? 'Vert' : r === 'ambre' ? 'Ambre' : 'Rouge'}
                </button>
              ))}
            </div>
            {state.manualRag && (
              <div className={`${styles.printRag} dm-printOnly`} style={{ color: manualCol.text, marginTop: '1mm' }}>
                RAG : {state.manualRag === 'vert' ? 'Vert' : state.manualRag === 'ambre' ? 'Ambre' : 'Rouge'}
              </div>
            )}
            <div className={styles.ngCommentLbl} style={{ color: manualCol.subtext }}>
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
              className={`${styles.ngComment} dm-ngComment`}
              style={{ color: state.manualRag ? manualCol.text : undefined }}
            />
            {state.manualOverride && (
              <button
                type="button"
                className={`${styles.ngReset} dm-ngReset dm-screenOnly`}
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

        <div className={styles.row2}>
          <div className={styles.bloc}>
            <div className={styles.blocTitle}>
              {fr ? 'Vélocité — 6 derniers sprints' : 'Velocity — last 6 sprints'}
            </div>
            <div className={`${styles.sparkInputs} dm-sparkInputs dm-screenOnly`}>
              {SPARK_LABELS.map((lbl, i) => (
                <div key={lbl} className={styles.sparkField}>
                  <label className={styles.sparkLbl}>{lbl}</label>
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
                    className={`${styles.sparkInp} ${i === 5 ? styles.sparkInpCur : ''}`}
                  />
                </div>
              ))}
            </div>
            <div className={styles.sparkZone}>
              {state.sparkData.map((v, i) => {
                const val = v || 0
                const h = val ? Math.max(6, Math.round((val / sparkMax) * 58)) : 6
                return (
                  <div key={i} className={styles.sparkCol}>
                    <div className={styles.sparkVal}>{val || '—'}</div>
                    <div
                      className={`${styles.sparkBar} ${i === 5 ? styles.sparkBarCur : ''}`}
                      style={{ height: h }}
                    />
                    <div className={styles.sparkLblBot}>
                      {SPARK_LABELS[i].replace(' actuel', '').replace('S ', 'S')}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.velociteFooter}>
              {fr ? 'Moy. 3 sprints' : 'Avg. 3 sprints'} :{' '}
              <strong>{velocityAvg}</strong>
              {' · '}
              {fr ? 'Tendance' : 'Trend'} : {velocityTrend}
            </div>
          </div>

          <div className={`${styles.bloc} ${styles.blocOkr}`}>
            <div className={styles.blocTitle}>OKR Check-in</div>
            <div className={styles.okrObj}>
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
                <div className={styles.okrRowLbl}>{lbl}</div>
                <div className={styles.okrRowTxt}>
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

        <div className={styles.narrative}>
          <div className={styles.narLbl}>{fr ? 'Narrative IA' : 'AI narrative'}</div>
          <Editable
            value={state.narrative}
            onChange={(v) => setState((s) => ({ ...s, narrative: v }))}
            placeholder={
              fr
                ? 'Générez la narrative (2 crédits) ou collez le texte P25 — factuel, orienté action, 200 mots max.'
                : 'Generate narrative (2 credits) or paste P25 text — factual, action-oriented, 200 words max.'
            }
            className={`${styles.narBody} dm-narBody`}
          />
        </div>

        <footer className={styles.footer}>
          <div>
            Dashboard {fr ? 'généré via' : 'via'}{' '}
            <strong className={styles.footerGold}>aigile.lu</strong> · Le Système S.A.L.I.M. · Prompt P25
          </div>
          <div className={styles.footerMono}>
            Sprint {state.header.sprint || '—'} · {state.header.period || '—'} ·{' '}
            {fr ? 'Mis à jour par le SM' : 'Updated by SM'}
          </div>
        </footer>
      </div>

      {showUpgrade && <UpgradeModal open onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}
