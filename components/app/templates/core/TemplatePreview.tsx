'use client';

import { Copy, FileText, Globe, Plus, Calendar, User, Building } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import { ScrollArea } from '@/components/shared/ui/scroll-area';
import { Separator } from '@/components/shared/ui/separator';
import { Template } from '@/lib/db/schema';

import { TemplatePermissions, TemplateAction } from './TemplateCard';

export interface TemplatePreviewProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  actions: TemplateAction[];
  permissions: TemplatePermissions;
  onAction?: (action: TemplateAction) => void;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

/**
 * TemplatePreview - Universal preview modal
 *
 * This component provides a comprehensive preview of templates with
 * permission-based actions and form schema visualization.
 */
export function TemplatePreview({
  template,
  isOpen,
  onClose,
  actions: _actions = [],
  permissions,
  onAction,
}: TemplatePreviewProps) {
  if (!template) {return null;}

  const handleAction = (type: TemplateAction['type']) => {
    if (onAction) {
      onAction({
        type,
        templateId: template.id,
      });
    }
  };

  const getFormFields = (): FormField[] => {
    try {
      const schema =
        typeof template.formSchema === 'string'
          ? JSON.parse(template.formSchema)
          : template.formSchema;
      return schema?.fields || [];
    } catch {
      return [];
    }
  };

  const getFieldTypeIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      text: <FileText className='w-4 h-4' />,
      email: <FileText className='w-4 h-4' />,
      tel: <FileText className='w-4 h-4' />,
      number: <FileText className='w-4 h-4' />,
      textarea: <FileText className='w-4 h-4' />,
      select: <FileText className='w-4 h-4' />,
      radio: <FileText className='w-4 h-4' />,
      checkbox: <FileText className='w-4 h-4' />,
      file: <FileText className='w-4 h-4' />,
      date: <Calendar className='w-4 h-4' />,
    };
    return iconMap[type] || <FileText className='w-4 h-4' />;
  };

  const getFieldTypeLabel = (type: string) => {
    const labelMap: Record<string, string> = {
      text: 'Text Input',
      email: 'Email Input',
      tel: 'Phone Input',
      number: 'Number Input',
      textarea: 'Text Area',
      select: 'Dropdown',
      radio: 'Radio Buttons',
      checkbox: 'Checkboxes',
      file: 'File Upload',
      date: 'Date Picker',
    };
    return labelMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) {return 'bg-gray-100 text-gray-700';}

    const colors: Record<string, string> = {
      HR: 'bg-blue-100 text-blue-700',
      Marketing: 'bg-green-100 text-green-700',
      Support: 'bg-orange-100 text-orange-700',
      Sales: 'bg-purple-100 text-purple-700',
      Education: 'bg-indigo-100 text-indigo-700',
      Healthcare: 'bg-red-100 text-red-700',
    };

    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formFields = getFormFields();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <div className='flex items-start justify-between'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2'>
                <DialogTitle className='text-xl font-semibold text-gray-900 truncate'>
                  {template.name}
                </DialogTitle>

                {template.isGlobal && (
                  <Badge className='bg-blue-50 text-blue-700 border-blue-200'>
                    <Globe className='w-3 h-3 mr-1' />
                    Global Template
                  </Badge>
                )}

                {template.category && (
                  <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                )}
              </div>

              {template.description && (
                <DialogDescription className='text-gray-600'>
                  {template.description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-hidden'>
          <ScrollArea className='h-full pr-6'>
            <div className='space-y-6'>
              {/* Template Metadata */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg'>
                <div className='text-center'>
                  <div className='text-lg font-semibold text-gray-900'>{formFields.length}</div>
                  <div className='text-sm text-gray-600'>Form Fields</div>
                </div>

                <div className='text-center'>
                  <div className='text-lg font-semibold text-gray-900'>{template.usageCount}</div>
                  <div className='text-sm text-gray-600'>Forms Created</div>
                </div>

                <div className='text-center'>
                  <div className='text-lg font-semibold text-gray-900'>{template.cloneCount}</div>
                  <div className='text-sm text-gray-600'>Times Cloned</div>
                </div>

                <div className='text-center'>
                  <div className='text-lg font-semibold text-gray-900'>
                    {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className='text-sm text-gray-600'>Created</div>
                </div>
              </div>

              {/* Template Info */}
              <div className='space-y-3'>
                <h3 className='text-lg font-medium text-gray-900'>Template Information</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {template.createdBy && (
                    <div className='flex items-center text-sm text-gray-600'>
                      <User className='w-4 h-4 mr-2 text-gray-400' />
                      <span>Created by: {template.createdBy}</span>
                    </div>
                  )}

                  {template.workspaceId && (
                    <div className='flex items-center text-sm text-gray-600'>
                      <Building className='w-4 h-4 mr-2 text-gray-400' />
                      <span>Workspace Template</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Form Structure Preview */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-gray-900'>Form Structure</h3>

                {formFields.length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    <FileText className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                    <p>No form fields defined</p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {formFields.map((field, index) => (
                      <div
                        key={field.id}
                        className='flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                      >
                        <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0'>
                          {getFieldTypeIcon(field.type)}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <h4 className='font-medium text-gray-900 truncate'>{field.label}</h4>

                            {field.required && (
                              <Badge
                                variant='outline'
                                className='text-xs bg-red-50 text-red-700 border-red-200'
                              >
                                Required
                              </Badge>
                            )}
                          </div>

                          <div className='flex items-center gap-4 text-sm text-gray-600'>
                            <span className='bg-gray-100 px-2 py-1 rounded text-xs'>
                              {getFieldTypeLabel(field.type)}
                            </span>

                            {field.placeholder && (
                              <span className='truncate'>Placeholder: "{field.placeholder}"</span>
                            )}
                          </div>

                          {/* Field Options */}
                          {field.options && field.options.length > 0 && (
                            <div className='mt-2'>
                              <div className='text-xs text-gray-500 mb-1'>Options:</div>
                              <div className='flex flex-wrap gap-1'>
                                {field.options.slice(0, 3).map((option, idx) => (
                                  <Badge key={idx} variant='outline' className='text-xs'>
                                    {option.label}
                                  </Badge>
                                ))}
                                {field.options.length > 3 && (
                                  <Badge variant='outline' className='text-xs text-gray-500'>
                                    +{field.options.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Validation Rules */}
                          {field.validation && Object.keys(field.validation).length > 0 && (
                            <div className='mt-2'>
                              <div className='text-xs text-gray-500 mb-1'>Validation:</div>
                              <div className='flex flex-wrap gap-1 text-xs'>
                                {field.validation.minLength && (
                                  <Badge variant='outline' className='text-xs'>
                                    Min length: {field.validation.minLength}
                                  </Badge>
                                )}
                                {field.validation.maxLength && (
                                  <Badge variant='outline' className='text-xs'>
                                    Max length: {field.validation.maxLength}
                                  </Badge>
                                )}
                                {field.validation.pattern && (
                                  <Badge variant='outline' className='text-xs'>
                                    Pattern validation
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className='text-xs text-gray-400 flex-shrink-0'>#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-2 pt-4 border-t'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>

          {permissions.canCreateForm && (
            <Button onClick={() => handleAction('createForm')}>
              <Plus className='w-4 h-4 mr-2' />
              Create Form
            </Button>
          )}

          {permissions.canClone && (
            <Button variant='outline' onClick={() => handleAction('clone')}>
              <Copy className='w-4 h-4 mr-2' />
              Clone Template
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
