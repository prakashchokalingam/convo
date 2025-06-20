import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplatesPage from '@/app/(app)/[workspaceSlug]/templates/page'; // Adjust path as per actual structure
import { useWorkspace } from '@/hooks/use-workspace';

// Mock child components to simplify TemplatesPage testing focus
vi.mock('@/app/(app)/[workspaceSlug]/templates/GlobalTemplatesTab', () => ({
  GlobalTemplatesTab: () => <div data-testid="global-templates-tab">GlobalTemplatesTab</div>,
}));
vi.mock('@/app/(app)/[workspaceSlug]/templates/UserTemplatesTab', () => ({
  UserTemplatesTab: () => <div data-testid="user-templates-tab">UserTemplatesTab</div>,
}));
vi.mock('@/app/(app)/[workspaceSlug]/templates/TemplateCreateDialog', () => ({
  TemplateCreateDialog: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="template-create-dialog">TemplateCreateDialog</div> : null,
}));

// Mock the useWorkspace hook
const mockUseWorkspaceValues = {
  workspace: { id: 'ws-123', name: 'Test Workspace', slug: 'test-workspace' },
  userRole: 'member',
  hasPermission: vi.fn(),
  // Add any other properties returned by the actual hook that TemplatesPage might use
  isLoading: false,
  error: null,
  isValidating: false,
  mutateWorkspace: vi.fn(),
  currentMembership: { role: 'member' }
};

vi.mock('@/hooks/use-workspace', () => ({
  useWorkspace: vi.fn(() => mockUseWorkspaceValues),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    // ... other router methods if needed
  }),
  useParams: () => ({ // If TemplatesPage uses useParams
    workspaceSlug: 'test-workspace',
  }),
  useSearchParams: () => ({ // If TemplatesPage uses useSearchParams
    get: vi.fn(),
  }),
}));


describe('TemplatesPage Component', () => {
  beforeEach(() => {
    // Reset mocks for each test
    vi.clearAllMocks();
    (useWorkspace as ReturnType<typeof vi.fn>).mockReturnValue(mockUseWorkspaceValues); // Reset to default mock values
  });

  it('shows "Create Template" button if user has create_template permission', () => {
    // Override the hasPermission mock for this specific test
    (mockUseWorkspaceValues.hasPermission as ReturnType<typeof vi.fn>).mockImplementation((resource: string, action: string) => {
      return resource === 'templates' && action === 'create';
    });
    (useWorkspace as ReturnType<typeof vi.fn>).mockReturnValue(mockUseWorkspaceValues);


    render(<TemplatesPage />);

    expect(screen.getByRole('button', { name: /Create Template/i })).toBeInTheDocument();
  });

  it('hides "Create Template" button if user does not have create_template permission', () => {
    // Ensure hasPermission returns false for 'templates' 'create'
    (mockUseWorkspaceValues.hasPermission as ReturnType<typeof vi.fn>).mockImplementation((resource: string, action: string) => {
      if (resource === 'templates' && action === 'create') {
        return false;
      }
      return true; // For any other permission, if needed by the component
    });
    (useWorkspace as ReturnType<typeof vi.fn>).mockReturnValue(mockUseWorkspaceValues);

    render(<TemplatesPage />);

    expect(screen.queryByRole('button', { name: /Create Template/i })).not.toBeInTheDocument();
  });

  it('renders tabs for Global and User templates', () => {
    render(<TemplatesPage />);
    expect(screen.getByRole('tab', { name: /Global Templates/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /My Templates/i })).toBeInTheDocument(); // Or "Workspace Templates"
  });

  // Test for loading state (if workspace is null initially)
  it('shows loading state if workspace is not yet available', () => {
    (useWorkspace as ReturnType<typeof vi.fn>).mockReturnValue({ ...mockUseWorkspaceValues, workspace: null });
    render(<TemplatesPage />);
    expect(screen.getByText(/Loading workspace.../i)).toBeInTheDocument();
  });

});
