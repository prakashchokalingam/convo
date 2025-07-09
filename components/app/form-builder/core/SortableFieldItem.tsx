'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Trash2, Copy, Settings, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Textarea } from '@/components/shared/ui/textarea';
import { getFieldDefinition } from '@/lib/form-builder/field-registry';
import { FieldConfig, DragItem } from '@/lib/form-builder/types';

import DependencyIndicator from '../conditional/DependencyIndicator';

interface SortableFieldItemProps {
  field: FieldConfig;
  allFields: FieldConfig[];
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
  onUpdate: (updates: Partial<FieldConfig>) => void;
  onRemove: () => void;
  onDuplicate: (field: FieldConfig) => void;
  // showHoverOverlay?: boolean; // For fields inside sections
}

export function SortableFieldItem({
  field,
  allFields,
  isSelected,
  onClick,
  onUpdate,
  onRemove,
  onDuplicate,
  // showHoverOverlay = false,
}: SortableFieldItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dragItem: DragItem = {
    id: field.id,
    type: 'field',
    data: field,
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: dragItem,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const definition = getFieldDefinition(field.type);
  const IconComponent = definition?.icon as React.ComponentType<{ className?: string }>;

  const handleLabelChange = (newLabel: string) => {
    onUpdate({ label: newLabel });
  };

  const handleRequiredToggle = () => {
    onUpdate({ required: !field.required });
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            placeholder={field.placeholder || `Enter ${field.type}...`}
            disabled
            className='pointer-events-none'
          />
        );

      case 'number':
        return (
          <Input
            type='number'
            placeholder={field.placeholder || 'Enter number...'}
            disabled
            className='pointer-events-none'
          />
        );

      case 'textarea':
        const textareaField = field as any;
        return (
          <Textarea
            placeholder={field.placeholder || 'Enter text...'}
            rows={textareaField.rows || 4}
            disabled
            className='pointer-events-none resize-none'
          />
        );

      case 'select':
      case 'multiselect':
        return (
          <div className='relative'>
            <Input
              placeholder={field.placeholder || 'Choose an option...'}
              disabled
              className='pointer-events-none pr-8'
            />
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
              <svg
                className='h-4 w-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        );

      case 'radio':
        const radioField = field as any;
        return (
          <div className='space-y-2'>
            {radioField.options?.slice(0, 3).map((option: any, index: number) => (
              <div key={index} className='flex items-center space-x-2'>
                <div className='w-4 h-4 border border-gray-300 rounded-full'></div>
                <span className='text-sm text-gray-600'>{option.label}</span>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className='flex items-center space-x-2'>
            <div className='w-4 h-4 border border-gray-300 rounded'></div>
            <span className='text-sm text-gray-600'>Checkbox option</span>
          </div>
        );

      case 'switch':
        return (
          <div className='flex items-center space-x-2'>
            <div className='w-11 h-6 bg-gray-200 rounded-full relative'>
              <div className='w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow'></div>
            </div>
            <span className='text-sm text-gray-600'>Toggle option</span>
          </div>
        );

      case 'date':
      case 'datetime':
        return <Input type='date' disabled className='pointer-events-none' />;

      case 'file':
        return (
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
            <div className='text-gray-400 mb-2'>
              <svg
                className='mx-auto h-8 w-8'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
            </div>
            <p className='text-sm text-gray-500'>Click to upload or drag and drop</p>
          </div>
        );

      case 'rating':
        return (
          <div className='flex space-x-1'>
            {[1, 2, 3, 4, 5].map(star => (
              <svg
                key={star}
                className='w-5 h-5 text-gray-300'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            ))}
          </div>
        );

      case 'section':
        // Sections are now handled by SectionContainer component
        return null;

      case 'divider':
        return <hr className='border-gray-300' />;

      case 'html':
        return (
          <div className='bg-gray-100 p-3 rounded border text-sm text-gray-600'>
            HTML Content Block
          </div>
        );

      default:
        return (
          <div className='bg-gray-100 p-3 rounded border text-sm text-gray-600'>
            {field.type} field preview
          </div>
        );
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        group relative border rounded-lg transition-all duration-200 cursor-pointer overflow-hidden
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      `}
    >
      {/* Field Header */}
      <div className='flex items-center justify-between p-3 border-b border-gray-100'>
        <div className='flex items-center space-x-3'>
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors'
          >
            <GripVertical className='h-4 w-4' />
          </button>

          {/* Field Icon */}
          {IconComponent && (
            <div className='w-6 h-6 bg-gray-100 rounded flex items-center justify-center'>
              <IconComponent className='h-3 w-3 text-gray-600' />
            </div>
          )}

          {/* Field Label */}
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <input
                type='text'
                value={field.label}
                onChange={e => handleLabelChange(e.target.value)}
                onClick={e => e.stopPropagation()}
                className='text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-300 focus:rounded px-1 py-0.5 flex-1'
              />
              {field.required && <span className='text-red-500 ml-1'>*</span>}
              <DependencyIndicator field={field} allFields={allFields} className='flex-shrink-0' />
            </div>
          </div>
        </div>

        {/* Field Actions */}
        <div
          className={`
          flex items-center space-x-1 transition-all duration-200
          ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
        `}
        >
          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              handleRequiredToggle();
            }}
            className='h-6 w-6 p-0'
          >
            <AlertCircle
              className={`h-3 w-3 ${field.required ? 'text-red-500' : 'text-gray-400'}`}
            />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              onDuplicate(field);
            }}
            className='h-6 w-6 p-0'
          >
            <Copy className='h-3 w-3 text-gray-400 hover:text-blue-500' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              onClick(e); // Select the field to show properties
            }}
            className='h-6 w-6 p-0'
          >
            <Settings className='h-3 w-3 text-gray-400 hover:text-blue-500' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
            className='h-6 w-6 p-0 text-red-400 hover:text-red-600'
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </div>

      {/* Field Preview */}
      <div className='p-3'>
        <div className='space-y-2'>
          {field.hint && <p className='text-xs text-gray-500'>{field.hint}</p>}
          {renderFieldPreview()}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          layoutId='selection-indicator'
          className='absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none'
          initial={false}
        />
      )}
    </motion.div>
  );
}
