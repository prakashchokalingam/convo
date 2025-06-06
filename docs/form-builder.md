# Form Builder Documentation

The Form Builder is a powerful, flexible component for creating dynamic forms with a drag-and-drop interface, rich field configurations, and advanced features.

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Field Types](#field-types)
- [Form Configuration](#form-configuration)
- [Components](#components)
- [Validation](#validation)
- [Theming](#theming)
- [AI Form Generation](#ai-form-generation)

## Quick Start

```tsx
import { FormBuilder } from '@/components/form-builder/core/FormBuilder'

function MyFormBuilder() {
  const handleSave = (config) => {
    // Save form configuration
    console.log('Form config:', config)
  }

  const handlePreview = (config) => {
    // Preview form
    console.log('Previewing form:', config)
  }

  return (
    <FormBuilder
      initialConfig={{
        name: 'My Custom Form',
        description: 'A form created with the form builder'
      }}
      onSave={handleSave}
      onPreview={handlePreview}
    />
  )
}
```

## Features

- **Drag and Drop Interface**: Intuitive drag-and-drop form building
- **Rich Field Library**: Extensive collection of field types
- **Real-time Preview**: Live preview of form changes
- **History Management**: Undo/redo functionality
- **Conditional Logic**: Show/hide fields based on conditions
- **Validation Rules**: Built-in and custom validation support
- **Theme Customization**: Flexible styling options
- **AI-Powered Generation**: Generate forms from natural language descriptions

## Field Types

### Basic Fields
- `text`: Single line text input
- `email`: Email address input
- `number`: Numeric input
- `textarea`: Multi-line text input
- `select`: Single select dropdown
- `multiselect`: Multiple selection dropdown
- `radio`: Radio button group
- `checkbox`: Single checkbox
- `switch`: Toggle switch

### Advanced Fields
- `date`: Date picker
- `datetime`: Date and time picker
- `country`: Country selector
- `phone`: Phone number input with country code
- `file`: File upload
- `signature`: Digital signature pad
- `rating`: Star/heart rating

### Layout Fields
- `section`: Group fields in sections
- `divider`: Visual separator
- `html`: Custom HTML content

## Form Configuration

### Initial Config Structure

```typescript
interface FormConfig {
  id: string;
  name: string;
  description?: string;
  settings: {
    title: string;
    description?: string;
    submitButtonText: string;
    successMessage?: string;
    errorMessage?: string;
    allowDrafts: boolean;
    oneSubmissionPerUser: boolean;
    requireAuth: boolean;
    notificationEmail?: string;
  };
  fields: FieldConfig[];
  theme?: ThemeConfig;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    createdBy: string;
  };
}
```

### Field Configuration

```typescript
interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  hint?: string;
  placeholder?: string;
  required: boolean;
  order: number;
  validation: ValidationRule[];
  conditional?: ConditionalLogic;
  styling?: FieldStyling;
}
```

## Components

### FormBuilder

Main component that provides the form building interface.

```typescript
interface FormBuilderProps {
  initialConfig?: Partial<FormConfig>;
  onSave?: (config: FormConfig) => void;
  onPreview?: (config: FormConfig) => void;
  className?: string;
}
```

### FieldLibrary

Panel containing available field types that can be dragged onto the form.

### FormCanvas

Main area where form fields are arranged and configured.

### PropertiesPanel

Configuration panel for form and field properties.

## Validation

### Built-in Validation Rules

- Required
- Min/Max length
- Pattern matching
- Numeric ranges
- File size/type
- Custom validation functions

```typescript
interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}
```

### Custom Validation Example

```typescript
const customValidation: ValidationRule = {
  type: 'custom',
  value: (value) => value.includes('@company.com'),
  message: 'Must be a company email address'
};
```

## Theming

Customize the appearance of your forms with theme configuration:

```typescript
interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  spacing: 'compact' | 'normal' | 'spacious';
  font: string;
}
```

### Example Theme

```typescript
const theme: ThemeConfig = {
  primaryColor: '#0066cc',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  borderColor: '#e5e7eb',
  borderRadius: 8,
  spacing: 'normal',
  font: 'Inter, system-ui, sans-serif'
};
```

## AI Form Generation

The form builder includes AI-powered form generation capabilities. Provide a natural language description, and get a complete form configuration.

### Example Usage

```typescript
const description = "Create a contact form with name, email, subject, and message fields. Include email validation and make all fields required.";

const generateForm = async (description: string) => {
  const response = await fetch('/api/forms/generate', {
    method: 'POST',
    body: JSON.stringify({ description })
  });
  
  const formConfig = await response.json();
  return formConfig;
};
```

### Generated Output

The AI will generate a complete form configuration including:
- Appropriate field types
- Required fields
- Validation rules
- Helpful placeholders and labels
- Form title and success message

## Best Practices

1. **Field Organization**
   - Group related fields using sections
   - Use clear, descriptive labels
   - Add helpful placeholder text and hints

2. **Validation**
   - Add appropriate validation rules
   - Provide clear error messages
   - Use conditional validation when needed

3. **User Experience**
   - Keep forms focused and concise
   - Use appropriate field types
   - Implement logical tab order
   - Add clear success/error messages

4. **Performance**
   - Minimize conditional logic complexity
   - Use appropriate field types for data
   - Implement proper form submission handling

5. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels where needed
   - Ensure keyboard navigation
   - Maintain sufficient color contrast

## Troubleshooting

Common issues and solutions:

1. **Fields not dragging**
   - Ensure DnD context is properly set up
   - Check for CSS conflicts
   - Verify touch event handling

2. **Validation not working**
   - Confirm validation rules syntax
   - Check conditional logic
   - Verify field type compatibility

3. **Theme not applying**
   - Check theme configuration
   - Verify CSS specificity
   - Clear browser cache

4. **Performance issues**
   - Reduce number of conditional rules
   - Optimize validation functions
   - Check for memory leaks

## Support

For additional support:
- Check the GitHub repository
- Review issues and discussions
- Contact the development team
- Refer to the API documentation

Remember to keep your form builder package updated to access the latest features and improvements.