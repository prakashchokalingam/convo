"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
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
import { cn } from '@/lib/utils';

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
      <Card className={`${variant === 'compact' ? 'h-auto' : 'h-full'}`}>
        <CardHeader className={variant === 'compact' ? 'pb-3' : 'pb-4'}>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className={`${variant === 'compact' ? 'py-3' : 'py-4'} space-y-3`}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" /> {/* Category */}
            <Skeleton className="h-4 w-12" /> {/* Field count */}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" /> {/* Usage count */}
            <Skeleton className="h-4 w-full" /> {/* Clone count */}
          </div>
          {/* New Skeletons for metadata */}
          <div className={`pt-2 ${variant === 'compact' ? 'space-y-1' : 'space-y-1.5'}`}>
            <Skeleton className={`h-3 ${variant === 'compact' ? 'w-3/5' : 'w-4/6'}`} /> {/* Created At / By */}
            {variant !== 'compact' && <Skeleton className="h-3 w-3/5" />} {/* Updated At */}
          </div>
        </CardContent>
        {variant !== 'compact' && (
          <CardFooter className="pt-0 pb-4">
            <div className="flex gap-2 w-full">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card
      role="article"
      className={cn(
        "group hover:shadow-lg transition-all duration-200 border-muted/40",
        variant === 'compact' ? 'h-auto' : 'h-full'
      )}
    >
      <CardHeader className={variant === 'compact' ? 'pb-3' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className={cn(
                "font-semibold text-foreground truncate",
                variant === 'compact' ? 'text-sm' : 'text-lg'
              )}>
                {template.name}
              </CardTitle>
              {template.isGlobal && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  Global
                </Badge>
              )}
            </div>
            
            {template.description && (
              <CardDescription className={cn(
                "text-muted-foreground",
                variant === 'compact' ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'
              )}>
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleAction('preview')} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Template
                </DropdownMenuItem>
                
                {permissions.canCreateForm && (
                  <DropdownMenuItem onClick={() => handleAction('createForm')} className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Form
                  </DropdownMenuItem>
                )}
                
                {permissions.canClone && (
                  <DropdownMenuItem onClick={() => handleAction('clone')} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2" />
                    Clone Template
                  </DropdownMenuItem>
                )}
                
                {permissions.canEdit && (
                  <DropdownMenuItem onClick={() => handleAction('edit')} className="cursor-pointer">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Template
                  </DropdownMenuItem>
                )}
                
                {permissions.canDelete && (
                  <DropdownMenuItem 
                    onClick={() => handleAction('delete')} 
                    className="text-destructive cursor-pointer focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Template
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className={`${variant === 'compact' ? 'py-3' : 'py-4'} space-y-3`}> {/* Adjusted space-y for new metadata section */}
        {/* Category and Field Count */}
        <div className="flex items-center justify-between">
          {template.category && (
            <Badge
              className={`text-xs px-2 py-1 font-medium ${getCategoryColor(template.category)}`}
            >
              {template.category}
            </Badge>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            <FileText className="w-3 h-3 mr-1" />
            <span className="font-medium">{getFormFieldCount()}</span>
            <span className="ml-1">fields</span>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-2 gap-3"> {/* Reduced gap slightly */}
          <div className="flex items-center text-xs bg-muted/30 rounded-lg p-2 hover:bg-muted/50 transition-colors">
            <div className="flex items-center text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              <span className="font-semibold text-foreground">{template.usageCount}</span>
              <span className="ml-1">forms</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs bg-muted/30 rounded-lg p-2 hover:bg-muted/50 transition-colors">
            <div className="flex items-center text-muted-foreground">
              <Copy className="w-3 h-3 mr-1" />
              <span className="font-semibold text-foreground">{template.cloneCount}</span>
              <span className="ml-1">clones</span>
            </div>
          </div>
        </div>

        {/* Template Metadata */}
        <div className={`pt-2 text-xs text-muted-foreground space-y-1 ${variant === 'compact' ? 'mt-2' : 'mt-3'}`}>
          {variant === 'compact' ? (
            <>
              <div>
                Created: {new Date(template.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' / '}
                {template.isGlobal ? (
                  <span className="font-medium">By: Convo Team</span>
                ) : (
                  <span className="font-medium">By: User {template.createdBy?.substring(0, 8) || 'N/A'}</span>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                Created: {new Date(template.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' by '}
                {template.isGlobal ? (
                  <span className="font-medium text-foreground">Convo Team</span>
                ) : (
                  <span className="font-medium text-foreground">User {template.createdBy?.substring(0, 8) || 'N/A'}</span>
                )}
              </div>
              <div>
                Updated: {new Date(template.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </>
          )}
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
                className="flex-1 hover:bg-primary/90 transition-colors"
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
                className="flex-1 hover:bg-muted transition-colors"
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
