'use client';

import { FileText, Plus, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Button } from '@/components/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { Separator } from '@/components/shared/ui/separator';
import { Textarea } from '@/components/shared/ui/textarea';
import { getFormsUrl } from '@/lib/urls/workspace-urls';

interface TemplateCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceSlug: string;
  onSuccess?: () => void;
}

const BUSINESS_CATEGORIES = [
  { value: 'HR', label: 'HR' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Support', label: 'Support' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Education', label: 'Education' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Other', label: 'Other' },
];

/**
 * TemplateCreateDialog - Template creation modal
 *
 * Provides options for creating templates:
 * 1. From scratch (opens form builder in template mode)
 * 2. From existing form (converts form to template)
 */
export function TemplateCreateDialog({
  isOpen,
  onClose,
  workspaceId,
  workspaceSlug,
  onSuccess,
}: TemplateCreateDialogProps) {
  const router = useRouter();
  const [createMode, setCreateMode] = useState<'scratch' | 'form' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for template metadata
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: '',
  });

  const resetDialog = () => {
    setCreateMode(null);
    setTemplateData({ name: '', description: '', category: '' });
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleCreateFromScratch = () => {
    // Redirect to form builder with template mode
    const params = new URLSearchParams({
      mode: 'template',
      workspaceId,
      name: templateData.name || 'New Template',
      description: templateData.description || '',
      category: templateData.category || '',
    });

    const newFormUrl = getFormsUrl(workspaceSlug) + `/new?${params}`;
    router.push(newFormUrl);
    handleClose();
  };

  const handleCreateFromForm = async () => {
    if (!templateData.name.trim()) {
      setError('Template name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a basic template with minimal form schema
      const basicFormSchema = {
        fields: [
          {
            id: 'sample_field',
            type: 'text',
            label: 'Sample Field',
            placeholder: 'Replace this with your form fields',
            required: false,
          },
        ],
        settings: {
          submitButtonText: 'Submit',
          successMessage: 'Thank you for your submission!',
        },
      };

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          workspaceId,
          formSchema: basicFormSchema,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create template');
      }

      const data = await response.json();

      // Success - redirect to edit the template
      const editTemplateUrl =
        getFormsUrl(workspaceSlug) + `/new?templateId=${data.template.id}&mode=template`;
      router.push(editTemplateUrl);

      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error) {
      console.error('Error creating template:', error);
      setError(error instanceof Error ? error.message : 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (createMode === 'form') {
      return templateData.name.trim().length > 0;
    }
    return true; // For 'scratch' mode, validation happens in form builder
  };

  const renderModeSelection = () => (
    <div className='space-y-4'>
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          How would you like to create your template?
        </h3>
        <p className='text-sm text-gray-600'>Choose how you want to start building your template</p>
      </div>

      <div className='grid grid-cols-1 gap-3'>
        {/* Create from Scratch */}
        <button
          onClick={() => setCreateMode('scratch')}
          className='p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group'
        >
          <div className='flex items-start gap-3'>
            <div className='flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors'>
              <Sparkles className='w-5 h-5 text-blue-600' />
            </div>
            <div className='flex-1'>
              <h4 className='font-medium text-gray-900 mb-1'>Start from Scratch</h4>
              <p className='text-sm text-gray-600'>
                Use the form builder to create a new template with custom fields and settings
              </p>
            </div>
          </div>
        </button>

        {/* Create Basic Template */}
        <button
          onClick={() => setCreateMode('form')}
          className='p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left group'
        >
          <div className='flex items-start gap-3'>
            <div className='flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
              <FileText className='w-5 h-5 text-green-600' />
            </div>
            <div className='flex-1'>
              <h4 className='font-medium text-gray-900 mb-1'>Create Basic Template</h4>
              <p className='text-sm text-gray-600'>
                Create a template with basic metadata, then customize it in the form builder
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderTemplateForm = () => (
    <div className='space-y-4'>
      <div className='text-center mb-4'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Template Information</h3>
        <p className='text-sm text-gray-600'>Provide basic information for your template</p>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className='space-y-4'>
        <div>
          <Label htmlFor='template-name'>Template Name *</Label>
          <Input
            id='template-name'
            placeholder='e.g., Customer Feedback Survey'
            value={templateData.name}
            onChange={e => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
            className='mt-1'
          />
        </div>

        <div>
          <Label htmlFor='template-description'>Description</Label>
          <Textarea
            id='template-description'
            placeholder='Describe what this template is for and how it should be used...'
            value={templateData.description}
            onChange={e => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
            className='mt-1'
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor='template-category'>Category</Label>
          <Select
            value={templateData.category}
            onValueChange={value => setTemplateData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='Select a business category' />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderScratchForm = () => (
    <div className='space-y-4'>
      <div className='text-center mb-4'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Template Setup</h3>
        <p className='text-sm text-gray-600'>
          Provide basic information, then use the form builder to create your template
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <Label htmlFor='scratch-name'>Template Name (Optional)</Label>
          <Input
            id='scratch-name'
            placeholder='e.g., Customer Feedback Survey'
            value={templateData.name}
            onChange={e => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
            className='mt-1'
          />
          <p className='text-xs text-gray-500 mt-1'>
            You can change this later in the form builder
          </p>
        </div>

        <div>
          <Label htmlFor='scratch-description'>Description (Optional)</Label>
          <Textarea
            id='scratch-description'
            placeholder='Describe what this template is for...'
            value={templateData.description}
            onChange={e => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
            className='mt-1'
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor='scratch-category'>Category (Optional)</Label>
          <Select
            value={templateData.category}
            onValueChange={value => setTemplateData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className='mt-1'>
              <SelectValue placeholder='Select a business category' />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus className='w-5 h-5' />
            Create Template
          </DialogTitle>
          <DialogDescription>
            Create a reusable template to speed up form creation
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          {!createMode && renderModeSelection()}
          {createMode === 'form' && renderTemplateForm()}
          {createMode === 'scratch' && renderScratchForm()}
        </div>

        {createMode && (
          <>
            <Separator />
            <div className='flex justify-between'>
              <Button variant='outline' onClick={() => setCreateMode(null)}>
                Back
              </Button>

              <div className='flex gap-2'>
                <Button variant='outline' onClick={handleClose}>
                  Cancel
                </Button>

                <Button
                  onClick={
                    createMode === 'scratch' ? handleCreateFromScratch : handleCreateFromForm
                  }
                  disabled={!validateForm() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className='w-4 h-4 mr-2' />
                      {createMode === 'scratch' ? 'Open Form Builder' : 'Create Template'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
