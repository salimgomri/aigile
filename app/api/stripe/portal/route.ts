import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createStripePortalUrl } from '@/lib/payments/stripe-portal'

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    }

    const { getBaseUrlFromRequest } = await import('@/lib/utils/base-url')
    const urlObj = new URL(request.url)
    const returnPath = urlObj.searchParams.get('return') || '/settings/team'
    const baseUrl = getBaseUrlFromRequest(request)

    const url = await createStripePortalUrl(session.user.id, returnPath, baseUrl)
    return NextResponse.json({ url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
