'use client'

import { type CSSProperties, type ReactNode } from 'react'
import { useInView } from '@/hooks/use-in-view'

type AnimateInProps = {
  children: ReactNode
  className?: string
  threshold?: number
  cascadeDelay?: number
  as?: 'div' | 'section' | 'article'
  fadeOnly?: boolean
}

export function AnimateIn({
  children,
  className = '',
  threshold = 0.15,
  cascadeDelay = 0,
  as: Tag = 'div',
  fadeOnly = false,
}: AnimateInProps) {
  const { ref, inView } = useInView(threshold)
  const style: CSSProperties | undefined =
    cascadeDelay > 0 ? { transitionDelay: `${cascadeDelay}ms` } : undefined

  return (
    <Tag
      ref={ref}
      className={`${fadeOnly ? 'animate-fade' : 'animate-in'} ${inView ? 'visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}

export function DrawLine({ className = '' }: { className?: string }) {
  const { ref, inView } = useInView(0.15)

  return (
    <div
      ref={ref}
      className={`draw-line ${inView ? 'visible' : ''} ${className}`}
      aria-hidden
    />
  )
}
