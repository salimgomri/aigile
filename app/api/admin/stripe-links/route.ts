import { NextResponse } from 'next/server'
import { requireAdminApiSession } from '@/lib/admin/require-admin-api-session'
import { getStripeReadClient } from '@/lib/stripe-read'
import { DIGITAL_PRODUCTS, getPaymentLinkId, getPaymentLinkUrl } from '@/lib/products'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await requireAdminApiSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const stripe = getStripeReadClient()
  const envLinks = DIGITAL_PRODUCTS.map((p) => {
    const url = getPaymentLinkUrl(p)
    const id = getPaymentLinkId(p)
    return {
      slug: p.slug,
      nom: p.nom,
      envUrl: p.paymentLinkUrlEnv,
      envId: p.paymentLinkIdEnv,
      url,
      id,
      missing: !url,
    }
  })

  let paymentLinks: Array<{
    id: string
    url: string | null
    active: boolean
    livemode: boolean
  }> = []
  let products: Array<{ id: string; name: string; active: boolean }> = []

  if (stripe) {
    try {
      const links = await stripe.paymentLinks.list({ limit: 40 })
      paymentLinks = links.data.map((l) => ({
        id: l.id,
        url: l.url,
        active: l.active,
        livemode: l.livemode,
      }))
    } catch (err) {
      console.warn('[admin/stripe-links] paymentLinks.list', err)
    }
    try {
      const prods = await stripe.products.list({ limit: 40 })
      products = prods.data.map((p) => ({ id: p.id, name: p.name, active: p.active }))
    } catch (err) {
      console.warn('[admin/stripe-links] products.list', err)
    }
  }

  const alerts = envLinks
    .map((e) => {
      if (!e.id && !e.url) return `${e.slug} : variable absente`
      const match = e.id ? paymentLinks.find((l) => l.id === e.id) : paymentLinks.find((l) => l.url === e.url)
      if (e.url && !match) return `${e.slug} : lien Stripe introuvable (mode test ?)`
      if (match && !match.active) return `${e.slug} : lien inactif`
      if (match?.livemode) return `${e.slug} : lien LIVE détecté — cette PR ne doit pas opérer en live`
      return null
    })
    .filter(Boolean)

  return NextResponse.json(
    { envLinks, paymentLinks, products, alerts, readOnly: true },
    { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  )
}
