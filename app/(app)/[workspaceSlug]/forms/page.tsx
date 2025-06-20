"use client"; // Required for using useState

import { useState, useEffect } from 'react';
import { getCurrentWorkspace } from '@/lib/workspace'; // Still needed for initial workspace data
import { FormsList, CreateFormButton, FormsHeader } from '@/components/forms/form-components';

interface FormsPageProps {
  params: {
    workspaceSlug: string;
  };
}

// Define a type for the workspace if not already available globally
interface Workspace {
  id: string;
  name: string;
  slug: string;
  // Add other workspace properties if needed
}

export default function FormsPage({ params }: FormsPageProps) {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // 'all', 'published', 'draft'
  const [createdByFilter, setCreatedByFilter] = useState(''); // User ID or name string
  const [createdAtFilter, setCreatedAtFilter] = useState(''); // ISO date string or predefined range
  const [currentPage, setCurrentPage] = useState(1);

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        setLoadingWorkspace(true);
        const ws = await getCurrentWorkspace(params.workspaceSlug);
        setWorkspace(ws);
      } catch (error) {
        console.error("Failed to load workspace", error);
        // Handle error appropriately, e.g., show error message or redirect
      } finally {
        setLoadingWorkspace(false);
      }
    }
    loadWorkspace();
  }, [params.workspaceSlug]);

  if (loadingWorkspace || !workspace) {
    return <div>Loading workspace information...</div>; // Or a more sophisticated loading state
  }

  return (
    <div className="space-y-6">
      {/* Forms Header with Search and Filters */}
      <FormsHeader
        workspace={workspace} // Keep workspace prop for now, can be removed if FormsHeader no longer needs it directly
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        createdByFilter={createdByFilter}
        onCreatedByFilterChange={setCreatedByFilter}
        createdAtFilter={createdAtFilter}
        onCreatedAtFilterChange={setCreatedAtFilter}
      />

      {/* Create Form Button and Page Title */}
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
      <FormsList
        workspaceId={workspace.id}
        workspaceSlug={params.workspaceSlug}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        createdByFilter={createdByFilter}
        createdAtFilter={createdAtFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage} // Pass setter for pagination
      />
    </div>
  );
}

// generateMetadata remains a server-side export if possible, or needs adjustment
// For client components, metadata is typically handled differently (e.g. using Head from next/document or next/head)
// However, Next.js 13+ app router allows generateMetadata in client component files too.
export function generateMetadata({ params }: { params: { workspaceSlug: string } }) {
  return {
    title: `Forms - ${params.workspaceSlug}`,
    description: 'Manage your forms and create new ones',
  };
}
