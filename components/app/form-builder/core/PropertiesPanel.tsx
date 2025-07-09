'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Trash2, Info, Zap } from 'lucide-react';
import { useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getFieldDefinition } from '@/lib/form-builder/field-registry';
import {
  FormConfig,
  FieldConfig,
  ValidationRule,
  SectionFieldConfig,
  TextareaFieldConfig,
  FieldStyling,
} from '@/lib/form-builder/types';

import { ConditionalLogicBuilder } from '../conditional/ConditionalLogicBuilder';
import { DependencyIndicator } from '../conditional/DependencyIndicator';

interface PropertiesPanelProps {
  config: FormConfig;
  selectedField?: FieldConfig;
  onUpdateConfig: (updates: Partial<FormConfig>) => void;
  onUpdateField: (fieldId: string, updates: Partial<FieldConfig>) => void;
}

type FieldWithOptions = FieldConfig & {
  options?: { label: string; value: string }[];
};

interface ValidationRuleEditorProps {
  rules: ValidationRule[];
  onChange: (rules: ValidationRule[]) => void;
}

function ValidationRuleEditor({ rules, onChange }: ValidationRuleEditorProps) {
  const addRule = useCallback(
    (type: ValidationRule['type']) => {
      const newRule: ValidationRule = {
        type,
        message: getDefaultValidationMessage(type),
        value: getDefaultValidationValue(type),
      };
      onChange([...rules, newRule]);
    },
    [rules, onChange]
  );

  const updateRule = useCallback(
    (index: number, updates: Partial<ValidationRule>) => {
      const newRules = [...rules];
      newRules[index] = { ...newRules[index], ...updates };
      onChange(newRules);
    },
    [rules, onChange]
  );

  const removeRule = useCallback(
    (index: number) => {
      const newRules = rules.filter((_, i) => i !== index);
      onChange(newRules);
    },
    [rules, onChange]
  );

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Label className='text-sm font-medium'>Validation Rules</Label>
        <Button
          variant='outline'
          size='sm'
          onClick={() => addRule('required')}
          className='h-7 px-2'
        >
          <Plus className='h-3 w-3 mr-1' />
          Add Rule
        </Button>
      </div>

      <div className='space-y-2'>
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className='p-3 space-y-2'>
              <div className='flex items-center justify-between'>
                <Select
                  value={rule.type}
                  onValueChange={value =>
                    updateRule(index, {
                      type: value as ValidationRule['type'],
                      message: getDefaultValidationMessage(value as ValidationRule['type']),
                      value: getDefaultValidationValue(value as ValidationRule['type']),
                    })
                  }
                >
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='required'>Required</SelectItem>
                    <SelectItem value='min'>Minimum</SelectItem>
                    <SelectItem value='max'>Maximum</SelectItem>
                    <SelectItem value='pattern'>Pattern</SelectItem>
                    <SelectItem value='custom'>Custom</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => removeRule(index)}
                  className='h-6 w-6 p-0 text-red-500 hover:text-red-700'
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              </div>

              {(rule.type === 'min' || rule.type === 'max') && (
                <Input
                  type='number'
                  placeholder='Value'
                  value={rule.value || ''}
                  onChange={e => updateRule(index, { value: parseInt(e.target.value) || 0 })}
                  className='text-xs'
                />
              )}

              {rule.type === 'pattern' && (
                <Input
                  placeholder='Regular expression'
                  value={rule.value || ''}
                  onChange={e => updateRule(index, { value: e.target.value })}
                  className='text-xs'
                />
              )}

              <Input
                placeholder='Error message'
                value={rule.message}
                onChange={e => updateRule(index, { message: e.target.value })}
                className='text-xs'
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {rules.length === 0 && (
        <Card className='p-4'>
          <div className='text-center text-muted-foreground text-sm'>No validation rules added</div>
        </Card>
      )}
    </div>
  );
}

function getDefaultValidationMessage(type: ValidationRule['type']): string {
  switch (type) {
    case 'required':
      return 'This field is required';
    case 'min':
      return 'Value must be at least {min}';
    case 'max':
      return 'Value must be at most {max}';
    case 'pattern':
      return 'Please enter a valid format';
    case 'custom':
      return 'Invalid value';
    default:
      return 'Invalid value';
  }
}

function getDefaultValidationValue(type: ValidationRule['type']): string | number | undefined {
  switch (type) {
    case 'min':
    case 'max':
      return 0;
    case 'pattern':
      return '';
    default:
      return undefined;
  }
}

