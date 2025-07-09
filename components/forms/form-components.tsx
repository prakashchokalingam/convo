'use client';

import { format } from 'date-fns';
import { Plus, Edit3, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { getFormsUrl, getFormEditorUrl } from '@/lib/urls/workspace-urls';


// Enhanced components for forms functionality

// Define a type for the form object
interface Form {
  id: string;
  title: string;
  description?: string | null;
  isPublished: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  workspaceSlug: string; // Added client-side during fetch processing
  creatorName: string; // From API
  responseCount: number; // From API
  isConversational: boolean; // From API
}

interface PaginationData {
  page: number;
  limit: number;
  totalForms: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const ITEMS_PER_PAGE = 10;

export interface FormsListProps {
  workspaceId: string;
  workspaceSlug: string;
  searchTerm: string;
  statusFilter: string;
  createdByFilter: string;
  createdAtFilter: string;
  currentPage: number;
  setCurrentPage: (page: number | ((prevPage: number) => number)) => void;
}

export function FormsList({
  workspaceId,
  workspaceSlug,
  searchTerm,
  statusFilter,
  createdByFilter,
  createdAtFilter,
  currentPage,
  setCurrentPage,
}: FormsListProps) {
  const [forms, setForms] = useState<Form[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        setError(null);

        let apiUrl = `/api/forms?workspaceId=${workspaceId}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`;
        if (searchTerm) {apiUrl += `&searchTerm=${encodeURIComponent(searchTerm)}`;}
        if (statusFilter && statusFilter !== 'all') {apiUrl += `&status=${statusFilter}`;}
        if (createdByFilter) {apiUrl += `&createdBy=${encodeURIComponent(createdByFilter)}`;}
        if (createdAtFilter) {apiUrl += `&createdAt=${createdAtFilter}`;}

        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch forms');
        }
        const data = await response.json();
        const apiForms = data.forms || [];
        const processedForms = apiForms.map((formItem: any) => ({
          ...formItem,
          workspaceSlug: workspaceSlug, // Add workspaceSlug for client-side navigation
        }));
        setForms(processedForms);
        setPaginationData(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setForms([]); // Clear forms on error
        setPaginationData(null); // Clear pagination on error
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchForms();
    }
  }, [
    workspaceId,
    workspaceSlug,
    searchTerm,
    statusFilter,
    createdByFilter,
    createdAtFilter,
    currentPage,
  ]);

  const handleTogglePublish = async (formId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`/api/forms/${formId}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form status');
      }
      setForms(prevForms =>
        prevForms.map(f => (f.id === formId ? { ...f, isPublished: newStatus } : f))
      );
      // TODO: Add toast notification for success
    } catch (error) {
      console.error('Error updating form status:', error);
      // TODO: Add toast notification for error
    }
  };

  if (loading) {
    return (
      <div className='bg-white rounded-lg border border-gray-200 p-6 text-center'>
        <p className='text-gray-500'>Loading forms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white rounded-lg border border-gray-200 p-6 text-center'>
        <p className='text-red-500'>Error: {error}</p>
      </div>
    );
  }

  if (forms.length === 0 && !loading) {
    return (
      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6'>
          <div className='text-center py-8'>
            <h3 className='text-lg font-medium text-gray-900'>No forms found</h3>
            <p className='text-sm text-gray-500 mt-1'>
              Try adjusting your filters or create a new form.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-white rounded-lg border border-gray-200 overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Title
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Creator
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Created At
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Responses
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {forms.map(form => (
              <tr key={form.id}>
                <td className='px-6 py-4'>
                  <Link
                    href={getFormEditorUrl(form.workspaceSlug, form.id)}
                    className='text-blue-600 hover:underline font-medium'
                  >
                    {form.title}
                  </Link>
                  {form.description && (
                    <p className='text-sm text-gray-500 mt-1 truncate max-w-xs'>
                      {form.description}
                    </p>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {form.creatorName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {format(new Date(form.createdAt), 'MMMM d, yyyy')}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <Badge
                    variant={form.isPublished ? 'default' : 'outline'}
                    className={
                      form.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {form.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {form.responseCount}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex items-center justify-end space-x-2'>
                    <Link href={getFormEditorUrl(form.workspaceSlug, form.id)}>
                      <Button variant='outline' size='sm' type='button'>
                        <Edit3 className='w-4 h-4 mr-1' />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant='outline'
                      size='sm'
                      type='button'
                      onClick={() => handleTogglePublish(form.id, form.isPublished)}
                    >
                      {form.isPublished ? (
                        <ToggleRight className='w-4 h-4 mr-1' />
                      ) : (
                        <ToggleLeft className='w-4 h-4 mr-1' />
                      )}
                      {form.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Link href={`/${form.workspaceSlug}/forms/${form.id}/responses`}>
                      <Button variant='outline' size='sm' type='button'>
                        <Eye className='w-4 h-4 mr-1' />
                        View Responses
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginationData && paginationData.totalForms > 0 && (
        <div className='mt-4 flex items-center justify-between'>
          <div>
            <p className='text-sm text-gray-700'>
              Page <span className='font-medium'>{paginationData.page}</span> of{' '}
              <span className='font-medium'>{paginationData.totalPages}</span>
            </p>
          </div>
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={!paginationData.hasPrev}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!paginationData.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
export function CreateFormButton({ workspace }: { workspace: any }) {
  return (
    <Link href={`${getFormsUrl(workspace.slug)}/new`}>
      <Button className='bg-blue-600 text-white hover:bg-blue-700'>
        <Plus className='w-4 h-4 mr-2' />
        Create Form
      </Button>
    </Link>
  );
}

export interface FormsHeaderProps {
  workspace: any; // Keeping workspace for now, can be refined if not needed
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  createdByFilter: string;
  onCreatedByFilterChange: (userId: string) => void;
  createdAtFilter: string;
  onCreatedAtFilterChange: (date: string) => void;
}

export function FormsHeader({
  workspace: _workspace,
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  createdByFilter,
  onCreatedByFilterChange,
  createdAtFilter,
  onCreatedAtFilterChange,
}: FormsHeaderProps) {
  return (
    <div className='px-6 py-4 bg-white rounded-lg border border-gray-200 mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <input
          type='text'
          placeholder='Search forms by title...'
          className='border border-gray-300 rounded-md px-3 py-2 text-sm w-full'
          value={searchTerm}
          onChange={e => onSearchTermChange(e.target.value)}
        />
        <select
          className='border border-gray-300 rounded-md px-3 py-2 text-sm w-full'
          value={statusFilter}
          onChange={e => onStatusFilterChange(e.target.value)}
        >
          <option value=''>All Statuses</option>
          <option value='published'>Published</option>
          <option value='draft'>Draft</option>
        </select>
        <input
          type='text'
          placeholder='Filter by Creator ID...'
          className='border border-gray-300 rounded-md px-3 py-2 text-sm w-full'
          value={createdByFilter}
          onChange={e => onCreatedByFilterChange(e.target.value)}
        />
        <input
          type='date'
          placeholder='Filter by Created Date...'
          className='border border-gray-300 rounded-md px-3 py-2 text-sm w-full'
          value={createdAtFilter}
          onChange={e => onCreatedAtFilterChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export function FormEditor({ form: _form, workspace: _workspace }: { form: any; workspace: any }) {
  return (
    <div className='h-full bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-xl font-semibold text-gray-900 mb-2'>Form Editor Coming Soon</div>
        <div className='text-gray-600'>This is where the drag-and-drop form builder will be</div>
      </div>
    </div>
  );
}

export function FormHeader({ form, workspace: _workspace }: { form: any; workspace: any }) {
  return (
    <div className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-lg font-semibold text-gray-900'>{form?.title || 'Untitled Form'}</h1>
          <div className='text-sm text-gray-500'>
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className='flex gap-2'>
          <button className='bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm'>
            Preview
          </button>
          <button className='bg-blue-600 text-white px-3 py-2 rounded-md text-sm'>Publish</button>
        </div>
      </div>
    </div>
  );
}

export function PublicFormRenderer({ form, isPreview }: { form: any; isPreview: boolean }) {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-md p-8 max-w-md w-full'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>{form?.title || 'Form Title'}</h1>
        <p className='text-gray-600 mb-6'>{form?.description || 'Form description goes here'}</p>
        {isPreview && (
          <div className='bg-blue-50 border border-blue-200 rounded-md p-3 mb-6'>
            <div className='text-blue-800 text-sm font-medium'>Preview Mode</div>
          </div>
        )}
        <div className='text-center py-8'>
          <div className='text-gray-500'>Form renderer coming soon</div>
        </div>
      </div>
    </div>
  );
}

export function FormSubmissionWrapper({
  form: _form,
  isPreview: _isPreview,
  children,
}: {
  form: any;
  isPreview: boolean;
  children: React.ReactNode;
}) {
  return <div className='min-h-screen bg-gray-50'>{children}</div>;
}
