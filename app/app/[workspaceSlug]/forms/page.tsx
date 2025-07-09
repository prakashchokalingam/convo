import { Suspense } from 'react';

import { FormsList, CreateFormButton, FormsHeader } from '@/components/forms/form-components';
import { getCurrentWorkspace } from '@/lib/workspace-server';

interface FormsPageProps {
  params: {
    workspaceSlug: string;
  };
}

export default async function FormsPage({ params }: FormsPageProps) {
  const workspace = await getCurrentWorkspace(params.workspaceSlug);

  return (
    <div className='space-y-6'>
      {/* Forms Header with Search and Filters */}
      <FormsHeader workspace={workspace} />

      {/* Page Title and Create Form Button */}
      <div className='flex justify-between items-center mb-6 px-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Forms</h1>
          <p className='mt-1 text-sm text-gray-500'>Create and manage your conversational forms</p>
        </div>
        {/* CreateFormButton is now part of FormsHeader or rendered separately if needed */}
      </div>

      {/* Create Form Button - Moved to be a direct child for consistent spacing */}
      <div className='flex justify-end px-6'>
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
