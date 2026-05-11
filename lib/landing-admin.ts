import 'server-only'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { isAdminEmail, isAdminUserId, hasDevLocalAdminSimCookie } from '@/lib/admin'

/** Landing : admin connecté (email ADMIN_EMAILS ou userId → email en base). */
export async function getSessionIsAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) return false
  const email = session?.user?.email ?? null
  const h = await headers()
  const cookieHeader = h.get('cookie')
  if (isAdminEmail(email)) return true
  if (await isAdminUserId(userId)) return true
  if (hasDevLocalAdminSimCookie(cookieHeader)) return true
  return false
}
