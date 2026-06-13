/**
 * Fiches pratiques S.A.L.I.M. — politique de diffusion
 *
 * - Ne jamais placer les PDF/SVG des fiches dans `public/`
 * - Les identifiants (FP-*, SVG-*) restent côté serveur (YAML / storage privé)
 * - L'API publique n'expose que le libellé ficheLiee, jamais le fichier
 * - Futur accès : route authentifiée + URL signée courte durée (Supabase Storage privé)
 */
export const FICHES_MUST_NOT_BE_PUBLIC = true as const

/** Ne pas exposer schemas_lies ni chemins assets au client */
export function publicFicheMeta(ficheLiee: string | null | undefined, ficheFor: string[]) {
  return {
    ficheLiee: ficheLiee ?? null,
    ficheDestineeA: ficheFor,
    hasFiche: !!ficheLiee,
  }
}
