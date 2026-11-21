import path from 'path'
import fs from 'fs/promises'
import type { DigitalProduct } from '@/lib/products'
import { supabaseAdmin } from '@/lib/supabase'

export {
  paymentStatusPaid,
  productFromSession,
  assertSlugMatches,
} from '@/lib/downloads/session-guards'

const MAX_DOWNLOADS = 5

export function privateFilesDir(): string {
  return process.env.PRIVATE_FILES_DIR?.trim() || path.join(process.cwd(), 'private/files')
}

export function resolvePrivatePdf(product: DigitalProduct): string | null {
  if (!product.fichierCle) return null
  return path.join(privateFilesDir(), product.fichierCle)
}


export async function countDownloads(sessionId: string, slug: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('digital_downloads')
    .select('download_count')
    .eq('session_id', sessionId)
    .eq('product_slug', slug)
    .maybeSingle()
  return data?.download_count ?? 0
}

export async function incrementDownloads(sessionId: string, slug: string): Promise<number> {
  const current = await countDownloads(sessionId, slug)
  const next = current + 1
  await supabaseAdmin.from('digital_downloads').upsert(
    {
      session_id: sessionId,
      product_slug: slug,
      download_count: next,
      last_downloaded_at: new Date().toISOString(),
    },
    { onConflict: 'session_id,product_slug' },
  )
  return next
}

export function maxDownloads(): number {
  return MAX_DOWNLOADS
}

export async function readPrivatePdf(product: DigitalProduct): Promise<Buffer | null> {
  const filePath = resolvePrivatePdf(product)
  if (!filePath) return null
  try {
    return await fs.readFile(filePath)
  } catch {
    return null
  }
}

