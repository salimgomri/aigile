'use client'

import type { ReactNode } from 'react'
import type { SalimQaAccessInput } from '@/lib/salim-qa/access'
import { CIBLE_LABELS, ROLE_LABELS, STATUT_LABELS } from '@/lib/salim-qa/constants'
import type { SalimQaQuestionPublic } from '@/lib/salim-qa/types'
import type { SalimQaUnlockScope } from '@/lib/salim-qa/unlock-scope'
import { SalimQaFicheStack } from './SalimQaFicheViewer'
import { SalimQaUnlockActions } from './SalimQaUnlockActions'

type SalimQaDetailModalProps = {
  detail: SalimQaQuestionPublic
  detailIdx: number
  total: number
  language: 'fr' | 'en'
  access: SalimQaAccessInput
  terms: string[]
  unlocking: boolean
  onClose: () => void
  onUnlock: (scope: SalimQaUnlockScope) => void
  onRecharge: () => void
  onPrev: () => void
  onNext: () => void
  highlightText: (text: string, terms: string[]) => ReactNode
}

export function SalimQaDetailModal({
  detail,
  detailIdx,
  total,
  language,
  access,
  terms,
  unlocking,
  onClose,
  onUnlock,
  onRecharge,
  onPrev,
  onNext,
  highlightText,
}: SalimQaDetailModalProps) {
  const copy =
    language === 'fr'
      ? {
          terrain: 'Sur le terrain',
          response: 'La réponse',
          sheetTitle: 'Fiche pratique',
          sheetFor: 'Fiche destinée à',
          noSheet: 'No sheet',
          sheetLocked: 'Schéma disponible après déblocage (1 crédit).',
          answerLocked: 'Réponse disponible après déblocage (1 crédit).',
          prev: '← Précédente',
          next: 'Suivante →',
        }
      : {
          terrain: 'In the field',
          response: 'Answer',
          sheetTitle: 'Practical sheet',
          sheetFor: 'Sheet for',
          noSheet: 'No sheet',
          sheetLocked: 'Diagram available after unlock (1 credit).',
          answerLocked: 'Answer available after unlock (1 credit).',
          prev: '← Previous',
          next: 'Next →',
        }

  const showSheetCol = detail.hasFiche

  return (
    <div className="sq-modal-overlay" onClick={onClose} role="presentation">
      <div className="sq-modal sq-modal--detail" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="sq-modal-detail-header">
          <div className="sq-modal-detail-badges">
            <span className="sq-role-badge">
              <span className="sq-role-code">{detail.role}</span>
              {ROLE_LABELS[detail.role]?.[language] ?? detail.role}
            </span>
            {detail.cible && (
              <span className="sq-modal-detail-meta">{CIBLE_LABELS[detail.cible]?.[language] ?? detail.cible}</span>
            )}
            {detail.statutReponse && (
              <span className="sq-modal-detail-status">
                <span
                  className="sq-modal-detail-dot"
                  style={{ background: STATUT_LABELS[detail.statutReponse]?.color ?? '#9A9A93' }}
                />
                {STATUT_LABELS[detail.statutReponse]?.[language] ?? detail.statutReponse}
              </span>
            )}
          </div>
          <button type="button" className="sq-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="sq-modal-detail-body">
          <div className="sq-modal-detail-ref sq-brand-mono">
            {detail.id} · {String(detailIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <h2 className="sq-modal-detail-title">{highlightText(detail.question, terms)}</h2>

          <div className={`sq-detail-grid${showSheetCol ? '' : ' sq-detail-grid--single'}`}>
            {showSheetCol && (
              <aside className="sq-detail-sheet-col">
                <div className="sq-detail-panel sq-detail-panel--sheet">
                  <div className="sq-detail-panel-head">
                    <span className="sq-brand-mono sq-detail-label">{copy.sheetTitle}</span>
                    {detail.ficheDestineeA.length > 0 && (
                      <span className="sq-detail-panel-meta">
                        {copy.sheetFor}: {detail.ficheDestineeA.join(', ')}
                      </span>
                    )}
                  </div>

                  {detail.ficheCount > 0 ? (
                    detail.canReadFiche ? (
                      <SalimQaFicheStack questionId={detail.id} count={detail.ficheCount} />
                    ) : (
                      <div className="sq-detail-locked">
                        <div className="sq-detail-locked-icon">◇</div>
                        <p>{copy.sheetLocked}</p>
                      </div>
                    )
                  ) : (
                    <p className="sq-detail-no-sheet">{copy.noSheet}</p>
                  )}
                </div>
              </aside>
            )}

            <div className="sq-detail-content-col">
              <div className="sq-detail-panel sq-detail-panel--terrain">
                <div className="sq-brand-mono sq-detail-label sq-detail-label--gold">{copy.terrain}</div>
                <p className="sq-detail-terrain">« {detail.douleur} »</p>
              </div>

              <div className="sq-detail-panel sq-detail-panel--answer">
                <div className="sq-brand-mono sq-detail-label">{copy.response}</div>
                {detail.canReadAnswer && detail.answerFull ? (
                  <p className="sq-detail-answer">{detail.answerFull}</p>
                ) : (
                  <div className="sq-detail-locked sq-detail-locked--answer">
                    <p className="sq-detail-preview">{detail.answerPreview}</p>
                    <p className="sq-detail-locked-hint">{copy.answerLocked}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <SalimQaUnlockActions
            language={language}
            question={detail}
            access={access}
            onUnlock={onUnlock}
            onRecharge={onRecharge}
            loading={unlocking}
          />

          <div className="sq-modal-detail-footer">
            <button type="button" className="sq-modal-nav" disabled={detailIdx <= 0} onClick={onPrev}>
              {copy.prev}
            </button>
            <span className="sq-brand-mono sq-modal-page">p. {detail.page ?? '—'}</span>
            <button type="button" className="sq-modal-nav" disabled={detailIdx >= total - 1} onClick={onNext}>
              {copy.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
