import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canAccessTool } from '@/lib/tool-access'

/**
 * GET ?slug=scoring_deliverable — accès landing (admin, invite, promo early adopter).
 */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  const slug = new URL(request.url).searchParams.get('slug')?.trim()
  if (!slug || !/^[a-z0-9_]+$/.test(slug)) {
    return NextResponse.json({ error: 'slug invalide' }, { status: 400 })
  }

  if (!session?.user) {
    return NextResponse.json({ authenticated: false, canAccess: false })
  }

  const canAccess = await canAccessTool(slug, session.user.email, { userId: session.user.id })
  return NextResponse.json({ authenticated: true, canAccess })
}
