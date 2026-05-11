import 'server-only'

import { execFile } from 'child_process'
import { mkdtemp, readdir, readFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'

import { intelFeedPatch } from '@/lib/intelligence/feed-repository'

const execFileAsync = promisify(execFile)

function stripVtt(raw: string): string {
  return raw
    .replace(/^WEBVTT[^\n]*\n+/im, '')
    .replace(/\d{2}:\d{2}:\d{2}\.\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}\.\d{3}[^\n]*\n/g, '')
    .replace(/^\s*NOTE[^\n]*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
}

/** Extrait un transcript via sous-titres auto (yt-dlp doit être installé sur le serveur). */
export async function fetchYoutubeTranscriptText(url: string): Promise<{ text?: string; error?: string }> {
  const bin = process.env.YT_DLP_PATH?.trim() || 'yt-dlp'
  const dir = await mkdtemp(join(tmpdir(), 'aigile-ytdlp-'))

  try {
    await execFileAsync(
      bin,
      [
        '--no-playlist',
        '--write-auto-sub',
        '--write-sub',
        '--sub-lang',
        'en,fr',
        '--skip-download',
        '--sub-format',
        'vtt',
        '-o',
        join(dir, '%(id)s'),
        url,
      ],
      {
        timeout: 180_000,
        maxBuffer: 32 * 1024 * 1024,
        cwd: dir,
      },
    )

    const files = await readdir(dir)
    const vtt =
      files.find((f) => /\.en\.vtt$/i.test(f)) ??
      files.find((f) => /\.fr\.vtt$/i.test(f)) ??
      files.find((f) => f.endsWith('.vtt'))

    if (!vtt) {
      return { error: 'Aucun sous-titre automatique disponible pour cette URL.' }
    }

    const raw = await readFile(join(dir, vtt), 'utf8')
    const text = stripVtt(raw).trim()
    if (!text) return { error: 'Sous-titre vide après extraction.' }

    return { text: text.slice(0, 80_000) }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if ((msg || '').includes('ENOENT') || (msg || '').toLowerCase().includes('spawn')) {
      return { error: 'yt-dlp introuvable sur le serveur (installer yt-dlp ou définir YT_DLP_PATH).' }
    }
    return { error: msg.slice(0, 800) }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

export async function runYoutubeTranscriptJob(
  itemId: string,
  youtubeUrl: string,
  opts?: { skipAnalyzingBootstrap?: boolean },
): Promise<void> {
  if (!opts?.skipAnalyzingBootstrap) {
    const started = new Date().toISOString()
    await intelFeedPatch(itemId, {
      status: 'analyzing',
      analyst_started_at: started,
      transcript_error: null,
    })
  }

  const result = await fetchYoutubeTranscriptText(youtubeUrl)
  const now = new Date().toISOString()

  if (result.text) {
    const snippet = result.text.slice(0, 320).trim()
    await intelFeedPatch(itemId, {
      status: 'ready',
      transcript_text: result.text,
      transcript_error: null,
      preview_snippet: snippet || null,
      ready_at: now,
    })
    return
  }

  await intelFeedPatch(itemId, {
    status: 'error',
    transcript_error: result.error ?? 'Erreur inconnue',
    ready_at: null,
  })
}

export function enqueueYoutubeTranscriptJob(
  itemId: string,
  youtubeUrl: string,
  opts?: { skipAnalyzingBootstrap?: boolean },
): void {
  void runYoutubeTranscriptJob(itemId, youtubeUrl, opts).catch((err) => {
    console.error('[intel yt transcript]', itemId, err)
    const msg = err instanceof Error ? err.message : String(err)
    void intelFeedPatch(itemId, {
      status: 'error',
      transcript_error: msg.slice(0, 500),
      ready_at: null,
    })
  })
}
