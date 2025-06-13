'use client'

import React, { useCallback, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { FormConfig, FieldConfig, DragItem } from '@/lib/form-builder/types'
import { SortableFieldItem } from './SortableFieldItem'
import { EmptyCanvas } from './EmptyCanvas'
import { Plus, Eye, GripVertical, Trash2, Copy, Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Insertion Indicator Component
interface InsertionIndicatorProps {
  position: 'top' | 'bottom'
  isVisible: boolean
}

function InsertionIndicator({ position, isVisible }: InsertionIndicatorProps) {
  if (!isVisible) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0 }}
      className={`
        absolute left-0 right-0 h-0.5 bg-blue-500 z-20
        ${position === 'top' ? 'top-0' : 'bottom-0'}
      `}
    >
      <div className="absolute left-0 w-2 h-2 bg-blue-500 rounded-full -top-0.75"></div>
      <div className="absolute right-0 w-2 h-2 bg-blue-500 rounded-full -top-0.75"></div>
    </motion.div>
  )
}

// Field Wrapper with Drop Zones
interface FieldWrapperProps {
  children: React.ReactNode
  fieldId: string
  index: number
  sectionId?: string
  onDrop?: (droppedItem: any, position: 'before' | 'after') => void
}

function FieldWrapper({ children, fieldId, index, sectionId, onDrop }: FieldWrapperProps) {
  // Before drop zone
  const { isOver: isOverBefore, setNodeRef: setBeforeRef } = useDroppable({
    id: `before-${fieldId}-${sectionId || 'root'}`,
    data: {
      type: 'field-insertion',
      position: 'before',
      targetFieldId: fieldId,
      index,
      sectionId
    }
  })

  // After drop zone
  const { isOver: isOverAfter, setNodeRef: setAfterRef } = useDroppable({
    id: `after-${fieldId}-${sectionId || 'root'}`,
    data: {
      type: 'field-insertion',
      position: 'after',
      targetFieldId: fieldId,
      index,
      sectionId
    }
  })

  return (
    <div className="relative">
      {/* Before drop zone */}
      <div
        ref={setBeforeRef}
        className="absolute -top-3 left-0 right-0 h-6 z-10"
      >
        <InsertionIndicator position="top" isVisible={isOverBefore} />
      </div>
      
      {/* Field content */}
      {children}
      
      {/* After drop zone */}
      <div
        ref={setAfterRef}
        className="absolute -bottom-3 left-0 right-0 h-6 z-10"
      >
        <InsertionIndicator position="bottom" isVisible={isOverAfter} />
      </div>
    </div>
  )
}

// Section Container Component
interface SectionContainerProps {
  section: FieldConfig
  children: FieldConfig[]
  allFields: FieldConfig[]
  selectedFieldId?: string
  onSelectField: (fieldId?: string) => void
  onUpdateField: (fieldId: string, updates: Partial<FieldConfig>) => void
  onRemoveField: (fieldId: string) => void
  onDuplicateField: (field: FieldConfig) => void
}

