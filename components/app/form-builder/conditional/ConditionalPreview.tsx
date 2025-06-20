'use client'

import React, { useState, useMemo } from 'react'
import { FieldConfig, FormConfig } from '@/lib/form-builder/types'
import { useConditionalFormValues } from '@/lib/form-builder/conditional/visibility-manager'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Play, RotateCcw, Eye, EyeOff, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConditionalPreviewProps {
  formConfig: FormConfig
  className?: string
  onClose?: () => void
}

interface FieldPreviewProps {
  field: FieldConfig
  value: any
  onChange: (value: any) => void
  isVisible: boolean
}

function FieldPreview({ field, value, onChange, isVisible }: FieldPreviewProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={!isVisible}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={!isVisible}
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            disabled={!isVisible}
          />
        )

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={onChange}
            disabled={!isVisible}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.id}-${option.value}`}
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={!isVisible}
                  className="h-4 w-4"
                />
                <Label htmlFor={`${field.id}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={!isVisible}
              className="h-4 w-4"
            />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
            </Label>
          </div>
        )

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={!!value}
              onCheckedChange={onChange}
              disabled={!isVisible}
            />
            <Label className="text-sm">{field.label}</Label>
          </div>
        )

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={!isVisible}
          />
        )

      case 'datetime':
        return (
          <Input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={!isVisible}
          />
        )

      case 'section':
        return (
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
            <h3 className="font-medium text-lg">{field.label}</h3>
            {field.description && (
              <p className="text-sm text-gray-600 mt-1">{field.description}</p>
            )}
          </div>
        )

      case 'divider':
        return <hr className="border-gray-300" />

      case 'html':
        return (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: field.content || '' }}
          />
        )

      default:
        return (
          <div className="p-2 bg-gray-100 border rounded text-sm text-gray-600">
            Unsupported field type: {field.type}
          </div>
        )
    }
  }

  return (
    <div className={cn(
      'space-y-2 transition-opacity duration-200',
      !isVisible && 'opacity-40'
    )}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
          {isVisible ? (
            <Eye className="h-3 w-3 text-green-600" />
          ) : (
            <EyeOff className="h-3 w-3 text-gray-400" />
          )}
        </Label>
        <Badge variant={isVisible ? 'default' : 'secondary'} className="text-xs">
          {isVisible ? 'Visible' : 'Hidden'}
        </Badge>
      </div>
      
      {field.hint && (
        <p className="text-xs text-gray-600">{field.hint}</p>
      )}
      
      <div className={cn(!isVisible && 'pointer-events-none')}>
        {renderField()}
      </div>
    </div>
  )
}

export function ConditionalPreview({ formConfig, className, onClose }: ConditionalPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const conditionalFields = useMemo(() => 
    formConfig.fields.filter(field => field.conditional && field.conditional.conditions.length > 0),
    [formConfig.fields]
  )

  const {
    values,
    visibilityState,
    visibilityActions,
    updateValue,
    getVisibleValues
  } = useConditionalFormValues(formConfig.fields, {})

  const handleReset = () => {
    visibilityActions.resetVisibility()
    Object.keys(values).forEach(fieldId => {
      updateValue(fieldId, '')
    })
  }

  const handleTogglePreview = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      handleReset()
    }
  }

  const visibleFieldCount = visibilityActions.getVisibleFields().length
  const hiddenFieldCount = visibilityActions.getHiddenFields().length

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Conditional Logic Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {visibleFieldCount} visible
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <EyeOff className="h-3 w-3" />
              {hiddenFieldCount} hidden
            </Badge>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={handleTogglePreview}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isPlaying ? 'Stop Preview' : 'Start Preview'}
          </Button>
          
          {isPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {conditionalFields.length > 0 && (
          <div className="text-sm text-gray-600">
            Found {conditionalFields.length} field{conditionalFields.length > 1 ? 's' : ''} with conditional logic
          </div>
        )}
      </CardHeader>

      {isPlaying && (
        <CardContent>
          <div className="space-y-6">
            {formConfig.fields
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((field) => {
                const isVisible = visibilityActions.getFieldVisibility(field.id)
                const fieldValue = values[field.id]

                return (
                  <FieldPreview
                    key={field.id}
                    field={field}
                    value={fieldValue}
                    onChange={(value) => updateValue(field.id, value)}
                    isVisible={isVisible}
                  />
                )
              })}

            {conditionalFields.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-3">Conditional Logic Status</h4>
                <div className="space-y-2">
                  {conditionalFields.map((field) => {
                    const isVisible = visibilityActions.getFieldVisibility(field.id)
                    const result = visibilityActions.getFieldEvaluationResult(field.id)
                    
                    return (
                      <div key={field.id} className="flex items-center justify-between text-xs">
                        <span className="font-medium">{field.label}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={isVisible ? 'default' : 'secondary'}>
                            {isVisible ? 'Visible' : 'Hidden'}
                          </Badge>
                          {result?.reasons && result.reasons.length > 0 && (
                            <span className="text-gray-500 max-w-xs truncate">
                              {result.reasons[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Form Data (Visible Fields Only)</h4>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(getVisibleValues(), null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      )}

      {!isPlaying && conditionalFields.length === 0 && (
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Conditional Logic Found</p>
            <p className="text-sm">
              Add conditional logic to your fields to see how they interact with each other.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default ConditionalPreview