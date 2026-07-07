'use client'

import { useState } from 'react'
import type { WorkflowState } from '@/lib/framework/framework-data'
import { FrameworkIcon } from './framework-icons'

type WorkflowNodeProps = {
  state: WorkflowState
  index: number
  active: boolean
  onClick: (state: WorkflowState) => void
  icon: string
  stateLabel: string
  lateralLabel: string
}

export function WorkflowNode({ state, index, active, onClick, icon, stateLabel, lateralLabel }: WorkflowNodeProps) {
  const isCancelled = !!state.lateral
  const [hover, setHover] = useState(false)
  const highlighted = active || hover

  return (
    <button
      type="button"
      onClick={() => onClick(state)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '4px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        minWidth: isCancelled ? 108 : 128,
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-body)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 56,
          height: 56,
          borderRadius: isCancelled ? 'var(--radius-md)' : 'var(--radius-full)',
          background: active ? 'var(--aigile-gold)' : 'var(--surface-card)',
          border: isCancelled
            ? `1.5px dashed ${highlighted ? 'var(--status-cancelled)' : 'var(--hairline-strong)'}`
            : `1.5px solid ${active || highlighted ? 'var(--aigile-gold)' : 'var(--border-default)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: highlighted ? 'translateY(-4px) scale(1.04)' : 'translateY(0) scale(1)',
          boxShadow: active ? 'var(--shadow-gold-glow)' : highlighted ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
          transition:
            'transform var(--duration-base) var(--ease-out-premium), box-shadow var(--duration-base) var(--ease-out-premium), background var(--duration-fast) linear, border-color var(--duration-fast) linear',
        }}
      >
        <FrameworkIcon
          name={icon}
          size={22}
          style={{
            color: active ? 'var(--accent-ink)' : isCancelled ? 'var(--status-cancelled)' : 'var(--accent-hover)',
          }}
        />
        {!isCancelled && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 20,
              height: 20,
              borderRadius: 'var(--radius-full)',
              background: active ? 'var(--ink)' : 'var(--surface-page)',
              border: '1px solid var(--border-default)',
              color: active ? 'var(--paper)' : 'var(--text-faint)',
              fontSize: 10,
              fontWeight: 'var(--weight-bold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {index + 1}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span
          style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: isCancelled ? 'var(--text-body-size)' : 'var(--text-h3)',
            fontWeight: 'var(--weight-medium)',
            color: highlighted ? 'var(--ink)' : 'var(--text-body)',
          }}
        >
          {state.label}
        </span>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--text-faint)',
          }}
        >
          {isCancelled ? lateralLabel : `${stateLabel} ${index + 1}`}
        </span>
      </div>
    </button>
  )
}

export function WorkflowConnector() {
  return (
    <div
      aria-hidden
      style={{
        flex: 1,
        minWidth: 20,
        height: 1.5,
        background: 'linear-gradient(90deg, var(--hairline-strong), var(--hairline))',
        alignSelf: 'flex-start',
        marginTop: 31,
      }}
    />
  )
}
