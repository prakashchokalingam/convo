import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateCard } from '@/components/app/templates/core/TemplateCard';
import {
  createMockTemplate,
  createMockGlobalTemplate,
  createMockWorkspaceTemplate,
  createMockPermissions,
  PERMISSION_SCENARIOS,
} from './template-helpers';

// Mock @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isSignedIn: true,
    isLoaded: true,
    user: {
      id: 'user_test_id_123',
      fullName: 'Test User FullName',
      firstName: 'Test',
      lastName: 'User',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      // Add any other user properties your component might need
    },
  }),
  // If your component uses other Clerk components like <UserButton />, mock them here too
  // UserButton: () => <div data-testid="mock-user-button" />,
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Copy: () => <div data-testid="copy-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  MoreHorizontal: () => <div data-testid="more-horizontal-icon" />,
  Pencil: () => <div data-testid="pencil-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Users: () => <div data-testid="users-icon" />,
}));

describe('TemplateCard Component', () => {
  let mockOnAction: any;

  beforeEach(() => {
    mockOnAction = vi.fn();
  });

  describe('Basic Rendering', () => {
    it('should render template card with basic information', () => {
      const template = createMockTemplate({
        name: 'Customer Survey',
        description: 'Collect customer feedback efficiently',
        category: 'Marketing',
        usageCount: 25,
        cloneCount: 8,
      });

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      expect(screen.getByText('Customer Survey')).toBeInTheDocument();
      expect(screen.getByText('Collect customer feedback efficiently')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('forms')).toBeInTheDocument(); // Changed "forms created" to "forms"
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('clones')).toBeInTheDocument();
    });

    it('should display global template badge for global templates', () => {
      const template = createMockGlobalTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
      expect(screen.getByText('Global')).toBeInTheDocument();
    });

    it('should not display global badge for workspace templates', () => {
      const template = createMockWorkspaceTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      expect(screen.queryByTestId('globe-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('Global')).not.toBeInTheDocument();
    });

    it('should display correct field count', () => {
      const template = createMockTemplate({
        formSchema: {
          fields: [
            { id: 'field1', type: 'text', label: 'Field 1' },
            { id: 'field2', type: 'email', label: 'Field 2' },
            { id: 'field3', type: 'textarea', label: 'Field 3' },
          ],
          settings: {},
        },
      });

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      expect(screen.getByText('3 fields')).toBeInTheDocument();
    });

    it('should handle missing description gracefully', () => {
      const template = createMockTemplate({
        description: null,
      });

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      expect(screen.getByText(template.name)).toBeInTheDocument();
      // Should not crash or show description
    });
  });

  describe('Permission-Based Rendering', () => {
    it('should show create form button for users with create_form permission', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.MEMBER}
          onAction={mockOnAction}
        />
      );

      expect(screen.getByText('Create Form')).toBeInTheDocument();
    });

    it('should show clone button for users with clone permission', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      expect(screen.getByText('Clone')).toBeInTheDocument();
    });

    it('should hide action buttons for users without permissions', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.VIEWER}
          onAction={mockOnAction}
        />
      );

      expect(screen.queryByText('Create Form')).not.toBeInTheDocument();
      expect(screen.queryByText('Clone')).not.toBeInTheDocument();
    });

    it('should show edit and delete options in dropdown for admin users', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      // Click the more options button
      await user.click(screen.getByTestId('more-horizontal-icon'));

      await waitFor(() => {
        expect(screen.getByText('Edit Template')).toBeInTheDocument(); // Changed "Edit" to "Edit Template"
        expect(screen.getByText('Delete Template')).toBeInTheDocument(); // Changed "Delete" to "Delete Template"
      });
    });

    it('should not show edit/delete options for users without permissions', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.MEMBER}
          onAction={mockOnAction}
        />
      );

      // More options button should not be present or should not show edit/delete
      const moreButton = screen.queryByTestId('more-horizontal-icon');
      if (moreButton) {
        await user.click(moreButton);
        await waitFor(() => {
          expect(screen.queryByText('Edit Template')).not.toBeInTheDocument(); // Changed "Edit"
          expect(screen.queryByText('Delete Template')).not.toBeInTheDocument(); // Changed "Delete"
        });
      }
    });
  });

  describe('Action Handling', () => {
    it('should call onAction when create form button is clicked', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      await user.click(screen.getByText('Create Form'));

      expect(mockOnAction).toHaveBeenCalledWith({
        type: 'createForm',
        templateId: template.id,
        data: undefined,
      });
    });

    it('should call onAction when clone button is clicked', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      await user.click(screen.getByText('Clone'));

      expect(mockOnAction).toHaveBeenCalledWith({
        type: 'clone',
        templateId: template.id,
        data: undefined,
      });
    });

    it('should call onAction when preview is clicked from dropdown', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      await user.click(screen.getByTestId('more-horizontal-icon'));
      await user.click(screen.getByText('Preview Template')); // Changed "Preview" to "Preview Template"

      expect(mockOnAction).toHaveBeenCalledWith({
        type: 'preview',
        templateId: template.id,
        data: undefined,
      });
    });

    it('should call onAction when edit is clicked from dropdown', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      await user.click(screen.getByTestId('more-horizontal-icon'));
      await user.click(screen.getByText('Edit Template')); // Changed "Edit" to "Edit Template"

      expect(mockOnAction).toHaveBeenCalledWith({
        type: 'edit',
        templateId: template.id,
        data: undefined,
      });
    });

    it('should call onAction when delete is clicked from dropdown', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          onAction={mockOnAction}
        />
      );

      await user.click(screen.getByTestId('more-horizontal-icon'));
      await user.click(screen.getByText('Delete Template')); // Changed "Delete" to "Delete Template"

      expect(mockOnAction).toHaveBeenCalledWith({
        type: 'delete',
        templateId: template.id,
        data: undefined,
      });
    });

    it('should not call onAction when onAction prop is not provided', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
        />
      );

      // Should not throw error
      await user.click(screen.getByText('Create Form'));
    });
  });

  describe('Loading State', () => {
    it('should render skeleton loading state when isLoading is true', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          isLoading={true}
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText(template.name)).not.toBeInTheDocument();
    });

    it('should render normal content when isLoading is false', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          isLoading={false}
        />
      );

      expect(screen.getByText(template.name)).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Variant Rendering', () => {
    it('should render compact variant correctly', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          variant="compact"
        />
      );

      // Compact variant should still show basic info but in smaller format
      expect(screen.getByText(template.name)).toBeInTheDocument();
      expect(screen.getByText(template.description!)).toBeInTheDocument();
    });

    it('should render default variant with footer actions', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          variant="default"
        />
      );

      // Default variant should show footer with action buttons
      expect(screen.getByText('Create Form')).toBeInTheDocument();
      expect(screen.getByText('Clone')).toBeInTheDocument();
    });
  });

  describe('Category Colors', () => {
    it('should apply correct color classes for different categories', () => {
      const categories = ['HR', 'Marketing', 'Support', 'Sales'];
      
      categories.forEach(category => {
        const template = createMockTemplate({ category });
        
        const { unmount } = render(
          <TemplateCard
            template={template}
            permissions={PERMISSION_SCENARIOS.ADMIN}
          />
        );

        expect(screen.getByText(category)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle unknown category gracefully', () => {
      const template = createMockTemplate({ category: 'Unknown' as any });

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
        />
      );

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed formSchema gracefully', () => {
      const template = createMockTemplate({
        formSchema: 'invalid json' as any,
      });

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
        />
      );

      expect(screen.getByText('0 fields')).toBeInTheDocument();
    });

    it('should handle empty formSchema gracefully', () => {
      const template = createMockTemplate({
        formSchema: { fields: [], settings: {} },
      });

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
        />
      );

      expect(screen.getByText('0 fields')).toBeInTheDocument();
    });

    it('should handle null category gracefully', () => {
      const template = createMockTemplate({ category: null });

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
        />
      );

      // Should not crash, category section should be absent
      expect(screen.getByText(template.name)).toBeInTheDocument();
    });

    it('should hide actions when showActions is false', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
          showActions={false}
        />
      );

      expect(screen.queryByText('Create Form')).not.toBeInTheDocument();
      expect(screen.queryByText('Clone')).not.toBeInTheDocument();
      expect(screen.queryByTestId('more-horizontal-icon')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels and roles', () => {
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
        />
      );

      // Check that buttons have proper roles
      expect(screen.getByRole('button', { name: /create form/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clone/i })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const template = createMockTemplate();

      render(
        <TemplateCard
          template={template}
          permissions={PERMISSION_SCENARIOS.ADMIN}
        />
      );

      // Tab to create form button
      await user.tab();
      expect(screen.getByText('Create Form')).toHaveFocus();

      // Tab to clone button
      await user.tab();
      expect(screen.getByText('Clone')).toHaveFocus();
    });
  });
});
