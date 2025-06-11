import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSubdomainContext } from '@/lib/subdomain';

interface FormsLayoutProps {
  children: ReactNode;
}

export default function FormsLayout({ children }: FormsLayoutProps) {
  // Verify this is forms context
  const context = getSubdomainContext();
  if (context !== 'forms') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
