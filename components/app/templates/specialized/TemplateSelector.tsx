'use client';

import { Search, Filter, Globe, Building, FileText, Users, Eye, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import { Input } from '@/components/shared/ui/input';
import { ScrollArea } from '@/components/shared/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Template } from '@/lib/db/schema';

export interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
  categoryFilter?: string;
  workspaceId: string;
  currentUserId?: string;
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
 * TemplateSelector - Compact template browser for form creation
 *
 * This component provides a modal interface for selecting templates
 * during form creation, with separate tabs for global and workspace templates.
 */
export function TemplateSelector({
  isOpen,
  onClose,
  onSelect,
  categoryFilter = '',
  workspaceId,
  _currentUserId,
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'All Categories');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<'global' | 'workspace'>('global');
  const [globalTemplates, setGlobalTemplates] = useState<Template[]>([]);
  const [workspaceTemplates, setWorkspaceTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchTemplates();
    }
  }, [isOpen, workspaceId]);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both global and workspace templates
      const params = new URLSearchParams({
        workspaceId,
        limit: '100', // Get more templates for selection
      });

      const response = await fetch(`/api/templates?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      const templates = data.templates || [];

      // Separate global and workspace templates
      const global = templates.filter((t: Template) => t.isGlobal);
      const workspace = templates.filter((t: Template) => !t.isGlobal);

      setGlobalTemplates(global);
      setWorkspaceTemplates(workspace);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = (templates: Template[]) => {
    return templates.filter(template => {
      const matchesSearch =
        !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Categories' || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
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

  const getFormFieldCount = (template: Template) => {
    try {
      const schema =
        typeof template.formSchema === 'string'
          ? JSON.parse(template.formSchema)
          : template.formSchema;
      return schema?.fields?.length || 0;
    } catch {
      return 0;
    }
  };

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
      // Reset state for next time
      setSelectedTemplate(null);
      setSearchQuery('');
      setSelectedCategory('All Categories');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setSelectedTemplate(null);
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setError(null);
  };

  const renderTemplateCard = (template: Template) => (
    <div
      key={template.id}
      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
        selectedTemplate?.id === template.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedTemplate(template)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedTemplate(template);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className='flex items-start justify-between mb-2'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <h4 className='font-medium text-gray-900 truncate text-sm'>{template.name}</h4>

            {template.isGlobal && (
              <Badge className='text-xs bg-blue-50 text-blue-700 border-blue-200'>
                <Globe className='w-2 h-2 mr-1' />
                Global
              </Badge>
            )}
          </div>

          {template.description && (
            <p className='text-xs text-gray-600 line-clamp-2 mb-2'>{template.description}</p>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {template.category && (
            <Badge className={`text-xs px-2 py-1 ${getCategoryColor(template.category)}`}>
              {template.category}
            </Badge>
          )}

          <div className='flex items-center text-xs text-gray-500'>
            <FileText className='w-3 h-3 mr-1' />
            {getFormFieldCount(template)} fields
          </div>
        </div>

        <div className='flex items-center text-xs text-gray-500'>
          <Users className='w-3 h-3 mr-1' />
          {template.usageCount} uses
        </div>
      </div>
    </div>
  );

  const renderTemplateList = (templates: Template[]) => {
    const filteredTemplates = filterTemplates(templates);

    if (loading) {
      return (
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
          <span className='ml-2 text-gray-600'>Loading templates...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className='text-center py-8'>
          <div className='text-red-600 mb-2'>{error}</div>
          <Button variant='outline' size='sm' onClick={fetchTemplates}>
            Try Again
          </Button>
        </div>
      );
    }

    if (filteredTemplates.length === 0) {
      const hasFilters = searchQuery || selectedCategory !== 'All Categories';

      return (
        <div className='text-center py-8'>
          <FileText className='w-8 h-8 mx-auto mb-2 text-gray-400' />
          <div className='text-gray-600 mb-2'>
            {hasFilters ? 'No templates match your criteria' : 'No templates available'}
          </div>
          {hasFilters && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      );
    }

    return <div className='space-y-2'>{filteredTemplates.map(renderTemplateCard)}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-4xl max-h-[80vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to start building your form, or browse our collection of pre-made
            templates for different business needs.
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className='flex flex-col sm:flex-row gap-3 py-4 border-b'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search templates...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='w-full sm:w-48'>
              <Filter className='w-4 h-4 mr-2' />
              <SelectValue />
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

        {/* Template Lists */}
        <div className='flex-1 min-h-0'>
          <Tabs
            value={activeTab}
            onValueChange={value => setActiveTab(value as 'global' | 'workspace')}
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='global' className='flex items-center gap-2'>
                <Globe className='w-4 h-4' />
                Global Templates ({globalTemplates.length})
              </TabsTrigger>
              <TabsTrigger value='workspace' className='flex items-center gap-2'>
                <Building className='w-4 h-4' />
                My Templates ({workspaceTemplates.length})
              </TabsTrigger>
            </TabsList>

            <div className='mt-4'>
              <ScrollArea className='h-96'>
                <TabsContent value='global' className='mt-0'>
                  {renderTemplateList(globalTemplates)}
                </TabsContent>

                <TabsContent value='workspace' className='mt-0'>
                  {renderTemplateList(workspaceTemplates)}
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        {/* Selected Template Preview */}
        {selectedTemplate && (
          <div className='border-t pt-4'>
            <div className='text-sm text-gray-600 mb-2'>Selected Template:</div>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium text-blue-900'>{selectedTemplate.name}</div>
                  <div className='text-sm text-blue-700'>
                    {getFormFieldCount(selectedTemplate)} fields • {selectedTemplate.category}
                  </div>
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    /* Could open preview modal */
                  }}
                >
                  <Eye className='w-4 h-4 mr-1' />
                  Preview
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={handleSelect} disabled={!selectedTemplate}>
            Use This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
