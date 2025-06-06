// Core Form Builder Types and Interfaces

export type FieldType = 
  // Basic Fields
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  // Advanced Fields
  | 'date'
  | 'datetime'
  | 'country'
  | 'phone'
  | 'file'
  | 'signature'
  | 'rating'
  // Layout Fields
  | 'section'
  | 'divider'
  | 'html'

export interface BaseFieldConfig {
  id: string
  type: FieldType
  label: string
  hint?: string
  placeholder?: string
  required: boolean
  order: number
  sectionId?: string // Reference to parent section
  nestingLevel?: number // For visual hierarchy (0 = root, 1 = inside section, etc)
  validation: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface ConditionalLogic {
  show: boolean
  conditions: Array<{
    fieldId: string
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
    value: any
  }>
  logic: 'and' | 'or'
}

export interface FieldStyling {
  width?: 'full' | 'half' | 'third' | 'quarter' | string
  className?: string
  style?: React.CSSProperties
}

export interface FieldMetadata {
  createdAt: Date
  updatedAt: Date
  version: number
}

// Specific Field Configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email'
  validation: ValidationRule[]
  minLength?: number
  maxLength?: number
  pattern?: string
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number'
  validation: ValidationRule[]
  min?: number
  max?: number
  step?: number
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea'
  validation: ValidationRule[]
  rows?: number
  minLength?: number
  maxLength?: number
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'multiselect'
  options: Array<{
    label: string
    value: string
    disabled?: boolean
  }>
  validation: ValidationRule[]
  multiple?: boolean
  searchable?: boolean
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio'
  options: Array<{
    label: string
    value: string
    disabled?: boolean
  }>
  validation: ValidationRule[]
  layout?: 'horizontal' | 'vertical'
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox'
  validation: ValidationRule[]
  defaultChecked?: boolean
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: 'switch'
  validation: ValidationRule[]
  defaultChecked?: boolean
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date' | 'datetime'
  validation: ValidationRule[]
  minDate?: Date
  maxDate?: Date
  format?: string
}

export interface CountryFieldConfig extends BaseFieldConfig {
  type: 'country'
  validation: ValidationRule[]
  searchable?: boolean
  showFlag?: boolean
}

export interface PhoneFieldConfig extends BaseFieldConfig {
  type: 'phone'
  validation: ValidationRule[]
  defaultCountry?: string
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file'
  validation: ValidationRule[]
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
}

export interface SignatureFieldConfig extends BaseFieldConfig {
  type: 'signature'
  validation: ValidationRule[]
  width?: 'full' | 'half' | 'third' | 'quarter' | string | number
  height?: number
}

export interface RatingFieldConfig extends BaseFieldConfig {
  type: 'rating'
  validation: ValidationRule[]
  max?: number
  allowHalf?: boolean
  icon?: 'star' | 'heart' | 'thumb'
}

export interface SectionFieldConfig extends BaseFieldConfig {
  type: 'section'
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  children?: string[] // Array of field IDs inside this section
  isCollapsed?: boolean // Current collapsed state
  allowNesting?: boolean // Whether fields can be dropped into this section
}

export interface DividerFieldConfig extends BaseFieldConfig {
  type: 'divider'
  style?: 'solid' | 'dashed' | 'dotted'
  thickness?: number
}

export interface HtmlFieldConfig extends BaseFieldConfig {
  type: 'html'
  content: string
  sanitize?: boolean
}

export interface FieldConfig extends BaseFieldConfig {
  // All fields can have these optional properties
  minLength?: number
  maxLength?: number
  pattern?: string
  min?: number
  max?: number
  step?: number
  rows?: number
  options?: Array<{
    label: string
    value: string
    disabled?: boolean
  }>
  multiple?: boolean
  searchable?: boolean
  layout?: 'horizontal' | 'vertical'
  defaultChecked?: boolean
  minDate?: Date
  maxDate?: Date
  format?: string
  showFlag?: boolean
  defaultCountry?: string
  accept?: string
  maxSize?: number
  maxFiles?: number
  width?: number
  height?: number
  allowHalf?: boolean
  icon?: 'star' | 'heart' | 'thumb'
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  style?: 'solid' | 'dashed' | 'dotted'
  thickness?: number
  content?: string
  sanitize?: boolean
  className?: string
  conditional?: ConditionalLogic
  styling?: FieldStyling
  metadata?: FieldMetadata
}

export interface FormSettings {
  title: string
  description?: string
  submitButtonText: string
  successMessage?: string
  errorMessage?: string
  allowDrafts: boolean
  oneSubmissionPerUser: boolean
  requireAuth: boolean
  notificationEmail?: string
}

export interface ThemeConfig {
  primaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  borderRadius: number
  spacing: 'compact' | 'normal' | 'spacious'
  font: string
}

export interface FormConfig {
  id: string
  name: string
  description?: string
  settings: FormSettings
  fields: FieldConfig[]
  theme?: ThemeConfig
  metadata: {
    createdAt: Date
    updatedAt: Date
    version: number
    createdBy: string
  }
}

export interface FormSubmission {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: Date
  submittedBy?: string
  ipAddress?: string
  userAgent?: string
}

// Drag and Drop Types
export interface DragItem {
  id: string
  type: 'field' | 'new-field'
  fieldType?: FieldType
  data?: FieldConfig
}

export interface DropTarget {
  id: string
  type: 'canvas' | 'section' | 'field'
  accepts: string[]
  sectionId?: string // If dropping into a section
}

export interface DropResult {
  draggedId: string
  targetId?: string
  targetType: 'canvas' | 'section' | 'field'
  position: 'before' | 'after' | 'inside'
  sectionId?: string
}

// Form Builder State Types
export interface FormBuilderState {
  config: FormConfig
  selectedFieldId?: string
  isDragging: boolean
  dragPreview?: DragItem
  history: FormConfig[]
  historyIndex: number
}

export interface FormBuilderActions {
  updateConfig: (config: Partial<FormConfig>) => void
  addField: (field: FieldConfig, position?: number) => void
  updateField: (fieldId: string, updates: Partial<FieldConfig>) => void
  removeField: (fieldId: string) => void
  moveField: (fieldId: string, newPosition: number) => void
  selectField: (fieldId?: string) => void
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

// Field Registry Types
export interface FieldDefinition {
  type: FieldType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: 'basic' | 'advanced' | 'layout'
  defaultConfig: Partial<FieldConfig>
  propertiesSchema: any // Zod schema for properties validation
  component: React.ComponentType<any>
}

export interface FieldRegistry {
  [key: string]: FieldDefinition
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

export interface FormValidationOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
  stopOnFirstError?: boolean
}

// Renderer Types
export interface FormRendererProps {
  config: FormConfig
  onSubmit: (data: Record<string, any>) => Promise<void>
  onDraftSave?: (data: Record<string, any>) => Promise<void>
  initialData?: Record<string, any>
  validationOptions?: FormValidationOptions
  className?: string
  style?: React.CSSProperties
}

export interface FieldRendererProps {
  field: FieldConfig
  value?: any
  onChange: (value: any) => void
  onBlur?: () => void
  error?: string
  disabled?: boolean
  readOnly?: boolean
}