// Form Builder Constants and Default Configurations

import { FieldType, FormSettings, ThemeConfig } from './types';

export const FIELD_CATEGORIES = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  LAYOUT: 'layout',
} as const;

export const FIELD_TYPES: Record<string, FieldType> = {
  // Basic Fields
  TEXT: 'text',
  EMAIL: 'email',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  SWITCH: 'switch',

  // Advanced Fields
  DATE: 'date',
  DATETIME: 'datetime',
  COUNTRY: 'country',
  PHONE: 'phone',
  FILE: 'file',
  SIGNATURE: 'signature',
  RATING: 'rating',

  // Layout Fields
  SECTION: 'section',
  DIVIDER: 'divider',
  HTML: 'html',
} as const;

export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  MIN: 'min',
  MAX: 'max',
  PATTERN: 'pattern',
  CUSTOM: 'custom',
} as const;

export const CONDITIONAL_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
} as const;

export const FIELD_WIDTHS = {
  FULL: 'full',
  HALF: 'half',
  THIRD: 'third',
  QUARTER: 'quarter',
} as const;

export const DEFAULT_FORM_SETTINGS: FormSettings = {
  title: 'Untitled Form',
  description: '',
  submitButtonText: 'Submit',
  successMessage: 'Thank you for your submission!',
  errorMessage: 'Please fix the errors below and try again.',
  allowDrafts: true,
  oneSubmissionPerUser: false,
  requireAuth: false,
  notificationEmail: undefined,
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#d1d5db',
  borderRadius: 6,
  spacing: 'normal',
  font: 'Inter, sans-serif',
};

export const DEFAULT_VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  number: 'Please enter a valid number',
  min: 'Value must be at least {min}',
  max: 'Value must be at most {max}',
  minLength: 'Must be at least {min} characters',
  maxLength: 'Must be at most {max} characters',
  pattern: 'Please enter a valid format',
  custom: 'Invalid value',
};

export const COMMON_VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z]+$/,
  numeric: /^\d+$/,
};

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_TYPES: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    spreadsheet: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    text: ['text/plain', 'text/csv'],
  },
};

export const SIGNATURE_DEFAULTS = {
  WIDTH: 400,
  HEIGHT: 200,
  BACKGROUND_COLOR: '#ffffff',
  PEN_COLOR: '#000000',
};

export const RATING_DEFAULTS = {
  MAX: 5,
  ALLOW_HALF: false,
  ICON: 'star',
};

export const DATE_FORMATS = {
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'MMM DD, YYYY': 'MMM dd, yyyy',
  'DD MMM YYYY': 'dd MMM yyyy',
};

export const DRAG_TYPES = {
  FIELD: 'field',
  NEW_FIELD: 'new-field',
} as const;

export const DROP_POSITIONS = {
  BEFORE: 'before',
  AFTER: 'after',
  INSIDE: 'inside',
} as const;

export const FORM_BUILDER_PANELS = {
  FIELD_LIBRARY: 'field-library',
  CANVAS: 'canvas',
  PROPERTIES: 'properties',
} as const;

export const UNDO_REDO_LIMIT = 50;

export const AUTO_SAVE_DELAY = 1000; // milliseconds

export const FIELD_LIBRARY_SEARCH_DEBOUNCE = 300; // milliseconds

