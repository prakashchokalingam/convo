import React from 'react';
import { ClerkProvider, currentUser, auth } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Inter } from "next/font/google";

// Components (assuming similar structure to root layout or app layout)
// We might need a specific AdminHeader or AdminSidebar later.
// For now, simple navigation.

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

// Function to check if the current user is an authorized admin
async function isAuthorizedAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) {
    return false;
  }

  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  if (!adminEmailsEnv) {
    console.warn("ADMIN_EMAILS environment variable is not set.");
    return false; // No admins configured, so no one is an admin
  }

  const allowedAdminEmails = adminEmailsEnv.split(',').map(email => email.trim().toLowerCase());
  const userEmails = user.emailAddresses.map(emailObj => emailObj.emailAddress.toLowerCase());

  return userEmails.some(email => allowedAdminEmails.includes(email));
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    redirect('/app/login?redirect=/admin'); // Redirect to your app's login page
  }

  const isAuthorized = await isAuthorizedAdmin();
  if (!isAuthorized) {
    // It's better to redirect to a dedicated access denied page
    // For now, redirecting to a simple page, will create app/(admin)/admin/access-denied/page.tsx next
    redirect('/admin/access-denied');
  }

  return (
    <ClerkProvider> {/* Ensure Clerk context is available if not inherited from a higher layout */}
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body className={`${inter.className} antialiased bg-muted/40`}>
          <div className="flex min-h-screen w-full">
            <aside className="w-64 bg-background border-r p-4">
              <nav className="flex flex-col space-y-2">
                <h2 className="text-lg font-semibold mb-4">Admin Dashboard</h2>
                <Link href="/admin/workspaces" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Workspaces
                </Link>
                {/* Add more admin navigation links here */}
              </nav>
            </aside>
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
