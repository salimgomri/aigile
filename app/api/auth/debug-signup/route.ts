/**
 * Debug: test sign-up and return full error
 * DELETE after fixing - POST with { email, name, password }
 */
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const result = await auth.api.signUpEmail({
      body: {
        email: body.email || 'debug@test.com',
        name: body.name || 'Debug User',
        password: body.password || 'debugpass123',
      },
    })
    const res = result as { error?: unknown; message?: string }
    if (res.error) {
      return Response.json(
        { error: res.error, message: res.message, full: result },
        { status: 500 }
      )
    }
    return Response.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown'
    const stack = err instanceof Error ? err.stack : ''
    const cause = err instanceof Error && err.cause ? String(err.cause) : undefined
    const extra = err && typeof err === 'object' ? JSON.stringify(err, null, 2) : ''
    console.error('[DEBUG-SIGNUP]', err)
    return Response.json(
      { error: message, cause, stack: stack?.split('\n').slice(0, 8), extra },
      { status: 500 }
    )
  }
}
