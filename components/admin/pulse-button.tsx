'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

export type PulseButtonVariant = 'standard' | 'critical'

type PulseButtonProps = {
  variant: PulseButtonVariant
  /** Zone sensible au shimmer (mode standard uniquement). */
  shimmerLayer?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Enveloppe animée (GSAP) : shimmer ~5s en standard, double battement + halo doré en critique.
 */
export function PulseButton({ variant, shimmerLayer, children, className }: PulseButtonProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const shimmerEl = shimmerRef.current
    if (!root) return

    const mq =
      typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mq?.matches) return

    try {
      const ctx = gsap.context(() => {
        gsap.killTweensOf(root)
        if (shimmerEl) gsap.killTweensOf(shimmerEl)

        if (variant === 'critical') {
          gsap.set(root, { transformOrigin: '50% 50%', scale: 1 })
          const beat = gsap.timeline({ repeat: -1 })
          beat.to(root, {
            scale: 1.038,
            boxShadow:
              '0 0 0 4px rgba(254, 189, 16,0.48), 0 0 36px rgba(232,150,30,0.42), 0 0 64px rgba(254, 189, 16,0.18)',
            duration: 0.11,
            ease: 'power2.out',
          })
          beat.to(root, { scale: 1.014, duration: 0.075, ease: 'power2.inOut' })
          beat.to(root, {
            scale: 1.042,
            boxShadow:
              '0 0 0 7px rgba(254, 189, 16,0.4), 0 0 48px rgba(232,150,30,0.52), 0 0 80px rgba(254, 189, 16,0.22)',
            duration: 0.11,
            ease: 'power2.out',
          })
          beat.to(root, {
            scale: 1,
            boxShadow: '0 0 0 0 rgba(254, 189, 16,0), 0 0 0 rgba(0,0,0,0)',
            duration: 0.19,
            ease: 'power3.inOut',
          })
          beat.to(root, { duration: 0.72 })
        } else if (shimmerEl) {
          gsap.set(shimmerEl, { xPercent: -140 })
          gsap.timeline({ repeat: -1, repeatDelay: 5 }).to(shimmerEl, {
            xPercent: 220,
            duration: 1.05,
            ease: 'power2.inOut',
          })
        }
      }, root)

      return () => ctx.revert()
    } catch (e) {
      console.warn('[PulseButton] GSAP désactivé pour cette carte', e)
      return undefined
    }
  }, [variant])

  return (
    <div ref={rootRef} className={`relative overflow-hidden rounded-2xl ${className ?? ''}`}>
      {variant === 'standard' && shimmerLayer != null ? (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          aria-hidden
        >
          <div ref={shimmerRef} className="absolute inset-y-0 left-0 w-[70%] will-change-transform">
            {shimmerLayer}
          </div>
        </div>
      ) : null}
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
