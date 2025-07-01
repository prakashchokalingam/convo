import { ReactNode } from 'react';
import AppStoreInitializer from '@/components/shared/AppStoreInitializer';

/**
 * App Layout
 * 
 * This layout applies to all app routes (/app/*).
 * Context verification is now handled by the path structure itself:
 * - All files in app/app/* are automatically app context
 * - Authentication is handled by individual pages as needed
 * - Login/signup pages are public, workspace pages require auth
 */

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  // App layout - context is guaranteed by path structure
  // Authentication handled at page level for flexibility
  return <AppStoreInitializer>{children}</AppStoreInitializer>;
}
