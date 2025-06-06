"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { NavBar } from "@/components/app/navbar";
import { Sidebar } from "@/components/app/sidebar";
import { Loader2 } from "lucide-react";

// Auth wrapper component
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if this is an auth route
  const isAuthRoute = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  useEffect(() => {
    if (isLoaded && !userId && !isAuthRoute) {
      const currentUrl = window.location.href;
      const redirectUrl = encodeURIComponent(currentUrl);
      router.push(`/sign-in?redirect_url=${redirectUrl}`);
    }
  }, [isLoaded, userId, router, isAuthRoute]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // For auth routes, don't show sidebar/navbar
  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar for app */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="md:pl-72 flex flex-col w-full">
        <NavBar />
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </ClerkProvider>
  );
}