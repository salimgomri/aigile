import { NextResponse } from 'next/server'
import { getClientSafeData } from '@/lib/scoring/rules-loader'
import { getAuthedUserId, jsonError, parseCadrageFromQuery } from '@/lib/scoring/http'

export async function GET(request: Request) {
  try {
    const userId = await getAuthedUserId()
    if (!userId) {
      return jsonError(401, 'AUTH_REQUIRED', 'Authentication required')
    }

    const { searchParams } = new URL(request.url)
    const cadrage = parseCadrageFromQuery(searchParams)
    if (!cadrage) {
      return jsonError(400, 'INVALID_BODY', 'Query params C2, C4, C5, C7 (a|b|c) are required')
    }

    const { questions, model } = getClientSafeData(cadrage)
    return NextResponse.json({ questions, model })
  } catch (e) {
    console.error('[scoring/questions] GET:', e)
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected error')
  }
}
