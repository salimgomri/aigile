'use client'

/** Rafale dorée sans GSAP (Web Animations API) — évite les effets de bord navigateur / cssRules. */
export function playCollectorCopyBurst(anchorEl: HTMLElement | null) {
  if (typeof window === 'undefined') return

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (mq.matches) return

  const rect = anchorEl?.getBoundingClientRect()
  const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

  const parent = document.createElement('div')
  parent.setAttribute('aria-hidden', 'true')
  parent.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:hidden'

  document.body.appendChild(parent)

  const n = 14
  for (let i = 0; i < n; i++) {
    const dot = document.createElement('div')
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.35
    const dist = 36 + Math.random() * 52
    dot.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:3px;height:3px;margin:-1.5px 0 0 -1.5px;border-radius:9999px;background:rgba(201,151,58,0.92);box-shadow:0 0 10px rgba(201,151,58,0.55)`
    parent.appendChild(dot)
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist
    const anim = dot.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(0.15)`, opacity: 0 },
      ],
      { duration: 520 + Math.random() * 140, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
    )
    void anim.finished.then(() => dot.remove()).catch(() => dot.remove())
  }

  window.setTimeout(() => parent.remove(), 900)
}
