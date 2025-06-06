// Conditional Logic Evaluation Engine
// Handles evaluation of conditional logic rules and field visibility

import { ConditionalLogic, FieldConfig } from '../types'

export interface EvaluationContext {
  fieldValues: Record<string, any>
  fields: FieldConfig[]
}

export interface EvaluationResult {
  visible: boolean
  reasons?: string[]
}

export class ConditionalEvaluator {
  /**
   * Evaluates whether a field should be visible based on its conditional logic
   */
  static evaluateFieldVisibility(
    field: FieldConfig,
    context: EvaluationContext
  ): EvaluationResult {
    // If no conditional logic, field is always visible
    if (!field.conditional) {
      return { visible: true }
    }

    return this.evaluateConditionalLogic(field.conditional, context)
  }

  /**
   * Evaluates a conditional logic configuration
   */
  static evaluateConditionalLogic(
    conditional: ConditionalLogic,
    context: EvaluationContext
  ): EvaluationResult {
    const { conditions, logic } = conditional
    const reasons: string[] = []

    if (conditions.length === 0) {
      return { visible: conditional.show, reasons: ['No conditions defined'] }
    }

    const conditionResults = conditions.map(condition => {
      const result = this.evaluateCondition(condition, context)
      if (!result.passed) {
        reasons.push(result.reason || 'Condition not met')
      }
      return result.passed
    })

    let allConditionsMet: boolean
    if (logic === 'and') {
      allConditionsMet = conditionResults.every(result => result)
    } else {
      allConditionsMet = conditionResults.some(result => result)
    }

    // If conditions are met, use the 'show' value, otherwise invert it
    const visible = allConditionsMet ? conditional.show : !conditional.show

    return {
      visible,
      reasons: visible ? [] : reasons
    }
  }

  /**
   * Evaluates a single condition
   */
  private static evaluateCondition(
    condition: ConditionalLogic['conditions'][0],
    context: EvaluationContext
  ): { passed: boolean; reason?: string } {
    const { fieldId, operator, value: expectedValue } = condition
    const actualValue = context.fieldValues[fieldId]

    // Find the referenced field for context
    const referencedField = context.fields.find(f => f.id === fieldId)
    if (!referencedField) {
      return {
        passed: false,
        reason: `Referenced field "${fieldId}" not found`
      }
    }

    // Handle undefined/null values
    if (actualValue === undefined || actualValue === null) {
      return {
        passed: operator === 'not_equals' && expectedValue !== null && expectedValue !== undefined,
        reason: `Field "${referencedField.label}" has no value`
      }
    }

    switch (operator) {
      case 'equals':
        return {
          passed: this.compareValues(actualValue, expectedValue, 'equals'),
          reason: `${referencedField.label} does not equal "${expectedValue}"`
        }

      case 'not_equals':
        return {
          passed: this.compareValues(actualValue, expectedValue, 'not_equals'),
          reason: `${referencedField.label} equals "${expectedValue}"`
        }

      case 'contains':
        return {
          passed: this.compareValues(actualValue, expectedValue, 'contains'),
          reason: `${referencedField.label} does not contain "${expectedValue}"`
        }

      case 'greater_than':
        return {
          passed: this.compareValues(actualValue, expectedValue, 'greater_than'),
          reason: `${referencedField.label} is not greater than "${expectedValue}"`
        }

      case 'less_than':
        return {
          passed: this.compareValues(actualValue, expectedValue, 'less_than'),
          reason: `${referencedField.label} is not less than "${expectedValue}"`
        }

      default:
        return {
          passed: false,
          reason: `Unknown operator: ${operator}`
        }
    }
  }

  /**
   * Compares two values based on the operator
   */
  private static compareValues(
    actualValue: any,
    expectedValue: any,
    operator: ConditionalLogic['conditions'][0]['operator']
  ): boolean {
    // Convert values to strings for comparison if they're not numbers
    const actual = this.normalizeValue(actualValue)
    const expected = this.normalizeValue(expectedValue)

    switch (operator) {
      case 'equals':
        return actual === expected

      case 'not_equals':
        return actual !== expected

      case 'contains':
        if (Array.isArray(actual)) {
          return actual.some(item => 
            this.normalizeValue(item) === expected
          )
        }
        return String(actual).toLowerCase().includes(String(expected).toLowerCase())

      case 'greater_than':
        if (this.isNumericComparison(actual, expected)) {
          return Number(actual) > Number(expected)
        }
        return String(actual).localeCompare(String(expected)) > 0

      case 'less_than':
        if (this.isNumericComparison(actual, expected)) {
          return Number(actual) < Number(expected)
        }
        return String(actual).localeCompare(String(expected)) < 0

      default:
        return false
    }
  }

