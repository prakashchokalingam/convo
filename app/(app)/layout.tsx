import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getSubdomainContext } from '@/lib/subdomain';
import AppStoreInitializer from '@/components/shared/AppStoreInitializer';

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  // Verify this is app context
  const context = getSubdomainContext();
  if (context !== 'app') {
    redirect('/');
  }

  // This layout applies to all app routes
  // Authentication checking will be done at the page level
  // since we need to allow access to login/signup pages

  return <AppStoreInitializer>{children}</AppStoreInitializer>;
}
