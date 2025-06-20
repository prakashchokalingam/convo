'use client'

import React from 'react'
import { FieldConfig } from '@/lib/form-builder/types'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowDown, ArrowUp, Eye, EyeOff, AlertTriangle, Link } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DependencyIndicatorProps {
  field: FieldConfig
  allFields: FieldConfig[]
  className?: string
}

interface FieldDependency {
  id: string
  label: string
  type: 'dependency' | 'dependent'
}

export function DependencyIndicator({ field, allFields, className }: DependencyIndicatorProps) {
  // Get fields this field depends on
  const dependencies: FieldDependency[] = React.useMemo(() => {
    if (!field.conditional?.conditions) return []
    
    return field.conditional.conditions
      .map(condition => {
        const dependentField = allFields.find(f => f.id === condition.fieldId)
        return dependentField ? {
          id: dependentField.id,
          label: dependentField.label,
          type: 'dependency' as const
        } : null
      })
      .filter((dep): dep is NonNullable<typeof dep> => dep !== null)
  }, [field.conditional, allFields])

  // Get fields that depend on this field
  const dependents: FieldDependency[] = React.useMemo(() => {
    return allFields
      .filter(f => 
        f.conditional?.conditions?.some(condition => condition.fieldId === field.id)
      )
      .map(f => ({
        id: f.id,
        label: f.label,
        type: 'dependent' as const
      }))
  }, [field.id, allFields])

  const hasConditionalLogic = !!field.conditional && field.conditional.conditions.length > 0
  const hasDependencies = dependencies.length > 0
  const hasDependents = dependents.length > 0
  const hasAnyRelationships = hasDependencies || hasDependents

  if (!hasAnyRelationships && !hasConditionalLogic) {
    return null
  }

  const getConditionalSummary = () => {
    if (!field.conditional) return ''
    
    const { show, logic, conditions } = field.conditional
    const action = show ? 'shown' : 'hidden'
    const logicText = logic === 'and' ? 'all' : 'any'
    const conditionCount = conditions.length
    
    return `Field is ${action} when ${logicText} of ${conditionCount} condition${conditionCount > 1 ? 's' : ''} ${conditionCount > 1 ? 'are' : 'is'} met`
  }

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-1', className)}>
        {hasConditionalLogic && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary" 
                className="text-xs px-1.5 py-0.5 flex items-center gap-1"
              >
                {field.conditional?.show ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                Conditional
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Conditional Logic: {getConditionalSummary()}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {hasDependencies && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="text-xs px-1.5 py-0.5 flex items-center gap-1 border-blue-200 text-blue-700"
              >
                <ArrowUp className="h-3 w-3" />
                {dependencies.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Depends on {dependencies.length} field{dependencies.length > 1 ? 's' : ''}: {dependencies.map(d => d.label).join(', ')}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {hasDependents && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="text-xs px-1.5 py-0.5 flex items-center gap-1 border-green-200 text-green-700"
              >
                <ArrowDown className="h-3 w-3" />
                {dependents.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{dependents.length} field{dependents.length > 1 ? 's' : ''} depend{dependents.length === 1 ? 's' : ''} on this: {dependents.map(d => d.label).join(', ')}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

export default DependencyIndicator