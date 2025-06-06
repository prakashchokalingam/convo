import { describe, it, expect } from 'vitest'
import {
  FIELD_CATEGORIES,
  FIELD_TYPES,
  VALIDATION_TYPES,
  CONDITIONAL_OPERATORS,
  FIELD_WIDTHS,
  DEFAULT_FORM_SETTINGS,
  DEFAULT_THEME_CONFIG,
  DEFAULT_VALIDATION_MESSAGES,
  COMMON_VALIDATION_PATTERNS,
  FILE_UPLOAD_LIMITS,
  SIGNATURE_DEFAULTS,
  RATING_DEFAULTS,
  DATE_FORMATS,
  DRAG_TYPES,
  DROP_POSITIONS,
  FORM_BUILDER_PANELS,
  DEFAULT_FIELD_CONFIGS,
  COUNTRY_OPTIONS
} from '@/lib/form-builder/constants'
import { FormConfig, FieldConfig, ValidationRule } from '@/lib/form-builder/types'

describe('Form Builder Constants', () => {
  describe('Field Categories', () => {
    it('should have correct field categories', () => {
      expect(FIELD_CATEGORIES.BASIC).toBe('basic')
      expect(FIELD_CATEGORIES.ADVANCED).toBe('advanced')
      expect(FIELD_CATEGORIES.LAYOUT).toBe('layout')
    })
  })

  describe('Field Types', () => {
    it('should have basic field types', () => {
      expect(FIELD_TYPES.TEXT).toBe('text')
      expect(FIELD_TYPES.EMAIL).toBe('email')
      expect(FIELD_TYPES.NUMBER).toBe('number')
      expect(FIELD_TYPES.TEXTAREA).toBe('textarea')
      expect(FIELD_TYPES.SELECT).toBe('select')
      expect(FIELD_TYPES.MULTISELECT).toBe('multiselect')
      expect(FIELD_TYPES.RADIO).toBe('radio')
      expect(FIELD_TYPES.CHECKBOX).toBe('checkbox')
      expect(FIELD_TYPES.SWITCH).toBe('switch')
    })

    it('should have advanced field types', () => {
      expect(FIELD_TYPES.DATE).toBe('date')
      expect(FIELD_TYPES.DATETIME).toBe('datetime')
      expect(FIELD_TYPES.COUNTRY).toBe('country')
      expect(FIELD_TYPES.PHONE).toBe('phone')
      expect(FIELD_TYPES.FILE).toBe('file')
      expect(FIELD_TYPES.SIGNATURE).toBe('signature')
      expect(FIELD_TYPES.RATING).toBe('rating')
    })

    it('should have layout field types', () => {
      expect(FIELD_TYPES.SECTION).toBe('section')
      expect(FIELD_TYPES.DIVIDER).toBe('divider')
      expect(FIELD_TYPES.HTML).toBe('html')
    })
  })

  describe('Validation Types', () => {
    it('should have all validation types', () => {
      expect(VALIDATION_TYPES.REQUIRED).toBe('required')
      expect(VALIDATION_TYPES.MIN).toBe('min')
      expect(VALIDATION_TYPES.MAX).toBe('max')
      expect(VALIDATION_TYPES.PATTERN).toBe('pattern')
      expect(VALIDATION_TYPES.CUSTOM).toBe('custom')
    })
  })

  describe('Conditional Operators', () => {
    it('should have all conditional operators', () => {
      expect(CONDITIONAL_OPERATORS.EQUALS).toBe('equals')
      expect(CONDITIONAL_OPERATORS.NOT_EQUALS).toBe('not_equals')
      expect(CONDITIONAL_OPERATORS.CONTAINS).toBe('contains')
      expect(CONDITIONAL_OPERATORS.GREATER_THAN).toBe('greater_than')
      expect(CONDITIONAL_OPERATORS.LESS_THAN).toBe('less_than')
    })
  })

  describe('Field Widths', () => {
    it('should have all field width options', () => {
      expect(FIELD_WIDTHS.FULL).toBe('full')
      expect(FIELD_WIDTHS.HALF).toBe('half')
      expect(FIELD_WIDTHS.THIRD).toBe('third')
      expect(FIELD_WIDTHS.QUARTER).toBe('quarter')
    })
  })

  describe('Default Form Settings', () => {
    it('should have valid default form settings', () => {
      expect(DEFAULT_FORM_SETTINGS.title).toBe('Untitled Form')
      expect(DEFAULT_FORM_SETTINGS.description).toBe('')
      expect(DEFAULT_FORM_SETTINGS.submitButtonText).toBe('Submit')
      expect(DEFAULT_FORM_SETTINGS.successMessage).toBe('Thank you for your submission!')
      expect(DEFAULT_FORM_SETTINGS.errorMessage).toBe('Please fix the errors below and try again.')
      expect(DEFAULT_FORM_SETTINGS.allowDrafts).toBe(true)
      expect(DEFAULT_FORM_SETTINGS.oneSubmissionPerUser).toBe(false)
      expect(DEFAULT_FORM_SETTINGS.requireAuth).toBe(false)
      expect(DEFAULT_FORM_SETTINGS.notificationEmail).toBeUndefined()
    })
  })

  describe('Default Theme Config', () => {
    it('should have valid default theme settings', () => {
      expect(DEFAULT_THEME_CONFIG.primaryColor).toBe('#3b82f6')
      expect(DEFAULT_THEME_CONFIG.backgroundColor).toBe('#ffffff')
      expect(DEFAULT_THEME_CONFIG.textColor).toBe('#1f2937')
      expect(DEFAULT_THEME_CONFIG.borderColor).toBe('#d1d5db')
      expect(DEFAULT_THEME_CONFIG.borderRadius).toBe(6)
      expect(DEFAULT_THEME_CONFIG.spacing).toBe('normal')
      expect(DEFAULT_THEME_CONFIG.font).toBe('Inter, sans-serif')
    })
  })

  describe('Validation Messages', () => {
    it('should have default validation messages', () => {
      expect(DEFAULT_VALIDATION_MESSAGES.required).toBe('This field is required')
      expect(DEFAULT_VALIDATION_MESSAGES.email).toBe('Please enter a valid email address')
      expect(DEFAULT_VALIDATION_MESSAGES.number).toBe('Please enter a valid number')
      expect(DEFAULT_VALIDATION_MESSAGES.min).toBe('Value must be at least {min}')
      expect(DEFAULT_VALIDATION_MESSAGES.max).toBe('Value must be at most {max}')
      expect(DEFAULT_VALIDATION_MESSAGES.minLength).toBe('Must be at least {min} characters')
      expect(DEFAULT_VALIDATION_MESSAGES.maxLength).toBe('Must be at most {max} characters')
      expect(DEFAULT_VALIDATION_MESSAGES.pattern).toBe('Please enter a valid format')
      expect(DEFAULT_VALIDATION_MESSAGES.custom).toBe('Invalid value')
    })
  })

  describe('Validation Patterns', () => {
    it('should have valid regex patterns', () => {
      // Test email pattern
      expect(COMMON_VALIDATION_PATTERNS.email.test('test@example.com')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.email.test('invalid-email')).toBe(false)

      // Test phone pattern
      expect(COMMON_VALIDATION_PATTERNS.phone.test('+1234567890')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.phone.test('(123) 456-7890')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.phone.test('abc')).toBe(false)

      // Test URL pattern
      expect(COMMON_VALIDATION_PATTERNS.url.test('https://example.com')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.url.test('http://test.com')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.url.test('invalid-url')).toBe(false)

      // Test alphanumeric pattern
      expect(COMMON_VALIDATION_PATTERNS.alphanumeric.test('abc123')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.alphanumeric.test('abc-123')).toBe(false)

      // Test alphabetic pattern
      expect(COMMON_VALIDATION_PATTERNS.alphabetic.test('abc')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.alphabetic.test('abc123')).toBe(false)

      // Test numeric pattern
      expect(COMMON_VALIDATION_PATTERNS.numeric.test('123')).toBe(true)
      expect(COMMON_VALIDATION_PATTERNS.numeric.test('abc')).toBe(false)
    })
  })

  describe('File Upload Limits', () => {
    it('should have valid file upload settings', () => {
      expect(FILE_UPLOAD_LIMITS.MAX_SIZE).toBe(10 * 1024 * 1024) // 10MB
      expect(FILE_UPLOAD_LIMITS.MAX_FILES).toBe(5)
      expect(FILE_UPLOAD_LIMITS.ALLOWED_TYPES.image).toContain('image/jpeg')
      expect(FILE_UPLOAD_LIMITS.ALLOWED_TYPES.image).toContain('image/png')
      expect(FILE_UPLOAD_LIMITS.ALLOWED_TYPES.document).toContain('application/pdf')
      expect(FILE_UPLOAD_LIMITS.ALLOWED_TYPES.spreadsheet).toContain('application/vnd.ms-excel')
      expect(FILE_UPLOAD_LIMITS.ALLOWED_TYPES.text).toContain('text/plain')
    })
  })

  describe('Component Defaults', () => {
    it('should have valid signature defaults', () => {
      expect(SIGNATURE_DEFAULTS.WIDTH).toBe(400)
      expect(SIGNATURE_DEFAULTS.HEIGHT).toBe(200)
      expect(SIGNATURE_DEFAULTS.BACKGROUND_COLOR).toBe('#ffffff')
      expect(SIGNATURE_DEFAULTS.PEN_COLOR).toBe('#000000')
    })

    it('should have valid rating defaults', () => {
      expect(RATING_DEFAULTS.MAX).toBe(5)
      expect(RATING_DEFAULTS.ALLOW_HALF).toBe(false)
      expect(RATING_DEFAULTS.ICON).toBe('star')
    })
  })

  describe('Date Formats', () => {
    it('should have valid date format mappings', () => {
      expect(DATE_FORMATS['MM/DD/YYYY']).toBe('MM/dd/yyyy')
      expect(DATE_FORMATS['DD/MM/YYYY']).toBe('dd/MM/yyyy')
      expect(DATE_FORMATS['YYYY-MM-DD']).toBe('yyyy-MM-dd')
      expect(DATE_FORMATS['MMM DD, YYYY']).toBe('MMM dd, yyyy')
      expect(DATE_FORMATS['DD MMM YYYY']).toBe('dd MMM yyyy')
    })
  })

  describe('Drag and Drop Constants', () => {
    it('should have drag types', () => {
      expect(DRAG_TYPES.FIELD).toBe('field')
      expect(DRAG_TYPES.NEW_FIELD).toBe('new-field')
    })

    it('should have drop positions', () => {
      expect(DROP_POSITIONS.BEFORE).toBe('before')
      expect(DROP_POSITIONS.AFTER).toBe('after')
      expect(DROP_POSITIONS.INSIDE).toBe('inside')
    })
  })

  describe('Form Builder Panels', () => {
    it('should have panel constants', () => {
      expect(FORM_BUILDER_PANELS.FIELD_LIBRARY).toBe('field-library')
      expect(FORM_BUILDER_PANELS.CANVAS).toBe('canvas')
      expect(FORM_BUILDER_PANELS.PROPERTIES).toBe('properties')
    })
  })

  describe('Default Field Configurations', () => {
    it('should have configuration for all basic field types', () => {
      expect(DEFAULT_FIELD_CONFIGS.text).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.text.type).toBe('text')
      expect(DEFAULT_FIELD_CONFIGS.text.label).toBe('Text Field')
      expect(DEFAULT_FIELD_CONFIGS.text.required).toBe(false)
      expect(DEFAULT_FIELD_CONFIGS.text.validation).toEqual([])

      expect(DEFAULT_FIELD_CONFIGS.email).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.email.type).toBe('email')

      expect(DEFAULT_FIELD_CONFIGS.number).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.number.type).toBe('number')
    })

    it('should have configuration for advanced field types', () => {
      expect(DEFAULT_FIELD_CONFIGS.date).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.date.type).toBe('date')
      expect(DEFAULT_FIELD_CONFIGS.date.format).toBe('MM/dd/yyyy')

      expect(DEFAULT_FIELD_CONFIGS.signature).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.signature.type).toBe('signature')
      expect(DEFAULT_FIELD_CONFIGS.signature.width).toBe(SIGNATURE_DEFAULTS.WIDTH)
      expect(DEFAULT_FIELD_CONFIGS.signature.height).toBe(SIGNATURE_DEFAULTS.HEIGHT)

      expect(DEFAULT_FIELD_CONFIGS.rating).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.rating.type).toBe('rating')
      expect(DEFAULT_FIELD_CONFIGS.rating.max).toBe(RATING_DEFAULTS.MAX)
    })

    it('should have configuration for layout field types', () => {
      expect(DEFAULT_FIELD_CONFIGS.section).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.section.type).toBe('section')
      expect(DEFAULT_FIELD_CONFIGS.section.collapsible).toBe(false)
      expect(DEFAULT_FIELD_CONFIGS.section.children).toEqual([])

      expect(DEFAULT_FIELD_CONFIGS.divider).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.divider.type).toBe('divider')
      expect(DEFAULT_FIELD_CONFIGS.divider.style).toBe('solid')

      expect(DEFAULT_FIELD_CONFIGS.html).toBeDefined()
      expect(DEFAULT_FIELD_CONFIGS.html.type).toBe('html')
      expect(DEFAULT_FIELD_CONFIGS.html.sanitize).toBe(true)
    })

    it('should have consistent properties across all field configs', () => {
      Object.entries(DEFAULT_FIELD_CONFIGS).forEach(([fieldType, config]) => {
        expect(config).toHaveProperty('type')
        expect(config).toHaveProperty('label')
        expect(config).toHaveProperty('required')
        expect(config).toHaveProperty('validation')
        expect(config).toHaveProperty('order')
        expect(config.type).toBe(fieldType)
        expect(config.required).toBe(false)
        expect(config.validation).toEqual([])
        expect(config.order).toBe(0)
      })
    })
  })

  describe('Country Options', () => {
    it('should have country options with required properties', () => {
      expect(COUNTRY_OPTIONS.length).toBeGreaterThan(0)
      
      COUNTRY_OPTIONS.forEach(country => {
        expect(country).toHaveProperty('label')
        expect(country).toHaveProperty('value')
        expect(country).toHaveProperty('flag')
        expect(typeof country.label).toBe('string')
        expect(typeof country.value).toBe('string')
        expect(typeof country.flag).toBe('string')
        expect(country.label.length).toBeGreaterThan(0)
        expect(country.value.length).toBe(2) // Country codes should be 2 characters
      })
    })

    it('should have common countries', () => {
      const countryCodes = COUNTRY_OPTIONS.map(c => c.value)
      expect(countryCodes).toContain('US')
      expect(countryCodes).toContain('CA')
      expect(countryCodes).toContain('GB')
      expect(countryCodes).toContain('AU')
      expect(countryCodes).toContain('DE')
    })
  })
})

