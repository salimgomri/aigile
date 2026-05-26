'use client'

import { useEffect, useState } from 'react'
import { LAUNCH_END_DATE_ISO } from '@/lib/launch-config'

function getDaysRemaining(): number {
  const end = new Date(`${LAUNCH_END_DATE_ISO}T23:59:59`)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function CountdownBanner() {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)

  useEffect(() => {
    setDaysRemaining(getDaysRemaining())
  }, [])

  if (daysRemaining === null || daysRemaining <= 0) return null

  const urgent = daysRemaining <= 3
  const dayLabel = daysRemaining > 1 ? 'jours' : 'jour'

  return (
    <div className={`urgency-banner${urgent ? ' urgency-banner-urgent' : ''}`}>
      Plus que {daysRemaining} {dayLabel} au prix de lancement · Ensuite : 79€ sur Amazon
    </div>
  )
}
