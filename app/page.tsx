import { getSubdomainContext } from '@/lib/subdomain';
import { LandingPage } from '@/components/marketing/landing-page';

export default function RootPage() {
  // For now, just render the original landing page
  // The route group system will handle context routing
  return <LandingPage />;
}

export function generateMetadata() {
  return {
    title: 'Convo - Build AI-Powered Conversational Forms',
    description: 'Create engaging conversational forms that increase completion rates by 40-60%. Transform boring surveys into engaging conversations.',
  };
}
