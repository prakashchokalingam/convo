"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateGrid, TemplateAction, TemplatePermissions } from '@/components/app/templates/core';
import { TemplatePreview } from '@/components/app/templates/core';
import { Template } from '@/lib/db/schema';
import { Building, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Button } from '@/components/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog';
import { getFormEditorUrl, getFormsUrl } from '@/lib/urls/workspace-urls';

interface UserTemplatesTabProps {
  workspaceId: string;
  workspaceSlug: string;
  userRole: string;
  canCreateTemplates: boolean;
  onCreateTemplate: () => void;
}

/**
 * UserTemplatesTab - Displays and manages workspace templates
 * 
 * Shows workspace-specific templates with full CRUD operations for users
 * with appropriate permissions.
 */
export function UserTemplatesTab({ 
  workspaceId,
  workspaceSlug, 
  userRole, 
  canCreateTemplates,
  onCreateTemplate 
}: UserTemplatesTabProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    template: Template | null;
  }>({ isOpen: false, template: null });

  // Define permissions for workspace templates
  const permissions: TemplatePermissions = {
    canClone: canCreateTemplates, // Can clone if user can create templates
    canCreateForm: true, // All users can create forms from templates
    canEdit: canCreateTemplates, // Can edit if user can create templates (owner/admin)
    canDelete: canCreateTemplates, // Can delete if user can create templates (owner/admin)
  };

  const fetchWorkspaceTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        workspaceId,
        isGlobal: 'false', // Only fetch workspace templates
        limit: '100',
      });

      const response = await fetch(`/api/templates?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      
      const data = await response.json();
      // Filter to only workspace templates (extra safety)
      const workspaceTemplates = data.templates?.filter((t: Template) => !t.isGlobal) || [];
      setTemplates(workspaceTemplates);
    } catch (error) {
      console.error('Error fetching workspace templates:', error);
      setError('Failed to load workspace templates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchWorkspaceTemplates();
  }, [fetchWorkspaceTemplates]);

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
          
        case 'edit':
          await handleEditTemplate(templateId);
          break;
          
        case 'delete':
          const templateToDelete = templates.find(t => t.id === templateId);
          if (templateToDelete) {
            setDeleteConfirmDialog({
              isOpen: true,
              template: templateToDelete
            });
          }
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
      
      // Success feedback
      console.log('Template cloned successfully:', data.template.name);
      
      // Refresh the templates list
      fetchWorkspaceTemplates();
      
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
      const formEditorUrl = getFormEditorUrl(workspaceSlug, data.form.id);
      router.push(formEditorUrl);
      
    } catch (error) {
      console.error('Error creating form from template:', error);
      throw error;
    }
  };

  const handleEditTemplate = async (templateId: string) => {
    // For now, redirect to form builder with template mode
    // In a future implementation, this could open a template editor
    const newFormUrl = getFormsUrl(workspaceSlug) + `/new?templateId=${templateId}&mode=template`;
    router.push(newFormUrl);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      // Success feedback
      console.log('Template deleted successfully');
      
      // Remove template from local state
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      
      // Close dialog
      setDeleteConfirmDialog({ isOpen: false, template: null });
      
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  const retryFetch = () => {
    fetchWorkspaceTemplates();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <div className="text-gray-600">Loading workspace templates...</div>
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
        title="My Templates"
        description="Templates created by your team. Create, edit, and manage custom templates for your workspace."
        showFilters={true}
        showCreateButton={canCreateTemplates}
        onCreateTemplate={onCreateTemplate}
        emptyState={
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No workspace templates yet
            </h3>
            <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
              Create your first template or clone a global template to get started.
            </p>
            {canCreateTemplates && (
              <Button onClick={onCreateTemplate}>
                Create Your First Template
              </Button>
            )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmDialog.isOpen} 
        onOpenChange={(open) => setDeleteConfirmDialog({ isOpen: open, template: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirmDialog.template?.name}"?
              This action cannot be undone.
              {deleteConfirmDialog.template && deleteConfirmDialog.template.usageCount > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  ⚠️ This template has been used to create {deleteConfirmDialog.template.usageCount} form(s). 
                  Deleting it won't affect existing forms.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmDialog({ isOpen: false, template: null })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deleteConfirmDialog.template) {
                  handleDeleteTemplate(deleteConfirmDialog.template.id);
                }
              }}
              disabled={actionLoading[`${deleteConfirmDialog.template?.id}-delete`]}
            >
              {actionLoading[`${deleteConfirmDialog.template?.id}-delete`] ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Template'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
