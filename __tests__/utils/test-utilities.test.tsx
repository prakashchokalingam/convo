import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  renderWithDnd,
  createMockFormConfig,
  createMockField,
  createMockSection,
  createMockDragEvent,
  createMouseEvent,
  simulateDragAndDrop,
  expectFormToHaveField,
  expectFieldToBeInSection,
  expectSectionToHaveFieldCount,
  waitForDragAnimation,
  waitForFormUpdate,
} from './test-helpers';
import { FormConfig, FieldConfig } from '@/lib/form-builder/types';

// Simple test component for DnD testing
function TestComponent() {
  return (
    <div>
      <div data-testid='draggable' draggable>
        Draggable Item
      </div>
      <div data-testid='droppable'>Drop Zone</div>
    </div>
  );
}

describe('Test Utilities', () => {
  describe('renderWithDnd', () => {
    it('should render component with DnD context', () => {
      renderWithDnd(<TestComponent />);

      expect(screen.getByTestId('draggable')).toBeInTheDocument();
      expect(screen.getByTestId('droppable')).toBeInTheDocument();
    });

    it('should provide drag and drop functionality', () => {
      renderWithDnd(<TestComponent />);

      const draggable = screen.getByTestId('draggable');
      const droppable = screen.getByTestId('droppable');

      // Elements should be in the DOM and ready for DnD interactions
      expect(draggable).toBeInTheDocument();
      expect(droppable).toBeInTheDocument();
      expect(draggable).toHaveAttribute('draggable', 'true');
    });
  });

  describe('createMockFormConfig', () => {
    it('should create a valid form config with defaults', () => {
      const config = createMockFormConfig();

      expect(config).toMatchObject({
        id: 'test-form',
        name: 'Test Form',
        description: 'A test form for testing',
        fields: [],
        metadata: expect.objectContaining({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          version: 1,
          createdBy: 'test-user',
        }),
      });
      expect(config.settings).toBeDefined();
      expect(config.theme).toBeDefined();
    });

    it('should accept overrides', () => {
      const overrides = {
        id: 'custom-form',
        name: 'Custom Form',
        description: 'Custom description',
        fields: [createMockField('text')],
      };

      const config = createMockFormConfig(overrides);

      expect(config.id).toBe('custom-form');
      expect(config.name).toBe('Custom Form');
      expect(config.description).toBe('Custom description');
      expect(config.fields).toHaveLength(1);
    });

    it('should merge settings and theme correctly', () => {
      const overrides = {
        settings: {
          title: 'Custom Title',
          submitButtonText: 'Custom Submit',
        },
      };

      const config = createMockFormConfig(overrides);

      expect(config.settings.title).toBe('Custom Title');
      expect(config.settings.submitButtonText).toBe('Custom Submit');
      // Should still have other default settings
      expect(config.settings.allowDrafts).toBeDefined();
      expect(config.settings.oneSubmissionPerUser).toBeDefined();
    });
  });

  describe('createMockField', () => {
    it('should create a field with default properties', () => {
      const field = createMockField('text');

      expect(field).toMatchObject({
        type: 'text',
        label: 'Text Field',
        required: false,
        order: 0,
        nestingLevel: 0,
      });
      expect(field.id).toMatch(/^field-\d+-[a-z0-9]+$/);
    });

    it('should accept overrides', () => {
      const overrides = {
        id: 'custom-field',
        label: 'Custom Label',
        required: true,
        order: 5,
        sectionId: 'section-1',
      };

      const field = createMockField('email', overrides);

      expect(field.id).toBe('custom-field');
      expect(field.type).toBe('email');
      expect(field.label).toBe('Custom Label');
      expect(field.required).toBe(true);
      expect(field.order).toBe(5);
      expect(field.sectionId).toBe('section-1');
    });

    it('should generate unique IDs for each field', () => {
      const field1 = createMockField('text');
      const field2 = createMockField('text');

      expect(field1.id).not.toBe(field2.id);
    });
  });

  describe('createMockSection', () => {
    it('should create a section field with default properties', () => {
      const section = createMockSection();

      expect(section.type).toBe('section');
      expect(section.label).toBe('Test Section');
      expect(section.required).toBe(false);
      expect(section.order).toBe(0);
    });

    it('should accept overrides', () => {
      const overrides = {
        label: 'Custom Section',
        description: 'A custom section',
      };

      const section = createMockSection(overrides);

      expect(section.label).toBe('Custom Section');
      expect(section.description).toBe('A custom section');
    });
  });

  describe('Event Creation Utilities', () => {
    it('should create mock drag events', () => {
      const dragEvent = createMockDragEvent('dragstart');

      expect(dragEvent).toBeInstanceOf(DragEvent);
      expect(dragEvent.type).toBe('dragstart');
      expect(dragEvent.bubbles).toBe(true);
      expect(dragEvent.cancelable).toBe(true);
      expect(dragEvent.dataTransfer).toBeDefined();
    });

    it('should create mock drag events with custom dataTransfer', () => {
      const customDataTransfer = {
        getData: vi.fn().mockReturnValue('test-data'),
        setData: vi.fn(),
      };

      const dragEvent = createMockDragEvent('drop', customDataTransfer);

      expect(dragEvent.dataTransfer.getData).toBe(customDataTransfer.getData);
      expect(dragEvent.dataTransfer.setData).toBe(customDataTransfer.setData);
    });

    it('should create mouse events', () => {
      const coordinates = { x: 100, y: 200 };
      const mouseEvent = createMouseEvent('mousedown', coordinates);

      expect(mouseEvent).toBeInstanceOf(MouseEvent);
      expect(mouseEvent.type).toBe('mousedown');
      expect(mouseEvent.clientX).toBe(100);
      expect(mouseEvent.clientY).toBe(200);
      expect(mouseEvent.bubbles).toBe(true);
      expect(mouseEvent.cancelable).toBe(true);
    });

    it('should create mouse events with default coordinates', () => {
      const mouseEvent = createMouseEvent('click');

      expect(mouseEvent.clientX).toBe(0);
      expect(mouseEvent.clientY).toBe(0);
    });
  });

  describe('Drag and Drop Simulation', () => {
    let dragElement: HTMLElement;
    let dropElement: HTMLElement;

    beforeEach(() => {
      document.body.innerHTML = `
        <div id="drag-element" draggable="true">Drag me</div>
        <div id="drop-element">Drop here</div>
      `;
      dragElement = document.getElementById('drag-element')!;
      dropElement = document.getElementById('drop-element')!;
    });

    it('should simulate drag and drop sequence', async () => {
      const dragStartHandler = vi.fn();
      const dropHandler = vi.fn();

      dragElement.addEventListener('dragstart', dragStartHandler);
      dropElement.addEventListener('drop', dropHandler);

      await simulateDragAndDrop(dragElement, dropElement);

      expect(dragStartHandler).toHaveBeenCalled();
      expect(dropHandler).toHaveBeenCalled();
    });

    it('should simulate drag and drop with custom coordinates', async () => {
      const coordinates = {
        start: { x: 10, y: 20 },
        end: { x: 100, y: 200 },
      };

      const mouseDownHandler = vi.fn();
      const mouseUpHandler = vi.fn();

      dragElement.addEventListener('mousedown', mouseDownHandler);
      dropElement.addEventListener('mouseup', mouseUpHandler);

      await simulateDragAndDrop(dragElement, dropElement, coordinates);

      expect(mouseDownHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          clientX: 10,
          clientY: 20,
        })
      );
      expect(mouseUpHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          clientX: 100,
          clientY: 200,
        })
      );
    });
  });

  describe('Form Testing Assertions', () => {
    let testForm: FormConfig;

    beforeEach(() => {
      testForm = createMockFormConfig({
        fields: [
          createMockField('text', { id: 'field-1', label: 'Name' }),
          createMockField('email', { id: 'field-2', label: 'Email', sectionId: 'section-1' }),
          createMockSection({ id: 'section-1', label: 'Contact Info' }),
          createMockField('textarea', { id: 'field-3', label: 'Comments', sectionId: 'section-1' }),
        ],
      });
    });

    describe('expectFormToHaveField', () => {
      it('should find existing field', () => {
        const field = expectFormToHaveField(testForm, 'field-1');
        expect(field.id).toBe('field-1');
        expect(field.label).toBe('Name');
      });

      it('should throw for non-existent field', () => {
        expect(() => {
          expectFormToHaveField(testForm, 'non-existent');
        }).toThrow();
      });
    });

    describe('expectFieldToBeInSection', () => {
      it('should find field in correct section', () => {
        const field = expectFieldToBeInSection(testForm, 'field-2', 'section-1');
        expect(field.id).toBe('field-2');
        expect(field.sectionId).toBe('section-1');
      });

      it('should throw if field is not in expected section', () => {
        expect(() => {
          expectFieldToBeInSection(testForm, 'field-1', 'section-1');
        }).toThrow();
      });
    });

    describe('expectSectionToHaveFieldCount', () => {
      it('should count fields in section correctly', () => {
        const fieldsInSection = expectSectionToHaveFieldCount(testForm, 'section-1', 2);
        expect(fieldsInSection).toHaveLength(2);
        expect(fieldsInSection.every(f => f.sectionId === 'section-1')).toBe(true);
      });

      it('should throw if field count is incorrect', () => {
        expect(() => {
          expectSectionToHaveFieldCount(testForm, 'section-1', 5);
        }).toThrow();
      });

      it('should handle sections with no fields', () => {
        const emptySection = expectSectionToHaveFieldCount(testForm, 'empty-section', 0);
        expect(emptySection).toHaveLength(0);
      });
    });
  });

  describe('Async Utilities', () => {
    it('should provide drag animation delay', async () => {
      const startTime = Date.now();
      await waitForDragAnimation();
      const endTime = Date.now();

      // Should wait approximately 300ms
      expect(endTime - startTime).toBeGreaterThanOrEqual(250);
      expect(endTime - startTime).toBeLessThan(400);
    });

    it('should provide form update delay', async () => {
      const startTime = Date.now();
      await waitForFormUpdate();
      const endTime = Date.now();

      // Should wait approximately 100ms
      expect(endTime - startTime).toBeGreaterThanOrEqual(90);
      expect(endTime - startTime).toBeLessThan(150);
    });
  });
});

