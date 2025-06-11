import { getSubdomainContext } from '@/lib/subdomain';
import { LandingPage } from '@/components/marketing/landing-page';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Verify this is marketing context
  const context = getSubdomainContext();
  
  if (context === 'app') {
    // This shouldn't happen - app context should go to workspace routes
    redirect('/');
  }
  
  if (context === 'form') {
    // This shouldn't happen - form context should go to form routes  
    redirect('/');
  }

  // Show marketing landing page
  return <LandingPage />;
}

export function generateMetadata() {
  return {
    title: 'ConvoForms - Build AI-Powered Conversational Forms',
    description: 'Create engaging conversational forms that increase completion rates by 40-60%. Transform boring surveys into engaging conversations.',
  };
}
