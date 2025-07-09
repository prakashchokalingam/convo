import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormBuilder } from '@/components/app/form-builder/core/FormBuilder';
import { createMockFormConfig, createMockField, renderWithDnd } from '../utils/test-helpers';
import { FormConfig, FieldType } from '@/lib/form-builder/types';

// Mock the FormCanvas and other child components to focus on FormBuilder logic
vi.mock('@/components/form-builder/core/FormCanvas', () => ({
  FormCanvas: ({ config, onSelectField, onUpdateField, onRemoveField, onDuplicateField }: any) => (
    <div data-testid='form-canvas'>
      <div>Form Canvas</div>
      <div>Fields: {config.fields.length}</div>
      {config.fields.map((field: any) => (
        <div
          key={field.id}
          data-testid={`field-${field.id}`}
          onClick={() => onSelectField(field.id)}
        >
          {field.label}
          <button onClick={() => onUpdateField(field.id, { label: 'Updated' })}>Update</button>
          <button onClick={() => onRemoveField(field.id)}>Remove</button>
          <button onClick={() => onDuplicateField(field)}>Duplicate</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/components/form-builder/core/FieldLibrary', () => ({
  FieldLibrary: ({ onAddField }: any) => (
    <div data-testid='field-library'>
      <div>Field Library</div>
      <button onClick={() => onAddField('text')}>Add Text Field</button>
      <button onClick={() => onAddField('email')}>Add Email Field</button>
      <button onClick={() => onAddField('section')}>Add Section</button>
    </div>
  ),
}));

vi.mock('@/components/form-builder/core/PropertiesPanel', () => ({
  PropertiesPanel: ({ config, selectedField, onUpdateConfig, onUpdateField }: any) => (
    <div data-testid='properties-panel'>
      <div>Properties Panel</div>
      {selectedField && (
        <div data-testid='selected-field-properties'>
          <div>Selected: {selectedField.label}</div>
          <button
            onClick={() => onUpdateField(selectedField.id, { label: 'Updated from Properties' })}
          >
            Update Field Label
          </button>
        </div>
      )}
      <button onClick={() => onUpdateConfig({ name: 'Updated Form Name' })}>
        Update Form Name
      </button>
    </div>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('FormBuilder Component', () => {
  let mockOnSave: any;
  let mockOnPreview: any;

  beforeEach(() => {
    mockOnSave = vi.fn();
    mockOnPreview = vi.fn();
  });

  describe('Initial Rendering', () => {
    it('should render with default configuration', () => {
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      expect(screen.getByText('Untitled Form')).toBeInTheDocument();
      expect(screen.getByTestId('field-library')).toBeInTheDocument();
      expect(screen.getByTestId('form-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('properties-panel')).toBeInTheDocument();
    });

    it('should render with initial configuration', () => {
      const initialConfig = createMockFormConfig({
        name: 'Test Form',
        description: 'Test Description',
        fields: [
          createMockField('text', { label: 'Name Field' }),
          createMockField('email', { label: 'Email Field' }),
        ],
      });

      render(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByText('Fields: 2')).toBeInTheDocument();
    });

    it('should render header buttons', () => {
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should render undo/redo buttons', () => {
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      // Undo and redo buttons should be present (though initially disabled)
      const undoButton = screen.getByRole('button', { name: '' });
      const redoButton = screen.getAllByRole('button', { name: '' })[1];

      expect(undoButton).toBeInTheDocument();
      expect(redoButton).toBeInTheDocument();
      expect(undoButton).toBeDisabled();
      expect(redoButton).toBeDisabled();
    });
  });

  describe('Field Management', () => {
    it('should add fields from field library', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      // Initially no fields
      expect(screen.getByText('Fields: 0')).toBeInTheDocument();

      // Add a text field
      await user.click(screen.getByRole('button', { name: 'Add Text Field' }));

      await waitFor(() => {
        expect(screen.getByText('Fields: 1')).toBeInTheDocument();
      });
    });

    it('should select fields when clicked', async () => {
      const user = userEvent.setup();
      const initialConfig = createMockFormConfig({
        fields: [createMockField('text', { id: 'field-1', label: 'Test Field' })],
      });

      render(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Click on the field
      await user.click(screen.getByTestId('field-field-1'));

      await waitFor(() => {
        expect(screen.getByText('Selected: Test Field')).toBeInTheDocument();
      });
    });

    it('should update field properties', async () => {
      const user = userEvent.setup();
      const initialConfig = createMockFormConfig({
        fields: [createMockField('text', { id: 'field-1', label: 'Test Field' })],
      });

      render(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Select the field first
      await user.click(screen.getByTestId('field-field-1'));

      // Update field from properties panel
      await user.click(screen.getByRole('button', { name: 'Update Field Label' }));

      await waitFor(() => {
        expect(screen.getByText('Selected: Updated from Properties')).toBeInTheDocument();
      });
    });

    it('should remove fields', async () => {
      const user = userEvent.setup();
      const initialConfig = createMockFormConfig({
        fields: [createMockField('text', { id: 'field-1', label: 'Test Field' })],
      });

      render(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      expect(screen.getByText('Fields: 1')).toBeInTheDocument();

      // Remove the field
      await user.click(screen.getByRole('button', { name: 'Remove' }));

      await waitFor(() => {
        expect(screen.getByText('Fields: 0')).toBeInTheDocument();
      });
    });

    it('should duplicate fields', async () => {
      const user = userEvent.setup();
      const initialConfig = createMockFormConfig({
        fields: [createMockField('text', { id: 'field-1', label: 'Test Field' })],
      });

      render(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      expect(screen.getByText('Fields: 1')).toBeInTheDocument();

      // Duplicate the field
      await user.click(screen.getByRole('button', { name: 'Duplicate' }));

      await waitFor(() => {
        expect(screen.getByText('Fields: 2')).toBeInTheDocument();
      });
    });
  });

  describe('Form Configuration Management', () => {
    it('should update form configuration', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      expect(screen.getByText('Untitled Form')).toBeInTheDocument();

      // Update form name from properties panel
      await user.click(screen.getByRole('button', { name: 'Update Form Name' }));

      await waitFor(() => {
        expect(screen.getByText('Updated Form Name')).toBeInTheDocument();
      });
    });
  });

  describe('Save and Preview Functionality', () => {
    it('should call onSave when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Untitled Form',
          fields: [],
        })
      );
    });

    it('should call onPreview when preview button is clicked', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      await user.click(screen.getByRole('button', { name: /preview/i }));

      expect(mockOnPreview).toHaveBeenCalledTimes(1);
      expect(mockOnPreview).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Untitled Form',
          fields: [],
        })
      );
    });

    it('should show preview mode when preview is clicked', async () => {
      const user = userEvent.setup();
      const initialConfig = createMockFormConfig({
        name: 'Test Form',
        description: 'Test Description',
        fields: [
          createMockField('text', { label: 'Name Field' }),
          createMockField('email', { label: 'Email Field' }),
        ],
      });

      render(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      await user.click(screen.getByRole('button', { name: /preview/i }));

      await waitFor(() => {
        expect(screen.getByText('Preview: Test Form')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back to Editor' })).toBeInTheDocument();
      });
    });

    it('should return to editor from preview mode', async () => {
      const user = userEvent.setup();
      const initialConfig = createMockFormConfig({
        name: 'Test Form',
      });

      render(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Go to preview
      await user.click(screen.getByRole('button', { name: /preview/i }));

      await waitFor(() => {
        expect(screen.getByText('Preview: Test Form')).toBeInTheDocument();
      });

      // Go back to editor
      await user.click(screen.getByRole('button', { name: 'Back to Editor' }));

      await waitFor(() => {
        expect(screen.getByTestId('field-library')).toBeInTheDocument();
        expect(screen.getByTestId('form-canvas')).toBeInTheDocument();
        expect(screen.getByTestId('properties-panel')).toBeInTheDocument();
      });
    });
  });

  describe('History Management (Undo/Redo)', () => {
    it('should enable undo after making changes', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      const undoButton = screen.getAllByRole('button', { name: '' })[0];
      expect(undoButton).toBeDisabled();

      // Make a change (add a field)
      await user.click(screen.getByRole('button', { name: 'Add Text Field' }));

      await waitFor(() => {
        expect(undoButton).not.toBeDisabled();
      });
    });

    it('should enable redo after undoing changes', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onSave={mockOnSave} onPreview={mockOnPreview} />);

      const undoButton = screen.getAllByRole('button', { name: '' })[0];
      const redoButton = screen.getAllByRole('button', { name: '' })[1];

      // Make a change
      await user.click(screen.getByRole('button', { name: 'Add Text Field' }));

      await waitFor(() => {
        expect(screen.getByText('Fields: 1')).toBeInTheDocument();
      });

      // Undo the change
      await user.click(undoButton);

      await waitFor(() => {
        expect(screen.getByText('Fields: 0')).toBeInTheDocument();
        expect(redoButton).not.toBeDisabled();
      });
    });
  });

  describe('Custom CSS Classes', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FormBuilder
          className='custom-form-builder'
          onSave={mockOnSave}
          onPreview={mockOnPreview}
        />
      );

      expect(container.firstChild).toHaveClass('custom-form-builder');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onSave callback gracefully', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onPreview={mockOnPreview} />);

      // Should not throw when save is clicked without onSave callback
      await user.click(screen.getByRole('button', { name: /save/i }));

      // No error should be thrown
      expect(true).toBe(true);
    });

    it('should handle missing onPreview callback gracefully', async () => {
      const user = userEvent.setup();
      render(<FormBuilder onSave={mockOnSave} />);

      // Should not throw when preview is clicked without onPreview callback
      await user.click(screen.getByRole('button', { name: /preview/i }));

      // No error should be thrown
      expect(true).toBe(true);
    });
  });
});

