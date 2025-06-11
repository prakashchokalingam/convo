"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateGrid, TemplateAction, TemplatePermissions } from '@/components/app/templates/core';
import { TemplatePreview } from '@/components/app/templates/core';
import { TemplateSelector } from '@/components/app/templates/specialized';
import { Template } from '@/lib/db/schema';
import { Globe, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Button } from '@/components/shared/ui/button';

interface GlobalTemplatesTabProps {
  workspaceId: string;
  userRole: string;
  canCreateTemplates: boolean;
}

/**
 * GlobalTemplatesTab - Displays and manages global templates
 * 
 * Shows global templates with clone and create form functionality.
 * Templates are fetched from the API and filtered to show only global ones.
 */
export function GlobalTemplatesTab({ 
  workspaceId, 
  userRole, 
  canCreateTemplates 
}: GlobalTemplatesTabProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Define permissions for global templates
  const permissions: TemplatePermissions = {
    canClone: canCreateTemplates, // Can clone if user can create templates
    canCreateForm: true, // All users can create forms from templates
    canEdit: false, // Global templates cannot be edited
    canDelete: false, // Global templates cannot be deleted
  };

  const fetchGlobalTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        workspaceId,
        isGlobal: 'true', // Only fetch global templates
        limit: '100', // Get all global templates
      });

      const response = await fetch(`/api/templates?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching global templates:', error);
      setError('Failed to load global templates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchGlobalTemplates();
  }, [fetchGlobalTemplates]);

  const handleTemplateAction = async (action: TemplateAction) => {
    const { type, templateId } = action;
    
    // Set loading state for this specific action
    setActionLoading(prev => ({ ...prev, [`${templateId}-${type}`]: true }));
    
    try {
      switch (type) {
        case 'preview':
          const template = templates.find(t => t.id === templateId);
          if (template) {
            setPreviewTemplate(template);
          }
          break;
          
        case 'clone':
          await handleCloneTemplate(templateId);
          break;
          
        case 'createForm':
          await handleCreateForm(templateId);
          break;
          
        default:
          console.warn('Unhandled template action:', type);
      }
    } catch (error) {
      console.error(`Error handling ${type} action:`, error);
      // You could show a toast notification here
    } finally {
      // Clear loading state
      setActionLoading(prev => ({ ...prev, [`${templateId}-${type}`]: false }));
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to clone template');
      }

      const data = await response.json();
      
      // Success feedback (you could add a toast notification here)
      console.log('Template cloned successfully:', data.template.name);
      
      // Optionally refresh the templates list to update clone counts
      fetchGlobalTemplates();
      
    } catch (error) {
      console.error('Error cloning template:', error);
      throw error;
    }
  };

  const handleCreateForm = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const response = await fetch(`/api/templates/${templateId}/create-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          name: `Form from ${template.name}`,
          description: `Created from ${template.name} template`,
          isConversational: false,
          isPublished: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create form from template');
      }

      const data = await response.json();
      
      // Navigate to the form editor
      router.push(`/${workspaceId}/forms/${data.form.id}`);
      
    } catch (error) {
      console.error('Error creating form from template:', error);
      throw error;
    }
  };

  const retryFetch = () => {
    fetchGlobalTemplates();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <div className="text-gray-600">Loading global templates...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={retryFetch}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <TemplateGrid
        templates={templates}
        permissions={permissions}
        onTemplateAction={handleTemplateAction}
        title="Global Templates"
        description="Pre-built templates for common business needs. Clone any template to customize it for your workspace."
        showFilters={true}
        showCreateButton={false} // Don't show create button for global templates
        emptyState={
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No global templates available
            </h3>
            <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
              Global templates are created by the Convo team to help you get started quickly.
            </p>
          </div>
        }
      />

      {/* Template Preview Modal */}
      <TemplatePreview
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        permissions={permissions}
        actions={[]}
        onAction={handleTemplateAction}
      />
    </>
  );
}
