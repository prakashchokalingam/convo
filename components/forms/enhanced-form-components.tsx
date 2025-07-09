'use client';

import {
  ArrowLeft,
  Eye,
  Share,
  Save,
  ChevronDown,
  Layout,
  Plus,
  FileText,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { TemplateSelector } from '@/components/app/templates/specialized';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu';


interface FormHeaderProps {
  form: any;
  workspace: any;
  mode?: string;
}

export function FormHeader({ form, workspace: _workspace, mode }: FormHeaderProps) {
  const router = useRouter();
  const isTemplateMode = mode === 'template';

  return (
    <div className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-lg font-semibold text-gray-900'>
                {form?.title || 'Untitled Form'}
              </h1>
              {isTemplateMode && (
                <Badge className='bg-purple-100 text-purple-700 border-purple-200'>
                  <Layout className='w-3 h-3 mr-1' />
                  Template Mode
                </Badge>
              )}
              {form?.isPublished && (
                <Badge className='bg-green-100 text-green-700 border-green-200'>Published</Badge>
              )}
            </div>
            <div className='text-sm text-gray-500'>
              {isTemplateMode ? 'Template Editor' : 'Form Editor'} • Last updated:{' '}
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm'>
            <Eye className='w-4 h-4 mr-2' />
            Preview
          </Button>

          {!isTemplateMode && (
            <Button variant='outline' size='sm'>
              <Share className='w-4 h-4 mr-2' />
              Share
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <Save className='w-4 h-4 mr-2' />
                Save
                <ChevronDown className='w-4 h-4 ml-2' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <FileText className='w-4 h-4 mr-2' />
                Save Form
              </DropdownMenuItem>
              {!isTemplateMode && (
                <DropdownMenuItem>
                  <Layout className='w-4 h-4 mr-2' />
                  Save as Template
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {!isTemplateMode && <Button>{form?.isPublished ? 'Update' : 'Publish'}</Button>}

          {isTemplateMode && <Button>Save Template</Button>}
        </div>
      </div>
    </div>
  );
}

interface EnhancedFormEditorProps {
  form: any;
  workspace: any;
  mode?: string;
  templateId?: string;
}

export function EnhancedFormEditor({ form, workspace, mode, templateId }: EnhancedFormEditorProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isTemplateMode = mode === 'template';

  const handleTemplateSelect = async (_template: any) => {
    setIsLoading(true);
    // Here you would apply the template to the current form
    // For now, we'll just close the selector
    setTimeout(() => {
      setShowTemplateSelector(false);
      setIsLoading(false);
    }, 1000);
  };

  const renderPlaceholderEditor = () => (
    <div className='h-full flex items-center justify-center bg-gray-50'>
      <div className='text-center max-w-md'>
        <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          {isTemplateMode ? (
            <Layout className='w-8 h-8 text-blue-600' />
          ) : (
            <FileText className='w-8 h-8 text-blue-600' />
          )}
        </div>

        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          {isTemplateMode ? 'Template Editor' : 'Form Builder'} Coming Soon
        </h2>

        <p className='text-gray-600 mb-6'>
          {isTemplateMode
            ? 'Create and customize reusable form templates with our drag-and-drop editor.'
            : 'Build beautiful conversational forms with our visual drag-and-drop builder.'}
        </p>

        <div className='space-y-3'>
          <div className='text-sm text-gray-500'>Current capabilities:</div>
          <ul className='text-sm text-gray-600 space-y-1'>
            <li>✅ Template creation and management</li>
            <li>✅ Form creation from templates</li>
            <li>✅ Permission-based access control</li>
            <li>🚧 Visual form builder (in development)</li>
            <li>🚧 Advanced field types (coming soon)</li>
          </ul>
        </div>

        {!isTemplateMode && (
          <div className='mt-6'>
            <Button onClick={() => setShowTemplateSelector(true)} variant='outline'>
              <Plus className='w-4 h-4 mr-2' />
              Apply Template to Form
            </Button>
          </div>
        )}

        <div className='mt-4 text-xs text-gray-500'>
          Form ID: {form.id}
          {templateId && (
            <>
              <br />
              Template ID: {templateId}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderFormStructure = () => {
    let config;
    try {
      config = typeof form.config === 'string' ? JSON.parse(form.config) : form.config;
    } catch {
      config = { fields: [] };
    }

    if (!config.fields || config.fields.length === 0) {
      return renderPlaceholderEditor();
    }

    return (
      <div className='h-full bg-white'>
        <div className='p-6'>
          <div className='mb-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {isTemplateMode ? 'Template Structure' : 'Form Structure'}
            </h3>
            <p className='text-sm text-gray-600'>
              {config.fields.length} field{config.fields.length !== 1 ? 's' : ''} configured
            </p>
          </div>

          <div className='space-y-3'>
            {config.fields.map((field: any, index: number) => (
              <div
                key={field.id || index}
                className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='font-medium text-gray-900'>
                      {field.label || 'Untitled Field'}
                    </div>
                    <div className='text-sm text-gray-500'>
                      Type: {field.type} {field.required && '• Required'}
                    </div>
                  </div>
                  <Badge variant='outline' className='text-xs'>
                    #{index + 1}
                  </Badge>
                </div>

                {field.placeholder && (
                  <div className='mt-2 text-sm text-gray-600'>
                    Placeholder: &quot;{field.placeholder}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isTemplateMode && (
            <div className='mt-6 pt-6 border-t'>
              <Button
                onClick={() => setShowTemplateSelector(true)}
                variant='outline'
                className='w-full'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Template to Form
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className='h-full flex items-center justify-center'>
          <div className='text-center'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
            <div className='text-gray-600'>Applying template...</div>
          </div>
        </div>
      ) : (
        renderFormStructure()
      )}

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
        workspaceId={workspace.id}
      />
    </>
  );
}
