'use client';

import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFieldsByCategory, searchFieldDefinitions } from '@/lib/form-builder/field-registry';
import { FieldType, FieldDefinition, DragItem, FormConfig } from '@/lib/form-builder/types';

interface DraggableFieldItemProps {
  definition: FieldDefinition;
  onAddField: (fieldType: FieldType, sectionId?: string) => void;
  selectedFieldId?: string;
  config: FormConfig;
}

function DraggableFieldItem({
  definition,
  onAddField,
  selectedFieldId,
  config,
}: DraggableFieldItemProps) {
  const dragItem: DragItem = {
    id: `new-${definition.type}`,
    type: 'new-field',
    fieldType: definition.type,
  };

  const IconComponent = definition.icon as React.ComponentType<{ className?: string }>;
  const isSection =
    selectedFieldId && config.fields.find(f => f.id === selectedFieldId)?.type === 'section';
  const isSectionField = definition.type === 'section';
  const isDisabled = isSectionField && isSection; // Disable section fields when section is selected

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${definition.type}`,
    data: dragItem,
    disabled: isDisabled, // Disable dragging for section fields when section is selected
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleClick = () => {
    // Prevent adding section to section (1 level only)
    const selectedField = selectedFieldId
      ? config.fields.find(f => f.id === selectedFieldId)
      : null;
    const isTargetingSection = selectedField?.type === 'section';

    if (definition.type === 'section' && isTargetingSection) {
      console.warn('Cannot add section to section - sections can only be at root level');
      return;
    }

    const targetSectionId = isTargetingSection ? selectedField.id : undefined;
    onAddField(definition.type, targetSectionId);
  };

  return (
    <Card
      className={`
      group relative transition-all duration-200 hover:shadow-md
      ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed bg-muted'
          : 'cursor-grab active:cursor-grabbing hover:border-primary/50'
      }
      ${isDragging ? 'opacity-50 scale-95 rotate-1' : ''}
    `}
    >
      <CardContent className='p-3'>
        <motion.div
          ref={setNodeRef}
          style={style}
          {...(isDisabled ? {} : listeners)}
          {...(isDisabled ? {} : attributes)}
          onClick={!isDisabled ? handleClick : undefined}
          whileHover={!isDisabled ? { scale: 1.02 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
        >
          <div className='flex items-start space-x-3'>
            <div
              className={`
              flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors
              ${
                isDisabled
                  ? 'bg-muted-foreground/20 text-muted-foreground'
                  : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
              }
            `}
            >
              <IconComponent className='h-4 w-4' />
            </div>
            <div className='flex-1 min-w-0'>
              <h4 className='text-sm font-medium text-foreground'>{definition.label}</h4>
              <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                {definition.description}
              </p>
              {isSection && (
                <Badge variant='secondary' className='mt-2 text-xs'>
                  → Add to section
                </Badge>
              )}
              {isDisabled && (
                <Badge variant='destructive' className='mt-2 text-xs'>
                  Cannot nest sections
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

interface FieldCategoryProps {
  category: 'basic' | 'advanced' | 'layout';
  title: string;
  searchQuery: string;
  onAddField: (fieldType: FieldType, sectionId?: string) => void;
  selectedFieldId?: string;
  config: FormConfig;
}

function FieldCategory({
  category,
  title,
  searchQuery,
  onAddField,
  selectedFieldId,
  config,
}: FieldCategoryProps) {
  const fields = useMemo(() => {
    if (searchQuery.trim()) {
      return searchFieldDefinitions(searchQuery).filter(field => field.category === category);
    }
    return getFieldsByCategory(category);
  }, [category, searchQuery]);

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center space-x-2'>
        <Badge variant='outline' className='text-xs font-semibold'>
          {title}
        </Badge>
        <div className='flex-1 h-px bg-border'></div>
      </div>
      <div className='grid gap-2'>
        {fields.map(definition => (
          <DraggableFieldItem
            key={definition.type}
            definition={definition}
            onAddField={onAddField}
            selectedFieldId={selectedFieldId}
            config={config}
          />
        ))}
      </div>
    </div>
  );
}

interface FieldLibraryProps {
  onAddField: (fieldType: FieldType, sectionId?: string) => void;
  selectedFieldId?: string;
  config: FormConfig;
}

export function FieldLibrary({ onAddField, selectedFieldId, config }: FieldLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const hasSearchResults = useMemo(() => {
    if (!searchQuery.trim()) {return true;}
    return searchFieldDefinitions(searchQuery).length > 0;
  }, [searchQuery]);

  return (
    <Card className='flex flex-col h-full rounded-none border-0 border-r'>
      {/* Header */}
      <CardContent className='p-4 border-b border-border'>
        <h2 className='text-lg font-semibold text-foreground mb-3'>Field Library</h2>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search fields...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 py-2 w-full'
          />
        </div>
      </CardContent>

      {/* Tabs */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='flex flex-col h-full'>
          <TabsList className='flex w-full mx-2 mt-3 h-9 bg-muted rounded-lg p-1'>
            <TabsTrigger
              value='all'
              className='flex-1 text-xs px-2 py-1.5 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-0 transition-all'
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value='layout'
              className='flex-1 text-xs px-2 py-1.5 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-0 transition-all'
            >
              Layout
            </TabsTrigger>
            <TabsTrigger
              value='basic'
              className='flex-1 text-xs px-2 py-1.5 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-0 transition-all'
            >
              Basic
            </TabsTrigger>
            <TabsTrigger
              value='advanced'
              className='flex-1 text-xs px-2 py-1.5 h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md min-w-0 transition-all'
            >
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Field Content */}
          <div className='flex-1 overflow-y-auto'>
            <div className='p-4 space-y-6'>
              {!hasSearchResults ? (
                <div className='text-center py-8'>
                  <div className='text-muted-foreground mb-2'>
                    <Search className='h-8 w-8 mx-auto' />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    No fields found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <>
                  <TabsContent value='all' className='mt-0 space-y-6'>
                    <FieldCategory
                      category='layout'
                      title='Layout Fields'
                      searchQuery={searchQuery}
                      onAddField={onAddField}
                      selectedFieldId={selectedFieldId}
                      config={config}
                    />
                    <FieldCategory
                      category='basic'
                      title='Basic Fields'
                      searchQuery={searchQuery}
                      onAddField={onAddField}
                      selectedFieldId={selectedFieldId}
                      config={config}
                    />
                    <FieldCategory
                      category='advanced'
                      title='Advanced Fields'
                      searchQuery={searchQuery}
                      onAddField={onAddField}
                      selectedFieldId={selectedFieldId}
                      config={config}
                    />
                  </TabsContent>

                  <TabsContent value='basic' className='mt-0'>
                    <FieldCategory
                      category='basic'
                      title='Basic Fields'
                      searchQuery={searchQuery}
                      onAddField={onAddField}
                      selectedFieldId={selectedFieldId}
                      config={config}
                    />
                  </TabsContent>

                  <TabsContent value='advanced' className='mt-0'>
                    <FieldCategory
                      category='advanced'
                      title='Advanced Fields'
                      searchQuery={searchQuery}
                      onAddField={onAddField}
                      selectedFieldId={selectedFieldId}
                      config={config}
                    />
                  </TabsContent>

                  <TabsContent value='layout' className='mt-0'>
                    <FieldCategory
                      category='layout'
                      title='Layout Fields'
                      searchQuery={searchQuery}
                      onAddField={onAddField}
                      selectedFieldId={selectedFieldId}
                      config={config}
                    />
                  </TabsContent>
                </>
              )}
            </div>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <CardContent className='p-4 border-t border-border bg-muted/30'>
        {selectedFieldId &&
        config.fields.find(f => f.id === selectedFieldId)?.type === 'section' ? (
          <Card className='p-3 bg-primary/5 border-primary/20'>
            <div className='text-center'>
              <Badge variant='default' className='mb-2'>
                Section Selected
              </Badge>
              <p className='text-xs text-muted-foreground'>
                Click fields to add to &quot;{config.fields.find(f => f.id === selectedFieldId)?.label}&quot;
              </p>
            </div>
          </Card>
        ) : (
          <p className='text-xs text-muted-foreground text-center'>
            Drag fields to the canvas or click to add them
          </p>
        )}
      </CardContent>
    </Card>
  );
}
