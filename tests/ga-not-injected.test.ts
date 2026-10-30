import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('GA consent', () => {
  it('does not load gtag from root layout', () => {
    const layout = fs.readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8')
    expect(layout).not.toContain('googletagmanager.com/gtag')
    expect(layout).not.toContain('google-analytics')
  })

  it('loads gtag only from consent component', () => {
    const ga = fs.readFileSync(path.join(process.cwd(), 'components/consent/GoogleAnalytics.tsx'), 'utf8')
    expect(ga).toContain('googletagmanager.com/gtag/js')
    expect(ga).toContain("stored?.choice === 'granted'")
  })
})
