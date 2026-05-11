/** Dégradé de secours quand aucune miniature n’est disponible (couleur par palier). */
export function tierCoverGradientClass(tierId: string): string {
  switch (tierId) {
    case 'empire_builders':
      return 'bg-gradient-to-br from-zinc-950 via-amber-950/90 to-black'
    case 'wealth_architects':
      return 'bg-gradient-to-br from-emerald-950 via-teal-950/80 to-zinc-950'
    case 'product_elite':
      return 'bg-gradient-to-br from-slate-900 via-indigo-950/85 to-zinc-950'
    case 'agile_scale':
      return 'bg-gradient-to-br from-blue-950 via-slate-900 to-zinc-950'
    case 'coaching_leadership':
      return 'bg-gradient-to-br from-rose-950/90 via-violet-950/70 to-zinc-950'
    case 'podcasts_audio':
      return 'bg-gradient-to-br from-violet-950 via-fuchsia-950/75 to-zinc-950'
    default:
      return 'bg-gradient-to-br from-zinc-900 via-muted/40 to-zinc-950'
  }
}
