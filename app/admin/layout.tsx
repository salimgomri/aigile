import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isAdminEmail } from '@/lib/admin'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')
  if (!isAdminEmail(session.user.email)) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/orders" className="text-xl font-bold text-foreground">
            Dashboard Admin
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-aigile-gold hover:text-book-orange"
            >
              Commandes
            </Link>
            <Link
              href="/admin/feature-flags"
              className="text-sm font-medium text-aigile-gold hover:text-book-orange"
            >
              Feature flags
            </Link>
            <Link
              href="/admin/access"
              className="text-sm font-medium text-aigile-gold hover:text-book-orange"
            >
              Accès / promos
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              ← Dashboard
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
