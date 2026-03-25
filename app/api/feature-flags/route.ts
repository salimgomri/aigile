import { NextResponse } from 'next/server'
import { getPublicFeatureFlagsPayload } from '@/lib/feature-flags'

/** Public : états des feature flags (pas de secrets) */
export async function GET() {
  try {
    const flags = await getPublicFeatureFlagsPayload()
    return NextResponse.json({ flags })
  } catch (e) {
    console.error('[feature-flags]', e)
    return NextResponse.json({ flags: {} }, { status: 200 })
  }
}
