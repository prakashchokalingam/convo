// Form Builder Field Registry System

import { FieldType, FieldDefinition, FieldRegistry, FieldConfig } from './types'
import { DEFAULT_FIELD_CONFIGS } from './constants'
import { 
  Type, 
  Mail, 
  Hash, 
  FileText, 
  ChevronDown, 
  List, 
  Circle, 
  CheckSquare, 
  ToggleLeft,
  Calendar,
  CalendarClock,
  Globe,
  Phone,
  Upload,
  PenTool,
  Star,
  LayoutPanelTop,
  Minus,
  Code
} from 'lucide-react'

// Field Icons
export const FIELD_ICONS = {
  text: Type,
  email: Mail,
  number: Hash,
  textarea: FileText,
  select: ChevronDown,
  multiselect: List,
  radio: Circle,
  checkbox: CheckSquare,
  switch: ToggleLeft,
  date: Calendar,
  datetime: CalendarClock,
  country: Globe,
  phone: Phone,
  file: Upload,
  signature: PenTool,
  rating: Star,
  section: LayoutPanelTop,
  divider: Minus,
  html: Code
}

// Field Definitions
export const FIELD_DEFINITIONS: FieldRegistry = {
  text: {
    type: 'text',
    label: 'Text Input',
    description: 'Single line text input field',
    icon: FIELD_ICONS.text,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.text,
      id: '',
      order: 0
    },
    propertiesSchema: null, // Will be populated with Zod schemas
    component: null as any // Will be populated with React components
  },

  email: {
    type: 'email',
    label: 'Email',
    description: 'Email address input field',
    icon: FIELD_ICONS.email,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.email,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  number: {
    type: 'number',
    label: 'Number',
    description: 'Numeric input field',
    icon: FIELD_ICONS.number,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.number,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  textarea: {
    type: 'textarea',
    label: 'Textarea',
    description: 'Multi-line text input field',
    icon: FIELD_ICONS.textarea,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.textarea,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  select: {
    type: 'select',
    label: 'Dropdown',
    description: 'Single selection dropdown',
    icon: FIELD_ICONS.select,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.select,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  multiselect: {
    type: 'multiselect',
    label: 'Multi-Select',
    description: 'Multiple selection dropdown',
    icon: FIELD_ICONS.multiselect,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.multiselect,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  radio: {
    type: 'radio',
    label: 'Radio Buttons',
    description: 'Single selection radio group',
    icon: FIELD_ICONS.radio,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.radio,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  checkbox: {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Single checkbox field',
    icon: FIELD_ICONS.checkbox,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.checkbox,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  switch: {
    type: 'switch',
    label: 'Toggle Switch',
    description: 'On/off toggle switch',
    icon: FIELD_ICONS.switch,
    category: 'basic',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.switch,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  date: {
    type: 'date',
    label: 'Date Picker',
    description: 'Date selection field',
    icon: FIELD_ICONS.date,
    category: 'advanced',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.date,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  datetime: {
    type: 'datetime',
    label: 'Date & Time',
    description: 'Date and time selection field',
    icon: FIELD_ICONS.datetime,
    category: 'advanced',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.datetime,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  country: {
    type: 'country',
    label: 'Country Select',
    description: 'Country selection dropdown',
    icon: FIELD_ICONS.country,
    category: 'advanced',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.country,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  phone: {
    type: 'phone',
    label: 'Phone Number',
    description: 'Phone number input with country code',
    icon: FIELD_ICONS.phone,
    category: 'advanced',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.phone,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  file: {
    type: 'file',
    label: 'File Upload',
    description: 'File upload field',
    icon: FIELD_ICONS.file,
    category: 'advanced',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.file,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  signature: {
    type: 'signature',
    label: 'Signature',
    description: 'Digital signature capture',
    icon: FIELD_ICONS.signature,
    category: 'advanced',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.signature,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  rating: {
    type: 'rating',
    label: 'Rating',
    description: 'Star or icon rating field',
    icon: FIELD_ICONS.rating,
    category: 'advanced',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.rating,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  section: {
    type: 'section',
    label: 'Section',
    description: 'Form section divider',
    icon: FIELD_ICONS.section,
    category: 'layout',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.section,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  divider: {
    type: 'divider',
    label: 'Divider',
    description: 'Visual divider line',
    icon: FIELD_ICONS.divider,
    category: 'layout',
    defaultConfig: {
      ...DEFAULT_FIELD_CONFIGS.divider,
      id: '',
      order: 0
    },
    propertiesSchema: null,
    component: null as any
  },

  // Temporarily disabled - will be added back with table experience
  // html: {
  //   type: 'html',
  //   label: 'HTML Content',
  //   description: 'Custom HTML content block',
  //   icon: FIELD_ICONS.html,
  //   category: 'layout',
  //   defaultConfig: {
  //     ...DEFAULT_FIELD_CONFIGS.html,
  //     id: '',
  //     order: 0
  //   },
  //   propertiesSchema: null,
  //   component: null as any
  // }
}

// Registry Management Functions
export class FormFieldRegistry {
  private static instance: FormFieldRegistry
  private registry: FieldRegistry = { ...FIELD_DEFINITIONS }

  private constructor() {}

  static getInstance(): FormFieldRegistry {
    if (!FormFieldRegistry.instance) {
      FormFieldRegistry.instance = new FormFieldRegistry()
    }
    return FormFieldRegistry.instance
  }

  // Get all field definitions
  getAllFields(): FieldRegistry {
    return { ...this.registry }
  }

  // Get field definition by type
  getField(type: FieldType): FieldDefinition | undefined {
    return this.registry[type]
  }

  // Get fields by category
  getFieldsByCategory(category: 'basic' | 'advanced' | 'layout'): FieldDefinition[] {
    return Object.values(this.registry).filter(field => field.category === category)
  }

  // Register a new field type
  registerField(definition: FieldDefinition): void {
    this.registry[definition.type] = definition
  }

  // Unregister a field type
  unregisterField(type: FieldType): void {
    delete this.registry[type]
  }

  // Check if field type is registered
  isRegistered(type: FieldType): boolean {
    return type in this.registry
  }

  // Get field types by category
  getFieldTypesByCategory(category: 'basic' | 'advanced' | 'layout'): FieldType[] {
    return Object.values(this.registry)
      .filter(field => field.category === category)
      .map(field => field.type)
  }

  // Search fields by label or description
  searchFields(query: string): FieldDefinition[] {
    const lowercaseQuery = query.toLowerCase()
    return Object.values(this.registry).filter(field => 
      field.label.toLowerCase().includes(lowercaseQuery) ||
      field.description.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Create default field config for a type
  createDefaultFieldConfig(type: FieldType, overrides: Partial<FieldConfig> = {}): FieldConfig {
    const definition = this.getField(type)
    if (!definition) {
      throw new Error(`Field type "${type}" is not registered`)
    }

    const baseConfig = {
      ...definition.defaultConfig,
      id: overrides.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: overrides.order || 0,
      validation: []
    }

    return { ...baseConfig, ...overrides } as FieldConfig
  }
}

// Singleton instance
export const fieldRegistry = FormFieldRegistry.getInstance()

// Helper functions
export const getFieldDefinition = (type: FieldType): FieldDefinition | undefined => {
  return fieldRegistry.getField(type)
}

export const getAllFieldDefinitions = (): FieldRegistry => {
  return fieldRegistry.getAllFields()
}

export const getFieldsByCategory = (category: 'basic' | 'advanced' | 'layout'): FieldDefinition[] => {
  return fieldRegistry.getFieldsByCategory(category)
}

export const createFieldConfig = (type: FieldType, overrides: Partial<FieldConfig> = {}): FieldConfig => {
  return fieldRegistry.createDefaultFieldConfig(type, overrides)
}

export const isFieldTypeRegistered = (type: FieldType): boolean => {
  return fieldRegistry.isRegistered(type)
}

export const searchFieldDefinitions = (query: string): FieldDefinition[] => {
  return fieldRegistry.searchFields(query)
}