import { describe, it, expect } from 'vitest'
import { 
  createFieldConfig, 
  getFieldDefinition, 
  getAllFieldDefinitions 
} from '@/lib/form-builder/field-registry'
import { 
  DEFAULT_FORM_SETTINGS, 
  DEFAULT_THEME_CONFIG,
  FIELD_TYPES 
} from '@/lib/form-builder/constants'
import { createMockFormConfig, createMockField } from './utils'

describe('Form Builder Integration Tests', () => {
  describe('Complete Form Building Workflow', () => {
    it('should create a complete form with various field types', () => {
      // Create a form configuration
      const form = createMockFormConfig({
        name: 'Integration Test Form',
        description: 'A comprehensive form for testing',
        settings: {
          ...DEFAULT_FORM_SETTINGS,
          title: 'Test Survey',
          submitButtonText: 'Submit Survey'
        }
      })

      // Add various field types
      const textField = createFieldConfig('text', {
        label: 'Full Name',
        required: true,
        validation: [
          { type: 'required', message: 'Name is required' }
        ]
      })

      const emailField = createFieldConfig('email', {
        label: 'Email Address',
        required: true,
        validation: [
          { type: 'required', message: 'Email is required' },
          { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
        ]
      })

      const selectField = createFieldConfig('select', {
        label: 'Country',
        required: true,
        options: [
          { label: 'United States', value: 'US' },
          { label: 'Canada', value: 'CA' },
          { label: 'United Kingdom', value: 'GB' }
        ]
      })

      const sectionField = createFieldConfig('section', {
        label: 'Contact Information',
        description: 'Please provide your contact details'
      })

      // Add fields to form
      form.fields = [sectionField, textField, emailField, selectField]

      // Verify form structure
      expect(form.name).toBe('Integration Test Form')
      expect(form.settings.title).toBe('Test Survey')
      expect(form.fields).toHaveLength(4)

      // Verify field types
      expect(form.fields[0].type).toBe('section')
      expect(form.fields[1].type).toBe('text')
      expect(form.fields[2].type).toBe('email')
      expect(form.fields[3].type).toBe('select')

      // Verify field configurations
      expect(form.fields[1].required).toBe(true)
      expect(form.fields[1].validation).toHaveLength(1)
      expect(form.fields[3].options).toHaveLength(3)
    })

    it('should support all available field types', () => {
      const allFieldDefinitions = getAllFieldDefinitions()
      const availableFieldTypes = Object.keys(allFieldDefinitions)

      // Verify we have all expected field types
      expect(availableFieldTypes).toContain('text')
      expect(availableFieldTypes).toContain('email')
      expect(availableFieldTypes).toContain('number')
      expect(availableFieldTypes).toContain('textarea')
      expect(availableFieldTypes).toContain('select')
      expect(availableFieldTypes).toContain('radio')
      expect(availableFieldTypes).toContain('checkbox')
      expect(availableFieldTypes).toContain('date')
      expect(availableFieldTypes).toContain('file')
      expect(availableFieldTypes).toContain('signature')
      expect(availableFieldTypes).toContain('section')

      // Test that each field type can be created
      availableFieldTypes.forEach(fieldType => {
        const definition = getFieldDefinition(fieldType as any)
        expect(definition).toBeDefined()
        expect(definition!.type).toBe(fieldType)
        expect(definition!.label).toBeTruthy()
        expect(definition!.description).toBeTruthy()

        // Create a field of this type
        const field = createFieldConfig(fieldType as any, {
          label: `Test ${fieldType} Field`
        })
        expect(field.type).toBe(fieldType)
        expect(field.label).toBe(`Test ${fieldType} Field`)
      })
    })

    it('should handle complex nested form structures', () => {
      const complexForm = createMockFormConfig({
        name: 'Complex Registration Form',
        fields: [
          // Personal Information Section
          createMockField('section', {
            id: 'personal-section',
            label: 'Personal Information',
            description: 'Tell us about yourself'
          }),
          createMockField('text', {
            id: 'first-name',
            label: 'First Name',
            required: true,
            sectionId: 'personal-section',
            nestingLevel: 1
          }),
          createMockField('text', {
            id: 'last-name',
            label: 'Last Name',
            required: true,
            sectionId: 'personal-section',
            nestingLevel: 1
          }),
          createMockField('email', {
            id: 'email',
            label: 'Email',
            required: true,
            sectionId: 'personal-section',
            nestingLevel: 1
          }),

          // Address Section
          createMockField('section', {
            id: 'address-section',
            label: 'Address Information',
            description: 'Where do you live?'
          }),
          createMockField('text', {
            id: 'street',
            label: 'Street Address',
            required: true,
            sectionId: 'address-section',
            nestingLevel: 1
          }),
          createMockField('text', {
            id: 'city',
            label: 'City',
            required: true,
            sectionId: 'address-section',
            nestingLevel: 1
          }),

          // Preferences (no section)
          createMockField('checkbox', {
            id: 'newsletter',
            label: 'Subscribe to newsletter',
            required: false
          })
        ]
      })

      // Verify form structure
      expect(complexForm.fields).toHaveLength(8)

      // Check sections
      const sections = complexForm.fields.filter(f => f.type === 'section')
      expect(sections).toHaveLength(2)

      // Check fields in personal section
      const personalFields = complexForm.fields.filter(f => f.sectionId === 'personal-section')
      expect(personalFields).toHaveLength(3)
      expect(personalFields.every(f => f.nestingLevel === 1)).toBe(true)

      // Check fields in address section
      const addressFields = complexForm.fields.filter(f => f.sectionId === 'address-section')
      expect(addressFields).toHaveLength(2)
      expect(addressFields.every(f => f.nestingLevel === 1)).toBe(true)

      // Check root level fields (no section)
      const rootFields = complexForm.fields.filter(f => !f.sectionId && f.type !== 'section')
      expect(rootFields).toHaveLength(1)
      expect(rootFields[0].id).toBe('newsletter')
    })
  })

  describe('Form Validation and Business Logic', () => {
    it('should validate form configuration', () => {
      const form = createMockFormConfig({
        name: 'Validation Test Form',
        settings: {
          ...DEFAULT_FORM_SETTINGS,
          requireAuth: true,
          oneSubmissionPerUser: true
        }
      })

      // Check required properties
      expect(form.id).toBeTruthy()
      expect(form.name).toBeTruthy()
      expect(form.settings).toBeDefined()
      expect(form.theme).toBeDefined()
      expect(form.metadata).toBeDefined()

      // Check settings validation
      expect(form.settings.requireAuth).toBe(true)
      expect(form.settings.oneSubmissionPerUser).toBe(true)
      expect(form.settings.allowDrafts).toBeDefined()

      // Check metadata
      expect(form.metadata.createdAt).toBeInstanceOf(Date)
      expect(form.metadata.updatedAt).toBeInstanceOf(Date)
      expect(form.metadata.version).toBe(1)
      expect(form.metadata.createdBy).toBe('test-user')
    })

    it('should handle field validation rules', () => {
      const fieldWithValidation = createFieldConfig('text', {
        label: 'Username',
        required: true,
        validation: [
          { type: 'required', message: 'Username is required' },
          { type: 'min', value: 3, message: 'Username must be at least 3 characters' },
          { type: 'max', value: 20, message: 'Username must be at most 20 characters' },
          { type: 'pattern', value: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
        ]
      })

      expect(fieldWithValidation.required).toBe(true)
      expect(fieldWithValidation.validation).toHaveLength(4)
      expect(fieldWithValidation.validation[0].type).toBe('required')
      expect(fieldWithValidation.validation[1].type).toBe('min')
      expect(fieldWithValidation.validation[1].value).toBe(3)
      expect(fieldWithValidation.validation[3].value).toBeInstanceOf(RegExp)
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle large forms efficiently', () => {
      const largeForm = createMockFormConfig({
        name: 'Large Form Test',
        fields: []
      })

      // Add 100 fields
      const startTime = Date.now()
      for (let i = 0; i < 100; i++) {
        const fieldType = i % 2 === 0 ? 'text' : 'email'
        const field = createFieldConfig(fieldType, {
          label: `Field ${i + 1}`,
          order: i
        })
        largeForm.fields.push(field)
      }
      const endTime = Date.now()

      // Should create 100 fields quickly (under 100ms)
      expect(endTime - startTime).toBeLessThan(100)
      expect(largeForm.fields).toHaveLength(100)

      // Verify all fields have unique IDs
      const fieldIds = largeForm.fields.map(f => f.id)
      const uniqueIds = new Set(fieldIds)
      expect(uniqueIds.size).toBe(100)
    })
  })
})
