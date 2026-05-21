/** Aligné sur la Veille / Sources : seuil mini pour considérer une ligne flux « avec analyse » (corps exploitable). */
export const MIN_READABLE_FEED_CHARS = 80

/** Texte principal stocké (HTML extrait ou transcript). */
export function intelFeedPrimaryBody(row: { content?: string | null; transcript_text?: string | null }): string {
  const c = (row.content ?? '').trim()
  if (c.length > 0) return c
  return (row.transcript_text ?? '').trim()
}

export function intelFeedRowHasReadableBody(row: { content?: string | null; transcript_text?: string | null }): boolean {
  return intelFeedPrimaryBody(row).length >= MIN_READABLE_FEED_CHARS
}
