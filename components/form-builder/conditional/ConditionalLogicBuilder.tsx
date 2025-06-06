'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { ConditionalLogic, FieldConfig, FieldType } from '@/lib/form-builder/types'
import { CONDITIONAL_OPERATORS } from '@/lib/form-builder/constants'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConditionalLogicBuilderProps {
  field: FieldConfig
  allFields: FieldConfig[]
  onUpdate: (conditional: ConditionalLogic | undefined) => void
  className?: string
}

interface ConditionRowProps {
  condition: ConditionalLogic['conditions'][0]
  index: number
  availableFields: FieldConfig[]
  onUpdate: (condition: ConditionalLogic['conditions'][0]) => void
  onRemove: () => void
  showRemove: boolean
}

function ConditionRow({
  condition,
  index,
  availableFields,
  onUpdate,
  onRemove,
  showRemove
}: ConditionRowProps) {
  const selectedField = availableFields.find(f => f.id === condition.fieldId)
  
  const getFieldValueInput = () => {
    if (!selectedField) {
      return (
        <Input
          value={condition.value || ''}
          onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
          placeholder="Enter value..."
          className="flex-1"
        />
      )
    }

    switch (selectedField.type) {
      case 'select':
      case 'radio':
        return (
          <Select
            value={condition.value || ''}
            onValueChange={(value) => onUpdate({ ...condition, value })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select value..." />
            </SelectTrigger>
            <SelectContent>
              {selectedField.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'checkbox':
      case 'switch':
        return (
          <Select
            value={String(condition.value)}
            onValueChange={(value) => onUpdate({ ...condition, value: value === 'true' })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select value..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes/Checked</SelectItem>
              <SelectItem value="false">No/Unchecked</SelectItem>
            </SelectContent>
          </Select>
        )
      
      case 'number':
        return (
          <Input
            type="number"
            value={condition.value || ''}
            onChange={(e) => onUpdate({ ...condition, value: Number(e.target.value) })}
            placeholder="Enter number..."
            className="flex-1"
          />
        )
      
      case 'date':
      case 'datetime':
        return (
          <Input
            type={selectedField.type === 'datetime' ? 'datetime-local' : 'date'}
            value={condition.value || ''}
            onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
            className="flex-1"
          />
        )
      
      default:
        return (
          <Input
            value={condition.value || ''}
            onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
            placeholder="Enter value..."
            className="flex-1"
          />
        )
    }
  }

  const getAvailableOperators = () => {
    if (!selectedField) return Object.values(CONDITIONAL_OPERATORS)
    
    switch (selectedField.type) {
      case 'number':
      case 'date':
      case 'datetime':
        return Object.values(CONDITIONAL_OPERATORS)
      
      case 'select':
      case 'radio':
      case 'checkbox':
      case 'switch':
        return [CONDITIONAL_OPERATORS.EQUALS, CONDITIONAL_OPERATORS.NOT_EQUALS]
      
      case 'multiselect':
        return [CONDITIONAL_OPERATORS.CONTAINS, CONDITIONAL_OPERATORS.EQUALS, CONDITIONAL_OPERATORS.NOT_EQUALS]
      
      default:
        return [
          CONDITIONAL_OPERATORS.EQUALS,
          CONDITIONAL_OPERATORS.NOT_EQUALS,
          CONDITIONAL_OPERATORS.CONTAINS
        ]
    }
  }

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'equals': return 'equals'
      case 'not_equals': return 'does not equal'
      case 'contains': return 'contains'
      case 'greater_than': return 'is greater than'
      case 'less_than': return 'is less than'
      default: return operator
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>If</span>
      </div>
      
      <Select
        value={condition.fieldId}
        onValueChange={(fieldId) => onUpdate({ ...condition, fieldId, value: '' })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select field..." />
        </SelectTrigger>
        <SelectContent>
          {availableFields.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(operator) => onUpdate({ ...condition, operator: operator as any })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Operator..." />
        </SelectTrigger>
        <SelectContent>
          {getAvailableOperators().map((operator) => (
            <SelectItem key={operator} value={operator}>
              {getOperatorLabel(operator)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {getFieldValueInput()}

      {showRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function ConditionalLogicBuilder({
  field,
  allFields,
  onUpdate,
  className
}: ConditionalLogicBuilderProps) {
  const [isEnabled, setIsEnabled] = useState(!!field.conditional)

  // Get fields that can be referenced (excluding self and to prevent circular deps)
  const availableFields = useMemo(() => {
    return allFields.filter(f => {
      if (f.id === field.id) return false
      if (f.order >= field.order) return false // Only allow references to fields above
      return true
    })
  }, [allFields, field.id, field.order])

  const conditional = field.conditional || {
    show: true,
    conditions: [],
    logic: 'and' as const
  }

  const handleToggleEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled)
    if (enabled) {
      onUpdate({
        show: true,
        conditions: [],
        logic: 'and'
      })
    } else {
      onUpdate(undefined)
    }
  }, [onUpdate])

  const handleUpdateConditional = useCallback((updates: Partial<ConditionalLogic>) => {
    onUpdate({ ...conditional, ...updates })
  }, [conditional, onUpdate])

  const handleAddCondition = useCallback(() => {
    if (availableFields.length === 0) return
    
    const newCondition = {
      fieldId: '',
      operator: 'equals' as const,
      value: ''
    }
    
    handleUpdateConditional({
      conditions: [...conditional.conditions, newCondition]
    })
  }, [availableFields.length, conditional.conditions, handleUpdateConditional])

  const handleUpdateCondition = useCallback((index: number, updatedCondition: ConditionalLogic['conditions'][0]) => {
    const newConditions = [...conditional.conditions]
    newConditions[index] = updatedCondition
    handleUpdateConditional({ conditions: newConditions })
  }, [conditional.conditions, handleUpdateConditional])

  const handleRemoveCondition = useCallback((index: number) => {
    const newConditions = conditional.conditions.filter((_, i) => i !== index)
    handleUpdateConditional({ conditions: newConditions })
  }, [conditional.conditions, handleUpdateConditional])

  const hasValidConditions = conditional.conditions.every(c => 
    c.fieldId && c.operator && c.value !== undefined && c.value !== ''
  )

  const conditionSummary = useMemo(() => {
    if (!isEnabled || conditional.conditions.length === 0) {
      return 'Always visible'
    }

    const actionText = conditional.show ? 'Show' : 'Hide'
    const logicText = conditional.logic === 'and' ? 'all' : 'any'
    const conditionCount = conditional.conditions.length

    return `${actionText} when ${logicText} of ${conditionCount} condition${conditionCount > 1 ? 's' : ''} ${conditionCount > 1 ? 'are' : 'is'} met`
  }, [isEnabled, conditional.show, conditional.logic, conditional.conditions.length])

  if (availableFields.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Conditional Logic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            No fields available for conditional logic. Add fields above this one to enable conditional visibility.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {isEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Conditional Logic
          </CardTitle>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isEnabled ? 'default' : 'secondary'} className="text-xs">
            {conditionSummary}
          </Badge>
          {isEnabled && !hasValidConditions && conditional.conditions.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              Invalid conditions
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {isEnabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Field Visibility</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="show"
                  name="visibility"
                  checked={conditional.show}
                  onChange={() => handleUpdateConditional({ show: true })}
                  className="h-4 w-4"
                />
                <Label htmlFor="show" className="text-sm">Show field when conditions are met</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="hide"
                  name="visibility"
                  checked={!conditional.show}
                  onChange={() => handleUpdateConditional({ show: false })}
                  className="h-4 w-4"
                />
                <Label htmlFor="hide" className="text-sm">Hide field when conditions are met</Label>
              </div>
            </div>
          </div>

          {conditional.conditions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Conditions</Label>
              <div className="space-y-2">
                {conditional.conditions.map((condition, index) => (
                  <React.Fragment key={index}>
                    <ConditionRow
                      condition={condition}
                      index={index}
                      availableFields={availableFields}
                      onUpdate={(updatedCondition) => handleUpdateCondition(index, updatedCondition)}
                      onRemove={() => handleRemoveCondition(index)}
                      showRemove={conditional.conditions.length > 1}
                    />
                    {index < conditional.conditions.length - 1 && (
                      <div className="flex justify-center">
                        <Select
                          value={conditional.logic}
                          onValueChange={(logic) => handleUpdateConditional({ logic: logic as 'and' | 'or' })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="and">AND</SelectItem>
                            <SelectItem value="or">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCondition}
            className="w-full"
            disabled={availableFields.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>

          {conditional.conditions.length > 0 && !hasValidConditions && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Please complete all conditions for the logic to work properly.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default ConditionalLogicBuilder