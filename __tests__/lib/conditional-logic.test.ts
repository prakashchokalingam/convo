import { describe, it, expect, beforeEach } from 'vitest'
import { ConditionalEvaluator } from '@/lib/form-builder/conditional/evaluator'
import { DependencyManager } from '@/lib/form-builder/conditional/dependency-manager'
import { FieldConfig, ConditionalLogic } from '@/lib/form-builder/types'

describe('Conditional Logic System', () => {
  let fields: FieldConfig[]
  let dependencyManager: DependencyManager

  beforeEach(() => {
    fields = [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: false,
        order: 1,
        validation: []
      },
      {
        id: 'age',
        type: 'number',
        label: 'Age',
        required: false,
        order: 2,
        validation: []
      },
      {
        id: 'has_license',
        type: 'checkbox',
        label: 'Has Driver License',
        required: false,
        order: 3,
        validation: []
      },
      {
        id: 'license_number',
        type: 'text',
        label: 'License Number',
        required: false,
        order: 4,
        validation: [],
        conditional: {
          show: true,
          conditions: [
            {
              fieldId: 'has_license',
              operator: 'equals',
              value: true
            }
          ],
          logic: 'and'
        }
      },
      {
        id: 'vehicle_type',
        type: 'select',
        label: 'Vehicle Type',
        required: false,
        order: 5,
        validation: [],
        options: [
          { label: 'Car', value: 'car' },
          { label: 'Motorcycle', value: 'motorcycle' },
          { label: 'Truck', value: 'truck' }
        ],
        conditional: {
          show: true,
          conditions: [
            {
              fieldId: 'has_license',
              operator: 'equals',
              value: true
            },
            {
              fieldId: 'age',
              operator: 'greater_than',
              value: 18
            }
          ],
          logic: 'and'
        }
      }
    ]

    dependencyManager = new DependencyManager(fields)
  })

  describe('ConditionalEvaluator', () => {
    describe('Basic Condition Evaluation', () => {
      it('should show field when conditions are met', () => {
        const context = {
          fieldValues: { has_license: true },
          fields
        }

        const licenseField = fields.find(f => f.id === 'license_number')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(licenseField, context)

        expect(result.visible).toBe(true)
        expect(result.reasons).toEqual([])
      })

      it('should hide field when conditions are not met', () => {
        const context = {
          fieldValues: { has_license: false },
          fields
        }

        const licenseField = fields.find(f => f.id === 'license_number')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(licenseField, context)

        expect(result.visible).toBe(false)
        expect(result.reasons).toHaveLength(1)
      })

      it('should handle missing field values', () => {
        const context = {
          fieldValues: {},
          fields
        }

        const licenseField = fields.find(f => f.id === 'license_number')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(licenseField, context)

        expect(result.visible).toBe(false)
        expect(result.reasons).toContain('Has Driver License has no value')
      })

      it('should handle fields without conditional logic', () => {
        const context = {
          fieldValues: {},
          fields
        }

        const nameField = fields.find(f => f.id === 'name')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(nameField, context)

        expect(result.visible).toBe(true)
      })
    })

    describe('Multiple Conditions with AND logic', () => {
      it('should show field when all AND conditions are met', () => {
        const context = {
          fieldValues: { 
            has_license: true,
            age: 25
          },
          fields
        }

        const vehicleField = fields.find(f => f.id === 'vehicle_type')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(vehicleField, context)

        expect(result.visible).toBe(true)
        expect(result.reasons).toEqual([])
      })

      it('should hide field when any AND condition is not met', () => {
        const context = {
          fieldValues: { 
            has_license: true,
            age: 16
          },
          fields
        }

        const vehicleField = fields.find(f => f.id === 'vehicle_type')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(vehicleField, context)

        expect(result.visible).toBe(false)
        expect(result.reasons).toContain('Age is not greater than "18"')
      })
    })

    describe('Multiple Conditions with OR logic', () => {
      it('should show field when any OR condition is met', () => {
        const orField: FieldConfig = {
          id: 'emergency_contact',
          type: 'text',
          label: 'Emergency Contact',
          required: false,
          order: 6,
          validation: [],
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'age',
                operator: 'less_than',
                value: 18
              },
              {
                fieldId: 'has_license',
                operator: 'equals',
                value: false
              }
            ],
            logic: 'or'
          }
        }

        const context = {
          fieldValues: { 
            has_license: true,
            age: 16
          },
          fields: [...fields, orField]
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(orField, context)

        expect(result.visible).toBe(true)
      })

      it('should hide field when no OR conditions are met', () => {
        const orField: FieldConfig = {
          id: 'emergency_contact',
          type: 'text',
          label: 'Emergency Contact',
          required: false,
          order: 6,
          validation: [],
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'age',
                operator: 'less_than',
                value: 18
              },
              {
                fieldId: 'has_license',
                operator: 'equals',
                value: false
              }
            ],
            logic: 'or'
          }
        }

        const context = {
          fieldValues: { 
            has_license: true,
            age: 25
          },
          fields: [...fields, orField]
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(orField, context)

        expect(result.visible).toBe(false)
      })
    })

    describe('Different Operators', () => {
      it('should handle equals operator correctly', () => {
        const context = {
          fieldValues: { has_license: true },
          fields
        }

        const licenseField = fields.find(f => f.id === 'license_number')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(licenseField, context)

        expect(result.visible).toBe(true)
      })

      it('should handle not_equals operator correctly', () => {
        const notEqualsField: FieldConfig = {
          ...fields.find(f => f.id === 'license_number')!,
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'has_license',
                operator: 'not_equals',
                value: false
              }
            ],
            logic: 'and'
          }
        }

        const context = {
          fieldValues: { has_license: true },
          fields
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(notEqualsField, context)

        expect(result.visible).toBe(true)
      })

      it('should handle contains operator for arrays', () => {
        const multiSelectField: FieldConfig = {
          id: 'hobbies',
          type: 'multiselect',
          label: 'Hobbies',
          required: false,
          order: 7,
          validation: []
        }

        const dependentField: FieldConfig = {
          id: 'sports_level',
          type: 'select',
          label: 'Sports Level',
          required: false,
          order: 8,
          validation: [],
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'hobbies',
                operator: 'contains',
                value: 'sports'
              }
            ],
            logic: 'and'
          }
        }

        const context = {
          fieldValues: { hobbies: ['reading', 'sports', 'music'] },
          fields: [...fields, multiSelectField, dependentField]
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(dependentField, context)

        expect(result.visible).toBe(true)
      })

      it('should handle contains operator for strings', () => {
        const dependentField: FieldConfig = {
          id: 'professional_info',
          type: 'textarea',
          label: 'Professional Info',
          required: false,
          order: 8,
          validation: [],
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'name',
                operator: 'contains',
                value: 'Dr'
              }
            ],
            logic: 'and'
          }
        }

        const context = {
          fieldValues: { name: 'Dr. John Smith' },
          fields: [...fields, dependentField]
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(dependentField, context)

        expect(result.visible).toBe(true)
      })

      it('should handle greater_than operator for numbers', () => {
        const context = {
          fieldValues: { 
            has_license: true,
            age: 25
          },
          fields
        }

        const vehicleField = fields.find(f => f.id === 'vehicle_type')!
        const result = ConditionalEvaluator.evaluateFieldVisibility(vehicleField, context)

        expect(result.visible).toBe(true)
      })

      it('should handle less_than operator for numbers', () => {
        const youthField: FieldConfig = {
          id: 'parent_consent',
          type: 'checkbox',
          label: 'Parent Consent',
          required: false,
          order: 9,
          validation: [],
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'age',
                operator: 'less_than',
                value: 18
              }
            ],
            logic: 'and'
          }
        }

        const context = {
          fieldValues: { age: 16 },
          fields: [...fields, youthField]
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(youthField, context)

        expect(result.visible).toBe(true)
      })
    })

    describe('Hide vs Show Logic', () => {
      it('should hide field when show=false and conditions are met', () => {
        const hideField: FieldConfig = {
          id: 'adult_only',
          type: 'text',
          label: 'Adult Only Field',
          required: false,
          order: 10,
          validation: [],
          conditional: {
            show: false,
            conditions: [
              {
                fieldId: 'age',
                operator: 'less_than',
                value: 18
              }
            ],
            logic: 'and'
          }
        }

        const context = {
          fieldValues: { age: 16 },
          fields: [...fields, hideField]
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(hideField, context)

        expect(result.visible).toBe(false)
      })

      it('should show field when show=false and conditions are not met', () => {
        const hideField: FieldConfig = {
          id: 'adult_only',
          type: 'text',
          label: 'Adult Only Field',
          required: false,
          order: 10,
          validation: [],
          conditional: {
            show: false,
            conditions: [
              {
                fieldId: 'age',
                operator: 'less_than',
                value: 18
              }
            ],
            logic: 'and'
          }
        }

        const context = {
          fieldValues: { age: 25 },
          fields: [...fields, hideField]
        }

        const result = ConditionalEvaluator.evaluateFieldVisibility(hideField, context)

        expect(result.visible).toBe(true)
      })
    })

    describe('Validation', () => {
      it('should detect circular dependencies', () => {
        const circularFields: FieldConfig[] = [
          {
            id: 'field1',
            type: 'text',
            label: 'Field 1',
            required: false,
            order: 1,
            validation: [],
            conditional: {
              show: true,
              conditions: [{ fieldId: 'field2', operator: 'equals', value: 'test' }],
              logic: 'and'
            }
          },
          {
            id: 'field2',
            type: 'text',
            label: 'Field 2',
            required: false,
            order: 2,
            validation: [],
            conditional: {
              show: true,
              conditions: [{ fieldId: 'field1', operator: 'equals', value: 'test' }],
              logic: 'and'
            }
          }
        ]

        const field1 = circularFields[0]
        const validation = ConditionalEvaluator.validateConditionalLogic(field1, circularFields)

        expect(validation.isValid).toBe(false)
        expect(validation.errors).toContain('Circular dependency detected in conditional logic')
      })

      it('should detect references to non-existent fields', () => {
        const invalidField: FieldConfig = {
          id: 'invalid',
          type: 'text',
          label: 'Invalid Field',
          required: false,
          order: 1,
          validation: [],
          conditional: {
            show: true,
            conditions: [{ fieldId: 'non_existent', operator: 'equals', value: 'test' }],
            logic: 'and'
          }
        }

        const validation = ConditionalEvaluator.validateConditionalLogic(invalidField, [invalidField])

        expect(validation.isValid).toBe(false)
        expect(validation.errors).toContain('Referenced field "non_existent" does not exist')
      })

      it('should detect self-references', () => {
        const selfRefField: FieldConfig = {
          id: 'self_ref',
          type: 'text',
          label: 'Self Reference Field',
          required: false,
          order: 1,
          validation: [],
          conditional: {
            show: true,
            conditions: [{ fieldId: 'self_ref', operator: 'equals', value: 'test' }],
            logic: 'and'
          }
        }

        const validation = ConditionalEvaluator.validateConditionalLogic(selfRefField, [selfRefField])

        expect(validation.isValid).toBe(false)
        expect(validation.errors).toContain('Field cannot reference itself in conditional logic')
      })
    })

    describe('Evaluation Order', () => {
      it('should evaluate fields in correct dependency order', () => {
        const evaluationOrder = ConditionalEvaluator.getFieldEvaluationOrder(fields)

        const nameIndex = evaluationOrder.indexOf('name')
        const ageIndex = evaluationOrder.indexOf('age')
        const hasLicenseIndex = evaluationOrder.indexOf('has_license')
        const licenseNumberIndex = evaluationOrder.indexOf('license_number')
        const vehicleTypeIndex = evaluationOrder.indexOf('vehicle_type')

        // Fields without dependencies should come first
        expect(nameIndex).toBeLessThan(licenseNumberIndex)
        expect(ageIndex).toBeLessThan(vehicleTypeIndex)
        expect(hasLicenseIndex).toBeLessThan(licenseNumberIndex)
        expect(hasLicenseIndex).toBeLessThan(vehicleTypeIndex)
      })

      it('should evaluate all fields and return visibility results', () => {
        const fieldValues = {
          has_license: true,
          age: 25
        }

        const results = ConditionalEvaluator.evaluateAllFields(fields, fieldValues)

        expect(results['name'].visible).toBe(true)
        expect(results['age'].visible).toBe(true)
        expect(results['has_license'].visible).toBe(true)
        expect(results['license_number'].visible).toBe(true)
        expect(results['vehicle_type'].visible).toBe(true)
      })
    })
  })

  describe('DependencyManager', () => {
    describe('Graph Construction', () => {
      it('should build correct dependency graph', () => {
        const graph = dependencyManager.getGraph()

        expect(graph.nodes.size).toBe(5)
        expect(graph.nodes.get('license_number')?.dependencies).toEqual(['has_license'])
        expect(graph.nodes.get('vehicle_type')?.dependencies).toEqual(['has_license', 'age'])
      })

      it('should calculate correct dependency levels', () => {
        const graph = dependencyManager.getGraph()

        expect(graph.nodes.get('name')?.level).toBe(1)
        expect(graph.nodes.get('age')?.level).toBe(1)
        expect(graph.nodes.get('has_license')?.level).toBe(1)
        expect(graph.nodes.get('license_number')?.level).toBe(2)
        expect(graph.nodes.get('vehicle_type')?.level).toBe(2)
      })

      it('should provide correct evaluation order', () => {
        const order = dependencyManager.getEvaluationOrder()

        const hasLicenseIndex = order.indexOf('has_license')
        const ageIndex = order.indexOf('age')
        const licenseNumberIndex = order.indexOf('license_number')
        const vehicleTypeIndex = order.indexOf('vehicle_type')

        expect(hasLicenseIndex).toBeLessThan(licenseNumberIndex)
        expect(hasLicenseIndex).toBeLessThan(vehicleTypeIndex)
        expect(ageIndex).toBeLessThan(vehicleTypeIndex)
      })
    })

    describe('Dependency Operations', () => {
      it('should add new field and update dependencies', () => {
        const newField: FieldConfig = {
          id: 'advanced_license',
          type: 'checkbox',
          label: 'Advanced License',
          required: false,
          order: 6,
          validation: [],
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'license_number',
                operator: 'not_equals',
                value: ''
              }
            ],
            logic: 'and'
          }
        }

        const change = dependencyManager.addField(newField)

        expect(change.type).toBe('add')
        expect(change.fieldId).toBe('advanced_license')
        expect(change.newDependencies).toEqual(['license_number'])

        const graph = dependencyManager.getGraph()
        expect(graph.nodes.get('license_number')?.dependents).toContain('advanced_license')
      })

      it('should remove field and clean up dependencies', () => {
        const change = dependencyManager.removeField('license_number')

        expect(change.type).toBe('remove')
        expect(change.fieldId).toBe('license_number')
        expect(change.oldDependencies).toEqual(['has_license'])

        const graph = dependencyManager.getGraph()
        expect(graph.nodes.has('license_number')).toBe(false)
        expect(graph.nodes.get('has_license')?.dependents).not.toContain('license_number')
      })

      it('should update field dependencies', () => {
        const updatedField: FieldConfig = {
          ...fields.find(f => f.id === 'license_number')!,
          conditional: {
            show: true,
            conditions: [
              {
                fieldId: 'age',
                operator: 'greater_than',
                value: 16
              }
            ],
            logic: 'and'
          }
        }

        const change = dependencyManager.updateField(updatedField)

        expect(change.type).toBe('update')
        expect(change.oldDependencies).toEqual(['has_license'])
        expect(change.newDependencies).toEqual(['age'])

        const graph = dependencyManager.getGraph()
        expect(graph.nodes.get('has_license')?.dependents).not.toContain('license_number')
        expect(graph.nodes.get('age')?.dependents).toContain('license_number')
      })
    })

    describe('Dependency Queries', () => {
      it('should get available references for a field', () => {
        const availableRefs = dependencyManager.getAvailableReferences('vehicle_type')

        expect(availableRefs.map(f => f.id)).toContain('name')
        expect(availableRefs.map(f => f.id)).toContain('age')
        expect(availableRefs.map(f => f.id)).toContain('has_license')
        expect(availableRefs.map(f => f.id)).toContain('license_number')
        expect(availableRefs.map(f => f.id)).not.toContain('vehicle_type')
      })

      it('should get dependent fields', () => {
        const dependents = dependencyManager.getDependentFields('has_license')

        expect(dependents.map(f => f.id)).toContain('license_number')
        expect(dependents.map(f => f.id)).toContain('vehicle_type')
      })

      it('should get dependency fields', () => {
        const dependencies = dependencyManager.getDependencyFields('vehicle_type')

        expect(dependencies.map(f => f.id)).toContain('has_license')
        expect(dependencies.map(f => f.id)).toContain('age')
      })

      it('should get root fields (no dependencies)', () => {
        const rootFields = dependencyManager.getRootFields()

        expect(rootFields.map(f => f.id)).toContain('name')
        expect(rootFields.map(f => f.id)).toContain('age')
        expect(rootFields.map(f => f.id)).toContain('has_license')
        expect(rootFields.map(f => f.id)).not.toContain('license_number')
        expect(rootFields.map(f => f.id)).not.toContain('vehicle_type')
      })

      it('should get leaf fields (no dependents)', () => {
        const leafFields = dependencyManager.getLeafFields()

        expect(leafFields.map(f => f.id)).toContain('name')
        expect(leafFields.map(f => f.id)).toContain('license_number')
        expect(leafFields.map(f => f.id)).toContain('vehicle_type')
        expect(leafFields.map(f => f.id)).not.toContain('has_license')
        expect(leafFields.map(f => f.id)).not.toContain('age')
      })
    })

    describe('Validation', () => {
      it('should validate correct dependency graph', () => {
        const validation = dependencyManager.validate()

        expect(validation.isValid).toBe(true)
        expect(validation.errors).toEqual([])
      })

      it('should detect circular dependencies in graph', () => {
        const circularFields: FieldConfig[] = [
          {
            id: 'field1',
            type: 'text',
            label: 'Field 1',
            required: false,
            order: 1,
            validation: [],
            conditional: {
              show: true,
              conditions: [{ fieldId: 'field2', operator: 'equals', value: 'test' }],
              logic: 'and'
            }
          },
          {
            id: 'field2',
            type: 'text',
            label: 'Field 2',
            required: false,
            order: 2,
            validation: [],
            conditional: {
              show: true,
              conditions: [{ fieldId: 'field1', operator: 'equals', value: 'test' }],
              logic: 'and'
            }
          }
        ]

        const circularManager = new DependencyManager(circularFields)
        const validation = circularManager.validate()

        expect(validation.isValid).toBe(false)
        expect(validation.errors.some(error => error.includes('Circular dependency detected'))).toBe(true)
      })
    })
  })
})