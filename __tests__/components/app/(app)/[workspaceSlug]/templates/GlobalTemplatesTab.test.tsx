import React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalTemplatesTab } from '@/app/(app)/[workspaceSlug]/templates/GlobalTemplatesTab'; // Adjust path
import { Template } from '@/lib/db/schema'; // For mock data type

// Mock TemplateGrid and other sub-components if they are complex and not the focus
// For now, assume TemplateGrid renders items that we can query.
// If TemplateCard is a direct child of TemplateGrid and actions are on TemplateCard,
// then the queries will need to reflect that structure.

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock API calls (fetch)
global.fetch = vi.fn();

const mockGlobalTemplates: Template[] = [
  {
    id: 'global-tpl-1',
    name: 'Global Marketing Template',
    description: 'A great marketing template.',
    formSchema: {},
    category: 'MARKETING',
    isGlobal: true,
    workspaceId: null, // Global templates might have null workspaceId
    createdBy: 'system',
    usageCount: 100,
    cloneCount: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnailUrl: null,
    originalTemplateId: null,
  },
  // Add more mock global templates if needed
];

describe('GlobalTemplatesTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ templates: mockGlobalTemplates, pagination: {} }),
    });
  });

  const defaultProps = {
    workspaceId: 'ws-123',
    userRole: 'member', // userRole might not be directly used for permissions if canCreateTemplates covers it
    canCreateTemplates: true, // This prop is key
  };

  it('renders global templates and shows "Clone" and "Create Form" actions if user has create_template permission', async () => {
    await act(async () => {
      render(<GlobalTemplatesTab {...defaultProps} canCreateTemplates={true} />);
    });

    // Wait for templates to load (due to async fetch)
    expect(await screen.findByText(mockGlobalTemplates[0].name)).toBeInTheDocument();

    // Assuming TemplateCard or similar renders actions within an article or listitem role per template
    const templateCards = screen.getAllByRole('article'); // Or 'listitem' or a custom data-testid
    expect(templateCards.length).toBeGreaterThan(0);

    const firstCard = templateCards[0];

    // These queries depend heavily on how actions are rendered in TemplateCard
    // Using generic text match for now. Better to use specific roles or testids.
    expect(within(firstCard).getByRole('button', { name: /Clone/i })).toBeInTheDocument();
    // "Create Form" might be a button or link. Let's assume button for now.
    expect(within(firstCard).getByRole('button', { name: /Create Form/i })).toBeInTheDocument();

    // Edit and Delete should not be present for global templates
    expect(within(firstCard).queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
    expect(within(firstCard).queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
  });

  it('hides "Clone" action if user does not have create_template permission, but shows "Create Form"', async () => {
    await act(async () => {
      render(<GlobalTemplatesTab {...defaultProps} canCreateTemplates={false} />);
    });

    expect(await screen.findByText(mockGlobalTemplates[0].name)).toBeInTheDocument();
    const templateCards = screen.getAllByRole('article');
    const firstCard = templateCards[0];

    expect(within(firstCard).queryByRole('button', { name: /Clone/i })).not.toBeInTheDocument();
    expect(within(firstCard).getByRole('button', { name: /Create Form/i })).toBeInTheDocument(); // Assuming Create Form is always available for global
  });

  it('shows loading state initially', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => new Promise(() => {})); // Simulate pending promise
    render(<GlobalTemplatesTab {...defaultProps} />);
    expect(screen.getByText(/Loading global templates.../i)).toBeInTheDocument();
  });

  it('shows error state if fetching templates fails', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('API Error'));
    await act(async () => {
      render(<GlobalTemplatesTab {...defaultProps} />);
    });
    expect(await screen.findByText(/Failed to load global templates/i)).toBeInTheDocument();
  });
});
