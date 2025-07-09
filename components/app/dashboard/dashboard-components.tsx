import { formatDistanceToNow } from 'date-fns';
import { Plus, BarChart3, Eye, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import React, { memo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getFormsUrl, getWorkspaceUrl } from '@/lib/urls/workspace-urls';


interface QuickActionsProps {
  workspace: { slug: string };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Memoized StatCard component for better performance
const StatCard = memo(({ title, value, icon: Icon, trend }: StatCardProps) => {
  return (
    <Card className='hover:shadow-md transition-all duration-200'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>{title}</p>
            <div className='flex items-baseline space-x-2'>
              <p className='text-2xl font-bold tracking-tight'>{value}</p>
              {trend && (
                <span
                  className={`text-xs font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className='p-3 bg-primary/10 rounded-lg' aria-hidden='true'>
            <Icon className='h-5 w-5 text-primary' aria-hidden='true' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

// Memoized QuickActions component
export const QuickActions = memo(({ workspace }: QuickActionsProps) => {
  const actions = [
    {
      title: 'Create Form',
      description: 'Start building a new conversational form',
      icon: Plus,
      href: getFormsUrl(workspace.slug, '/new'),
      variant: 'default' as const,
    },
    {
      title: 'View Responses',
      description: 'Check latest form submissions',
      icon: Eye,
      href: getWorkspaceUrl(workspace.slug, '/responses'),
      variant: 'outline' as const,
    },
    {
      title: 'Analytics',
      description: 'Track form performance',
      icon: BarChart3,
      href: getWorkspaceUrl(workspace.slug, '/analytics'),
      variant: 'outline' as const,
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {actions.map(action => {
        const Icon = action.icon;
        return (
          <Card key={action.title} className='hover:shadow-lg transition-all duration-200 group'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3'>
                <div
                  className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'
                  aria-hidden='true'
                >
                  <Icon className='h-5 w-5 text-primary' aria-hidden='true' />
                </div>
                <CardTitle className='text-lg'>{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sm text-muted-foreground leading-relaxed'>{action.description}</p>
              <Button variant={action.variant} size='sm' className='w-full' asChild>
                <Link href={action.href}>Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

// Memoized DashboardStats component
export const DashboardStats = memo(({ workspaceId: _workspaceId }: { workspaceId: string }) => {
  const stats = [
    {
      title: 'Total Forms',
      value: 0,
      icon: FileText,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Responses',
      value: 0,
      icon: MessageSquare,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Completion Rate',
      value: '0%',
      icon: TrendingUp,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Active Forms',
      value: 0,
      icon: Eye,
      trend: { value: 0, isPositive: true },
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {stats.map(stat => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
});

DashboardStats.displayName = 'DashboardStats';

// Memoized RecentForms component
export const RecentForms = memo(({ workspaceId }: { workspaceId: string }) => {
  // Mock data for demonstration - replace with actual data fetching
  const recentForms: { id: string; name: string; updatedAt: Date; status: 'published' | 'draft' }[] = [];

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>Recent Forms</CardTitle>
          <Badge variant='secondary' className='text-xs'>
            {recentForms.length}
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='p-0'>
        {recentForms.length === 0 ? (
          <div className='text-center py-12 px-6'>
            <div
              className='mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4'
              aria-hidden='true'
            >
              <FileText className='h-6 w-6 text-muted-foreground' aria-hidden='true' />
            </div>
            <h4 className='text-sm font-medium text-foreground mb-2'>No forms yet</h4>
            <p className='text-sm text-muted-foreground mb-4'>
              Create your first form to get started
            </p>
            <Button variant='outline' size='sm' asChild>
              <Link href={getFormsUrl(workspaceId, '/new')}>Create Form</Link>
            </Button>
          </div>
        ) : (
          <div className='divide-y'>
            {recentForms.map((form, index: number) => (
              <div key={form.id || index} className='p-4 hover:bg-muted/50 transition-colors'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <h4 className='text-sm font-medium'>{form.name}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(form.updatedAt, { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={form.status === 'published' ? 'default' : 'secondary'}>
                    {form.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RecentForms.displayName = 'RecentForms';
