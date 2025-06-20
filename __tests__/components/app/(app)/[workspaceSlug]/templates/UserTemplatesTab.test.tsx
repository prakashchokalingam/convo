import React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserTemplatesTab } from '@/app/(app)/[workspaceSlug]/templates/UserTemplatesTab'; // Adjust path
import { useWorkspace } from '@/hooks/use-workspace';
import { Template } from '@/lib/db/schema'; // For mock data type

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock API calls (fetch)
global.fetch = vi.fn();

// Mock the useWorkspace hook
const mockUseWorkspaceValues = {
  workspace: { id: 'ws-123', name: 'Test Workspace', slug: 'test-ws' }, // slug might be needed if used internally
  userRole: 'member', // Default, actual permissions driven by hasPermission
  hasPermission: vi.fn((resource: string, action: string) => false), // Default to no permission
  isLoading: false,
  error: null,
  // Add other properties if UserTemplatesTab or its children use them
};

vi.mock('@/hooks/use-workspace', () => ({
  useWorkspace: vi.fn(() => mockUseWorkspaceValues),
}));

const mockUserTemplates: Template[] = [
  {
    id: 'ws-tpl-1',
    name: 'My Workspace Template',
    description: 'A custom template for our workspace.',
    formSchema: {},
    category: 'OTHER',
    isGlobal: false,
    workspaceId: 'ws-123',
    createdBy: 'user-1',
    usageCount: 5,
    cloneCount: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnailUrl: null,
    originalTemplateId: null,
  },
];

describe('UserTemplatesTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ templates: mockUserTemplates, pagination: {} }),
    });
    // Reset useWorkspace mock to default for each test, then override as needed
    (mockUseWorkspaceValues.hasPermission as ReturnType<typeof vi.fn>).mockImplementation(() => false);
    (useWorkspace as ReturnType<typeof vi.fn>).mockReturnValue(mockUseWorkspaceValues);
  });

  const defaultProps = {
    workspaceId: 'ws-123',
    userRole: 'member', // Prop userRole might be less relevant if hasPermission is the source of truth
    canCreateTemplates: true, // For main "Create Template" button and cloning from this tab
    onCreateTemplate: vi.fn(),
  };

  it('shows all actions (Clone, Create Form, Edit, Delete) if user has all relevant permissions', async () => {
    (mockUseWorkspaceValues.hasPermission as ReturnType<typeof vi.fn>).mockImplementation((resource: string, action: string) => {
      if (resource === 'templates') {
        return action === 'create' || action === 'edit' || action === 'delete';
      }
      return false;
    });
    // canCreateTemplates prop for this tab also implies clone permission from within this tab
    const props = { ...defaultProps, canCreateTemplates: true };


    await act(async () => {
      render(<UserTemplatesTab {...props} />);
    });

    expect(await screen.findByText(mockUserTemplates[0].name)).toBeInTheDocument();
    const firstCard = screen.getAllByRole('article')[0]; // Assuming cards are articles

    expect(within(firstCard).getByRole('button', { name: /Clone/i })).toBeInTheDocument();
    expect(within(firstCard).getByRole('button', { name: /Create Form/i })).toBeInTheDocument();
    expect(within(firstCard).getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(within(firstCard).getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('hides "Clone" if user lacks create_template permission (via canCreateTemplates prop)', async () => {
    // Note: 'create_template' from `hasPermission` is used by parent for `canCreateTemplates` prop.
    // Here, canCreateTemplates directly controls clone from this tab.
    const props = { ...defaultProps, canCreateTemplates: false };
    // Other permissions (edit, delete) might still be true from hasPermission directly
    (mockUseWorkspaceValues.hasPermission as ReturnType<typeof vi.fn>).mockImplementation((resource: string, action: string) => {
        if (resource === 'templates') return action === 'edit' || action === 'delete';
        return false;
    });


    await act(async () => {
      render(<UserTemplatesTab {...props} />);
    });

    expect(await screen.findByText(mockUserTemplates[0].name)).toBeInTheDocument();
    const firstCard = screen.getAllByRole('article')[0];
    expect(within(firstCard).queryByRole('button', { name: /Clone/i })).not.toBeInTheDocument();
    // Edit and Delete might still be there based on hasPermission
    expect(within(firstCard).getByRole('button', { name: /Edit/i })).toBeInTheDocument();

  });

  it('hides "Edit" if user lacks edit_template permission', async () => {
    (mockUseWorkspaceValues.hasPermission as ReturnType<typeof vi.fn>).mockImplementation((resource: string, action: string) => {
      if (resource === 'templates') return action === 'create' || action === 'delete'; // Has create/delete, not edit
      return false;
    });
     const props = { ...defaultProps, canCreateTemplates: true };


    await act(async () => {
      render(<UserTemplatesTab {...props} />);
    });

    expect(await screen.findByText(mockUserTemplates[0].name)).toBeInTheDocument();
    const firstCard = screen.getAllByRole('article')[0];
    expect(within(firstCard).queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
    // Clone and Delete might still be there
    expect(within(firstCard).getByRole('button', { name: /Clone/i })).toBeInTheDocument();
    expect(within(firstCard).getByRole('button', { name: /Delete/i })).toBeInTheDocument();

  });

  it('hides "Delete" if user lacks delete_template permission', async () => {
    (mockUseWorkspaceValues.hasPermission as ReturnType<typeof vi.fn>).mockImplementation((resource: string, action: string) => {
      if (resource === 'templates') return action === 'create' || action === 'edit'; // Has create/edit, not delete
      return false;
    });
    const props = { ...defaultProps, canCreateTemplates: true };


    await act(async () => {
      render(<UserTemplatesTab {...props} />);
    });

    expect(await screen.findByText(mockUserTemplates[0].name)).toBeInTheDocument();
    const firstCard = screen.getAllByRole('article')[0];
    expect(within(firstCard).queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
    // Clone and Edit might still be there
     expect(within(firstCard).getByRole('button', { name: /Clone/i })).toBeInTheDocument();
    expect(within(firstCard).getByRole('button', { name: /Edit/i })).toBeInTheDocument();
  });

  it('shows main "Create Template" button if canCreateTemplates prop is true', async () => {
    // This button is usually part of the empty state or header within UserTemplatesTab itself
    // For this test, we assume it's rendered when templates list is empty.
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ templates: [], pagination: {} }), // No templates
    });
    const props = { ...defaultProps, canCreateTemplates: true };
    await act(async () => {
        render(<UserTemplatesTab {...props} />);
    });
    expect(await screen.findByRole('button', { name: /Create Your First Template/i })).toBeInTheDocument();
  });

  it('hides main "Create Template" button if canCreateTemplates prop is false', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ templates: [], pagination: {} }), // No templates
    });
     const props = { ...defaultProps, canCreateTemplates: false };
    await act(async () => {
        render(<UserTemplatesTab {...props} />);
    });
    expect(screen.queryByRole('button', { name: /Create Your First Template/i })).not.toBeInTheDocument();
  });

});
