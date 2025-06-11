import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getCurrentWorkspace } from '@/lib/workspace';
import { getSubdomainContext } from '@/lib/subdomain';
import { AppHeader } from '@/components/app/dashboard/app-header';
import { AppSidebar } from '@/components/app/dashboard/app-sidebar';

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: {
    workspaceSlug: string;
  };
}

export default async function WorkspaceLayout({ 
  children, 
  params 
}: WorkspaceLayoutProps) {
  // Verify this is app context
  const context = getSubdomainContext();
  if (context !== 'app') {
    redirect('/');
  }

  // Require authentication for app context
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // Get and validate workspace access
  const workspace = await getCurrentWorkspace(params.workspaceSlug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <AppHeader workspace={workspace} />
      
      <div className="flex">
        {/* Sidebar */}
        <AppSidebar workspace={workspace} />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
