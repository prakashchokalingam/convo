import { Suspense } from 'react';

import {
  DashboardStats,
  RecentForms,
  QuickActions,
} from '@/components/app/dashboard/dashboard-components';
import { WelcomeBanner } from '@/components/app/dashboard/welcome-banner';
import { getCurrentWorkspace } from '@/lib/workspace-server';

interface WorkspaceDashboardProps {
  params: {
    workspaceSlug: string;
  };
  searchParams: {
    welcome?: string;
  };
}

export default async function WorkspaceDashboard({
  params,
  searchParams,
}: WorkspaceDashboardProps) {
  const workspace = await getCurrentWorkspace(params.workspaceSlug);
  const isWelcome = searchParams.welcome === 'true';

  return (
    <div className='space-y-6'>
      {/* Welcome Banner for new users */}
      {isWelcome && <WelcomeBanner workspace={workspace} />}

      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Welcome to {workspace.name}</h1>
        <p className='mt-1 text-sm text-gray-500'>
          {workspace.description || 'Create and manage your conversational forms'}
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions workspace={workspace} />

      {/* Dashboard Stats */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats workspaceId={workspace.id} />
      </Suspense>

      {/* Recent Forms */}
      <Suspense fallback={<div>Loading forms...</div>}>
        <RecentForms workspaceId={workspace.id} />
      </Suspense>
    </div>
  );
}

export function generateMetadata({ params }: { params: { workspaceSlug: string } }) {
  return {
    title: `${params.workspaceSlug} Dashboard`,
    description: 'Manage your forms and responses',
  };
}
