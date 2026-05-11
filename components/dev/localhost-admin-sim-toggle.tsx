'use client'

import { useCredits } from '@/lib/credits/CreditContext'
import { useLanguage } from '@/components/language-provider'
import { useSession } from '@/lib/auth-client'
import { isAigileDevAdminSimEnabled } from '@/lib/dev-admin-sim-toggle-env'
import { isLocalDevHostname } from '@/lib/dev-local-host'
import { useEffect, useState } from 'react'

const SIM_COOKIE = 'aigile_dev_admin_sim=1'

function readSimulatedFromDocumentCookie(): boolean {
  return document.cookie.split(';').some((p) => p.trim().startsWith(SIM_COOKIE))
}

/**
 * Bouton affiché seulement si NEXT_PUBLIC_AIGILE_DEV_ADMIN_SIM est activée (voir lib/dev-admin-sim-toggle-env.ts)
 * et hostname local (::1 / 127.0.0.1 / localhost). Sinon rien dans le DOM.
 */
export function LocalhostAdminSimToggle({ className = '' }: { className?: string }) {
  const { refresh } = useCredits()
  const { language } = useLanguage()
  const { data: session } = useSession()
  const [visible, setVisible] = useState(false)
  const [simulated, setSimulated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAigileDevAdminSimEnabled()) return
    const ok = isLocalDevHostname(window.location.hostname)
    setVisible(ok)
    if (!ok) return

    const sync = () => setSimulated(readSimulatedFromDocumentCookie())
    sync()
    window.addEventListener('aigile-dev-admin-sim-changed', sync)
    return () => window.removeEventListener('aigile-dev-admin-sim-changed', sync)
  }, [])

  async function apply(simulate: boolean) {
    setError(null)
    try {
      const res = await fetch('/api/dev/admin-sim', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulate }),
      })
      let payload: { error?: string } = {}
      try {
        payload = (await res.json()) as { error?: string }
      } catch {
        /* ignore */
      }
      if (!res.ok) {
        const msg =
          payload.error ??
          (language === 'fr'
            ? `Échec (${res.status}). Host local requis (localhost / 127.0.0.1 / ::1).`
            : `Failed (${res.status}). Local host required.`)
        setError(msg)
        console.warn('[admin-sim]', res.status, payload)
        return
      }
      await fetch('/api/admin/check', { credentials: 'include' })
      setSimulated(simulate)
      window.dispatchEvent(new Event('aigile-dev-admin-sim-changed'))
      await refresh()
    } catch (e) {
      console.warn('[admin-sim]', e)
      setError(language === 'fr' ? 'Erreur réseau' : 'Network error')
    }
  }

  if (!visible) return null

  const simLabel = language === 'fr' ? 'Simuler admin' : 'Simulate admin'
  const stopLabel = language === 'fr' ? 'Arrêter simulation' : 'Stop simulation'
  const hintLoggedOut =
    language === 'fr'
      ? 'Connecte-toi : la simulation pose les cookies, mais le menu Admin nécessite une session.'
      : 'Sign in: cookies are set, but the Admin nav needs an active session.'

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-center rounded-lg border border-dashed border-amber-600/60 bg-amber-500/15 px-2 py-1.5 dark:border-amber-400/50 dark:bg-amber-500/10">
        {simulated ? (
          <button
            type="button"
            onClick={() => void apply(false)}
            className="text-xs font-semibold text-amber-950 dark:text-amber-100"
          >
            {stopLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void apply(true)}
            className="text-xs font-semibold text-amber-950 dark:text-amber-100"
          >
            {simLabel}
          </button>
        )}
      </div>
      {error ? (
        <p className="max-w-[220px] text-[10px] leading-snug text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      {!session ? (
        <p className="max-w-[240px] text-[10px] leading-snug text-muted-foreground/90">{hintLoggedOut}</p>
      ) : null}
    </div>
  )
}
