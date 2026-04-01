/** Agrégation type v_tool_usage_macro à partir de lignes credit_transactions filtrées. */

export type ToolUsageCreditRow = {
  tool_slug: string
  user_id: string
  cost: number | null
  created_at: string
}

export type ToolUsageMacroRow = {
  tool_slug: string
  total_uses: number
  total_credits_spent: number
  unique_users: number
  first_used_at: string | null
  last_used_at: string | null
}

export function aggregateToolUsageMacro(rows: ToolUsageCreditRow[]): ToolUsageMacroRow[] {
  const byTool = new Map<
    string,
    {
      uses: number
      credits: number
      users: Set<string>
      first: string | null
      last: string | null
    }
  >()

  for (const r of rows) {
    if (!r.tool_slug) continue
    const slot =
      byTool.get(r.tool_slug) ?? {
        uses: 0,
        credits: 0,
        users: new Set<string>(),
        first: null,
        last: null,
      }
    slot.uses += 1
    slot.credits += r.cost ?? 0
    slot.users.add(r.user_id)
    const ca = r.created_at
    if (!slot.first || ca < slot.first) slot.first = ca
    if (!slot.last || ca > slot.last) slot.last = ca
    byTool.set(r.tool_slug, slot)
  }

  return [...byTool.entries()]
    .map(([tool_slug, v]) => ({
      tool_slug,
      total_uses: v.uses,
      total_credits_spent: v.credits,
      unique_users: v.users.size,
      first_used_at: v.first,
      last_used_at: v.last,
    }))
    .sort((a, b) => b.total_uses - a.total_uses)
}