function SectionContainer({
  section,
  children,
  allFields,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onRemoveField,
  onDuplicateField
}: SectionContainerProps) {
  const isSelected = selectedFieldId === section.id
  const sectionField = section as any
  const isCollapsed = sectionField.isCollapsed || false

  // Sortable for the section itself
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      id: section.id,
      type: 'field',
      data: section
    }
  })

  // Section-level drop zone (for dropping INTO the section)
  const {
    isOver: isSectionOver,
    setNodeRef: setSectionDropRef
  } = useDroppable({
    id: `section-drop-${section.id}`,
    data: {
      type: 'section-drop',
      sectionId: section.id,
      accepts: ['new-field', 'field']
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleLabelChange = (newLabel: string) => {
    onUpdateField(section.id, { label: newLabel })
  }

  const handleToggleCollapse = () => {
    onUpdateField(section.id, { isCollapsed: !isCollapsed } as any)
  }

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectField(section.id)
  }

  // Combine refs properly
  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    setSortableRef(node)
    setSectionDropRef(node)
  }, [setSortableRef, setSectionDropRef])

  return (
    <Card 
      ref={combinedRef}
      style={style}
      className={`
        relative transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'hover:shadow-md'}
        ${isDragging ? 'opacity-50 rotate-1 scale-105' : ''}
        ${isSectionOver && !isCollapsed ? 'border-primary shadow-xl bg-primary/5 scale-[1.02]' : ''}
      `}
    >

      {/* Full Section Drop Overlay - Exactly like Canvas */}
      {isSectionOver && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-0 bg-blue-500/15 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center pointer-events-none backdrop-blur-sm z-30"
        >
          <div className="text-center bg-white px-6 py-3 rounded-full border-2 border-blue-500 shadow-lg">
            <div className="flex items-center space-x-3">
              <Plus className="h-6 w-6 text-blue-600" />
              <span className="text-blue-700 font-semibold">Add field to "{section.label}" section</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section Header */}
      <CardHeader 
        className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer space-y-0"
        onClick={handleSectionClick}
      >
        <div className="flex items-center space-x-3 flex-1">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-600 transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Section Icon */}
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary border-dashed rounded"></div>
          </div>

          {/* Section Content */}
          <div className="flex-1">
            <input
              type="text"
              value={section.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-300 focus:rounded px-2 py-1 w-full"
              placeholder="Section Title"
            />
            {sectionField.description && (
              <p className="text-sm text-gray-600 mt-1">{sectionField.description}</p>
            )}
          </div>

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleToggleCollapse()
            }}
            className="p-1"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Section Actions */}
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicateField(section)
            }}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4 text-gray-400 hover:text-blue-500" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSectionClick}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4 text-gray-400 hover:text-blue-500" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRemoveField(section.id)
            }}
            className="h-8 w-8 p-0 text-red-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Section Content Area */}
      {!isCollapsed && (
        <CardContent className="p-4">
          {children.length === 0 ? (
            // Empty section state
            <div className={`
              min-h-[120px] border-2 border-dashed rounded-lg transition-all duration-200 
              flex items-center justify-center
              ${isSectionOver 
                ? 'border-blue-400 bg-blue-100/30' 
                : 'border-gray-300 bg-gray-50/30 hover:border-gray-400'
              }
            `}>
              <div className="text-center">
                <div className={`
                  transition-all duration-200
                  ${isSectionOver ? 'text-blue-600 scale-110' : 'text-gray-400'}
                `}>
                  <Plus className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    {isSectionOver ? 'Drop field here' : 'Drag fields here to add to section'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Fields inside section
            <div className="space-y-3">
              <SortableContext
                items={children.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {children.map((field, index) => (
                    <motion.div
                      key={field.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldWrapper
                        fieldId={field.id}
                        index={index}
                        sectionId={section.id}
                      >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200">
                          <SortableFieldItem
                            field={field}
                            allFields={allFields}
                            isSelected={selectedFieldId === field.id}
                            onClick={(event) => {
                              event.stopPropagation()
                              onSelectField(field.id)
                            }}
                            onUpdate={(updates) => onUpdateField(field.id, updates)}
                            onRemove={() => onRemoveField(field.id)}
                            onDuplicate={onDuplicateField}
                          />
                        </div>
                      </FieldWrapper>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SortableContext>
            </div>
          )}

          {/* Section Footer */}
          {children.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>
                {children.length} field{children.length !== 1 ? 's' : ''} in this section
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleCollapse()
                }}
                className="h-6 px-2 text-xs"
              >
                {isCollapsed ? 'Expand' : 'Collapse'}
              </Button>
            </div>
          )}
        </CardContent>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          layoutId="section-selection-indicator"
          className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
          initial={false}
        />
      )}
    </Card>
  )
}

interface FormCanvasProps {
  config: FormConfig
  selectedFieldId?: string
  onSelectField: (fieldId?: string) => void
  onUpdateField: (fieldId: string, updates: Partial<FieldConfig>) => void
  onRemoveField: (fieldId: string) => void
  onDuplicateField: (field: FieldConfig) => void
  isDragActive?: boolean
}

export function FormCanvas({
  config,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onRemoveField,
  onDuplicateField,
  isDragActive = false
}: FormCanvasProps) {
  // Main canvas drop zone
  const {
    isOver: isCanvasOver,
    setNodeRef: setCanvasDropRef
  } = useDroppable({
    id: 'form-canvas',
    data: {
      type: 'canvas',
      accepts: ['new-field', 'field']
    }
  })

  // Separate fields into root fields and nested fields
  const rootFields = useMemo(() => {
    return [...config.fields]
      .filter(field => !field.sectionId) // Only root level fields
      .sort((a, b) => a.order - b.order)
  }, [config.fields])

  const getFieldsBySection = useMemo(() => {
    const sectionFields: Record<string, FieldConfig[]> = {}
    
    config.fields
      .filter(field => field.sectionId)
      .forEach(field => {
        if (!sectionFields[field.sectionId!]) {
          sectionFields[field.sectionId!] = []
        }
        sectionFields[field.sectionId!].push(field)
      })
    
    // Sort fields within each section
    Object.keys(sectionFields).forEach(sectionId => {
      sectionFields[sectionId].sort((a, b) => a.order - b.order)
    })
    
    return sectionFields
  }, [config.fields])

  const handleFieldClick = useCallback((fieldId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onSelectField(fieldId)
  }, [onSelectField])

  const handleCanvasClick = useCallback(() => {
    onSelectField(undefined)
  }, [onSelectField])

  const renderField = useCallback((field: FieldConfig, index: number) => {
    if (field.type === 'section') {
      const sectionChildren = getFieldsBySection[field.id] || []
      return (
        <FieldWrapper
          key={field.id}
          fieldId={field.id}
          index={index}
        >
          <SectionContainer
            section={field}
            children={sectionChildren}
            allFields={config.fields}
            selectedFieldId={selectedFieldId}
            onSelectField={onSelectField}
            onUpdateField={onUpdateField}
            onRemoveField={onRemoveField}
            onDuplicateField={onDuplicateField}
          />
        </FieldWrapper>
      )
    }

    return (
      <FieldWrapper
        key={field.id}
        fieldId={field.id}
        index={index}
      >
        <SortableFieldItem
          field={field}
          allFields={config.fields}
          isSelected={selectedFieldId === field.id}
          onClick={(event) => handleFieldClick(field.id, event)}
          onUpdate={(updates) => onUpdateField(field.id, updates)}
          onRemove={() => onRemoveField(field.id)}
          onDuplicate={onDuplicateField}
        />
      </FieldWrapper>
    )
  }, [selectedFieldId, getFieldsBySection, onSelectField, onUpdateField, onRemoveField, onDuplicateField, handleFieldClick])

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Canvas Header */}
      <Card className="rounded-none border-0 border-b">
        <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-lg">Form Canvas</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {config.fields.length} fields
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Preview Mode</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Canvas Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <Card 
            ref={setCanvasDropRef}
            onClick={handleCanvasClick}
            className={`
              min-h-[600px] transition-all duration-200 relative
              ${isCanvasOver ? 'border-primary bg-primary/5 shadow-lg' : ''}
              ${rootFields.length === 0 ? 'flex items-center justify-center' : ''}
            `}
          >
            {rootFields.length === 0 ? (
              <EmptyCanvas />
            ) : (
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Form Header */}
                  <div className="pb-6 border-b border-border">
                    <h1 className="text-2xl font-bold mb-2">
                      {config.settings.title}
                    </h1>
                    {config.description && (
                      <p className="text-muted-foreground">
                        {config.description}
                      </p>
                    )}
                  </div>

                {/* Form Fields */}
                <SortableContext
                  items={rootFields.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                      {rootFields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {renderField(field, index)}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>

                  {/* Submit Button Preview */}
                  <div className="pt-6 border-t border-border">
                    <Button className="w-full md:w-auto">
                      {config.settings.submitButtonText}
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Canvas Drop indicator overlay */}
            {isCanvasOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-primary/15 border-2 border-dashed border-primary rounded-lg flex items-center justify-center pointer-events-none backdrop-blur-sm"
              >
                <Card className="bg-background px-6 py-3 border-2 border-primary shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Plus className="h-6 w-6 text-primary" />
                    <span className="text-primary font-semibold">Add field to form</span>
                  </div>
                </Card>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