  /**
   * Normalizes values for comparison
   */
  private static normalizeValue(value: any): any {
    if (value === null || value === undefined) {
      return ''
    }
    
    if (typeof value === 'boolean') {
      return value
    }
    
    if (typeof value === 'number') {
      return value
    }
    
    if (Array.isArray(value)) {
      return value
    }
    
    return String(value).trim()
  }

  /**
   * Checks if values can be compared numerically
   */
  private static isNumericComparison(actual: any, expected: any): boolean {
    return !isNaN(Number(actual)) && !isNaN(Number(expected))
  }

  /**
   * Gets all fields that a given field depends on
   */
  static getFieldDependencies(field: FieldConfig): string[] {
    if (!field.conditional || !field.conditional.conditions) {
      return []
    }

    return field.conditional.conditions.map(condition => condition.fieldId)
  }

  /**
   * Gets all fields that depend on a given field
   */
  static getFieldDependents(fieldId: string, allFields: FieldConfig[]): string[] {
    return allFields
      .filter(field => this.getFieldDependencies(field).includes(fieldId))
      .map(field => field.id)
  }

  /**
   * Checks for circular dependencies in conditional logic
   */
  static hasCircularDependency(
    fieldId: string, 
    allFields: FieldConfig[],
    visited: Set<string> = new Set()
  ): boolean {
    if (visited.has(fieldId)) {
      return true
    }

    visited.add(fieldId)

    const field = allFields.find(f => f.id === fieldId)
    if (!field) {
      return false
    }

    const dependencies = this.getFieldDependencies(field)
    
    for (const depId of dependencies) {
      if (this.hasCircularDependency(depId, allFields, new Set(visited))) {
        return true
      }
    }

    return false
  }

  /**
   * Validates conditional logic configuration
   */
  static validateConditionalLogic(
    field: FieldConfig,
    allFields: FieldConfig[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!field.conditional) {
      return { isValid: true, errors: [] }
    }

    // Check for circular dependencies
    if (this.hasCircularDependency(field.id, allFields)) {
      errors.push('Circular dependency detected in conditional logic')
    }

    // Validate referenced fields exist
    for (const condition of field.conditional.conditions) {
      const referencedField = allFields.find(f => f.id === condition.fieldId)
      if (!referencedField) {
        errors.push(`Referenced field "${condition.fieldId}" does not exist`)
      } else if (referencedField.id === field.id) {
        errors.push('Field cannot reference itself in conditional logic')
      }
    }

    // Validate condition values
    for (const condition of field.conditional.conditions) {
      if (condition.value === undefined || condition.value === null) {
        errors.push('Condition value cannot be empty')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Gets the evaluation order for fields based on dependencies
   */
  static getFieldEvaluationOrder(fields: FieldConfig[]): string[] {
    const visited = new Set<string>()
    const order: string[] = []

    function visit(fieldId: string) {
      if (visited.has(fieldId)) {
        return
      }

      visited.add(fieldId)
      
      const field = fields.find(f => f.id === fieldId)
      if (!field) {
        return
      }

      // Visit dependencies first
      const dependencies = ConditionalEvaluator.getFieldDependencies(field)
      for (const depId of dependencies) {
        visit(depId)
      }

      order.push(fieldId)
    }

    // Visit all fields
    for (const field of fields) {
      visit(field.id)
    }

    return order
  }

  /**
   * Evaluates visibility for all fields in the correct order
   */
  static evaluateAllFields(
    fields: FieldConfig[],
    fieldValues: Record<string, any>
  ): Record<string, EvaluationResult> {
    const context: EvaluationContext = { fieldValues, fields }
    const results: Record<string, EvaluationResult> = {}
    
    // Get evaluation order to handle dependencies correctly
    const evaluationOrder = this.getFieldEvaluationOrder(fields)
    
    for (const fieldId of evaluationOrder) {
      const field = fields.find(f => f.id === fieldId)
      if (field) {
        results[fieldId] = this.evaluateFieldVisibility(field, context)
      }
    }

    return results
  }
}

export default ConditionalEvaluator