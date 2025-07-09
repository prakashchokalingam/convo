'use client'; // This page will fetch data client-side

import { Terminal } from 'lucide-react'; // For Alert icon
import React, { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStats {
  totalUsers: number;
  totalWorkspaces: number;
  activeSubscriptions: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        const data: AdminStats = await response.json();
        setStats(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Admin Overview</h1>

      {isLoading && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Loading...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-8 bg-muted rounded animate-pulse'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant='destructive' className='mb-6'>
          <Terminal className='h-4 w-4' />
          <AlertTitle>Error Fetching Stats</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && stats && (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total Users
              </CardTitle>
              {/* You can add an icon here if you like, e.g., Users icon from lucide-react */}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalUsers}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total Workspaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalWorkspaces}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
