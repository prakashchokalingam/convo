'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FormConfig, FieldConfig, ValidationRule } from '@/lib/form-builder/types'
import { getFieldDefinition } from '@/lib/form-builder/field-registry'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import ConditionalLogicBuilder from '../conditional/ConditionalLogicBuilder'
import DependencyIndicator from '../conditional/DependencyIndicator'
import { 
  Settings, 
  Type, 
  Shield, 
  Eye, 
  Palette,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react'

interface PropertiesPanelProps {
  config: FormConfig
  selectedField?: FieldConfig
  onUpdateConfig: (updates: Partial<FormConfig>) => void
  onUpdateField: (fieldId: string, updates: Partial<FieldConfig>) => void
}

interface ValidationRuleEditorProps {
  rules: ValidationRule[]
  onChange: (rules: ValidationRule[]) => void
}

function ValidationRuleEditor({ rules, onChange }: ValidationRuleEditorProps) {
  const addRule = useCallback((type: ValidationRule['type']) => {
    const newRule: ValidationRule = {
      type,
      message: getDefaultValidationMessage(type),
      value: getDefaultValidationValue(type)
    }
    onChange([...rules, newRule])
  }, [rules, onChange])

  const updateRule = useCallback((index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], ...updates }
    onChange(newRules)
  }, [rules, onChange])

  const removeRule = useCallback((index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    onChange(newRules)
  }, [rules, onChange])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Validation Rules</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addRule('required')}
          className="h-7 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Rule
        </Button>
      </div>
      
      <div className="space-y-2">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-gray-200 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <select
                value={rule.type}
                onChange={(e) => updateRule(index, { 
                  type: e.target.value as ValidationRule['type'],
                  message: getDefaultValidationMessage(e.target.value as ValidationRule['type']),
                  value: getDefaultValidationValue(e.target.value as ValidationRule['type'])
                })}
                className="text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="required">Required</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
                <option value="pattern">Pattern</option>
                <option value="custom">Custom</option>
              </select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRule(index)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            {(rule.type === 'min' || rule.type === 'max') && (
              <Input
                type="number"
                placeholder="Value"
                value={rule.value || ''}
                onChange={(e) => updateRule(index, { value: parseInt(e.target.value) || 0 })}
                className="text-xs"
              />
            )}
            
            {rule.type === 'pattern' && (
              <Input
                placeholder="Regular expression"
                value={rule.value || ''}
                onChange={(e) => updateRule(index, { value: e.target.value })}
                className="text-xs"
              />
            )}
            
            <Input
              placeholder="Error message"
              value={rule.message}
              onChange={(e) => updateRule(index, { message: e.target.value })}
              className="text-xs"
            />
          </motion.div>
        ))}
      </div>
      
      {rules.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No validation rules added
        </div>
      )}
    </div>
  )
}

function getDefaultValidationMessage(type: ValidationRule['type']): string {
  switch (type) {
    case 'required': return 'This field is required'
    case 'min': return 'Value must be at least {min}'
    case 'max': return 'Value must be at most {max}'
    case 'pattern': return 'Please enter a valid format'
    case 'custom': return 'Invalid value'
    default: return 'Invalid value'
  }
}

function getDefaultValidationValue(type: ValidationRule['type']): any {
  switch (type) {
    case 'min':
    case 'max':
      return 0
    case 'pattern':
      return ''
    default:
      return undefined
  }
}

