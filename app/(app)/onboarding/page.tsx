import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getCurrentUserWorkspaces } from '@/lib/workspace-server';
import { AnimatedWorkspaceCreation } from '@/components/app/onboarding/animated-workspace-creation';

export default async function OnboardingPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/login');
  }

  // Check if user already has workspaces
  try {
    const workspaces = await getCurrentUserWorkspaces();
    if (workspaces.length > 0) {
      // User has existing workspace - redirect WITHOUT welcome parameter
      const primaryWorkspace = workspaces.find(w => w.type === 'default') || workspaces[0];
      const workspaceUrl = `/${primaryWorkspace.slug}/dashboard`;
      console.log('🏠 User has existing workspace, redirecting to:', workspaceUrl);
      redirect(workspaceUrl);
    }
  } catch (error) {
    console.error('Error checking workspaces:', error);
    // Continue with automatic workspace creation if there's an error
  }

  // No workspaces found - show animated automatic creation
  console.log('📝 No workspaces found, starting automatic workspace creation');

  return <AnimatedWorkspaceCreation />;
}
