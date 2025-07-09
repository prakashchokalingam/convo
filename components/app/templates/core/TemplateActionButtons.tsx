'use client';

import {
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu';
import { Template } from '@/lib/db/schema';

import { TemplatePermissions, TemplateAction } from './TemplateCard';

export interface TemplateActionButtonsProps {
  template: Template;
  permissions: TemplatePermissions;
  variant?: 'card' | 'list' | 'preview';
  onAction: (action: TemplateAction) => void;
  loading?: {
    clone?: boolean;
    createForm?: boolean;
    delete?: boolean;
  };
  showLabels?: boolean;
  className?: string;
}

/**
 * TemplateActionButtons - Reusable action controls component
 *
 * This component provides permission-aware button rendering with loading states,
 * confirmation dialogs, and multiple layout variants.
 */
export function TemplateActionButtons({
  template,
  permissions,
  variant = 'card',
  onAction,
  loading = {},
  showLabels = false,
  className = '',
}: TemplateActionButtonsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleAction = (type: TemplateAction['type'], data?: unknown) => {
    onAction({
      type,
      templateId: template.id,
      data,
    });
  };

  const handleDelete = () => {
    handleAction('delete');
    setShowDeleteDialog(false);
  };

  const getActionButton = (
    type: TemplateAction['type'],
    icon: React.ReactNode,
    label: string,
    isDestructive = false,
    isLoading = false
  ) => (
    <Button
      variant={variant === 'preview' ? 'default' : isDestructive ? 'destructive' : 'outline'}
      size={variant === 'list' ? 'sm' : 'default'}
      onClick={() => {
        if (type === 'delete') {
          setShowDeleteDialog(true);
        } else {
          handleAction(type);
        }
      }}
      disabled={isLoading}
      className={variant === 'card' ? 'flex-1' : ''}
    >
      {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : icon}
      {showLabels && <span className='ml-2'>{label}</span>}
    </Button>
  );

  // Card variant - horizontal button layout
  if (variant === 'card') {
    return (
      <>
        <div className={`flex gap-2 w-full ${className}`}>
          {permissions.canCreateForm &&
            getActionButton(
              'createForm',
              <Plus className='w-4 h-4' />,
              'Create Form',
              false,
              loading.createForm
            )}

          {permissions.canClone &&
            getActionButton('clone', <Copy className='w-4 h-4' />, 'Clone', false, loading.clone)}

          {(permissions.canEdit || permissions.canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => handleAction('preview')}>
                  <Eye className='h-4 w-4 mr-2' />
                  Preview
                </DropdownMenuItem>

                {permissions.canEdit && (
                  <DropdownMenuItem onClick={() => handleAction('edit')}>
                    <Pencil className='h-4 w-4 mr-2' />
                    Edit
                  </DropdownMenuItem>
                )}

                {permissions.canDelete && (
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className='text-red-600'
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5 text-red-500' />
                Delete Template
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{template.name}&quot;? This action cannot be
                undone.
                {template.usageCount > 0 && (
                  <div className='mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm'>
                    ⚠️ This template has been used to create {template.usageCount} form(s). Deleting
                    it won&apos;t affect existing forms.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={handleDelete} disabled={loading.delete}>
                {loading.delete ? (
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                ) : (
                  <Trash2 className='w-4 h-4 mr-2' />
                )}
                Delete Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // List variant - compact horizontal layout
  if (variant === 'list') {
    return (
      <>
        <div className={`flex items-center gap-1 ${className}`}>
          <Button variant='ghost' size='sm' onClick={() => handleAction('preview')}>
            <Eye className='w-3 h-3' />
          </Button>

          {permissions.canCreateForm && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleAction('createForm')}
              disabled={loading.createForm}
            >
              {loading.createForm ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : (
                <Plus className='w-3 h-3' />
              )}
            </Button>
          )}

          {permissions.canClone && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleAction('clone')}
              disabled={loading.clone}
            >
              {loading.clone ? (
                <Loader2 className='w-3 h-3 animate-spin' />
              ) : (
                <Copy className='w-3 h-3' />
              )}
            </Button>
          )}

          {permissions.canEdit && (
            <Button variant='ghost' size='sm' onClick={() => handleAction('edit')}>
              <Pencil className='w-3 h-3' />
            </Button>
          )}

          {permissions.canDelete && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowDeleteDialog(true)}
              className='text-red-600 hover:text-red-700'
            >
              <Trash2 className='w-3 h-3' />
            </Button>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5 text-red-500' />
                Delete Template
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{template.name}&quot;? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>

            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={handleDelete} disabled={loading.delete}>
                {loading.delete ? (
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                ) : (
                  <Trash2 className='w-4 h-4 mr-2' />
                )}
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Preview variant - prominent action buttons
  if (variant === 'preview') {
    return (
      <>
        <div className={`flex gap-2 ${className}`}>
          {permissions.canCreateForm &&
            getActionButton(
              'createForm',
              <Plus className='w-4 h-4' />,
              'Create Form',
              false,
              loading.createForm
            )}

          {permissions.canClone &&
            getActionButton(
              'clone',
              <Copy className='w-4 h-4' />,
              'Clone Template',
              false,
              loading.clone
            )}

          {permissions.canEdit && (
            <Button variant='outline' onClick={() => handleAction('edit')}>
              <Pencil className='w-4 h-4 mr-2' />
              Edit Template
            </Button>
          )}

          {permissions.canDelete && (
            <Button variant='destructive' onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className='w-4 h-4 mr-2' />
              Delete
            </Button>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <AlertTriangle className='w-5 h-5 text-red-500' />
                Delete Template
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{template.name}&quot;? This action cannot be
                undone.
                {template.usageCount > 0 && (
                  <div className='mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm'>
                    ⚠️ This template has been used to create {template.usageCount} form(s). Deleting
                    it won&apos;t affect existing forms.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={handleDelete} disabled={loading.delete}>
                {loading.delete ? (
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                ) : (
                  <Trash2 className='w-4 h-4 mr-2' />
                )}
                Delete Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}
