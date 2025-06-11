import { vi } from 'vitest';
import { Template, Workspace } from '@/lib/db/schema';
import { TemplatePermissions } from '@/components/app/templates/core';

// Mock template factory
export function createMockTemplate(overrides?: Partial<Template>): Template {
  const defaultTemplate: Template = {
    id: 'template-' + Math.random().toString(36).substr(2, 9),
    name: 'Test Template',
    description: 'A test template for testing purposes',
    formSchema: {
      fields: [
        {
          id: 'test_field',
          type: 'text',
          label: 'Test Field',
          placeholder: 'Enter test value',
          required: true,
        },
        {
          id: 'email_field',
          type: 'email',
          label: 'Email Address',
          placeholder: 'your@email.com',
          required: true,
        }
      ],
      settings: {
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your submission!',
      },
    },
    category: 'HR',
    isGlobal: false,
    createdBy: 'user-123',
    workspaceId: 'workspace-123',
    usageCount: 5,
    cloneCount: 2,
    thumbnailUrl: null,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  };

  return {
    ...defaultTemplate,
    ...overrides,
    // Deep merge formSchema if provided
    formSchema: overrides?.formSchema
      ? {
          ...defaultTemplate.formSchema,
          ...overrides.formSchema,
          fields: overrides.formSchema.fields || defaultTemplate.formSchema.fields,
        }
      : defaultTemplate.formSchema,
  };
}

// Mock workspace factory
export function createMockWorkspace(overrides?: Partial<Workspace>): Workspace {
  return {
    id: 'workspace-123',
    name: 'Test Workspace',
    slug: 'test-workspace',
    type: 'team',
    ownerId: 'user-123',
    description: 'A test workspace',
    avatarUrl: null,
    settings: '{}',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    ...overrides,
  };
}

// Mock permissions factory
export function createMockPermissions(overrides?: Partial<TemplatePermissions>): TemplatePermissions {
  return {
    canClone: true,
    canCreateForm: true,
    canEdit: true,
    canDelete: true,
    ...overrides,
  };
}

// Create global template
export function createMockGlobalTemplate(overrides?: Partial<Template>): Template {
  return createMockTemplate({
    isGlobal: true,
    createdBy: null,
    workspaceId: null,
    category: 'Marketing',
    name: 'Lead Generation Form',
    description: 'Capture leads with this professional form template',
    usageCount: 150,
    cloneCount: 45,
    ...overrides,
  });
}

// Create workspace template
export function createMockWorkspaceTemplate(overrides?: Partial<Template>): Template {
  return createMockTemplate({
    isGlobal: false,
    category: 'Support',
    name: 'Custom Support Form',
    description: 'Internal support request form',
    usageCount: 8,
    cloneCount: 1,
    ...overrides,
  });
}

// Mock templates array factory
export function createMockTemplatesArray(count: number = 3, isGlobal: boolean = false): Template[] {
  return Array.from({ length: count }, (_, index) => {
    if (isGlobal) {
      return createMockGlobalTemplate({
        id: `global-template-${index}`,
        name: `Global Template ${index + 1}`,
        category: ['HR', 'Marketing', 'Support'][index % 3] as any,
      });
    } else {
      return createMockWorkspaceTemplate({
        id: `workspace-template-${index}`,
        name: `Workspace Template ${index + 1}`,
        category: ['HR', 'Marketing', 'Support'][index % 3] as any,
      });
    }
  });
}

// Mock API response factory
export function createMockApiResponse<T>(data: T, success: boolean = true) {
  return {
    success,
    data,
    message: success ? 'Operation successful' : 'Operation failed',
    timestamp: new Date().toISOString(),
  };
}

// Mock fetch responses
export function mockFetchSuccess<T>(data: T) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(createMockApiResponse(data)),
  });
}

export function mockFetchError(status: number = 500, message: string = 'Internal Server Error') {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
  });
}

// Template action mock factory
export function createMockTemplateAction(type: string, templateId: string) {
  return {
    type,
    templateId,
    data: {},
  };
}

// Form schema helpers
export function getFormFieldCount(template: Template): number {
  try {
    const schema = typeof template.formSchema === 'string' 
      ? JSON.parse(template.formSchema) 
      : template.formSchema;
    return schema?.fields?.length || 0;
  } catch {
    return 0;
  }
}

// Test data categories
export const TEST_CATEGORIES = ['HR', 'Marketing', 'Support', 'Sales', 'Education', 'Healthcare', 'Other'];

// Mock permission scenarios
export const PERMISSION_SCENARIOS = {
  ADMIN: createMockPermissions({ canClone: true, canCreateForm: true, canEdit: true, canDelete: true }),
  MEMBER: createMockPermissions({ canClone: false, canCreateForm: true, canEdit: false, canDelete: false }),
  VIEWER: createMockPermissions({ canClone: false, canCreateForm: false, canEdit: false, canDelete: false }),
  OWNER: createMockPermissions({ canClone: true, canCreateForm: true, canEdit: true, canDelete: true }),
};

// Mock workspace context
export function mockWorkspaceContext(role: 'owner' | 'admin' | 'member' | 'viewer' = 'admin') {
  const workspace = createMockWorkspace();
  const permissions = PERMISSION_SCENARIOS[role.toUpperCase() as keyof typeof PERMISSION_SCENARIOS];
  
  return {
    workspace,
    userRole: role,
    loading: false,
    error: null,
    hasPermission: vi.fn((requiredRole: string) => {
      const roleHierarchy = { viewer: 1, member: 2, admin: 3, owner: 4 };
      const userLevel = roleHierarchy[role];
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy];
      return userLevel >= requiredLevel;
    }),
  };
}

// Form schema mock with different field types
export function createMockFormSchema(fieldCount: number = 3) {
  const fieldTypes = ['text', 'email', 'textarea', 'select', 'radio', 'checkbox', 'number', 'date'];
  
  return {
    fields: Array.from({ length: fieldCount }, (_, index) => ({
      id: `field_${index}`,
      type: fieldTypes[index % fieldTypes.length],
      label: `Field ${index + 1}`,
      placeholder: `Enter field ${index + 1}`,
      required: index % 2 === 0,
      options: fieldTypes[index % fieldTypes.length] === 'select' 
        ? [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ]
        : undefined,
    })),
    settings: {
      submitButtonText: 'Submit Form',
      successMessage: 'Thank you for your submission!',
    },
  };
}
