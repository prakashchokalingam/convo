"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Textarea } from '@/components/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Label } from '@/components/shared/ui/label';
import { Separator } from '@/components/shared/ui/separator';
import { 
  FileText, 
  Plus, 
  Loader2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { buildContextUrl } from '@/lib/subdomain';

interface TemplateCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
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
  onSuccess
}: TemplateCreateDialogProps) {
  const router = useRouter();
  // const [createMode, setCreateMode] = useState<'scratch' | 'form' | null>(null); // Removed mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for template metadata
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: '',
  });

  const resetDialog = () => {
    // setCreateMode(null); // Removed mode
    setTemplateData({ name: '', description: '', category: '' });
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  // Removed handleCreateFromScratch

  const handleCreateAndCustomize = async () => { // Renamed from handleCreateFromForm
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
          }
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
      
      // Success - redirect to edit the template's form schema
      const targetPath = `/${workspaceId}/forms/new?templateId=${data.template.id}&mode=template`;
      router.push(buildContextUrl('app', targetPath));
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
      
    } catch (err) { // Renamed error to err to avoid conflict with state variable
      console.error('Error creating template:', err);
      setError(err instanceof Error ? err.message : 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    // Only need to validate template name now
    return templateData.name.trim().length > 0;
  };

  // Removed renderModeSelection

  const renderTemplateForm = () => ( // This is now the main content
    <div className="space-y-4">
      {/* Removed title from here, rely on DialogHeader title
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Template Information
        </h3>
        <p className="text-sm text-gray-600">
          Provide basic information for your template
        </p>
      </div>
      */}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 pt-2"> {/* Added pt-2 for spacing after DialogDescription */}
        <div>
          <Label htmlFor="template-name">Template Name *</Label>
          <Input
            id="template-name"
            placeholder="e.g., Customer Feedback Survey"
            value={templateData.name}
            onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="template-description">Description</Label>
          <Textarea
            id="template-description"
            placeholder="Describe what this template is for and how it should be used..."
            value={templateData.description}
            onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="template-category">Category</Label>
          <Select
            value={templateData.category}
            onValueChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a business category" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_CATEGORIES.map((category) => (
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

  // Removed renderScratchForm

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Template
          </DialogTitle>
          <DialogDescription>
            Define the basic information for your new template. You can customize its fields and settings in the next step.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderTemplateForm()}
        </div>

        {/* Simplified Footer */}
        <Separator />
        <div className="flex justify-end pt-4"> {/* Changed to justify-end, removed Back button */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>

            <Button
              onClick={handleCreateAndCustomize} // Changed to new handler
              disabled={!validateForm() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> {/* Changed Icon */}
                  Create and Customize {/* Changed Button Text */}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
