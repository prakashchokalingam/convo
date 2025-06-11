'use client';

import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/shared/ui/button';
import { Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import client-safe types
import type { WorkspaceWithRole } from '@/lib/types/workspace';
import { WorkspaceSwitcher } from '@/components/app/workspace/workspace-switcher';

interface AppHeaderProps {
  workspace: WorkspaceWithRole;
}

export function AppHeader({ workspace }: AppHeaderProps) {
  const [availableWorkspaces, setAvailableWorkspaces] = useState<WorkspaceWithRole[]>([workspace]);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all workspaces and usage data
        const [workspacesRes, usageRes] = await Promise.all([
          fetch('/api/workspaces'),
          fetch('/api/usage/workspaces')
        ]);

        const [workspacesData, usageData] = await Promise.all([
          workspacesRes.json(),
          usageRes.json()
        ]);

        if (workspacesData.success) {
          setAvailableWorkspaces(workspacesData.workspaces);
        }

        if (usageData.success) {
          setUsage(usageData.data);
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
        // Fallback to current workspace only
        setAvailableWorkspaces([workspace]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workspace]);

  const handleWorkspaceCreated = () => {
    // Refresh workspaces and usage data
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Workspace Switcher */}
        <div className="flex items-center gap-4">
          <WorkspaceSwitcher 
            currentWorkspace={workspace}
            availableWorkspaces={availableWorkspaces}
            usage={usage}
            onCreateWorkspace={handleWorkspaceCreated}
          />
        </div>

        {/* Center: Search (future) */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
