import type { Plan } from '@/lib/plans';
import type { WorkspaceWithRole } from '@/lib/types/workspace';

// 1. User Data
export interface BootstrapUserData {
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  plan: Plan | null;
  subscriptionStatus: string | null; // e.g., 'active', 'canceled', 'past_due'
}

// 2. Current Workspace Data
export type BootstrapCurrentWorkspaceData = WorkspaceWithRole | null;

// 3. Workspace Limits Data (for the user)
export interface BootstrapWorkspaceLimitsData {
  maxWorkspaces: number; // -1 for unlimited
  currentWorkspacesOwned: number;
  canCreateMoreWorkspaces: boolean;
}

// 4. Seat Limits Data (for the current workspace)
export interface BootstrapSeatLimitsData {
  maxSeats: number; // -1 for unlimited
  currentSeats: number;
  canInviteMoreMembers: boolean;
}

// 5. Features Data (global feature flags)
export interface BootstrapFeaturesData {
  canInviteUsersToAnyWorkspace: boolean; // Based on overall plan
  // Add other global feature flags as needed
}

// 6. Abilities Data (contextual to current workspace & user's role)
export interface BootstrapAbilitiesData {
  canManageWorkspaceSettings: boolean;
  canManageMembers: boolean;
  canDeleteWorkspace: boolean;
  // Add other specific abilities based on role
}

// 7. BootstrapData (API Response Structure)
export interface BootstrapData {
  user: BootstrapUserData | null;
  currentWorkspace: BootstrapCurrentWorkspaceData; // This is WorkspaceWithRole | null
  workspaceLimits: BootstrapWorkspaceLimitsData | null;
  seatLimits: BootstrapSeatLimitsData | null; // Null if no workspace is active
  features: BootstrapFeaturesData | null;
  abilities: BootstrapAbilitiesData | null; // Null if no workspace is active or no specific abilities defined
}

// 8. AppStoreState (Zustand Store Shape)
export interface AppStoreState {
  user: BootstrapUserData | null;
  currentWorkspace: BootstrapCurrentWorkspaceData;
  workspaceLimits: BootstrapWorkspaceLimitsData | null;
  seatLimits: BootstrapSeatLimitsData | null;
  features: BootstrapFeaturesData | null;
  abilities: BootstrapAbilitiesData | null;
  isInitialized: boolean;
  isLoading: boolean; // To track loading state of bootstrap call
}

// 9. AppStoreActions (Zustand Store Actions)
export interface AppStoreActions {
  loadBootstrapData: (workspaceSlug?: string) => Promise<void>;
  setCurrentWorkspaceDirectly: (workspace: WorkspaceWithRole | null) => void;
  clearStore: () => void;
  // Potentially other actions like manually updating parts of the store
}
