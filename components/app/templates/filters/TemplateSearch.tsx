'use client';

import { Search, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';

export interface TemplateSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
  showClearButton?: boolean;
}

/**
 * TemplateSearch - Real-time search component with debouncing
 *
 * This component provides search functionality for templates with
 * debouncing to prevent excessive API calls.
 */
export function TemplateSearch({
  value = '',
  onChange,
  placeholder = 'Search templates...',
  onClear,
  debounceMs = 300,
  className = '',
  showClearButton = true,
}: TemplateSearchProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounce the search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (onChange && debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleClear = () => {
    setInternalValue('');
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />

      <Input
        type='text'
        placeholder={placeholder}
        value={internalValue}
        onChange={e => setInternalValue(e.target.value)}
        className={`pl-10 ${showClearButton && internalValue ? 'pr-10' : ''}`}
      />

      {showClearButton && internalValue && (
        <Button
          variant='ghost'
          size='icon'
          className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100'
          onClick={handleClear}
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
}
