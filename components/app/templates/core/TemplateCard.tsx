"use client";

import React from 'react';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shared/ui/dropdown-menu';
import { 
  Copy, 
  Eye, 
  FileText, 
  Globe, 
  MoreHorizontal, 
  Pencil, 
  Plus, 
  Trash2, 
  Users 
} from 'lucide-react';
import { Template } from '@/lib/db/schema';

export interface TemplatePermissions {
  canClone: boolean;
  canCreateForm: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface TemplateAction {
  type: 'clone' | 'createForm' | 'edit' | 'delete' | 'preview';
  templateId: string;
  data?: any;
}

export interface TemplateCardProps {
  template: Template;
  showActions?: boolean;
  onAction?: (action: TemplateAction) => void;
  permissions: TemplatePermissions;
  isLoading?: boolean;
  variant?: 'default' | 'compact';
}

/**
 * TemplateCard - The foundation component for displaying templates
 * 
 * This component works for both global and user templates, with permission-based
 * action buttons and usage statistics display.
 */
export function TemplateCard({
  template,
  showActions = true,
  onAction,
  permissions,
  isLoading = false,
  variant = 'default'
}: TemplateCardProps) {
  const handleAction = (type: TemplateAction['type'], data?: any) => {
    if (onAction) {
      onAction({
        type,
        templateId: template.id,
        data
      });
    }
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-100 text-gray-700';
    
    const colors: Record<string, string> = {
      'HR': 'bg-blue-100 text-blue-700',
      'Marketing': 'bg-green-100 text-green-700',
      'Support': 'bg-orange-100 text-orange-700',
      'Sales': 'bg-purple-100 text-purple-700',
      'Education': 'bg-indigo-100 text-indigo-700',
      'Healthcare': 'bg-red-100 text-red-700',
    };
    
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getFormFieldCount = () => {
    try {
      const schema = typeof template.formSchema === 'string' 
        ? JSON.parse(template.formSchema) 
        : template.formSchema;
      return schema?.fields?.length || 0;
    } catch {
      return 0;
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
        <CardFooter>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`group hover:shadow-md transition-shadow duration-200 ${
      variant === 'compact' ? 'h-auto' : 'h-full'
    }`}>
      <CardHeader className={variant === 'compact' ? 'pb-3' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className={`${variant === 'compact' ? 'text-sm' : 'text-lg'} font-semibold text-gray-900 truncate`}>
                {template.name}
              </CardTitle>
              {template.isGlobal && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  Global
                </Badge>
              )}
            </div>
            
            {template.description && (
              <CardDescription className={`${
                variant === 'compact' ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
              } text-gray-600`}>
                {template.description}
              </CardDescription>
            )}
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction('preview')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                
                {permissions.canCreateForm && (
                  <DropdownMenuItem onClick={() => handleAction('createForm')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Form
                  </DropdownMenuItem>
                )}
                
                {permissions.canClone && (
                  <DropdownMenuItem onClick={() => handleAction('clone')}>
                    <Copy className="h-4 w-4 mr-2" />
                    Clone Template
                  </DropdownMenuItem>
                )}
                
                {permissions.canEdit && (
                  <DropdownMenuItem onClick={() => handleAction('edit')}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                
                {permissions.canDelete && (
                  <DropdownMenuItem 
                    onClick={() => handleAction('delete')} 
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className={`${variant === 'compact' ? 'py-3' : 'py-4'} space-y-3`}>
        {/* Category and Field Count */}
        <div className="flex items-center justify-between">
          {template.category && (
            <Badge 
              className={`text-xs px-2 py-1 ${getCategoryColor(template.category)}`}
            >
              {template.category}
            </Badge>
          )}
          
          <div className="flex items-center text-xs text-gray-500">
            <FileText className="w-3 h-3 mr-1" />
            {getFormFieldCount()} fields
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center text-gray-600">
            <Users className="w-3 h-3 mr-1 text-gray-400" />
            <span className="font-medium">{template.usageCount}</span>
            <span className="ml-1">forms created</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Copy className="w-3 h-3 mr-1 text-gray-400" />
            <span className="font-medium">{template.cloneCount}</span>
            <span className="ml-1">clones</span>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons Footer */}
      {showActions && variant !== 'compact' && (
        <CardFooter className="pt-0 pb-4">
          <div className="flex gap-2 w-full">
            {permissions.canCreateForm && (
              <Button 
                size="sm" 
                onClick={() => handleAction('createForm')}
                className="flex-1"
              >
                <Plus className="w-3 h-3 mr-1" />
                Create Form
              </Button>
            )}
            
            {permissions.canClone && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('clone')}
                className="flex-1"
              >
                <Copy className="w-3 h-3 mr-1" />
                Clone
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// Export types for use in other components
export type { TemplatePermissions, TemplateAction };