describe('FormBuilder Preview Mode', () => {
  let mockOnSave: any;
  let mockOnPreview: any;

  beforeEach(() => {
    mockOnSave = vi.fn();
    mockOnPreview = vi.fn();
  });

  it('should render form fields in preview mode', async () => {
    const user = userEvent.setup();
    const initialConfig = createMockFormConfig({
      name: 'Survey Form',
      description: 'Please fill out this survey',
      fields: [
        createMockField('text', { label: 'Full Name', required: true }),
        createMockField('email', { label: 'Email Address', required: true }),
        createMockField('textarea', { label: 'Comments', required: false }),
      ],
    });

    render(
      <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
    );

    await user.click(screen.getByRole('button', { name: /preview/i }));

    await waitFor(() => {
      expect(screen.getByText('Survey Form')).toBeInTheDocument();
      expect(screen.getByText('Please fill out this survey')).toBeInTheDocument();
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Comments')).toBeInTheDocument();

      // Check for required indicators
      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators).toHaveLength(2); // Full Name and Email are required
    });
  });

  it('should show submit button with custom text', async () => {
    const user = userEvent.setup();
    const initialConfig = createMockFormConfig({
      settings: {
        ...createMockFormConfig().settings,
        submitButtonText: 'Submit Survey',
      },
    });

    render(
      <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
    );

    await user.click(screen.getByRole('button', { name: /preview/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit Survey' })).toBeInTheDocument();
    });
  });
});
