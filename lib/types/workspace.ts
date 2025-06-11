// Types for workspace data - safe to import in client components
// No database dependencies

export interface WorkspaceWithRole {
  id: string;
  name: string;
  slug: string;
  type: 'default' | 'team';
  ownerId: string;
  description: string | null;
  avatarUrl: string | null;
  settings: any;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  memberCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';
export type WorkspaceType = 'default' | 'team';

// Role hierarchy utility (client-safe)
export const roleHierarchy = { 
  viewer: 1, 
  member: 2, 
  admin: 3, 
  owner: 4 
} as const;

// Helper function to check role permissions (client-safe)
export function hasPermission(
  userRole: WorkspaceRole, 
  requiredRole: WorkspaceRole
): boolean {
  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];
  return userRoleLevel >= requiredRoleLevel;
}
