"use client"; // Required for using useState

import { useState, useEffect } from 'react';
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
      setLoadingWorkspace(true);
      try {
        const response = await fetch(`/api/workspaces/${params.workspaceSlug}/current`);
        if (!response.ok) {
          throw new Error(`Failed to fetch workspace: ${response.status}`);
        }
        const ws = await response.json();
        setWorkspace(ws);
      } catch (error) {
        console.error("Failed to load workspace", error);
        // Handle error appropriately, e.g., show error message or redirect
        // For now, we'll just log it and the component will show loading/error state
        setWorkspace(null); // Clear workspace on error
      } finally {
        setLoadingWorkspace(false);
      }
    }
    if (params.workspaceSlug) {
      loadWorkspace();
    }
  }, [params.workspaceSlug]);

  if (loadingWorkspace) {
    return <div>Loading workspace information...</div>; // Or a more sophisticated loading state
  }

  if (!workspace) {
    return <div>Error loading workspace or workspace not found.</div>; // Handle case where workspace is null after loading
  }

  return (
    <div className="space-y-6">
      {/* Forms Header with Search and Filters */}
      <FormsHeader
        workspace={workspace}
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

