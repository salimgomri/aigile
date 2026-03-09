import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

const VALID_ROLES = ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest']

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { role } = body

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const user = session.user as { firstName?: string; lastName?: string; name?: string }
    const updates: Record<string, string> = { role }

    // For Google users: split name into firstName/lastName if not set
    if (!user.firstName && user.name) {
      const parts = user.name.trim().split(/\s+/)
      updates.firstName = parts[0] || ''
      updates.lastName = parts.slice(1).join(' ') || ''
    }

    const { error } = await supabaseAdmin
      .from('user')
      .update(updates)
      .eq('id', session.user.id)

    if (error) {
      console.error('[API] Update role failed:', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API] update-role error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
