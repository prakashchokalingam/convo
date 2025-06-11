import { Suspense } from 'react';
import { getCurrentWorkspace } from '@/lib/workspace';
import { FormsList, CreateFormButton, FormsHeader } from '@/components/forms/form-components';

interface FormsPageProps {
  params: {
    workspaceSlug: string;
  };
}

export default async function FormsPage({ params }: FormsPageProps) {
  const workspace = await getCurrentWorkspace(params.workspaceSlug);

  return (
    <div className="space-y-6">
      {/* Forms Header with Search and Filters */}
      <FormsHeader workspace={workspace} />

      {/* Create Form Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your conversational forms
          </p>
        </div>
        <CreateFormButton workspace={workspace} />
      </div>

      {/* Forms List */}
      <Suspense fallback={<div>Loading forms...</div>}>
        <FormsList workspaceId={workspace.id} />
      </Suspense>
    </div>
  );
}

export function generateMetadata({ params }: { params: { workspaceSlug: string } }) {
  return {
    title: `Forms - ${params.workspaceSlug}`,
    description: 'Manage your forms and create new ones',
  };
}
