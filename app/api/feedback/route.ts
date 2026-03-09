import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { sendFeedbackEmail } from '@/lib/email'

function parseDeviceType(ua: string | null): string | null {
  if (!ua) return null
  const u = ua.toLowerCase()
  const isMobile = /mobile|android|iphone|ipad|ipod|webos|blackberry|iemobile|opera mini/i.test(u)
  if (/iphone|ipad|ipod|macintosh/i.test(u)) return isMobile ? 'Mobile Apple' : 'Desktop Apple'
  if (/windows|win32|win64|win10/i.test(u)) return isMobile ? 'Mobile Windows' : 'Desktop Windows'
  if (/android/i.test(u)) return 'Mobile Android'
  if (/linux/i.test(u)) return isMobile ? 'Mobile Linux' : 'Desktop Linux'
  return isMobile ? 'Mobile' : 'Desktop'
}

function getClientIp(headers: Headers): string | null {
  const cf = headers.get('cf-connecting-ip')
  if (cf) return cf
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null
  return headers.get('x-real-ip')
}

function getCountry(headers: Headers): string | null {
  return headers.get('x-vercel-ip-country') ?? headers.get('cf-ipcountry') ?? null
}

export async function POST(request: Request) {
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    const body = await request.json()
    const { message, pageUrl: clientPageUrl, senderName } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    if (!session?.user && (!senderName || typeof senderName !== 'string' || senderName.trim().length === 0)) {
      return NextResponse.json({ error: 'Nom requis pour les utilisateurs non connectés' }, { status: 400 })
    }

    const pageUrl = clientPageUrl ?? request.headers.get('referer') ?? null
    const userAgent = request.headers.get('user-agent') ?? null
    const msg = message.trim().slice(0, 2000)
    const displayName = session?.user?.name ?? (typeof senderName === 'string' ? senderName.trim() : null)

    const { error } = await supabaseAdmin.from('feedback').insert({
      user_id: session?.user?.id ?? null,
      message: msg,
      page_url: pageUrl?.slice(0, 500) ?? null,
      user_agent: userAgent?.slice(0, 500) ?? null,
      sender_name: displayName?.slice(0, 200) ?? null,
      device_type: parseDeviceType(userAgent),
      ip_address: getClientIp(h)?.slice(0, 45) ?? null,
      country: getCountry(h)?.slice(0, 10) ?? null,
    })

    if (error) {
      console.error('[API] feedback insert error:', error)
      return NextResponse.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 })
    }

    await sendFeedbackEmail({
      message: msg,
      pageUrl,
      userEmail: session?.user?.email ?? null,
      userName: displayName ?? null,
      deviceType: parseDeviceType(userAgent),
      ipAddress: getClientIp(h),
      country: getCountry(h),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API] feedback error:', err)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 })
  }
}
