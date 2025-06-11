import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserDefaultWorkspace } from '@/lib/workspace';

/**
 * App Root Page - /app
 * 
 * This page handles the root app context routing.
 * - If user is not authenticated → redirect to login
 * - If user is authenticated → redirect to their default workspace or onboarding
 */
export default async function AppPage() {
  const { userId } = auth();
  
  // If not authenticated, redirect to login
  if (!userId) {
    redirect('/app/login');
  }
  
  // If authenticated, try to get their default workspace
  const defaultWorkspace = await getUserDefaultWorkspace();
  
  if (defaultWorkspace) {
    // User has a default workspace, redirect to it
    redirect(`/app/${defaultWorkspace.slug}`);
  } else {
    // User doesn't have a workspace, redirect to onboarding
    redirect('/app/onboarding');
  }
}
