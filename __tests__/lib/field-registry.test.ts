import { describe, it, expect, beforeEach } from 'vitest';
import {
  FormFieldRegistry,
  fieldRegistry,
  getFieldDefinition,
  getAllFieldDefinitions,
  getFieldsByCategory,
  createFieldConfig,
  isFieldTypeRegistered,
  searchFieldDefinitions,
  FIELD_DEFINITIONS,
} from '@/lib/form-builder/field-registry';
import { FieldType } from '@/lib/form-builder/types';

describe('FormFieldRegistry', () => {
  let registry: FormFieldRegistry;

  beforeEach(() => {
    registry = FormFieldRegistry.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = FormFieldRegistry.getInstance();
      const instance2 = FormFieldRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Field Registration', () => {
    it('should get all field definitions', () => {
      const fields = registry.getAllFields();
      expect(Object.keys(fields)).toHaveLength(Object.keys(FIELD_DEFINITIONS).length);
      expect(fields).toHaveProperty('text');
      expect(fields).toHaveProperty('email');
      expect(fields).toHaveProperty('section');
    });

    it('should get specific field definition', () => {
      const textField = registry.getField('text');
      expect(textField).toBeDefined();
      expect(textField?.type).toBe('text');
      expect(textField?.label).toBe('Text Input');
      expect(textField?.category).toBe('basic');
    });

    it('should return undefined for non-existent field', () => {
      const nonExistent = registry.getField('non-existent' as FieldType);
      expect(nonExistent).toBeUndefined();
    });

    it('should check if field type is registered', () => {
      expect(registry.isRegistered('text')).toBe(true);
      expect(registry.isRegistered('non-existent' as FieldType)).toBe(false);
    });
  });

  describe('Field Categories', () => {
    it('should get fields by basic category', () => {
      const basicFields = registry.getFieldsByCategory('basic');
      expect(basicFields.length).toBeGreaterThan(0);
      expect(basicFields.every(field => field.category === 'basic')).toBe(true);
      expect(basicFields.some(field => field.type === 'text')).toBe(true);
      expect(basicFields.some(field => field.type === 'email')).toBe(true);
    });

    it('should get fields by advanced category', () => {
      const advancedFields = registry.getFieldsByCategory('advanced');
      expect(advancedFields.length).toBeGreaterThan(0);
      expect(advancedFields.every(field => field.category === 'advanced')).toBe(true);
      expect(advancedFields.some(field => field.type === 'date')).toBe(true);
      expect(advancedFields.some(field => field.type === 'signature')).toBe(true);
    });

    it('should get fields by layout category', () => {
      const layoutFields = registry.getFieldsByCategory('layout');
      expect(layoutFields.length).toBeGreaterThan(0);
      expect(layoutFields.every(field => field.category === 'layout')).toBe(true);
      expect(layoutFields.some(field => field.type === 'section')).toBe(true);
      expect(layoutFields.some(field => field.type === 'divider')).toBe(true);
    });

    it('should get field types by category', () => {
      const basicTypes = registry.getFieldTypesByCategory('basic');
      expect(basicTypes).toContain('text');
      expect(basicTypes).toContain('email');
      expect(basicTypes).not.toContain('date');
      expect(basicTypes).not.toContain('section');
    });
  });

  describe('Field Search', () => {
    it('should search fields by label', () => {
      const results = registry.searchFields('text');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(field => field.label.toLowerCase().includes('text'))).toBe(true);
    });

    it('should search fields by description', () => {
      const results = registry.searchFields('input');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(field => field.description.toLowerCase().includes('input'))).toBe(true);
    });

    it('should return empty array for non-matching search', () => {
      const results = registry.searchFields('nonexistentfieldtype');
      expect(results).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const resultsLower = registry.searchFields('email');
      const resultsUpper = registry.searchFields('EMAIL');
      expect(resultsLower).toEqual(resultsUpper);
    });
  });

  describe('Field Config Creation', () => {
    it('should create default field config', () => {
      const config = registry.createDefaultFieldConfig('text');
      expect(config.type).toBe('text');
      expect(config.label).toBe('Text Field');
      expect(config.required).toBe(false);
      expect(config.validation).toEqual([]);
      expect(config.id).toBeDefined();
      expect(config.id).toMatch(/^field_\d+_[a-z0-9]+$/);
    });

    it('should create field config with overrides', () => {
      const config = registry.createDefaultFieldConfig('text', {
        id: 'custom-id',
        label: 'Custom Label',
        required: true,
        order: 5,
      });
      expect(config.id).toBe('custom-id');
      expect(config.label).toBe('Custom Label');
      expect(config.required).toBe(true);
      expect(config.order).toBe(5);
    });

    it('should throw error for unregistered field type', () => {
      expect(() => {
        registry.createDefaultFieldConfig('unregistered' as FieldType);
      }).toThrow('Field type "unregistered" is not registered');
    });
  });

  describe('Registry Modification', () => {
    it('should register new field type', () => {
      const customField = {
        type: 'custom' as FieldType,
        label: 'Custom Field',
        description: 'A custom field type',
        icon: () => null,
        category: 'basic' as const,
        defaultConfig: {
          type: 'custom' as FieldType,
          label: 'Custom Field',
          required: false,
          validation: [],
          order: 0,
          id: '',
        },
        propertiesSchema: null,
        component: null as any,
      };

      registry.registerField(customField);
      expect(registry.isRegistered('custom' as FieldType)).toBe(true);
      expect(registry.getField('custom' as FieldType)).toEqual(customField);
    });

    it('should unregister field type', () => {
      // First register a custom field
      const customField = {
        type: 'temp' as FieldType,
        label: 'Temporary Field',
        description: 'A temporary field type',
        icon: () => null,
        category: 'basic' as const,
        defaultConfig: {
          type: 'temp' as FieldType,
          label: 'Temporary Field',
          required: false,
          validation: [],
          order: 0,
          id: '',
        },
        propertiesSchema: null,
        component: null as any,
      };

      registry.registerField(customField);
      expect(registry.isRegistered('temp' as FieldType)).toBe(true);

      registry.unregisterField('temp' as FieldType);
      expect(registry.isRegistered('temp' as FieldType)).toBe(false);
      expect(registry.getField('temp' as FieldType)).toBeUndefined();
    });
  });
});

