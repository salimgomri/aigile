'use client'

import { useCounter } from '@/hooks/use-counter'

type CounterStatProps = {
  target: number
  active: boolean
  suffix?: string
  className?: string
}

export function CounterStat({ target, active, suffix = '', className = '' }: CounterStatProps) {
  const value = useCounter(target, active)

  return (
    <span className={className}>
      {value}
      {suffix}
    </span>
  )
}
