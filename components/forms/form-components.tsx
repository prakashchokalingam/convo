"use client";

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';

// Enhanced components for forms functionality

export function FormsList({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">No forms yet</div>
          <div className="text-gray-400 text-xs mt-1">Create your first form to get started</div>
        </div>
      </div>
    </div>
  );
}

export function CreateFormButton({ workspace }: { workspace: any }) {
  return (
    <Link href={`/${workspace.slug}/forms/new`}>
      <Button className="bg-blue-600 text-white hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Create Form
      </Button>
    </Link>
  );
}

export function FormsHeader({ workspace }: { workspace: any }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <input
          type="text"
          placeholder="Search forms..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>All Forms</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>
    </div>
  );
}

export function FormEditor({ form, workspace }: { form: any; workspace: any }) {
  return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-900 mb-2">
          Form Editor Coming Soon
        </div>
        <div className="text-gray-600">
          This is where the drag-and-drop form builder will be
        </div>
      </div>
    </div>
  );
}

export function FormHeader({ form, workspace }: { form: any; workspace: any }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {form?.title || 'Untitled Form'}
          </h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm">
            Preview
          </button>
          <button className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export function PublicFormRenderer({ form, isPreview }: { form: any; isPreview: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {form?.title || 'Form Title'}
        </h1>
        <p className="text-gray-600 mb-6">
          {form?.description || 'Form description goes here'}
        </p>
        {isPreview && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
            <div className="text-blue-800 text-sm font-medium">
              Preview Mode
            </div>
          </div>
        )}
        <div className="text-center py-8">
          <div className="text-gray-500">
            Form renderer coming soon
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormSubmissionWrapper({ form, isPreview, children }: { 
  form: any; 
  isPreview: boolean; 
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
