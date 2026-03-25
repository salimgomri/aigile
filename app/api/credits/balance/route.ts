import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ensureUserCredits, getCreditStatus } from '@/lib/credits/manager'

/**
 * Solde crédits pour l’UI (guard client).
 * Les crédits sont fongibles (même pool que Rétro IA, Scoring, etc.).
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'AUTH_REQUIRED' },
      { status: 401 }
    )
  }

  await ensureUserCredits(session.user.id)
  const status = await getCreditStatus(session.user.id)
  if (!status) {
    return NextResponse.json({ credits: 0 })
  }

  if (status.isUnlimited) {
    return NextResponse.json({ credits: 999_999 })
  }

  return NextResponse.json({ credits: status.creditsRemaining ?? 0 })
}
