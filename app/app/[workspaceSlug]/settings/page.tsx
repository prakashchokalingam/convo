import { getCurrentWorkspace } from '@/lib/workspace-server';
import { WorkspaceSettings, SettingsNavigation } from '@/components/app/settings/settings-components';

interface SettingsPageProps {
  params: {
    workspaceSlug: string;
  };
  searchParams: {
    tab?: string;
  };
}

export default async function SettingsPage({ params, searchParams }: SettingsPageProps) {
  const workspace = await getCurrentWorkspace(params.workspaceSlug);
  const activeTab = searchParams.tab || 'general';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your workspace settings and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <SettingsNavigation 
            workspace={workspace} 
            activeTab={activeTab} 
          />
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <WorkspaceSettings 
            workspace={workspace} 
            activeTab={activeTab} 
          />
        </div>
      </div>
    </div>
  );
}

export function generateMetadata({ params }: { params: { workspaceSlug: string } }) {
  return {
    title: `Settings - ${params.workspaceSlug}`,
    description: 'Manage workspace settings and preferences',
  };
}
