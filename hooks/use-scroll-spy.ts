'use client'

import { useEffect, useState } from 'react'

type UseScrollSpyOptions = {
  enabled?: boolean
  /** Marge haute pour le sticky chrome (nav + sous-nav) */
  offset?: number
}

export function useScrollSpy(sectionIds: string[], options: UseScrollSpyOptions = {}) {
  const { enabled = true, offset = 132 } = options
  const [active, setActive] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const update = () => {
      const probe = window.scrollY + offset
      let current = sectionIds[0]

      for (const el of elements) {
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= probe) {
          current = el.id
        }
      }

      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled, offset, sectionIds.join('|')])

  return active
}
