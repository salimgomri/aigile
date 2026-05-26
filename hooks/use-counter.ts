'use client'

import { useEffect, useState } from 'react'

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useCounter(
  target: number,
  active: boolean,
  duration = 1200
): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return

    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    let start: number | null = null
    let raf = 0

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min(1, (timestamp - start) / duration)
      setValue(Math.round(easeOutExpo(progress) * target))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])

  return value
}
