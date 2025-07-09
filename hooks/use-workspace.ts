'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface WorkspaceWithRole {
  id: string;
  name: string;
  slug: string;
  type: 'default' | 'team';
  ownerId: string;
  description: string | null;
  avatarUrl: string | null;
  settings: string | null;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export function useWorkspace() {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const [workspace, setWorkspace] = useState<WorkspaceWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workspaceSlug = params?.workspaceSlug as string;

  useEffect(() => {
    async function fetchWorkspace() {
      if (!isLoaded || !user || !workspaceSlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/workspaces/${workspaceSlug}`);

        if (!response.ok) {
          throw new Error('Failed to fetch workspace');
        }

        const apiResponse = await response.json();

        // Handle the API response format { success: true, data: { workspace: ... } }
        if (apiResponse.success && apiResponse.data?.workspace) {
          setWorkspace(apiResponse.data.workspace);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching workspace:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workspace');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkspace();
  }, [workspaceSlug, isLoaded, user]);

  // Helper function to check permissions
  const hasPermission = (requiredRole: 'viewer' | 'member' | 'admin' | 'owner') => {
    if (!workspace) return false;

    const roleHierarchy = { viewer: 1, member: 2, admin: 3, owner: 4 };
    const userRoleLevel = roleHierarchy[workspace.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    return userRoleLevel >= requiredRoleLevel;
  };

  return {
    workspace,
    userRole: workspace?.role || 'viewer',
    loading,
    error,
    hasPermission,
  };
}
