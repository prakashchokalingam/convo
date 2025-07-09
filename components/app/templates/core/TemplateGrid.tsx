'use client';

import { Search, Filter, Plus, Grid, List } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { Template } from '@/lib/db/schema';

import { TemplateCard, TemplatePermissions, TemplateAction } from './TemplateCard';

export interface TemplateGridProps {
  templates: Template[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  searchQuery?: string;
  categoryFilter?: string;
  onTemplateAction?: (action: TemplateAction) => void;
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  permissions: TemplatePermissions;
  showCreateButton?: boolean;
  onCreateTemplate?: () => void;
  title?: string;
  description?: string;
  showFilters?: boolean;
  variant?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
}

const BUSINESS_CATEGORIES = [
  'All Categories',
  'HR',
  'Marketing',
  'Support',
  'Sales',
  'Education',
  'Healthcare',
  'Other',
];

/**
 * TemplateGrid - Reusable template list container
 *
 * This component provides a unified interface for displaying templates
 * with search, filtering, and different view options.
 */
export function TemplateGrid({
  templates,
  loading = false,
  emptyState,
  searchQuery = '',
  categoryFilter = '',
  onTemplateAction,
  onSearchChange,
  onCategoryChange,
  permissions,
  showCreateButton = false,
  onCreateTemplate,
  title,
  description,
  showFilters = true,
  variant = 'grid',
  onViewChange,
}: TemplateGridProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const [internalCategoryFilter, setInternalCategoryFilter] = useState(categoryFilter);

  // Use internal state if no external handlers provided
  const effectiveSearchQuery = onSearchChange ? searchQuery : internalSearchQuery;
  const effectiveCategoryFilter = onCategoryChange ? categoryFilter : internalCategoryFilter;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchQuery(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    const category = value === 'All Categories' ? '' : value;
    if (onCategoryChange) {
      onCategoryChange(category);
    } else {
      setInternalCategoryFilter(category);
    }
  };

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      !effectiveSearchQuery ||
      template.name.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(effectiveSearchQuery.toLowerCase());

    const matchesCategory =
      !effectiveCategoryFilter || template.category === effectiveCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const renderEmptyState = () => {
    if (emptyState) {
      return emptyState;
    }

    const hasFilters = effectiveSearchQuery || effectiveCategoryFilter;

    return (
      <div className='text-center py-12'>
        <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
          <Grid className='w-8 h-8 text-gray-400' />
        </div>

        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          {hasFilters ? 'No templates found' : 'No templates available'}
        </h3>

        <p className='text-sm text-gray-600 mb-4 max-w-sm mx-auto'>
          {hasFilters
            ? 'Try adjusting your search criteria or filters'
            : 'Get started by creating your first template or browse global templates'}
        </p>

        {showCreateButton && permissions.canCreateForm && (
          <Button onClick={onCreateTemplate}>
            <Plus className='w-4 h-4 mr-2' />
            Create Template
          </Button>
        )}
      </div>
    );
  };

  const renderLoadingState = () => (
    <div
      className={`grid gap-4 ${
        variant === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      }`}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <TemplateCard
          key={index}
          template={{} as Template}
          permissions={permissions}
          isLoading={true}
          variant={variant === 'list' ? 'compact' : 'default'}
        />
      ))}
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      {(title || description || showFilters || showCreateButton) && (
        <div className='space-y-4'>
          {/* Title and Description */}
          {(title || description) && (
            <div>
              {title && <h2 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h2>}
              {description && <p className='text-gray-600'>{description}</p>}
            </div>
          )}

          {/* Controls Row */}
          {(showFilters || showCreateButton || onViewChange) && (
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
              {/* Search and Filters */}
              {showFilters && (
                <div className='flex flex-col sm:flex-row gap-3 flex-1'>
                  {/* Search Input */}
                  <div className='relative min-w-0 flex-1 max-w-sm'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      placeholder='Search templates...'
                      value={effectiveSearchQuery}
                      onChange={e => handleSearchChange(e.target.value)}
                      className='pl-10'
                    />
                  </div>

                  {/* Category Filter */}
                  <Select
                    value={effectiveCategoryFilter || 'All Categories'}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className='w-full sm:w-48'>
                      <Filter className='w-4 h-4 mr-2' />
                      <SelectValue placeholder='All Categories' />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Right side controls */}
              <div className='flex items-center gap-2'>
                {/* View Toggle */}
                {onViewChange && (
                  <div className='flex items-center border rounded-md'>
                    <Button
                      variant={variant === 'grid' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => onViewChange('grid')}
                      className='rounded-r-none'
                    >
                      <Grid className='w-4 h-4' />
                    </Button>
                    <Button
                      variant={variant === 'list' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => onViewChange('list')}
                      className='rounded-l-none'
                    >
                      <List className='w-4 h-4' />
                    </Button>
                  </div>
                )}

                {/* Create Button */}
                {showCreateButton && permissions.canCreateForm && (
                  <Button onClick={onCreateTemplate}>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Template
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(effectiveSearchQuery || effectiveCategoryFilter) && (
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='text-sm text-gray-600'>Active filters:</span>

              {effectiveSearchQuery && (
                <Badge variant='outline' className='gap-1'>
                  Search: &quot;{effectiveSearchQuery}&quot;
                  <button
                    onClick={() => handleSearchChange('')}
                    className='ml-1 hover:bg-gray-200 rounded-full p-0.5'
                  >
                    ×
                  </button>
                </Badge>
              )}

              {effectiveCategoryFilter && (
                <Badge variant='outline' className='gap-1'>
                  Category: {effectiveCategoryFilter}
                  <button
                    onClick={() => handleCategoryChange('All Categories')}
                    className='ml-1 hover:bg-gray-200 rounded-full p-0.5'
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      {!loading && templates.length > 0 && (
        <div className='text-sm text-gray-600'>
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      )}

      {/* Content */}
      <div>
        {loading ? (
          renderLoadingState()
        ) : filteredTemplates.length === 0 ? (
          renderEmptyState()
        ) : (
          <div
            className={`grid gap-4 ${
              variant === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onAction={onTemplateAction}
                permissions={permissions}
                variant={variant === 'list' ? 'compact' : 'default'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
