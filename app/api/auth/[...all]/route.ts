import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const handlers = toNextJsHandler(auth)

function withErrorLog(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      const res = await handler(req)
      if (res.status >= 500) {
        const clone = res.clone()
        const text = await clone.text()
        console.error('[AUTH]', res.status, req.url, text.slice(0, 500))
      }
      return res
    } catch (err) {
      console.error('[AUTH]', err)
      throw err
    }
  }
}

export const GET = withErrorLog(handlers.GET)
export const POST = withErrorLog(handlers.POST)
export const PATCH = withErrorLog(handlers.PATCH)
export const PUT = withErrorLog(handlers.PUT)
export const DELETE = withErrorLog(handlers.DELETE)
