"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWorkspace } from '@/hooks/use-workspace';
import { Button } from '@/components/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Input } from '@/components/shared/ui/input';
import { Textarea } from '@/components/shared/ui/textarea';
import { Label } from '@/components/shared/ui/label';
import { Separator } from '@/components/shared/ui/separator';
import { Badge } from '@/components/shared/ui/badge';
import { TemplateSelector } from '@/components/app/templates/specialized';
import { 
  Plus, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Loader2,
  ChevronLeft,
  Layout
} from 'lucide-react';
import { Template } from '@/lib/db/schema';
import { getFormEditorUrl } from '@/lib/urls/workspace-urls';

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
  const { workspace, loading, hasPermission } = useWorkspace();
  
  // Check if a specific mode was requested (template mode, etc.)
  const mode = searchParams.get('mode'); // 'template' for template editing
  const templateId = searchParams.get('templateId');
  
  const [creationStep, setCreationStep] = useState<'choose' | 'details' | 'building'>('choose');
  const [selectedMethod, setSelectedMethod] = useState<'template' | 'scratch' | 'ai' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form details for scratch creation
  const [formDetails, setFormDetails] = useState({
    title: '',
    description: '',
    isConversational: false
  });
  const [aiPrompt, setAiPrompt] = useState('');

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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <div className="text-gray-600">Loading workspace...</div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-600">Failed to load workspace</div>
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
      isConversational: false
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
      router.push(getFormEditorUrl(workspace.slug, data.form.id));
      
    } catch (error) {
      console.error('Error creating form from template:', error);
      setError(error instanceof Error ? error.message : 'Failed to create form');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFromAI = async () => {
    if (!aiPrompt.trim()) {
      setError('AI prompt cannot be empty.');
      return;
    }
    if (!workspace) {
      setError('Workspace not loaded.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/forms/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          workspaceId: workspace.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.formId) {
        router.push(getFormEditorUrl(workspace.slug, data.formId));
      } else {
        throw new Error('Failed to get form ID from AI generation response.');
      }

    } catch (error) {
      console.error('Error creating form from AI:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred during AI form generation.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFromScratch = async () => {
    if (!formDetails.title.trim()) {
      setError('Form title is required');
      return;
    }

    setIsCreating(true);
    setError(null);

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
          }
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
        throw new Error('Failed to create form');
      }

      const data = await response.json();
      
      // Navigate to the form editor
      router.push(getFormEditorUrl(workspace.slug, data.form.id));
      
    } catch (error) {
      console.error('Error creating form:', error);
      setError(error instanceof Error ? error.message : 'Failed to create form');
    } finally {
      setIsCreating(false);
    }
  };

  const renderChooseMethod = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create a New Form</h1>
        <p className="text-lg text-gray-600">
          Choose how you'd like to start building your form
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template Option */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
          onClick={() => setShowTemplateSelector(true)}
        >
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Layout className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Choose from Templates</CardTitle>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Recommended
                </Badge>
              </div>
            </div>
            <CardDescription className="text-base">
              Start with a pre-built template and customize it to your needs. 
              Save time with proven form structures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                12+ professional templates available
              </div>
              <Button variant="outline">
                Browse Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* From Scratch Option */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-200"
          onClick={() => {
            setSelectedMethod('scratch');
            setCreationStep('details');
          }}
        >
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Start from Scratch</CardTitle>
            </div>
            <CardDescription className="text-base">
              Build your form from the ground up with complete creative control. 
              Perfect for unique requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Full customization and flexibility
              </div>
              <Button variant="outline">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Option */}
      <Card
        className="mt-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-200"
        onClick={() => {
          setSelectedMethod('ai');
          setCreationStep('details');
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">AI-Generated Form</CardTitle>
            </div>
          </div>
          <CardDescription>
            Describe your form in plain English and let AI build it for you automatically.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderFormDetails = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setCreationStep('choose')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to options
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {selectedMethod === 'ai'
            ? 'Describe Your Form Requirements'
            : selectedMethod === 'template'
              ? 'Configure Your Form'
              : 'Form Details'}
        </h1>
        <p className="text-gray-600">
          {selectedMethod === 'ai'
            ? 'Let our AI assist you in creating the perfect form based on your description.'
            : selectedMethod === 'template'
              ? `Creating form from "${selectedTemplate?.name}" template.`
              : 'Provide basic information for your new form.'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {selectedMethod === 'ai' ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="ai-prompt">Form Description & Requirements</Label>
              <Textarea
                id="ai-prompt"
                placeholder="e.g., Create a contact form with fields for name, email, phone number, and a message. Make the name and email fields required."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-1"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                Be as specific as possible for the best results. Mention field names, types (text, email, checkbox, etc.), and any validation rules.
              </p>
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreationStep('choose')}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateFromAI}
                disabled={!aiPrompt.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Form
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {selectedTemplate && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">{selectedTemplate.name}</div>
                    <div className="text-sm text-blue-700">{selectedTemplate.description}</div>
                  </div>
                  <Badge className="ml-auto bg-blue-100 text-blue-700 border-blue-200">
                    {selectedTemplate.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="form-title">Form Title *</Label>
                <Input
                  id="form-title"
                  placeholder="e.g., Customer Feedback Survey"
                  value={formDetails.title}
                  onChange={(e) => setFormDetails(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="form-description">Description</Label>
                <Textarea
                  id="form-description"
                  placeholder="Describe what this form is for..."
                  value={formDetails.description}
                  onChange={(e) => setFormDetails(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreationStep('choose')}>
                  Cancel
                </Button>

                <Button
                  onClick={selectedMethod === 'template' ? handleCreateFromTemplate : handleCreateFromScratch}
                  disabled={!formDetails.title.trim() || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Create Form
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderBuilding = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Setting up your form...
        </h2>
        <p className="text-gray-600">
          You'll be redirected to the form builder in a moment
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
