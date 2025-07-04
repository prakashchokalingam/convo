import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getCurrentWorkspace } from '@/lib/workspace-server';
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
  // Require authentication for workspace access
  const { userId } = auth();
  if (!userId) {
    redirect('/app/login');
  }

  // Get and validate workspace access
  const workspace = await getCurrentWorkspace(params.workspaceSlug);

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <AppHeader workspace={workspace} />
      
      <div className="flex">
        {/* Sidebar */}
        <AppSidebar workspace={workspace} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
