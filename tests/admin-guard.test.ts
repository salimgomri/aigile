import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: { from: () => ({}) },
}))

import { isAdminEmail, isAdminAccessAllowed } from '@/lib/admin'

describe('admin access (unchanged helpers)', () => {
  it('rejects empty email', () => {
    expect(isAdminEmail(null)).toBe(false)
    expect(isAdminEmail('')).toBe(false)
    expect(isAdminAccessAllowed('nobody@example.com', null)).toBe(false)
  })
})
