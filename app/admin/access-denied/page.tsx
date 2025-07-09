import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button'; // Assuming shadcn button path

export default function AccessDeniedPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background text-center px-4'>
      <div className='bg-card p-8 rounded-lg shadow-lg'>
        <h1 className='text-4xl font-bold text-destructive mb-4'>Access Denied</h1>
        <p className='text-muted-foreground mb-6'>
          You do not have the necessary permissions to access the admin dashboard.
        </p>
        <p className='text-sm text-muted-foreground mb-8'>
          If you believe this is an error, please contact your system administrator or ensure your
          email is listed in the `ADMIN_EMAILS` configuration.
        </p>
        <Button asChild>
          <Link href='/app'>Go to App Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