export function PropertiesPanel({
  config,
  selectedField,
  onUpdateConfig: _onUpdateConfig,
  onUpdateField,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const handleFieldUpdate = useCallback(
    (updates: Partial<FieldConfig>) => {
      if (selectedField) {
        onUpdateField(selectedField.id, updates);
      }
    },
    [selectedField, onUpdateField]
  );

  const renderFieldProperties = () => {
    if (!selectedField) {
      return (
        <Card className='m-4'>
          <CardContent className='flex flex-col items-center justify-center h-64 text-center p-6'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
              <Settings className='h-8 w-8 text-muted-foreground' />
            </div>
            <CardTitle className='mb-2'>No Field Selected</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Select a field from the canvas to edit its properties
            </p>
          </CardContent>
        </Card>
      );
    }

    const definition = getFieldDefinition(selectedField.type);
    const IconComponent = definition?.icon as React.ComponentType<{ className?: string }>;
    const isSection = selectedField.type === 'section';

    return (
      <div className='space-y-6'>
        {/* Field Header */}
        <Card className='mb-6'>
          <CardContent className='flex items-center space-x-3 p-4'>
            {IconComponent && (
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSection ? 'bg-primary/10' : 'bg-primary/10'
                }`}
              >
                <IconComponent className='h-5 w-5 text-primary' />
              </div>
            )}
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <CardTitle className='text-base'>{definition?.label}</CardTitle>
                <DependencyIndicator field={selectedField} allFields={config.fields} />
              </div>
              <p className='text-sm text-muted-foreground'>{definition?.description}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
          <TabsList className={`grid w-full ${isSection ? 'grid-cols-1' : 'grid-cols-3'}`}>
            <TabsTrigger value='basic' className='text-xs'>
              Basic
            </TabsTrigger>
            {!isSection && (
              <>
                <TabsTrigger value='validation' className='text-xs'>
                  Validation
                </TabsTrigger>
                <TabsTrigger value='conditional' className='text-xs flex items-center gap-1'>
                  <Zap className='h-3 w-3' />
                  Conditional
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value='basic' className='space-y-4'>
            {/* Label */}
            <div className='space-y-2'>
              <Label htmlFor='field-label'>{isSection ? 'Section Title' : 'Label'}</Label>
              <Input
                id='field-label'
                value={selectedField.label}
                onChange={e => handleFieldUpdate({ label: e.target.value })}
                placeholder={isSection ? 'Enter section title' : 'Enter field label'}
              />
            </div>

            {/* Section Description (for sections only) */}
            {isSection && (
              <div className='space-y-2'>
                <Label htmlFor='section-description'>Description</Label>
                <Textarea
                  id='section-description'
                  value={(selectedField as SectionFieldConfig).description || ''}
                  onChange={e => handleFieldUpdate({ description: e.target.value })}
                  placeholder='Optional section description'
                  rows={2}
                />
              </div>
            )}

            {/* Placeholder */}
            {!isSection &&
              ['text', 'email', 'number', 'textarea', 'select', 'multiselect'].includes(
                selectedField.type
              ) && (
                <div className='space-y-2'>
                  <Label htmlFor='field-placeholder'>Placeholder</Label>
                  <Input
                    id='field-placeholder'
                    value={selectedField.placeholder || ''}
                    onChange={e => handleFieldUpdate({ placeholder: e.target.value })}
                    placeholder='Enter placeholder text'
                  />
                </div>
              )}

            {/* Hint */}
            {!isSection && (
              <div className='space-y-2'>
                <Label htmlFor='field-hint'>Help Text</Label>
                <Textarea
                  id='field-hint'
                  value={selectedField.hint || ''}
                  onChange={e => handleFieldUpdate({ hint: e.target.value })}
                  placeholder='Optional help text for users'
                  rows={2}
                />
              </div>
            )}

            {/* Required Toggle - Hide for sections */}
            {!isSection && (
              <div className='flex items-center justify-between'>
                <div>
                  <Label>Required Field</Label>
                  <p className='text-sm text-gray-500'>Users must fill this field</p>
                </div>
                <Switch
                  checked={selectedField.required}
                  onCheckedChange={checked => handleFieldUpdate({ required: checked })}
                />
              </div>
            )}

            {/* Section-specific properties */}
            {isSection && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <Label>Collapsible Section</Label>
                    <p className='text-sm text-gray-500'>
                      Allow users to expand/collapse this section
                    </p>
                  </div>
                  <Switch
                    checked={(selectedField as SectionFieldConfig).collapsible || false}
                    onCheckedChange={checked => handleFieldUpdate({ collapsible: checked })}
                  />
                </div>

                {(selectedField as SectionFieldConfig).collapsible && (
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Default State</Label>
                      <p className='text-sm text-gray-500'>Section starts collapsed</p>
                    </div>
                    <Switch
                      checked={(selectedField as SectionFieldConfig).isCollapsed || false}
                      onCheckedChange={checked => handleFieldUpdate({ isCollapsed: checked })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Type-specific properties for regular fields */}
            {!isSection && selectedField.type === 'textarea' && (
              <div className='space-y-2'>
                <Label htmlFor='textarea-rows'>Rows</Label>
                <Input
                  id='textarea-rows'
                  type='number'
                  min='1'
                  max='20'
                  value={(selectedField as TextareaFieldConfig).rows || 4}
                  onChange={e => handleFieldUpdate({ rows: parseInt(e.target.value) || 4 })}
                />
              </div>
            )}

            {!isSection &&
              (selectedField.type === 'select' ||
                selectedField.type === 'multiselect' ||
                selectedField.type === 'radio') && (
                <div className='space-y-2'>
                  <Label>Options</Label>
                  <div className='space-y-2'>
                    {((selectedField as FieldWithOptions).options || []).map((option, index) => (
                      <div key={index} className='flex items-center space-x-2'>
                        <Input
                          value={option.label}
                          onChange={e => {
                            const currentOptions =
                              (selectedField as FieldWithOptions).options || [];
                            const newOptions = [...currentOptions];
                            newOptions[index] = {
                              ...option,
                              label: e.target.value,
                              value: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                            };
                            handleFieldUpdate({ options: newOptions });
                          }}
                          placeholder='Option label'
                          className='flex-1'
                        />
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            const currentOptions =
                              (selectedField as FieldWithOptions).options || [];
                            const newOptions = currentOptions.filter((_, i) => i !== index);
                            handleFieldUpdate({ options: newOptions });
                          }}
                          className='px-2'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const newOptions = [
                          ...((selectedField as FieldWithOptions).options || []),
                          { label: 'New Option', value: 'new_option' },
                        ];
                        handleFieldUpdate({ options: newOptions });
                      }}
                      className='w-full'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

            {/* Advanced settings merged into Basic tab */}
            {!isSection && (
              <div className='space-y-4 pt-4 border-t border-gray-200'>
                <div className='space-y-2'>
                  <Label>Field Width</Label>
                  <Select
                    value={selectedField.styling?.width || 'full'}
                    onValueChange={value =>
                      handleFieldUpdate({
                        styling: {
                          ...(selectedField.styling || {}),
                          width: value as FieldStyling['width'],
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='full'>Full Width</SelectItem>
                      <SelectItem value='half'>Half Width</SelectItem>
                      <SelectItem value='third'>One Third</SelectItem>
                      <SelectItem value='quarter'>One Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='field-css'>Custom CSS Class</Label>
                  <Input
                    id='field-css'
                    value={selectedField.styling?.className || ''}
                    onChange={e =>
                      handleFieldUpdate({
                        styling: {
                          ...(selectedField.styling || {}),
                          className: e.target.value,
                        },
                      })
                    }
                    placeholder='custom-class-name'
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {!isSection && (
            <>
              <TabsContent value='validation' className='space-y-4'>
                <ValidationRuleEditor
                  rules={selectedField.validation || []}
                  onChange={rules => handleFieldUpdate({ validation: rules })}
                />
              </TabsContent>

              <TabsContent value='conditional' className='space-y-4'>
                <ConditionalLogicBuilder
                  field={selectedField}
                  allFields={config.fields}
                  onUpdate={conditional => handleFieldUpdate({ conditional })}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    );
  };

  return (
    <Card className='flex flex-col h-full rounded-none border-0 border-l'>
      {/* Header */}
      <CardHeader className='p-4 border-b border-border'>
        <CardTitle className='text-lg'>Properties</CardTitle>
      </CardHeader>

      {/* Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4'>
          <div className='space-y-4'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={selectedField?.id || 'no-selection'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderFieldProperties()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <CardContent className='p-4 border-t border-border bg-muted/30'>
        <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
          <Info className='h-3 w-3' />
          <span>Changes are saved automatically</span>
        </div>
      </CardContent>
    </Card>
  );
}
