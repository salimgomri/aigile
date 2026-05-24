'use client'

import { useEffect } from 'react'

export function CheckInSavedToast({ show }: { show: boolean }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => {
      const url = new URL(window.location.href)
      url.searchParams.delete('saved')
      window.history.replaceState({}, '', url.pathname)
    }, 4000)
    return () => clearTimeout(t)
  }, [show])

  if (!show) return null

  return (
    <div
      role="status"
      className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
    >
      Check-in enregistré
    </div>
  )
}
