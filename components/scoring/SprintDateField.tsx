'use client'

import { useRef } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

type SprintDateFieldProps = {
  value: string
  onChange: (value: string) => void
  id?: string
  className?: string
}

/**
 * Fin de sprint : calendrier natif (showPicker) + bouton, thème sombre type scoring.
 */
export function SprintDateField({ value, onChange, id, className }: SprintDateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => {
    const el = inputRef.current
    if (typeof el?.showPicker === 'function') {
      void el.showPicker()
    } else {
      el?.focus()
    }
  }

  return (
    <div className={cn('relative flex flex-wrap items-stretch gap-2', className)}>
      <div className="relative min-w-0 flex-1 min-w-[200px]">
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full min-h-[44px] rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white',
            '[color-scheme:dark]',
            'focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/40',
            /* Masque l’icône native (doublon avec le bouton) ; clic sur le champ ouvre quand même le picker */
            '[&::-webkit-calendar-picker-indicator]:opacity-0',
            '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0',
            '[&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full',
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer'
          )}
        />
      </div>
      <button
        type="button"
        onClick={openPicker}
        className={cn(
          'shrink-0 flex items-center justify-center min-w-[44px] rounded-lg border border-white/15',
          'bg-white/5 text-orange-400 hover:bg-orange-500/15 hover:border-orange-500/40 transition-colors'
        )}
        aria-label="Ouvrir le calendrier"
        title="Calendrier"
      >
        <Calendar className="w-5 h-5" />
      </button>
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="shrink-0 px-3 text-sm text-white/50 hover:text-white transition-colors self-center"
        >
          Effacer
        </button>
      ) : null}
    </div>
  )
}
