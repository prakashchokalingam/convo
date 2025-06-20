import { getCurrentWorkspace, validateWorkspaceAccess } from '@/lib/workspace-server';
import { MembersList, InviteMemberButton, MembersHeader } from '@/components/app/members/members-components';

interface MembersPageProps {
  params: {
    workspaceSlug: string;
  };
}

export default async function MembersPage({ params }: MembersPageProps) {
  // Only admins and owners can access member management
  const workspace = await validateWorkspaceAccess(params.workspaceSlug, 'admin');

  return (
    <div className="space-y-6">
      {/* Members Header */}
      <MembersHeader workspace={workspace} />

      {/* Page Header with Invite Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage workspace members and their permissions
          </p>
        </div>
        
        {(workspace.role === 'owner' || workspace.role === 'admin') && (
          <InviteMemberButton workspace={workspace} />
        )}
      </div>

      {/* Members List */}
      <MembersList workspaceId={workspace.id} currentUserRole={workspace.role} />
    </div>
  );
}

export function generateMetadata({ params }: { params: { workspaceSlug: string } }) {
  return {
    title: `Members - ${params.workspaceSlug}`,
    description: 'Manage workspace members and permissions',
  };
}
