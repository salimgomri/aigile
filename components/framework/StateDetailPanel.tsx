'use client'

import { useEffect } from 'react'
import type { FrameworkLang, WorkflowState } from '@/lib/framework/framework-data'
import type { STRINGS } from '@/lib/framework/framework-data'
import { IconBadge } from './framework-icons'

type UiStrings = (typeof STRINGS)[FrameworkLang]

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(120px, 160px) 1fr',
        gap: 'var(--space-5)',
        padding: 'var(--space-4) 0',
        borderTop: '1px solid var(--border-default)',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-micro)',
          fontWeight: 'var(--weight-semibold)',
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
        }}
      >
        {label}
      </span>
      <p style={{ margin: 0, fontSize: 'var(--text-body-size)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-body)' }}>
        {value}
      </p>
    </div>
  )
}

export function StateDetailPanel({
  state,
  onClose,
  icon,
  t,
}: {
  state: WorkflowState
  onClose: () => void
  icon: string
  t: UiStrings
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28, 27, 25, 0.42)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-5)',
        zIndex: 100,
        animation: 'fw-fade-in var(--duration-fast) var(--ease-out-premium) both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: 640,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
          padding: 'var(--space-7)',
          animation: 'fw-rise-in var(--duration-base) var(--ease-out-premium) both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div>
            <span
              style={{
                fontSize: 'var(--text-micro)',
                fontWeight: 'var(--weight-semibold)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: 'var(--book-orange)',
              }}
            >
              {t.uiWhoDecides} : {state.decider}
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: 'var(--text-h1)',
                margin: '10px 0 0',
                color: 'var(--text-body)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <IconBadge icon={icon} tone="solid" size={44} shape="circle" />
              {state.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.uiClose}
            style={{
              appearance: 'none',
              border: '1px solid var(--border-default)',
              background: 'transparent',
              borderRadius: 'var(--radius-full)',
              width: 36,
              height: 36,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <p
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--text-muted)',
            margin: 'var(--space-5) 0 0',
          }}
        >
          {state.purpose}
        </p>

        <div style={{ marginTop: 'var(--space-5)' }}>
          <DetailRow label={t.uiEntry} value={state.entry} />
          <DetailRow label={t.uiExit} value={state.exit} />
          <DetailRow label={t.uiAiResp} value={state.ai} />
          <DetailRow label={t.uiHumanResp} value={state.human} />
        </div>

        <div style={{ marginTop: 'var(--space-5)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div
            style={{
              background: 'var(--surface-page)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
            }}
          >
            <div style={{ fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 6 }}>
              {t.uiDoR}
            </div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--text-body)', lineHeight: 'var(--leading-normal)' }}>{state.dor}</div>
          </div>
          <div
            style={{
              background: 'var(--surface-page)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
            }}
          >
            <div style={{ fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 6 }}>
              {t.uiDoD}
            </div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--text-body)', lineHeight: 'var(--leading-normal)' }}>{state.dod}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
