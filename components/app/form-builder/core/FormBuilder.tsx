'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import { FormConfig, FieldConfig, FieldType, FormBuilderState, DragItem } from '@/lib/form-builder/types'
import { DEFAULT_FORM_SETTINGS, DEFAULT_THEME_CONFIG } from '@/lib/form-builder/constants'
import { createFieldConfig } from '@/lib/form-builder/field-registry'
import { FieldLibrary } from './FieldLibrary'
import { FormCanvas } from './FormCanvas'
import { PropertiesPanel } from './PropertiesPanel'
import { Button } from '@/components/shared/ui/button'
import { Save, Eye, Settings, Undo, Redo, Zap } from 'lucide-react'
import ConditionalPreview from '../conditional/ConditionalPreview'

interface FormBuilderProps {
  initialConfig?: Partial<FormConfig>
  onSave?: (config: FormConfig) => void
  onPreview?: (config: FormConfig) => void
  mode?: 'create' | 'edit'
  className?: string
}

export function FormBuilder({ 
  initialConfig, 
  onSave, 
  onPreview,
  mode = 'create',
  className = ''
}: FormBuilderProps) {
  // Initialize form configuration
  const [state, setState] = useState<FormBuilderState>(() => {
    const defaultConfig: FormConfig = {
      id: initialConfig?.id || `form_${Date.now()}`,
      name: initialConfig?.name || 'Untitled Form',
      description: initialConfig?.description || '',
      settings: { ...DEFAULT_FORM_SETTINGS, ...initialConfig?.settings },
      fields: initialConfig?.fields || [],
      theme: { ...DEFAULT_THEME_CONFIG, ...initialConfig?.theme },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        createdBy: 'current-user',
        ...initialConfig?.metadata
      }
    }

    return {
      config: defaultConfig,
      selectedFieldId: undefined,
      isDragging: false,
      dragPreview: undefined,
      history: [defaultConfig],
      historyIndex: 0
    }
  })

  // Preview mode state
  const [showPreview, setShowPreview] = useState(false)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Memoized computed values
  const canUndo = useMemo(() => state.historyIndex > 0, [state.historyIndex])
  const canRedo = useMemo(() => state.historyIndex < state.history.length - 1, [state.historyIndex, state.history.length])
  const selectedField = useMemo(() => {
    return state.selectedFieldId 
      ? state.config.fields.find(field => field.id === state.selectedFieldId)
      : undefined
  }, [state.selectedFieldId, state.config.fields])

  // History management
  const addToHistory = useCallback((config: FormConfig) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1)
      newHistory.push(config)
      
      // Limit history size
      if (newHistory.length > 50) {
        newHistory.shift()
      }
      
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1
      }
    })
  }, [])

  // Update configuration with history
  const updateConfig = useCallback((updates: Partial<FormConfig>) => {
    setState(prev => {
      const newConfig = {
        ...prev.config,
        ...updates,
        metadata: {
          ...prev.config.metadata,
          updatedAt: new Date()
        }
      }
      
      addToHistory(newConfig)
      
      return {
        ...prev,
        config: newConfig
      }
    })
  }, [addToHistory])

  // Field management actions
  const addField = useCallback((fieldType: FieldType, sectionId?: string, position?: number) => {
    const newField = createFieldConfig(fieldType, {
      order: position ?? state.config.fields.length,
      sectionId: sectionId,
      nestingLevel: sectionId ? 1 : 0 // Fields inside sections are nested at level 1
    })
    
    const newFields = [...state.config.fields]
    if (position !== undefined) {
      newFields.splice(position, 0, newField)
      // Reorder subsequent fields
      newFields.forEach((field, index) => {
        field.order = index
      })
    } else {
      newFields.push(newField)
    }
    
    updateConfig({ fields: newFields })
    setState(prev => ({ ...prev, selectedFieldId: newField.id }))
  }, [state.config.fields, updateConfig])

  const updateField = useCallback((fieldId: string, updates: Partial<FieldConfig>) => {
    const newFields = state.config.fields.map(field => 
      field.id === fieldId 
        ? { ...field, ...updates }
        : field
    )
    updateConfig({ fields: newFields })
  }, [state.config.fields, updateConfig])

  const removeField = useCallback((fieldId: string) => {
    const newFields = state.config.fields
      .filter(field => field.id !== fieldId)
      .map((field, index) => ({ ...field, order: index }))
    
    updateConfig({ fields: newFields })
    
    if (state.selectedFieldId === fieldId) {
      setState(prev => ({ ...prev, selectedFieldId: undefined }))
    }
  }, [state.config.fields, state.selectedFieldId, updateConfig])

  const duplicateField = useCallback((field: FieldConfig) => {
    const duplicatedField = {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: `${field.label} (Copy)`,
      order: field.order + 0.1,
      sectionId: field.sectionId, // Preserve section assignment
    }
    
    const newFields = [...state.config.fields, duplicatedField]
      .sort((a, b) => a.order - b.order)
      .map((field, index) => ({ ...field, order: index }))
    
    // If duplicating a field in a section, update the section's children
    if (field.sectionId) {
      const sectionIndex = newFields.findIndex(f => f.id === field.sectionId)
      if (sectionIndex !== -1) {
        const section = newFields[sectionIndex] as any
        if (!section.children) section.children = []
        section.children.push(duplicatedField.id)
      }
    }
    
    updateConfig({ fields: newFields })
    
    // Animate to the new field with a slight delay
    setTimeout(() => {
      setState(prev => ({ ...prev, selectedFieldId: duplicatedField.id }))
    }, 100)
  }, [state.config.fields, updateConfig])

  const moveField = useCallback((fieldId: string, newPosition: number) => {
    const fields = [...state.config.fields]
    const fieldIndex = fields.findIndex(f => f.id === fieldId)
    
    if (fieldIndex === -1) return
    
    const [movedField] = fields.splice(fieldIndex, 1)
    fields.splice(newPosition, 0, movedField)
    
    // Update order for all fields
    fields.forEach((field, index) => {
      field.order = index
    })
    
    updateConfig({ fields })
  }, [state.config.fields, updateConfig])

  // Helper functions for field positioning
  const addFieldToSectionAtPosition = useCallback((fieldType: FieldType, sectionId: string, position: number) => {
    const newField = createFieldConfig(fieldType, {
      sectionId,
      nestingLevel: 1
    })
    
    // Get all fields in the target section
    const sectionFields = state.config.fields.filter(f => f.sectionId === sectionId)
    const otherFields = state.config.fields.filter(f => f.sectionId !== sectionId)
    
    // Insert at position within section
    sectionFields.splice(position, 0, newField)
    
    // Reorder section fields
    sectionFields.forEach((field, index) => {
      field.order = otherFields.length + index
    })
    
    const newFields = [...otherFields, ...sectionFields]
      .sort((a, b) => a.order - b.order)
      .map((field, index) => ({ ...field, order: index }))
    
    updateConfig({ fields: newFields })
    setState(prev => ({ ...prev, selectedFieldId: newField.id }))
  }, [state.config.fields, updateConfig])
  
  const moveFieldToSectionAtPosition = useCallback((fieldId: string, sectionId: string, position: number) => {
    const field = state.config.fields.find(f => f.id === fieldId)
    if (!field) return
    
    // Update field to belong to section
    const updatedField = {
      ...field,
      sectionId,
      nestingLevel: 1
    }
    
    // Get all other fields and section fields
    const otherFields = state.config.fields.filter(f => f.id !== fieldId && f.sectionId !== sectionId)
    const sectionFields = state.config.fields.filter(f => f.id !== fieldId && f.sectionId === sectionId)
    
    // Insert at position within section
    sectionFields.splice(position, 0, updatedField)
    
    // Reorder section fields
    sectionFields.forEach((field, index) => {
      field.order = otherFields.length + index
    })
    
    const newFields = [...otherFields, ...sectionFields]
      .sort((a, b) => a.order - b.order)
      .map((field, index) => ({ ...field, order: index }))
    
    updateConfig({ fields: newFields })
  }, [state.config.fields, updateConfig])
  
  const moveFieldToMainFormAtPosition = useCallback((fieldId: string, position: number) => {
    const field = state.config.fields.find(f => f.id === fieldId)
    if (!field) return
    
    // Update field to belong to main form
    const updatedField = {
      ...field,
      sectionId: undefined,
      nestingLevel: 0
    }
    
    // Get main form fields (excluding the moving field)
    const mainFields = state.config.fields.filter(f => f.id !== fieldId && !f.sectionId)
    const sectionFields = state.config.fields.filter(f => f.id !== fieldId && f.sectionId)
    
    // Insert at position in main form
    mainFields.splice(position, 0, updatedField)
    
    const newFields = [...mainFields, ...sectionFields]
      .map((field, index) => ({ ...field, order: index }))
    
    updateConfig({ fields: newFields })
  }, [state.config.fields, updateConfig])
  
  const reorderFieldAtPosition = useCallback((fieldId: string, newPosition: number, sectionId?: string) => {
    if (sectionId) {
      // Reordering within a section
      const sectionFields = state.config.fields.filter(f => f.sectionId === sectionId)
      const otherFields = state.config.fields.filter(f => f.sectionId !== sectionId)
      
      const fieldIndex = sectionFields.findIndex(f => f.id === fieldId)
      if (fieldIndex === -1) return
      
      const [movedField] = sectionFields.splice(fieldIndex, 1)
      sectionFields.splice(newPosition, 0, movedField)
      
      // Reorder section fields
      sectionFields.forEach((field, index) => {
        field.order = otherFields.length + index
      })
      
      const newFields = [...otherFields, ...sectionFields]
        .sort((a, b) => a.order - b.order)
        .map((field, index) => ({ ...field, order: index }))
      
      updateConfig({ fields: newFields })
    } else {
      // Reordering in main form
      moveField(fieldId, newPosition)
    }
  }, [state.config.fields, updateConfig, moveField])

  const selectField = useCallback((fieldId?: string) => {
    setState(prev => ({ ...prev, selectedFieldId: fieldId }))
  }, [])

  // Undo/Redo actions
  const undo = useCallback(() => {
    if (!canUndo) return
    
    setState(prev => {
      const newIndex = prev.historyIndex - 1
      return {
        ...prev,
        config: prev.history[newIndex],
        historyIndex: newIndex
      }
    })
  }, [canUndo])

  const redo = useCallback(() => {
    if (!canRedo) return
    
    setState(prev => {
      const newIndex = prev.historyIndex + 1
      return {
        ...prev,
        config: prev.history[newIndex],
        historyIndex: newIndex
      }
    })
  }, [canRedo])

  // Drag and drop handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const dragItem = active.data.current as DragItem
    
    setState(prev => ({
      ...prev,
      isDragging: true,
      dragPreview: dragItem
    }))
  }, [])

  // Enhanced drag and drop handler
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    setState(prev => ({
      ...prev,
      isDragging: false,
      dragPreview: undefined
    }))
    
    if (!over) return
    
    const dragItem = active.data.current as DragItem
    const overItem = over.data.current
    
    // Prevent section nesting - don't allow sections to be dropped into other sections
    if (dragItem.fieldType === 'section' && overItem?.type === 'section-drop') {
      console.warn('Cannot nest sections - sections can only be at root level')
      return
    }
    
    if (dragItem.type === 'field' && dragItem.data?.type === 'section' && overItem?.sectionId) {
      console.warn('Cannot move sections into other sections')
      return
    }

    // Handle different drop types
    switch (overItem?.type) {
      case 'section-drop': {
        // Dropping INTO a section
        const sectionId = overItem.sectionId
        
        if (dragItem.type === 'new-field' && dragItem.fieldType) {
          // Add new field to section
          addField(dragItem.fieldType, sectionId)
        } else if (dragItem.type === 'field' && dragItem.data) {
          // Move existing field to section
          const fieldId = dragItem.data.id
          const currentField = state.config.fields.find(f => f.id === fieldId)
          
          if (currentField && currentField.sectionId !== sectionId) {
            updateField(fieldId, {
              sectionId: sectionId,
              nestingLevel: 1
            })
          }
        }
        break
      }
      
      case 'field-insertion': {
        // Dropping BETWEEN fields (with precise positioning)
        const { position, targetFieldId, index, sectionId } = overItem
        const insertIndex = position === 'before' ? index : index + 1
        
        if (dragItem.type === 'new-field' && dragItem.fieldType) {
          // Add new field at specific position
          if (sectionId) {
            // Adding to section at specific position
            addFieldToSectionAtPosition(dragItem.fieldType, sectionId, insertIndex)
          } else {
            // Adding to main form at specific position
            addField(dragItem.fieldType, undefined, insertIndex)
          }
        } else if (dragItem.type === 'field' && dragItem.data) {
          // Move existing field to specific position
          const fieldId = dragItem.data.id
          const currentField = state.config.fields.find(f => f.id === fieldId)
          
          if (currentField) {
            if (sectionId && currentField.sectionId !== sectionId) {
              // Moving field to different section
              moveFieldToSectionAtPosition(fieldId, sectionId, insertIndex)
            } else if (!sectionId && currentField.sectionId) {
              // Moving field from section to main form
              moveFieldToMainFormAtPosition(fieldId, insertIndex)
            } else {
              // Reordering within same container
              reorderFieldAtPosition(fieldId, insertIndex, sectionId)
            }
          }
        }
        break
      }
      
      case 'canvas':
      default: {
        // Regular canvas drop or fallback
        if (dragItem.type === 'new-field' && dragItem.fieldType) {
          // Add field to end of form
          addField(dragItem.fieldType)
        } else if (dragItem.type === 'field' && dragItem.data) {
          // Handle sortable reordering
          const activeIndex = state.config.fields.findIndex(f => f.id === active.id)
          const overIndex = overItem?.sortable?.index ?? state.config.fields.length
          
          if (activeIndex !== -1 && activeIndex !== overIndex) {
            moveField(dragItem.data.id, overIndex)
          }
        }
        break
      }
    }
  }, [state.config.fields, addField, updateField, moveField, addFieldToSectionAtPosition, moveFieldToSectionAtPosition, moveFieldToMainFormAtPosition, reorderFieldAtPosition])

  // Save and preview handlers
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(state.config)
    }
  }, [state.config, onSave])

  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview(state.config)
    } else {
      setShowPreview(true)
    }
  }, [state.config, onPreview])

  const handleToggleConditionalPreview = useCallback(() => {
    setShowPreview(!showPreview)
  }, [showPreview])

  // Check if form has conditional fields
  const hasConditionalFields = useMemo(() => {
    return state.config.fields.some(field => field.conditional && field.conditional.conditions.length > 0)
  }, [state.config.fields])

  const handleClosePreview = useCallback(() => {
    setShowPreview(false)
  }, [])

  if (showPreview) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Preview: {state.config.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleClosePreview}
              size="sm"
            >
              Back to Editor
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                {/* Form Header */}
                <div className="pb-6 border-b border-gray-100">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {state.config.settings.title}
                  </h1>
                  {state.config.description && (
                    <p className="text-gray-600 text-lg">
                      {state.config.description}
                    </p>
                  )}
                </div>

                {/* Form Fields Preview */}
                <div className="space-y-6">
                  {[...state.config.fields]
                    .sort((a, b) => a.order - b.order)
                    .map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.hint && (
                          <p className="text-sm text-gray-500">{field.hint}</p>
                        )}
                        <div className="preview-field-content">
                          {/* This would render the actual field components in a real implementation */}
                          <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-600">
                            {field.type.charAt(0).toUpperCase() + field.type.slice(1)} field preview
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-100">
                  <Button 
                    className="w-full md:w-auto px-8 py-3"
                    disabled
                  >
                    {state.config.settings.submitButtonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {state.config.name}
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="p-2"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="p-2"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasConditionalFields && (
            <Button
              variant={showPreview ? "default" : "outline"}
              size="sm"
              onClick={handleToggleConditionalPreview}
              className="flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Test Logic</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {showPreview ? (
        <div className="flex-1 p-4 overflow-auto">
          <ConditionalPreview
            formConfig={state.config}
            onClose={() => setShowPreview(false)}
          />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Left Panel - Field Library */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <FieldLibrary 
                onAddField={addField} 
                selectedFieldId={state.selectedFieldId}
                config={state.config}
              />
            </div>

            {/* Center Panel - Form Canvas */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <SortableContext
                items={state.config.fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <FormCanvas
                config={state.config}
                selectedFieldId={state.selectedFieldId}
                onSelectField={selectField}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onDuplicateField={duplicateField}
                isDragActive={state.isDragging}
              />
              </SortableContext>
            </div>

            {/* Right Panel - Properties */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <PropertiesPanel
                config={state.config}
                selectedField={selectedField}
                onUpdateConfig={updateConfig}
                onUpdateField={updateField}
              />
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {state.dragPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {state.dragPreview.type === 'new-field' 
                      ? `Add ${state.dragPreview.fieldType} field`
                      : `Moving ${state.dragPreview.data?.label || 'field'}`
                    }
                  </div>
                </motion.div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  )
}