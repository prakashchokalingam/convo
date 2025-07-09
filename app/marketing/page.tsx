import { LandingPage } from '@/components/marketing/landing-page';

/**
 * Marketing Landing Page - /marketing
 *
 * Main marketing site page. No authentication required.
 * Context is guaranteed by path structure (/marketing/*)
 */
export default async function HomePage() {
  // Show marketing landing page
  return <LandingPage />;
}

export function generateMetadata() {
  return {
    title: 'ConvoForms - Build AI-Powered Conversational Forms',
    description:
      'Create engaging conversational forms that increase completion rates by 40-60%. Transform boring surveys into engaging conversations.',
  };
}