describe('Form Builder Types', () => {
  describe('FormConfig Type Safety', () => {
    it('should create a valid FormConfig object', () => {
      const formConfig: FormConfig = {
        id: 'test-form',
        name: 'Test Form',
        description: 'A test form',
        settings: DEFAULT_FORM_SETTINGS,
        fields: [],
        theme: DEFAULT_THEME_CONFIG,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          createdBy: 'test-user'
        }
      }

      expect(formConfig.id).toBe('test-form')
      expect(formConfig.name).toBe('Test Form')
      expect(formConfig.fields).toEqual([])
    })
  })

  describe('FieldConfig Type Safety', () => {
    it('should create a valid FieldConfig object', () => {
      const fieldConfig: FieldConfig = {
        id: 'test-field',
        type: 'text',
        label: 'Test Field',
        required: false,
        order: 0,
        validation: []
      }

      expect(fieldConfig.id).toBe('test-field')
      expect(fieldConfig.type).toBe('text')
      expect(fieldConfig.label).toBe('Test Field')
    })
  })

  describe('ValidationRule Type Safety', () => {
    it('should create valid ValidationRule objects', () => {
      const requiredRule: ValidationRule = {
        type: 'required',
        message: 'This field is required'
      }

      const minRule: ValidationRule = {
        type: 'min',
        value: 5,
        message: 'Minimum value is 5'
      }

      const patternRule: ValidationRule = {
        type: 'pattern',
        value: /^[a-zA-Z]+$/,
        message: 'Only letters allowed'
      }

      expect(requiredRule.type).toBe('required')
      expect(minRule.value).toBe(5)
      expect(patternRule.value).toBeInstanceOf(RegExp)
    })
  })
})
