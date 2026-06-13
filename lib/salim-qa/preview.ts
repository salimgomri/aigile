export const SALIM_QA_PREVIEW_LENGTH = 50

/** Aplatit les retours à la ligne et tronque à 50 caractères avec "..." */
export function previewAnswer(text: string, maxLen = SALIM_QA_PREVIEW_LENGTH): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= maxLen) return flat
  return `${flat.slice(0, maxLen).trimEnd()}...`
}
