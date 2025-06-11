'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { buildContextUrl } from '@/lib/subdomain';

interface SetupWorkspaceData {
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
}

export function useWorkspaceSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const setupWorkspace = async (data?: SetupWorkspaceData) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract user data from Clerk user object if not provided
      const payload = {
        email: data?.email || user.primaryEmailAddress?.emailAddress,
        firstName: data?.firstName || user.firstName,
        lastName: data?.lastName || user.lastName,
        username: data?.username || user.username,
        avatarUrl: data?.avatarUrl || user.imageUrl,
      };

      const response = await fetch('/api/setup-workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to setup workspace');
      }

      return {
        workspaceSlug: result.workspaceSlug,
        workspaceName: result.workspaceName,
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Workspace setup error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setupWorkspace,
    isLoading,
    error,
  };
}
