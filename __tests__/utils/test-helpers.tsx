import { render, RenderOptions } from '@testing-library/react'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { ReactElement, ReactNode } from 'react'
import { vi, expect } from 'vitest'
import { FormConfig, FieldConfig, FieldType } from '@/lib/form-builder/types'
import { DEFAULT_FORM_SETTINGS, DEFAULT_THEME_CONFIG } from '@/lib/form-builder/constants'

// Test wrapper with DndContext for drag & drop tests
interface DndWrapperProps {
  children: ReactNode
}

function DndWrapper({ children }: DndWrapperProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  return (
    <DndContext sensors={sensors}>
      {children}
    </DndContext>
  )
}

// Custom render function with DndContext
export function renderWithDnd(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: DndWrapper, ...options })
}

// Factory functions for test data
export function createMockFormConfig(overrides?: Partial<FormConfig>): FormConfig {
  const defaultConfig: FormConfig = {
    id: 'test-form',
    name: 'Test Form',
    description: 'A test form for testing',
    settings: { ...DEFAULT_FORM_SETTINGS },
    fields: [],
    theme: { ...DEFAULT_THEME_CONFIG },
    metadata: {
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      version: 1,
      createdBy: 'test-user',
    },
  }

  if (!overrides) return defaultConfig

  return {
    ...defaultConfig,
    ...overrides,
    // Deep merge settings and theme
    settings: overrides.settings ? { ...defaultConfig.settings, ...overrides.settings } : defaultConfig.settings,
    theme: overrides.theme ? { ...defaultConfig.theme, ...overrides.theme } : defaultConfig.theme,
    metadata: overrides.metadata ? { ...defaultConfig.metadata, ...overrides.metadata } : defaultConfig.metadata,
  }
}

export function createMockField(
  type: FieldType,
  overrides?: Partial<FieldConfig>
): FieldConfig {
  return {
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    required: false,
    order: 0,
    nestingLevel: 0,
    validation: [],
    ...overrides,
  }
}

export function createMockSection(overrides?: Partial<FieldConfig>): FieldConfig {
  return createMockField('section', {
    label: 'Test Section',
    ...overrides,
  })
}

// Mock event creators for drag & drop testing
export function createMockDragEvent(type: string, dataTransfer?: Partial<DataTransfer>) {
  const event = new global.DragEvent(type, {
    bubbles: true,
    cancelable: true,
  })
  
  // Override dataTransfer if provided
  if (dataTransfer) {
    Object.assign(event.dataTransfer, dataTransfer)
  }
  
  return event
}

// Mouse event utilities for drag & drop simulation
export function createMouseEvent(type: string, coordinates?: { x: number; y: number }) {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: coordinates?.x || 0,
    clientY: coordinates?.y || 0,
    screenX: coordinates?.x || 0,
    screenY: coordinates?.y || 0,
  })
}

// Helper to simulate drag and drop
export async function simulateDragAndDrop(
  dragElement: HTMLElement,
  dropElement: HTMLElement,
  coordinates?: { start: { x: number; y: number }; end: { x: number; y: number } }
) {
  const startCoords = coordinates?.start || { x: 0, y: 0 }
  const endCoords = coordinates?.end || { x: 100, y: 100 }

  // Start drag
  dragElement.dispatchEvent(createMouseEvent('mousedown', startCoords))
  dragElement.dispatchEvent(createMockDragEvent('dragstart'))
  
  // Move over drop target
  dropElement.dispatchEvent(createMouseEvent('mousemove', endCoords))
  dropElement.dispatchEvent(createMockDragEvent('dragenter'))
  dropElement.dispatchEvent(createMockDragEvent('dragover'))
  
  // Drop
  dropElement.dispatchEvent(createMockDragEvent('drop'))
  dragElement.dispatchEvent(createMockDragEvent('dragend'))
  dropElement.dispatchEvent(createMouseEvent('mouseup', endCoords))
}

// Custom matchers for testing form builder state
export function expectFormToHaveField(config: FormConfig, fieldId: string) {
  const field = config.fields.find(f => f.id === fieldId)
  expect(field).toBeDefined()
  return field!
}

export function expectFieldToBeInSection(config: FormConfig, fieldId: string, sectionId: string) {
  const field = expectFormToHaveField(config, fieldId)
  expect(field.sectionId).toBe(sectionId)
  return field
}

export function expectSectionToHaveFieldCount(config: FormConfig, sectionId: string, count: number) {
  const fieldsInSection = config.fields.filter(f => f.sectionId === sectionId)
  expect(fieldsInSection).toHaveLength(count)
  return fieldsInSection
}

// Async utilities
export function waitForDragAnimation() {
  return new Promise(resolve => setTimeout(resolve, 300))
}

export function waitForFormUpdate() {
  return new Promise(resolve => setTimeout(resolve, 100))
}

// Re-export testing library utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
