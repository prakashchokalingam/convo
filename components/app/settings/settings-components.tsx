// Placeholder components for settings functionality

import { getWorkspaceSettingsUrl } from '@/lib/workspace';

export function SettingsNavigation({ workspace, activeTab }: { workspace: any; activeTab: string }) {
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'members', label: 'Members' },
    { id: 'billing', label: 'Billing' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <nav className="space-y-1">
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={`${getWorkspaceSettingsUrl(workspace.slug)}?tab=${tab.id}`}
          className={`block px-3 py-2 text-sm rounded-md ${
            activeTab === tab.id
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}

export function WorkspaceSettings({ workspace, activeTab }: { workspace: any; activeTab: string }) {
  if (activeTab === 'general') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              defaultValue={workspace.name}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              defaultValue={workspace.description || ''}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              rows={3}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
      </h2>
      <div className="text-center py-8">
        <div className="text-gray-500">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon
        </div>
      </div>
    </div>
  );
}
