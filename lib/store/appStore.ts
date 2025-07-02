import { create } from 'zustand';
import type {
  AppStoreState,
  AppStoreActions,
  BootstrapData,
  // BootstrapCurrentWorkspaceData is WorkspaceWithRole | null, so directly use WorkspaceWithRole
} from '@/lib/types/bootstrap';
import type { WorkspaceWithRole } from '@/lib/types/workspace';

// Define the store type
type StoreType = AppStoreState & AppStoreActions;

// Define the initial state
const initialState: AppStoreState = {
  user: null,
  currentWorkspace: null,
  workspaceLimits: null,
  seatLimits: null,
  features: null,
  abilities: null,
  isInitialized: false,
  isLoading: false,
};

// Create the Zustand store
export const useAppStore = create<StoreType>((set, get) => ({
  ...initialState,

  loadBootstrapData: async (workspaceSlug?: string) => {
    set({ isLoading: true });
    try {
      let apiUrl = '/api/bootstrap';
      if (workspaceSlug) {
        apiUrl += `?workspaceSlug=${encodeURIComponent(workspaceSlug)}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch bootstrap data: ${response.statusText}`);
      }

      const data: BootstrapData = await response.json();

      set({
        user: data.user,
        currentWorkspace: data.currentWorkspace,
        workspaceLimits: data.workspaceLimits,
        seatLimits: data.seatLimits,
        features: data.features,
        abilities: data.abilities,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading bootstrap data:', error);
      // Keep previous state or clear parts of it? For now, just stop loading.
      // Consider setting isInitialized to true even on error to prevent infinite loading states.
      set({ isLoading: false, isInitialized: true }); // Mark as initialized even on error
    }
  },

  setCurrentWorkspaceDirectly: (workspace: WorkspaceWithRole | null) => {
    set({ currentWorkspace: workspace });
    // TODO: Consider if abilities and seatLimits should be re-evaluated or cleared here.
    // For now, a full loadBootstrapData(workspace?.slug) might be safer if abilities/seatLimits
    // for the new workspace are needed immediately and accurately without a full bootstrap.
    // Or, set abilities/seatLimits to null and let a component trigger a refresh if needed.
    set({ abilities: null, seatLimits: null });
  },

  clearStore: () => {
    set({ ...initialState, isInitialized: false }); // Reset to initial state, including isInitialized
  },
}));
