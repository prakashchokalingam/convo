'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, ReactNode } from 'react';

import { useAppStore } from '@/lib/store/appStore';

interface AppStoreInitializerProps {
  children: ReactNode;
}

export default function AppStoreInitializer({ children }: AppStoreInitializerProps) {
  const { loadBootstrapData, isInitialized, isLoading, clearStore } = useAppStore();

  let isSignedIn = false;
  let isClerkLoaded = false;

  try {
    // Attempt to use auth, but catch error if context is not found (e.g., in certain E2E server environments)
    const auth = useAuth();
    isSignedIn = auth.isSignedIn;
    isClerkLoaded = auth.isLoaded;
  } catch (error) {
    console.warn(
      'AppStoreInitializer: useAuth() failed, possibly due to missing Clerk context in test environment. Defaulting to unauthenticated state.',
      error
    );
    // Default to isClerkLoaded = true, isSignedIn = false to allow app to render.
    // This is a workaround for E2E test server issues.
    isClerkLoaded = true;
    isSignedIn = false;
  }

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
        if (isInitialized) {
          // Clear store only if it was previously initialized
          console.log(
            'AppStoreInitializer: User signed out or auth context issue, clearing store.'
          );
          clearStore();
        }
      }
    }
  }, [isSignedIn, isClerkLoaded, isInitialized, isLoading, loadBootstrapData, clearStore]);

  // Show global loading indicator if:
  // 1. Clerk auth state is not yet known (and no error occurred) OR
  // 2. User is signed in, store is loading initial data, and store is not yet initialized.
  // The try-catch above sets isClerkLoaded to true in case of error, so this condition might change.
  // If an error occurred in useAuth, isClerkLoaded is true, isSignedIn is false.
  // So, this condition becomes: if (false || (false && isLoading && !isInitialized)) which is false.
  // This means the loading UI won't show if useAuth fails, and it will proceed to render children.
  if (!isClerkLoaded || (isSignedIn && isLoading && !isInitialized)) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          backgroundColor: '#f8f9fa', // A light background color
        }}
      >
        {/* You can replace this with a more sophisticated spinner/loader component */}
        Loading application data...
      </div>
    );
  }

  return <>{children}</>;
}
