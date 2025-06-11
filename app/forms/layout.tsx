import { ReactNode } from 'react';

/**
 * Forms Layout
 * 
 * This layout applies to all public form pages (/forms/*).
 * No authentication required - forms are public by design.
 * 
 * Context verification is now handled by the path structure itself:
 * - All files in app/forms/* are automatically forms context
 * - Optimized for form submission UX
 */

interface FormsLayoutProps {
  children: ReactNode;
}

export default function FormsLayout({ children }: FormsLayoutProps) {
  // Forms layout - clean, minimal design for optimal conversion
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
