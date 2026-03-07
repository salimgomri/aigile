export type TeamRole = 
  | 'manager' 
  | 'scrum_master' 
  | 'product_owner' 
  | 'agile_coach' 
  | 'dev_team' 
  | 'guest'

export const PERMISSIONS = {
  niko_niko: {
    read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
    write: ['manager', 'scrum_master', 'dev_team'],
    write_own_only: ['dev_team'],
  },
  skill_matrix: {
    read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
    write: ['manager', 'scrum_master'],
    write_own_only: ['dev_team'],
  },
  okr: {
    read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'guest'],
    write: ['manager', 'product_owner'],
  },
  dora: {
    read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'guest'],
    write: ['manager', 'scrum_master'],
  },
  retro: {
    read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
    generate: ['manager', 'scrum_master', 'agile_coach'],
  },
  dashboard: {
    read: ['manager', 'scrum_master', 'product_owner', 'agile_coach', 'dev_team', 'guest'],
  },
  team_config: {
    read: ['manager', 'scrum_master', 'agile_coach', 'guest'],
    write: ['manager'],
  },
  export: {
    execute: ['manager'],
  },
} as const

export function canAccess(
  userRole: TeamRole, 
  resource: keyof typeof PERMISSIONS, 
  action: string
): boolean {
  const permissions = PERMISSIONS[resource]
  if (!permissions) return false
  
  const allowedRoles = permissions[action as keyof typeof permissions] as readonly TeamRole[] | undefined
  return allowedRoles?.includes(userRole) || false
}

export function canWriteOwnData(
  userRole: TeamRole,
  resource: keyof typeof PERMISSIONS
): boolean {
  const permissions = PERMISSIONS[resource]
  if (!permissions || !('write_own_only' in permissions)) return false
  
  return permissions.write_own_only?.includes(userRole) || false
}
