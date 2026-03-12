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

    const { searchParams } = new URL(request.url)
    const returnPath = searchParams.get('return') || '/settings/team'

    const url = await createStripePortalUrl(session.user.id, returnPath)
    return NextResponse.json({ url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
