interface QuickActionsProps {
  workspace: any;
}

export function QuickActions({ workspace }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Create Form</h3>
        <p className="text-sm text-gray-600 mb-4">Start building a new conversational form</p>
        <button className="text-blue-600 text-sm font-medium">+ New Form</button>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">View Responses</h3>
        <p className="text-sm text-gray-600 mb-4">Check latest form submissions</p>
        <button className="text-blue-600 text-sm font-medium">View All</button>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
        <p className="text-sm text-gray-600 mb-4">Track form performance</p>
        <button className="text-blue-600 text-sm font-medium">View Stats</button>
      </div>
    </div>
  );
}

export function DashboardStats({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-2xl font-bold text-gray-900">0</div>
        <div className="text-sm text-gray-600">Total Forms</div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-2xl font-bold text-gray-900">0</div>
        <div className="text-sm text-gray-600">Responses</div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-2xl font-bold text-gray-900">0%</div>
        <div className="text-sm text-gray-600">Completion Rate</div>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-2xl font-bold text-gray-900">0</div>
        <div className="text-sm text-gray-600">Active Forms</div>
      </div>
    </div>
  );
}

export function RecentForms({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Recent Forms</h3>
      </div>
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">No forms yet</div>
          <div className="text-gray-400 text-xs mt-1">Create your first form to get started</div>
        </div>
      </div>
    </div>
  );
}
