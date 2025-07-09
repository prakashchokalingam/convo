'use client';

import { FileText, Loader2, ChevronLeft, Layout } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { TemplateSelector } from '@/components/app/templates/specialized';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  Card,
  CardContent,
} from '@/components/shared/ui/card';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Separator } from '@/components/shared/ui/separator';
import { Textarea } from '@/components/shared/ui/textarea';
import { useWorkspace } from '@/hooks/use-workspace';
import { Template } from '@/lib/db/schema';

/**
 * Enhanced Form Creation Page with Template Integration
 *
 * This page provides multiple ways to create forms:
 * 1. Choose from templates (Global or Workspace)
 * 2. Start from scratch
 * 3. Use AI generation (future enhancement)
 */
export default function NewFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspace, loading } = useWorkspace();

  // Check if a specific mode was requested (template mode, etc.)
  const mode = searchParams.get('mode'); // 'template' for template editing
  const templateId = searchParams.get('templateId');

  const [creationStep, setCreationStep] = useState<'choose' | 'details' | 'building'>('choose');
  const [selectedMethod, setSelectedMethod] = useState<'template' | 'scratch' | 'ai' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');

  // Form details for scratch creation
  const [formDetails, setFormDetails] = useState({
    title: '',
    description: '',
    isConversational: false,
  });

  useEffect(() => {
    // If template mode is specified, redirect to form builder
    if (mode === 'template' && templateId) {
      // This would redirect to the form builder in template mode
      // For now, we'll show a placeholder
      setCreationStep('building');
    }
  }, [mode, templateId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-gray-400 mx-auto mb-4' />
          <div className='text-gray-600'>Loading workspace...</div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <div className='text-red-600'>Failed to load workspace</div>
        </div>
      </div>
    );
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setSelectedMethod('template');
    setShowTemplateSelector(false);
    setCreationStep('details');

    // Pre-fill form details from template
    setFormDetails({
      title: `Form from ${template.name}`,
      description: template.description || '',
      isConversational: false,
    });
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !formDetails.title.trim()) {
      setError('Form title is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`/api/templates/${selectedTemplate.id}/create-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: workspace.id,
          name: formDetails.title,
          description: formDetails.description,
          isConversational: formDetails.isConversational,
          isPublished: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create form from template');
      }

      const data = await response.json();

      // Navigate to the form editor
      router.push(`/${workspace.slug}/forms/${data.form.id}`);
    } catch (error) {
      console.error('Error creating form from template:', error);
      setError(error instanceof Error ? error.message : 'Failed to create form');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFromScratch = async () => {
    setIsCreating(true);
    setError(null);

    if (selectedMethod === 'ai') {
      if (!aiPrompt.trim() || !formDetails.title.trim()) {
        setError('AI Prompt and Form Title are required for AI generation.');
        setIsCreating(false);
        return;
      }
      try {
        const response = await fetch('/api/forms/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: workspace.id,
            prompt: aiPrompt,
            formTitle: formDetails.title,
            // description: formDetails.description, // Description might not be needed for AI
            isConversational: formDetails.isConversational,
          }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: 'Failed to generate form using AI' }));
          throw new Error(errorData.message || 'Failed to generate form using AI');
        }

        const data = await response.json();

        // Navigate to the form editor
        router.push(`/${workspace.slug}/forms/${data.form.id}`);
      } catch (error) {
        console.error('Error generating form with AI:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during AI form generation'
        );
      } finally {
        setIsCreating(false);
      }
    } else {
      // Handles 'scratch' method
      if (!formDetails.title.trim()) {
        setError('Form title is required');
        setIsCreating(false);
        return;
      }
      try {
        // Create a basic form structure
        const basicFormSchema = {
          fields: [
            {
              id: 'sample_field',
              type: 'text',
              label: 'Sample Field',
              placeholder: 'Start building your form by editing this field',
              required: false,
            },
          ],
          settings: {
            submitButtonText: 'Submit',
            successMessage: 'Thank you for your submission!',
          },
        };

        const response = await fetch('/api/forms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: workspace.id,
            title: formDetails.title,
            description: formDetails.description,
            config: JSON.stringify(basicFormSchema),
            isConversational: formDetails.isConversational,
            isPublished: false,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create form from scratch');
        }

        const data = await response.json();

        // Navigate to the form editor
        router.push(`/${workspace.slug}/forms/${data.form.id}`);
      } catch (error) {
        console.error('Error creating form from scratch:', error);
        setError(error instanceof Error ? error.message : 'Failed to create form');
      } finally {
        setIsCreating(false);
      }
    }
  };

  const renderChooseMethod = () => (
    <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>{/* content here */}</div>
  );

  const renderFormDetails = () => (
    <div className='py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-6'>
          <Button variant='ghost' onClick={() => setCreationStep('choose')} className='mb-4 px-0'>
            <ChevronLeft className='w-4 h-4 mr-2' />
            Back to options
          </Button>

          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            {selectedMethod === 'template' ? 'Configure Your Form' : 'Form Details'}
          </h1>
          <p className='text-gray-600'>
            {selectedMethod === 'template'
              ? `Creating form from "${selectedTemplate?.name}" template`
              : selectedMethod === 'ai'
                ? 'Describe the form you want to create using AI'
                : 'Provide basic information for your new form'}
          </p>
        </div>

        {selectedTemplate && selectedMethod === 'template' && (
          <Card className='mb-6 bg-blue-50 border-blue-200 w-full'>
            <CardContent className='pt-6 p-4 sm:p-6'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                <Layout className='w-5 h-5 text-blue-600' />
                <div>
                  <div className='font-medium text-blue-900'>{selectedTemplate.name}</div>
                  <div className='text-sm text-blue-700'>{selectedTemplate.description}</div>
                </div>
                <Badge className='ml-auto bg-blue-100 text-blue-700 border-blue-200 mt-2 sm:mt-0'>
                  {selectedTemplate.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md w-full'>
            <div className='text-red-800 text-sm'>{error}</div>
          </div>
        )}

        <Card className='w-full'>
          <CardContent className='pt-6 p-4 sm:p-6 space-y-4'>
            {selectedMethod === 'ai' && (
              <div className='w-full'>
                <Label htmlFor='ai-prompt'>Describe your form (AI Prompt) *</Label>
                <Textarea
                  id='ai-prompt'
                  placeholder='e.g., A simple contact form with name, email, and message fields.'
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  className='mt-1 w-full'
                  rows={5}
                />
              </div>
            )}
            <div className='w-full'>
              <Label htmlFor='form-title'>Form Title *</Label>
              <Input
                id='form-title'
                placeholder='e.g., Customer Feedback Survey'
                value={formDetails.title}
                onChange={e => setFormDetails(prev => ({ ...prev, title: e.target.value }))}
                className='mt-1 w-full'
              />
            </div>

            {selectedMethod !== 'ai' && ( // Description may not be needed if AI is generating based on prompt
              <div className='w-full'>
                <Label htmlFor='form-description'>Description</Label>
                <Textarea
                  id='form-description'
                  placeholder='Describe what this form is for...'
                  value={formDetails.description}
                  onChange={e => setFormDetails(prev => ({ ...prev, description: e.target.value }))}
                  className='mt-1 w-full'
                  rows={3}
                />
              </div>
            )}

            <Separator />

            <div className='flex flex-col sm:flex-row justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setCreationStep('choose')}
                className='w-full sm:w-auto'
              >
                Cancel
              </Button>

              <Button
                onClick={
                  selectedMethod === 'template' ? handleCreateFromTemplate : handleCreateFromScratch
                } // TODO: Add AI handler
                disabled={
                  (selectedMethod === 'ai' ? !aiPrompt.trim() : !formDetails.title.trim()) ||
                  isCreating
                }
                className='w-full sm:w-auto'
              >
                {isCreating ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className='w-4 h-4 mr-2' />
                    Create Form
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBuilding = () => (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-600 mx-auto mb-4' />
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>Setting up your form...</h2>
        <p className='text-gray-600'>You&apos;ll be redirected to the form builder in a moment</p>
      </div>
    </div>
  );

  return (
    <div className='min-h-full bg-background py-4'>
      {creationStep === 'choose' && renderChooseMethod()}
      {creationStep === 'details' && renderFormDetails()}
      {creationStep === 'building' && renderBuilding()}

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
        workspaceId={workspace.id}
      />
    </div>
  );
}
