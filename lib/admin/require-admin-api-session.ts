import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { isAdminAccessAllowed } from '@/lib/admin'

/** Session courante si l’utilisateur est admin réel ou simulation localhost (dev uniquement). */
export async function requireAdminApiSession() {
  const h = await headers()
  const session = await auth.api.getSession({ headers: h })
  if (!session?.user) return null
  if (!isAdminAccessAllowed(session.user.email, h.get('cookie'))) return null
  return session
}
