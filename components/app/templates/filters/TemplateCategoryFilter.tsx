'use client';

import { Filter, ChevronDown, X, Globe, Building } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';

export interface TemplateCategoryFilterProps {
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  showGlobalFilter?: boolean;
  globalFilterValue?: boolean | null; // null = all, true = global only, false = workspace only
  onGlobalFilterChange?: (value: boolean | null) => void;
  mode?: 'single' | 'multiple';
  className?: string;
  placeholder?: string;
}

const BUSINESS_CATEGORIES = [
  { value: 'HR', label: 'HR', color: 'bg-blue-100 text-blue-700' },
  { value: 'Marketing', label: 'Marketing', color: 'bg-green-100 text-green-700' },
  { value: 'Support', label: 'Support', color: 'bg-orange-100 text-orange-700' },
  { value: 'Sales', label: 'Sales', color: 'bg-purple-100 text-purple-700' },
  { value: 'Education', label: 'Education', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'Healthcare', label: 'Healthcare', color: 'bg-red-100 text-red-700' },
  { value: 'Other', label: 'Other', color: 'bg-gray-100 text-gray-700' },
];

/**
 * TemplateCategoryFilter - Multi-select category filter component
 *
 * This component provides filtering by business categories and optionally
 * by global vs workspace templates.
 */
export function TemplateCategoryFilter({
  selectedCategories = [],
  onCategoryChange,
  showGlobalFilter = false,
  globalFilterValue = null,
  onGlobalFilterChange,
  mode = 'multiple',
  className = '',
  placeholder = 'All Categories',
}: TemplateCategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    if (mode === 'single') {
      // Single select mode
      const newCategories = selectedCategories.includes(category) ? [] : [category];
      onCategoryChange?.(newCategories);
    } else {
      // Multiple select mode
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category];
      onCategoryChange?.(newCategories);
    }
  };

  const clearAllCategories = () => {
    onCategoryChange?.([]);
  };

  const getCategoryColor = (categoryValue: string) => {
    return (
      BUSINESS_CATEGORIES.find(cat => cat.value === categoryValue)?.color ||
      'bg-gray-100 text-gray-700'
    );
  };

  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return placeholder;
    }

    if (mode === 'single') {
      return selectedCategories[0];
    }

    if (selectedCategories.length === 1) {
      return selectedCategories[0];
    }

    return `${selectedCategories.length} categories`;
  };

  const hasActiveFilters = selectedCategories.length > 0 || globalFilterValue !== null;

  if (mode === 'single') {
    // Render as a select dropdown for single selection
    return (
      <div className={className}>
        <Select
          value={selectedCategories[0] || ''}
          onValueChange={value => onCategoryChange?.(value ? [value] : [])}
        >
          <SelectTrigger className='w-full'>
            <Filter className='w-4 h-4 mr-2' />
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=''>All Categories</SelectItem>
            {BUSINESS_CATEGORIES.map(category => (
              <SelectItem key={category.value} value={category.value}>
                <div className='flex items-center gap-2'>
                  <div className={`w-2 h-2 rounded-full ${category.color.split(' ')[0]}`} />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Render as multi-select dropdown
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Filter Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className={`w-full justify-between ${hasActiveFilters ? 'border-blue-500 bg-blue-50' : ''}`}
          >
            <div className='flex items-center gap-2'>
              <Filter className='w-4 h-4' />
              <span className='truncate'>{getDisplayText()}</span>
            </div>
            <ChevronDown className='w-4 h-4 opacity-50' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-56' align='start'>
          {/* Global/Workspace Filter */}
          {showGlobalFilter && (
            <div className='p-2 border-b'>
              <div className='text-xs font-medium text-gray-500 mb-2'>Template Source</div>
              <div className='space-y-1'>
                <Button
                  variant={globalFilterValue === null ? 'default' : 'ghost'}
                  size='sm'
                  className='w-full justify-start h-8'
                  onClick={() => onGlobalFilterChange?.(null)}
                >
                  All Templates
                </Button>
                <Button
                  variant={globalFilterValue === true ? 'default' : 'ghost'}
                  size='sm'
                  className='w-full justify-start h-8'
                  onClick={() => onGlobalFilterChange?.(true)}
                >
                  <Globe className='w-3 h-3 mr-2' />
                  Global Only
                </Button>
                <Button
                  variant={globalFilterValue === false ? 'default' : 'ghost'}
                  size='sm'
                  className='w-full justify-start h-8'
                  onClick={() => onGlobalFilterChange?.(false)}
                >
                  <Building className='w-3 h-3 mr-2' />
                  Workspace Only
                </Button>
              </div>
            </div>
          )}

          {/* Category Filters */}
          <div className='p-2'>
            <div className='text-xs font-medium text-gray-500 mb-2'>Categories</div>
            {BUSINESS_CATEGORIES.map(category => (
              <DropdownMenuCheckboxItem
                key={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => handleCategoryToggle(category.value)}
                className='flex items-center gap-2'
              >
                <div className={`w-2 h-2 rounded-full ${category.color.split(' ')[0]}`} />
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <div className='p-2 border-t'>
              <Button
                variant='ghost'
                size='sm'
                className='w-full justify-start h-8 text-red-600 hover:text-red-700'
                onClick={() => {
                  clearAllCategories();
                  onGlobalFilterChange?.(null);
                }}
              >
                <X className='w-3 h-3 mr-2' />
                Clear All Filters
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-1'>
          {selectedCategories.map(category => (
            <Badge
              key={category}
              variant='outline'
              className={`text-xs ${getCategoryColor(category)} cursor-pointer hover:bg-opacity-80`}
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
              <X className='w-3 h-3 ml-1' />
            </Badge>
          ))}

          {globalFilterValue !== null && (
            <Badge
              variant='outline'
              className='text-xs bg-blue-100 text-blue-700 cursor-pointer hover:bg-opacity-80'
              onClick={() => onGlobalFilterChange?.(null)}
            >
              {globalFilterValue ? (
                <>
                  <Globe className='w-3 h-3 mr-1' />
                  Global
                </>
              ) : (
                <>
                  <Building className='w-3 h-3 mr-1' />
                  Workspace
                </>
              )}
              <X className='w-3 h-3 ml-1' />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
