/**
 * Fiches pratiques S.A.L.I.M. — politique de diffusion
 *
 * ## Où déposer les SVG
 * - Dossier : `config/fp/` (hors `public/`)
 * - Nom de fichier : `{asset-id}.svg` où asset-id = valeur YAML `fiche_liee` ou `schemas_lies`
 *   Ex. YAML `fiche_liee: "FP-P4-CH13-checklist-dependances-01"`
 *   → fichier `config/fp/FP-P4-CH13-checklist-dependances-01.svg`
 *
 * ## Accès client
 * - URL : `/api/salim-qa/fiche?q={question-id}&i=0` (jamais le nom FP-* dans l’URL)
 * - Contrôle : connecté + (question débloquée OU Pro/Day Pass/admin) → SVG ; sinon 204 vide
 * - Viewer client : fetch + SVG inline + overlay (pas de `<img src>`, pas de clic droit)
 */
export const FICHES_MUST_NOT_BE_PUBLIC = true as const

/** Métadonnées publiques — jamais d’identifiant FP-* / SVG-* ni chemin fichier */
export function publicFicheMeta(
  ficheLiees: string[],
  schemasLies: string[],
  ficheFor: string[],
  ficheCount: number
) {
  return {
    hasFiche: ficheLiees.length > 0 || schemasLies.length > 0,
    ficheCount,
    ficheDestineeA: ficheFor,
  }
}

/** URL sécurisée côté client (question id uniquement) */
export function salimQaFicheUrl(questionId: string, index = 0): string {
  const params = new URLSearchParams({ q: questionId })
  if (index > 0) params.set('i', String(index))
  return `/api/salim-qa/fiche?${params.toString()}`
}
