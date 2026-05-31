'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

function isElementInView(el: HTMLElement, threshold: number): boolean {
  const rect = el.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
  if (visibleHeight <= 0) return false
  const ratio = visibleHeight / Math.max(rect.height, 1)
  return ratio >= threshold
}

export function useInView(threshold = 0.15) {
  const [inView, setInView] = useState(false)
  const nodeRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const disconnect = () => {
    observerRef.current?.disconnect()
    observerRef.current = null
  }

  const observe = useCallback(
    (el: HTMLElement) => {
      disconnect()

      if (isElementInView(el, threshold)) {
        setInView(true)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            disconnect()
          }
        },
        { threshold: [0, Math.min(threshold, 0.1), threshold], rootMargin: '40px 0px' }
      )

      observer.observe(el)
      observerRef.current = observer
    },
    [threshold]
  )

  const ref = useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node
      if (node) observe(node)
      else disconnect()
    },
    [observe]
  )

  useEffect(() => {
    const el = nodeRef.current
    if (!el || inView) return

    if (isElementInView(el, threshold)) {
      setInView(true)
      disconnect()
    }
  }, [inView, threshold])

  useEffect(() => disconnect, [])

  return { ref, inView }
}
