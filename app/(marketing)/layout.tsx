import { getSubdomainContext } from '@/lib/subdomain';
import { redirect } from 'next/navigation';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify this is marketing context
  const context = getSubdomainContext();
  
  if (context === 'app') {
    // This shouldn't happen - app context should go to workspace routes
    redirect('/');
  }
  
  if (context === 'forms') {
    // This shouldn't happen - forms context should go to form routes  
    redirect('/');
  }

  // For marketing context, render children directly
  return <>{children}</>;
}
