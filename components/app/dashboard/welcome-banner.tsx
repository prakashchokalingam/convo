'use client';

import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/shared/ui/button';
import type { WorkspaceWithRole } from '@/lib/types/workspace';
import { getFormsUrl } from '@/lib/urls/workspace-urls';

interface WelcomeBannerProps {
  workspace: WorkspaceWithRole;
}

export function WelcomeBanner({ workspace }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {return null;}

  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-0 right-0 -mt-4 -mr-4 opacity-20'>
        <Sparkles className='h-24 w-24' />
      </div>

      {/* Close button */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute top-2 right-2 text-white hover:bg-white/20'
        onClick={() => setIsVisible(false)}
      >
        <X className='h-4 w-4' />
      </Button>

      {/* Content */}
      <div className='relative'>
        <h2 className='text-2xl font-bold mb-2'>Welcome to {workspace.name}! &#x1F389;</h2>
        <p className='text-blue-100 mb-4 max-w-2xl'>
          You&apos;re all set! Your workspace is ready for creating amazing conversational forms. Start
          by building your first form or explore the features.
        </p>

        <div className='flex gap-3'>
          <Button
            variant='secondary'
            size='sm'
            className='bg-white text-blue-600 hover:bg-blue-50'
            asChild
          >
            <Link href={getFormsUrl(workspace.slug, '/new')}>Create Your First Form</Link>
          </Button>
          <Button variant='ghost' size='sm' className='text-white border-white hover:bg-white/20'>
            Take a Tour
          </Button>
        </div>
      </div>
    </div>
  );
}