describe('Complex Form Configurations', () => {
  it('should handle nested form structures', () => {
    const complexForm = createMockFormConfig({
      fields: [
        createMockSection({ id: 'section-1', label: 'Personal Info' }),
        createMockField('text', { id: 'field-1', sectionId: 'section-1', nestingLevel: 1 }),
        createMockField('email', { id: 'field-2', sectionId: 'section-1', nestingLevel: 1 }),
        createMockSection({ id: 'section-2', label: 'Address Info' }),
        createMockField('text', { id: 'field-3', sectionId: 'section-2', nestingLevel: 1 }),
        createMockField('text', { id: 'field-4' }), // Root level field
      ],
    });

    // Test section 1 has 2 fields
    expectSectionToHaveFieldCount(complexForm, 'section-1', 2);

    // Test section 2 has 1 field
    expectSectionToHaveFieldCount(complexForm, 'section-2', 1);

    // Test root level fields (no sectionId)
    const rootFields = complexForm.fields.filter(f => !f.sectionId && f.type !== 'section');
    expect(rootFields).toHaveLength(1);
    expect(rootFields[0].id).toBe('field-4');

    // Test nesting levels
    const nestedFields = complexForm.fields.filter(f => f.nestingLevel === 1);
    expect(nestedFields).toHaveLength(3);
  });

  it('should handle forms with validation rules', () => {
    const validatedForm = createMockFormConfig({
      fields: [
        createMockField('text', {
          id: 'name-field',
          required: true,
          validation: [
            { type: 'required', message: 'Name is required' },
            { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
          ],
        }),
        createMockField('email', {
          id: 'email-field',
          required: true,
          validation: [
            { type: 'required', message: 'Email is required' },
            {
              type: 'pattern',
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          ],
        }),
      ],
    });

    const nameField = expectFormToHaveField(validatedForm, 'name-field');
    expect(nameField.required).toBe(true);
    expect(nameField.validation).toHaveLength(2);
    expect(nameField.validation[0].type).toBe('required');
    expect(nameField.validation[1].type).toBe('minLength');

    const emailField = expectFormToHaveField(validatedForm, 'email-field');
    expect(emailField.required).toBe(true);
    expect(emailField.validation).toHaveLength(2);
    expect(emailField.validation[1].value).toBeInstanceOf(RegExp);
  });
});