// Default field configurations for each type
export const DEFAULT_FIELD_CONFIGS = {
  text: {
    type: 'text' as const,
    label: 'Text Field',
    placeholder: 'Enter text...',
    required: false,
    validation: [],
    maxLength: 255,
    order: 0,
  },

  email: {
    type: 'email' as const,
    label: 'Email Field',
    placeholder: 'Enter email address...',
    required: false,
    validation: [],
    order: 0,
  },

  number: {
    type: 'number' as const,
    label: 'Number Field',
    placeholder: 'Enter number...',
    required: false,
    validation: [],
    order: 0,
  },

  textarea: {
    type: 'textarea' as const,
    label: 'Textarea Field',
    placeholder: 'Enter text...',
    required: false,
    validation: [],
    rows: 4,
    order: 0,
  },

  select: {
    type: 'select' as const,
    label: 'Select Field',
    placeholder: 'Choose an option...',
    required: false,
    validation: [],
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    searchable: false,
    order: 0,
  },

  multiselect: {
    type: 'multiselect' as const,
    label: 'Multi-Select Field',
    placeholder: 'Choose options...',
    required: false,
    validation: [],
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    multiple: true,
    searchable: true,
    order: 0,
  },

  radio: {
    type: 'radio' as const,
    label: 'Radio Field',
    required: false,
    validation: [],
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    layout: 'vertical' as const,
    order: 0,
  },

  checkbox: {
    type: 'checkbox' as const,
    label: 'Checkbox Field',
    required: false,
    validation: [],
    defaultChecked: false,
    order: 0,
  },

  switch: {
    type: 'switch' as const,
    label: 'Switch Field',
    required: false,
    validation: [],
    defaultChecked: false,
    order: 0,
  },

  date: {
    type: 'date' as const,
    label: 'Date Field',
    required: false,
    validation: [],
    format: 'MM/dd/yyyy',
    order: 0,
  },

  datetime: {
    type: 'datetime' as const,
    label: 'Date & Time Field',
    required: false,
    validation: [],
    format: 'MM/dd/yyyy HH:mm',
    order: 0,
  },

  country: {
    type: 'country' as const,
    label: 'Country Field',
    placeholder: 'Select country...',
    required: false,
    validation: [],
    searchable: true,
    showFlag: true,
    order: 0,
  },

  phone: {
    type: 'phone' as const,
    label: 'Phone Field',
    placeholder: 'Enter phone number...',
    required: false,
    validation: [],
    defaultCountry: 'US',
    order: 0,
  },

  file: {
    type: 'file' as const,
    label: 'File Upload',
    required: false,
    validation: [],
    accept: 'image/*',
    multiple: false,
    maxSize: FILE_UPLOAD_LIMITS.MAX_SIZE,
    maxFiles: 1,
    order: 0,
  },

  signature: {
    type: 'signature' as const,
    label: 'Signature Field',
    required: false,
    validation: [],
    width: SIGNATURE_DEFAULTS.WIDTH,
    height: SIGNATURE_DEFAULTS.HEIGHT,
    order: 0,
  },

  rating: {
    type: 'rating' as const,
    label: 'Rating Field',
    required: false,
    validation: [],
    max: RATING_DEFAULTS.MAX,
    allowHalf: RATING_DEFAULTS.ALLOW_HALF,
    icon: RATING_DEFAULTS.ICON as 'star',
    order: 0,
  },

  section: {
    type: 'section' as const,
    label: 'Section',
    description: 'Section description',
    required: false,
    validation: [],
    collapsible: false,
    defaultCollapsed: false,
    children: [],
    isCollapsed: false,
    allowNesting: true,
    order: 0,
  },

  divider: {
    type: 'divider' as const,
    label: 'Divider',
    required: false,
    validation: [],
    style: 'solid' as const,
    thickness: 1,
    order: 0,
  },

  html: {
    type: 'html' as const,
    label: 'HTML Content',
    required: false,
    validation: [],
    content: '<p>Custom HTML content</p>',
    sanitize: true,
    order: 0,
  },
};

export const COUNTRY_OPTIONS = [
  { label: 'United States', value: 'US', flag: '🇺🇸' },
  { label: 'Canada', value: 'CA', flag: '🇨🇦' },
  { label: 'United Kingdom', value: 'GB', flag: '🇬🇧' },
  { label: 'Australia', value: 'AU', flag: '🇦🇺' },
  { label: 'Germany', value: 'DE', flag: '🇩🇪' },
  { label: 'France', value: 'FR', flag: '🇫🇷' },
  { label: 'Japan', value: 'JP', flag: '🇯🇵' },
  { label: 'China', value: 'CN', flag: '🇨🇳' },
  { label: 'India', value: 'IN', flag: '🇮🇳' },
  { label: 'Brazil', value: 'BR', flag: '🇧🇷' },
];