export function PropertiesPanel({
  config,
  selectedField,
  onUpdateConfig,
  onUpdateField
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('basic')

  const handleFieldUpdate = useCallback((updates: Partial<FieldConfig>) => {
    if (selectedField) {
      onUpdateField(selectedField.id, updates)
    }
  }, [selectedField, onUpdateField])

  const handleFormSettingsUpdate = useCallback((updates: Partial<FormConfig['settings']>) => {
    onUpdateConfig({
      settings: { ...config.settings, ...updates }
    })
  }, [config.settings, onUpdateConfig])

  const renderFieldProperties = () => {
    if (!selectedField) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Field Selected</h3>
          <p className="text-sm text-gray-500">
            Select a field from the canvas to edit its properties
          </p>
        </div>
      )
    }

    const definition = getFieldDefinition(selectedField.type)
    const IconComponent = definition?.icon as React.ComponentType<{ className?: string }>
    const isSection = selectedField.type === 'section'

    return (
      <div className="space-y-6">
        {/* Field Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
          {IconComponent && (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isSection ? 'bg-blue-100' : 'bg-blue-100'
            }`}>
              <IconComponent className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{definition?.label}</h3>
              <DependencyIndicator 
                field={selectedField}
                allFields={config.fields}
              />
            </div>
            <p className="text-sm text-gray-500">{definition?.description}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`grid w-full ${
            isSection ? 'grid-cols-1' : 'grid-cols-3'
          }`}>
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            {!isSection && (
              <>
                <TabsTrigger value="validation" className="text-xs">Validation</TabsTrigger>
                <TabsTrigger value="conditional" className="text-xs flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Conditional
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="field-label">{isSection ? 'Section Title' : 'Label'}</Label>
              <Input
                id="field-label"
                value={selectedField.label}
                onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                placeholder={isSection ? 'Enter section title' : 'Enter field label'}
              />
            </div>

            {/* Section Description (for sections only) */}
            {isSection && (
              <div className="space-y-2">
                <Label htmlFor="section-description">Description</Label>
                <Textarea
                  id="section-description"
                  value={(selectedField as any).description || ''}
                  onChange={(e) => handleFieldUpdate({ description: e.target.value })}
                  placeholder="Optional section description"
                  rows={2}
                />
              </div>
            )}

            {/* Placeholder */}
            {!isSection && ['text', 'email', 'number', 'textarea', 'select', 'multiselect'].includes(selectedField.type) && (
              <div className="space-y-2">
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                  id="field-placeholder"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                  placeholder="Enter placeholder text"
                />
              </div>
            )}

            {/* Hint */}
            {!isSection && (
              <div className="space-y-2">
                <Label htmlFor="field-hint">Help Text</Label>
                <Textarea
                  id="field-hint"
                  value={selectedField.hint || ''}
                  onChange={(e) => handleFieldUpdate({ hint: e.target.value })}
                  placeholder="Optional help text for users"
                  rows={2}
                />
              </div>
            )}

            {/* Required Toggle - Hide for sections */}
            {!isSection && (
              <div className="flex items-center justify-between">
                <div>
                  <Label>Required Field</Label>
                  <p className="text-sm text-gray-500">Users must fill this field</p>
                </div>
                <Switch
                  checked={selectedField.required}
                  onCheckedChange={(checked) => handleFieldUpdate({ required: checked })}
                />
              </div>
            )}

            {/* Section-specific properties */}
            {isSection && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Collapsible Section</Label>
                    <p className="text-sm text-gray-500">Allow users to expand/collapse this section</p>
                  </div>
                  <Switch
                    checked={(selectedField as any).collapsible || false}
                    onCheckedChange={(checked) => handleFieldUpdate({ collapsible: checked })}
                  />
                </div>
                
                {(selectedField as any).collapsible && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Default State</Label>
                      <p className="text-sm text-gray-500">Section starts collapsed</p>
                    </div>
                    <Switch
                      checked={(selectedField as any).isCollapsed || false}
                      onCheckedChange={(checked) => handleFieldUpdate({ isCollapsed: checked } as any)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Type-specific properties for regular fields */}
            {!isSection && selectedField.type === 'textarea' && (
              <div className="space-y-2">
                <Label htmlFor="textarea-rows">Rows</Label>
                <Input
                  id="textarea-rows"
                  type="number"
                  min="1"
                  max="20"
                  value={(selectedField as any).rows || 4}
                  onChange={(e) => handleFieldUpdate({ rows: parseInt(e.target.value) || 4 })}
                />
              </div>
            )}

            {!isSection && (selectedField.type === 'select' || selectedField.type === 'multiselect' || selectedField.type === 'radio') && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {((selectedField as any).options || []).map((option: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...((selectedField as any).options || [])]
                          newOptions[index] = { ...option, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') }
                          handleFieldUpdate({ options: newOptions })
                        }}
                        placeholder="Option label"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = ((selectedField as any).options || []).filter((_: any, i: number) => i !== index)
                          handleFieldUpdate({ options: newOptions })
                        }}
                        className="px-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [...((selectedField as any).options || []), { label: 'New Option', value: 'new_option' }]
                      handleFieldUpdate({ options: newOptions })
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {/* Advanced settings merged into Basic tab */}
            {!isSection && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <Label>Field Width</Label>
                  <select
                    value={(selectedField as any).styling?.width || 'full'}
                    onChange={(e) => handleFieldUpdate({ 
                      styling: { 
                        ...((selectedField as any).styling || {}), 
                        width: e.target.value 
                      } 
                    })}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="full">Full Width</option>
                    <option value="half">Half Width</option>
                    <option value="third">One Third</option>
                    <option value="quarter">One Quarter</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field-css">Custom CSS Class</Label>
                  <Input
                    id="field-css"
                    value={(selectedField as any).styling?.className || ''}
                    onChange={(e) => handleFieldUpdate({ 
                      styling: { 
                        ...((selectedField as any).styling || {}), 
                        className: e.target.value 
                      } 
                    })}
                    placeholder="custom-class-name"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {!isSection && (
            <>
              <TabsContent value="validation" className="space-y-4">
                <ValidationRuleEditor
                  rules={selectedField.validation || []}
                  onChange={(rules) => handleFieldUpdate({ validation: rules })}
                />
              </TabsContent>

              <TabsContent value="conditional" className="space-y-4">
                <ConditionalLogicBuilder
                  field={selectedField}
                  allFields={config.fields}
                  onUpdate={(conditional) => handleFieldUpdate({ conditional })}
                />
              </TabsContent>


            </>
          )}
        </Tabs>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Properties
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
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
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Info className="h-3 w-3" />
          <span>Changes are saved automatically</span>
        </div>
      </div>
    </div>
  )
}