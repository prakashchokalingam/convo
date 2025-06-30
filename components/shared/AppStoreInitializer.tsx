'use client';

import { useEffect, ReactNode } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import { useAuth } from '@clerk/nextjs';

interface AppStoreInitializerProps {
  children: ReactNode;
}

export default function AppStoreInitializer({ children }: AppStoreInitializerProps) {
  const { loadBootstrapData, isInitialized, isLoading, clearStore } = useAppStore();
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth(); // Renamed to avoid conflict with store's isLoading

  useEffect(() => {
    if (isClerkLoaded) {
      if (isSignedIn) {
        // Only load if not already initialized and not currently loading
        if (!isInitialized && !isLoading) {
          console.log('AppStoreInitializer: User signed in, loading bootstrap data.');
          loadBootstrapData();
        }
      } else {
        // User is not signed in
        if (isInitialized) { // Clear store only if it was previously initialized
          console.log('AppStoreInitializer: User signed out, clearing store.');
          clearStore();
        }
      }
    }
  }, [isSignedIn, isClerkLoaded, isInitialized, isLoading, loadBootstrapData, clearStore]);

  // Show global loading indicator if:
  // 1. Clerk auth state is not yet known OR
  // 2. User is signed in, store is loading initial data, and store is not yet initialized.
  if (!isClerkLoaded || (isSignedIn && isLoading && !isInitialized)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        backgroundColor: '#f8f9fa' // A light background color
      }}>
        {/* You can replace this with a more sophisticated spinner/loader component */}
        Loading application data...
      </div>
    );
  }

  return <>{children}</>;
}
