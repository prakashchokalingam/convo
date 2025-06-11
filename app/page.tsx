import { redirect } from 'next/navigation';

/**
 * Root page - redirects to marketing
 * 
 * This ensures that visiting the root of the app (/) 
 * redirects users to the marketing site (/marketing).
 * 
 * In production, convo.ai will rewrite to /marketing automatically,
 * but this redirect ensures consistency across environments.
 */
export default function RootPage() {
  redirect('/marketing');
}
