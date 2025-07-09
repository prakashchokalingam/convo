'use client';

import { Loader2, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { getWorkspaceUrl } from '@/lib/urls/workspace-urls';

interface AnimationStage {
  id: string;
  text: string;
  duration: number;
  icon: React.ReactNode;
}

const animationStages: AnimationStage[] = [
  {
    id: 'welcome',
    text: 'Welcome to Convo!',
    duration: 800,
    icon: <Sparkles className='h-6 w-6 text-blue-500' />,
  },
  {
    id: 'creating',
    text: 'Setting up your workspace...',
    duration: 2500,
    icon: <Loader2 className='h-6 w-6 text-blue-500 animate-spin' />,
  },
  {
    id: 'finalizing',
    text: 'Almost ready...',
    duration: 1200,
    icon: <Loader2 className='h-6 w-6 text-green-500 animate-spin' />,
  },
  {
    id: 'redirecting',
    text: 'Taking you to your dashboard...',
    duration: 600,
    icon: <ArrowRight className='h-6 w-6 text-green-500' />,
  },
];

export function AnimatedWorkspaceCreation() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  const currentStage = animationStages[currentStageIndex];

  useEffect(() => {
    async function createWorkspaceAndProgress() {
      try {
        // Start the animation sequence
        for (let i = 0; i < animationStages.length; i++) {
          setCurrentStageIndex(i);

          // Call API during the 'creating' stage
          if (animationStages[i].id === 'creating') {
            // Wait a bit before making the API call for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = await fetch('/api/workspace/onboard', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to create workspace');
            }

            const result = await response.json();

            // Continue with remaining animation time
            const remainingTime = animationStages[i].duration - 800;
            if (remainingTime > 0) {
              await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            // Store result for redirect
            sessionStorage.setItem('newWorkspace', JSON.stringify(result.data));
          } else {
            // Normal stage timing
            await new Promise(resolve => setTimeout(resolve, animationStages[i].duration));
          }
        }

        // Animation complete, redirect to workspace
        setIsComplete(true);

        const workspaceData = sessionStorage.getItem('newWorkspace');
        if (workspaceData) {
          const { workspaceSlug } = JSON.parse(workspaceData);
          sessionStorage.removeItem('newWorkspace');

          // Redirect with welcome parameter for new workspace
          const workspaceUrl = getWorkspaceUrl(workspaceSlug, '?welcome=true');
          router.push(workspaceUrl);
        } else {
          throw new Error('Workspace data not found');
        }
      } catch (error) {
        console.error('Workspace creation error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    }

    createWorkspaceAndProgress();
  }, [router]);

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full'>
          <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
            <div className='w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='h-8 w-8 text-red-500' />
            </div>

            <h1 className='text-xl font-semibold text-gray-900 mb-4'>Oops! Something went wrong</h1>

            <p className='text-gray-600 mb-6'>{error}</p>

            <div className='space-y-3'>
              <button
                onClick={() => window.location.reload()}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
              >
                Try Again
              </button>

              <button
                onClick={() => router.push('/login')}
                className='w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors'
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
          {/* Logo/Icon Area */}
          <div className='w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center'>
            {currentStage.icon}
          </div>

          {/* Main Message */}
          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>{currentStage.text}</h1>

          {/* Stage Description */}
          <p className='text-gray-600 mb-8'>
            {currentStage.id === 'welcome' && "We're excited to have you aboard!"}
            {currentStage.id === 'creating' &&
              'Creating your default workspace with AI-powered forms...'}
            {currentStage.id === 'finalizing' && 'Configuring your dashboard and settings...'}
            {currentStage.id === 'redirecting' && "Everything is ready! Let's get started."}
          </p>

          {/* Progress Bar */}
          <div className='w-full bg-gray-200 rounded-full h-2 mb-4'>
            <div
              className='bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out'
              style={{
                width: `${((currentStageIndex + 1) / animationStages.length) * 100}%`,
              }}
            />
          </div>

          {/* Progress Text */}
          <p className='text-sm text-gray-500'>
            Step {currentStageIndex + 1} of {animationStages.length}
          </p>

          {/* Completion State */}
          {isComplete && (
            <div className='mt-4 p-3 bg-green-50 rounded-lg'>
              <p className='text-green-800 text-sm font-medium'>
                ✨ Workspace created successfully! Redirecting...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-500'>This will only take a moment...</p>
        </div>
      </div>
    </div>
  );
}