describe('Field Registry Helper Functions', () => {
  it('should get field definition using helper', () => {
    const textField = getFieldDefinition('text');
    expect(textField).toBeDefined();
    expect(textField?.type).toBe('text');
  });

  it('should get all field definitions using helper', () => {
    const allFields = getAllFieldDefinitions();
    expect(Object.keys(allFields).length).toBeGreaterThan(0);
    expect(allFields).toHaveProperty('text');
  });

  it('should get fields by category using helper', () => {
    const basicFields = getFieldsByCategory('basic');
    expect(basicFields.length).toBeGreaterThan(0);
    expect(basicFields.every(field => field.category === 'basic')).toBe(true);
  });

  it('should create field config using helper', () => {
    const config = createFieldConfig('email', { label: 'Custom Email' });
    expect(config.type).toBe('email');
    expect(config.label).toBe('Custom Email');
  });

  it('should check if field type is registered using helper', () => {
    expect(isFieldTypeRegistered('text')).toBe(true);
    expect(isFieldTypeRegistered('nonexistent' as FieldType)).toBe(false);
  });

  it('should search field definitions using helper', () => {
    const results = searchFieldDefinitions('dropdown');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(field => field.label.toLowerCase().includes('dropdown'))).toBe(true);
  });
});

describe('Field Definitions Structure', () => {
  const requiredFieldProperties = [
    'type',
    'label',
    'description',
    'icon',
    'category',
    'defaultConfig',
    'propertiesSchema',
    'component',
  ];

  Object.entries(FIELD_DEFINITIONS).forEach(([fieldType, definition]) => {
    describe(`${fieldType} field definition`, () => {
      it('should have all required properties', () => {
        requiredFieldProperties.forEach(prop => {
          expect(definition).toHaveProperty(prop);
        });
      });

      it('should have valid category', () => {
        expect(['basic', 'advanced', 'layout']).toContain(definition.category);
      });

      it('should have non-empty label and description', () => {
        expect(definition.label).toBeTruthy();
        expect(definition.description).toBeTruthy();
      });

      it('should have matching type in defaultConfig', () => {
        expect(definition.defaultConfig.type).toBe(definition.type);
      });

      it('should have defaultConfig with required base properties', () => {
        expect(definition.defaultConfig).toHaveProperty('type');
        expect(definition.defaultConfig).toHaveProperty('label');
        expect(definition.defaultConfig).toHaveProperty('required');
        expect(definition.defaultConfig).toHaveProperty('validation');
        expect(definition.defaultConfig).toHaveProperty('order');
      });
    });
  });
});
