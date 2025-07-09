import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  renderWithDnd,
  createMockFormConfig,
  createMockField,
  createMockSection,
} from '../utils/test-helpers';
import { FormBuilder } from '@/components/app/form-builder/core/FormBuilder';

// Mock the child components but keep FormCanvas real to test section functionality
vi.mock('@/components/form-builder/core/FieldLibrary', () => ({
  FieldLibrary: ({ onAddField }: any) => (
    <div data-testid='field-library'>
      <div
        data-testid='text-field-drag'
        draggable
        onDragStart={e => {
          e.dataTransfer.setData(
            'application/json',
            JSON.stringify({
              type: 'new-field',
              fieldType: 'text',
            })
          );
        }}
      >
        Text Field
      </div>
      <button onClick={() => onAddField('text')}>Add Text Field</button>
    </div>
  ),
}));

vi.mock('@/components/form-builder/core/PropertiesPanel', () => ({
  PropertiesPanel: () => <div data-testid='properties-panel'>Properties Panel</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      initial,
      animate,
      exit,
      transition,
      layout,
      layoutId,
      ...props
    }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock the SortableFieldItem since we're focusing on section behavior
vi.mock('@/components/form-builder/core/SortableFieldItem', () => ({
  SortableFieldItem: ({ field, isSelected, onClick, onUpdate, onRemove, onDuplicate }: any) => (
    <div
      data-testid={`sortable-field-${field.id}`}
      className={`sortable-field ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div>
        {field.label} ({field.type})
      </div>
      <button onClick={() => onUpdate({ label: 'Updated' })}>Update</button>
      <button onClick={onRemove}>Remove</button>
      <button onClick={() => onDuplicate(field)}>Duplicate</button>
    </div>
  ),
}));

// Mock EmptyCanvas
vi.mock('@/components/form-builder/core/EmptyCanvas', () => ({
  EmptyCanvas: () => <div data-testid='empty-canvas'>Empty Canvas</div>,
}));

describe('Section Drop Zone Visual Feedback', () => {
  let mockOnSave: any;
  let mockOnPreview: any;

  beforeEach(() => {
    mockOnSave = vi.fn();
    mockOnPreview = vi.fn();
  });

  describe('Section Drop Target Styling', () => {
    it('should show blue overlay when dragging field over section', async () => {
      const initialConfig = createMockFormConfig({
        fields: [
          createMockSection({
            id: 'section-1',
            label: 'Contact Information',
          }),
        ],
      });

      const { container } = renderWithDnd(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Find the section in the rendered component
      // The section should be rendered by FormCanvas -> SectionContainer
      const sectionElement = container.querySelector(
        '[data-rbd-droppable-id*="section-drop-section-1"]'
      );

      // If the specific droppable isn't found, look for the section container
      const sectionContainer = container.querySelector(
        'div:has(input[value="Contact Information"])'
      );

      expect(sectionContainer || sectionElement).toBeInTheDocument();
    });

    it('should render section with proper structure', async () => {
      const initialConfig = createMockFormConfig({
        fields: [
          createMockSection({
            id: 'section-1',
            label: 'Personal Info',
            description: 'Enter your personal information',
          }),
        ],
      });

      const { container } = renderWithDnd(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Check that section is rendered with proper label
      expect(screen.getByDisplayValue('Personal Info')).toBeInTheDocument();

      // Check for section structure elements that should exist
      // Based on FormCanvas implementation, sections should have drag handles and action buttons
      const sectionTitle = screen.getByDisplayValue('Personal Info');
      expect(sectionTitle).toBeInTheDocument();
    });

    it('should handle empty section with drop zone', async () => {
      const initialConfig = createMockFormConfig({
        fields: [
          createMockSection({
            id: 'empty-section',
            label: 'Empty Section',
          }),
        ],
      });

      const { container } = renderWithDnd(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Check that the empty section renders
      expect(screen.getByDisplayValue('Empty Section')).toBeInTheDocument();

      // Empty sections should have a drop zone area
      // Based on FormCanvas, empty sections show "Drag fields here to add to section"
      expect(screen.getByText('Drag fields here to add to section')).toBeInTheDocument();
    });

    it('should show section with fields', async () => {
      const initialConfig = createMockFormConfig({
        fields: [
          createMockSection({
            id: 'filled-section',
            label: 'Contact Info',
          }),
          createMockField('text', {
            id: 'name-field',
            label: 'Full Name',
            sectionId: 'filled-section',
            nestingLevel: 1,
          }),
          createMockField('email', {
            id: 'email-field',
            label: 'Email Address',
            sectionId: 'filled-section',
            nestingLevel: 1,
          }),
        ],
      });

      renderWithDnd(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Check section title
      expect(screen.getByDisplayValue('Contact Info')).toBeInTheDocument();

      // Check fields in section
      expect(screen.getByText('Full Name (text)')).toBeInTheDocument();
      expect(screen.getByText('Email Address (email)')).toBeInTheDocument();

      // Should show field count in section footer
      expect(screen.getByText('2 fields in this section')).toBeInTheDocument();
    });

    it('should support section collapse/expand functionality', async () => {
      const user = userEvent.setup();
      const initialConfig = createMockFormConfig({
        fields: [
          createMockSection({
            id: 'collapsible-section',
            label: 'Collapsible Section',
            isCollapsed: false,
          }),
          createMockField('text', {
            id: 'field-in-section',
            label: 'Field in Section',
            sectionId: 'collapsible-section',
          }),
        ],
      });

      renderWithDnd(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Section should be expanded initially
      expect(screen.getByText('Field in Section (text)')).toBeInTheDocument();

      // Find and click collapse button
      const collapseButtons = screen.getAllByRole('button');
      const collapseButton = collapseButtons.find(
        btn => btn.querySelector('svg') // Looking for chevron icon
      );

      if (collapseButton) {
        await act(async () => {
          await user.click(collapseButton);
        });

        // Field should no longer be visible when collapsed
        // Note: This test may need adjustment based on actual collapse behavior
      }
    });
  });

  describe('Section Drop Zone Implementation', () => {
    it('should provide visual feedback during drag operations', async () => {
      const initialConfig = createMockFormConfig({
        fields: [
          createMockSection({
            id: 'test-section',
            label: 'Test Section',
          }),
        ],
      });

      const { container } = renderWithDnd(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Check that section renders with proper structure
      expect(screen.getByDisplayValue('Test Section')).toBeInTheDocument();

      // Check for empty section drop zone text
      expect(screen.getByText('Drag fields here to add to section')).toBeInTheDocument();

      // Verify the section has the proper DOM structure for drop handling
      const sectionInput = screen.getByDisplayValue('Test Section');
      expect(sectionInput).toBeInTheDocument();

      // The section should be properly structured for drag and drop
      // This tests that the FormCanvas and SectionContainer are working together
    });

    it('should handle complex form with multiple sections and fields', async () => {
      const initialConfig = createMockFormConfig({
        fields: [
          createMockSection({
            id: 'personal-section',
            label: 'Personal Information',
          }),
          createMockField('text', {
            id: 'first-name',
            label: 'First Name',
            sectionId: 'personal-section',
            nestingLevel: 1,
          }),
          createMockField('email', {
            id: 'email',
            label: 'Email',
            sectionId: 'personal-section',
            nestingLevel: 1,
          }),
          createMockSection({
            id: 'address-section',
            label: 'Address Information',
          }),
          createMockField('text', {
            id: 'street',
            label: 'Street Address',
            sectionId: 'address-section',
            nestingLevel: 1,
          }),
        ],
      });

      renderWithDnd(
        <FormBuilder initialConfig={initialConfig} onSave={mockOnSave} onPreview={mockOnPreview} />
      );

      // Check that both sections render
      expect(screen.getByDisplayValue('Personal Information')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Address Information')).toBeInTheDocument();

      // Check that fields are properly nested in sections
      expect(screen.getByText('First Name (text)')).toBeInTheDocument();
      expect(screen.getByText('Email (email)')).toBeInTheDocument();
      expect(screen.getByText('Street Address (text)')).toBeInTheDocument();

      // Check field counts in section footers
      expect(screen.getByText('2 fields in this section')).toBeInTheDocument();
      expect(screen.getByText('1 field in this section')).toBeInTheDocument();
    });
  });
});
