'use client';

import { Building, Users, Crown, Zap, ArrowUp, AlertTriangle, Info, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/card';
import { Progress } from '@/components/shared/ui/progress';

interface PlanUsageData {
  workspaces: {
    used: number;
    limit: number;
    unlimited: boolean;
  };
  planLimits: {
    maxWorkspaces: number;
    maxSeatsPerWorkspace: number;
    canInviteUsers: boolean;
    addonSeatsAvailable: boolean;
  };
  subscription?: {
    plan: 'starter' | 'pro' | 'enterprise';
    status: string;
    addonSeats: number;
    addonPricePerSeat: number;
  };
}

interface WorkspaceUsageData {
  members: {
    used: number;
    limit: number;
    unlimited: boolean;
    addonSeats: number;
  };
  planLimits: {
    maxSeatsPerWorkspace: number;
    canInviteUsers: boolean;
    addonSeatsAvailable: boolean;
  };
}

const planNames = {
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const planColors = {
  starter: 'bg-gray-100 text-gray-800 border-gray-200',
  pro: 'bg-blue-100 text-blue-800 border-blue-200',
  enterprise: 'bg-purple-100 text-purple-800 border-purple-200',
};

interface PlanUsageDashboardProps {
  userId?: string;
  workspaceId?: string;
  className?: string;
  onUpgradeClick?: () => void;
}

export function PlanUsageDashboard({
  userId,
  workspaceId,
  className = '',
  onUpgradeClick,
}: PlanUsageDashboardProps) {
  const [workspaceUsage, setWorkspaceUsage] = useState<PlanUsageData | null>(null);
  const [memberUsage, setMemberUsage] = useState<WorkspaceUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const promises = [];

        // Fetch workspace usage (always)
        promises.push(fetch('/api/usage/workspaces').then(r => r.json()));

        // Fetch member usage if workspaceId provided
        if (workspaceId) {
          promises.push(
            fetch(`/api/usage/workspaces/by-id/${workspaceId}/members`).then(r => r.json())
          );
        }

        const results = await Promise.all(promises);

        if (results[0]?.success) {
          setWorkspaceUsage(results[0].data);
        }

        if (results[1]?.success) {
          setMemberUsage(results[1].data);
        }
      } catch (error) {
        console.error('Error fetching usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [userId, workspaceId]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className='p-6'>
            <div className='animate-pulse space-y-4'>
              <div className='h-4 bg-gray-200 rounded w-1/3'></div>
              <div className='h-2 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isNearLimit = (used: number, limit: number) => {
    return limit > 0 && used / limit >= 0.8;
  };

  const isAtLimit = (used: number, limit: number) => {
    return limit > 0 && used >= limit;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Plan Overview */}
      {workspaceUsage?.subscription && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Crown className='h-5 w-5' />
                <CardTitle className='text-lg'>Current Plan</CardTitle>
              </div>
              <Badge variant='outline' className={planColors[workspaceUsage.subscription.plan]}>
                {planNames[workspaceUsage.subscription.plan]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {workspaceUsage.subscription.plan === 'starter' && (
              <Alert>
                <Info className='h-4 w-4' />
                <AlertDescription>
                  You're on the Starter plan. Upgrade to Pro to invite team members and create more
                  workspaces.
                </AlertDescription>
              </Alert>
            )}
            {workspaceUsage.subscription.addonSeats > 0 && (
              <div className='mt-4'>
                <p className='text-sm text-gray-600'>
                  Additional seats: {workspaceUsage.subscription.addonSeats} × $
                  {(workspaceUsage.subscription.addonPricePerSeat / 100).toFixed(2)}/month
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Workspace Usage */}
      {workspaceUsage && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Building className='h-5 w-5' />
                <CardTitle className='text-lg'>Workspaces</CardTitle>
              </div>
              {!workspaceUsage.workspaces.unlimited && (
                <Badge
                  variant={
                    isAtLimit(workspaceUsage.workspaces.used, workspaceUsage.workspaces.limit)
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  {workspaceUsage.workspaces.used} / {workspaceUsage.workspaces.limit}
                </Badge>
              )}
            </div>
            <CardDescription>
              {workspaceUsage.workspaces.unlimited
                ? 'Unlimited workspaces'
                : `${workspaceUsage.workspaces.used} of ${workspaceUsage.workspaces.limit} workspaces used`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!workspaceUsage.workspaces.unlimited && (
              <div className='space-y-4'>
                <Progress
                  value={(workspaceUsage.workspaces.used / workspaceUsage.workspaces.limit) * 100}
                  className='w-full'
                />

                {isNearLimit(workspaceUsage.workspaces.used, workspaceUsage.workspaces.limit) && (
                  <Alert
                    variant={
                      isAtLimit(workspaceUsage.workspaces.used, workspaceUsage.workspaces.limit)
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    <AlertTriangle className='h-4 w-4' />
                    <AlertDescription>
                      {isAtLimit(workspaceUsage.workspaces.used, workspaceUsage.workspaces.limit)
                        ? "You've reached your workspace limit. Upgrade to create more workspaces."
                        : "You're approaching your workspace limit."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Member Usage (only shown if workspaceId provided) */}
      {memberUsage && workspaceId && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                <CardTitle className='text-lg'>Team Members</CardTitle>
              </div>
              {!memberUsage.members.unlimited && (
                <Badge
                  variant={
                    isAtLimit(memberUsage.members.used, memberUsage.members.limit)
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  {memberUsage.members.used} / {memberUsage.members.limit}
                </Badge>
              )}
            </div>
            <CardDescription>
              {memberUsage.members.unlimited
                ? 'Unlimited team members'
                : `${memberUsage.members.used} of ${memberUsage.members.limit} seats used`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!memberUsage.planLimits.canInviteUsers ? (
              <Alert>
                <Info className='h-4 w-4' />
                <AlertDescription>
                  Your current plan doesn't support team collaboration. Upgrade to Pro to invite
                  team members.
                </AlertDescription>
              </Alert>
            ) : (
              <div className='space-y-4'>
                {!memberUsage.members.unlimited && (
                  <Progress
                    value={(memberUsage.members.used / memberUsage.members.limit) * 100}
                    className='w-full'
                  />
                )}

                {memberUsage.members.addonSeats > 0 && (
                  <div className='text-sm text-gray-600'>
                    <Plus className='h-4 w-4 inline mr-1' />
                    {memberUsage.members.addonSeats} additional seats purchased
                  </div>
                )}

                {!memberUsage.members.unlimited &&
                  isNearLimit(memberUsage.members.used, memberUsage.members.limit) && (
                    <Alert
                      variant={
                        isAtLimit(memberUsage.members.used, memberUsage.members.limit)
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription>
                        {isAtLimit(memberUsage.members.used, memberUsage.members.limit)
                          ? "You've reached your seat limit. Upgrade your plan or purchase additional seats."
                          : "You're approaching your seat limit."}
                      </AlertDescription>
                    </Alert>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA */}
      {workspaceUsage?.subscription?.plan !== 'enterprise' && onUpgradeClick && (
        <Card className='border-blue-200 bg-blue-50'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Zap className='h-5 w-5 text-blue-600' />
              <CardTitle className='text-lg text-blue-900'>Need More?</CardTitle>
            </div>
            <CardDescription>
              Upgrade your plan to get more workspaces, team members, and advanced features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onUpgradeClick} className='w-full'>
              <ArrowUp className='h-4 w-4 mr-2' />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Compact version for smaller spaces
export function CompactPlanUsage({
  workspaceUsage,
  memberUsage,
  className = '',
}: {
  workspaceUsage?: PlanUsageData;
  memberUsage?: WorkspaceUsageData;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {workspaceUsage && (
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-600'>Workspaces</span>
          <Badge variant='outline' size='sm'>
            {workspaceUsage.workspaces.unlimited
              ? `${workspaceUsage.workspaces.used} / ∞`
              : `${workspaceUsage.workspaces.used} / ${workspaceUsage.workspaces.limit}`}
          </Badge>
        </div>
      )}

      {memberUsage && (
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-600'>Team Members</span>
          <Badge variant='outline' size='sm'>
            {memberUsage.members.unlimited
              ? `${memberUsage.members.used} / ∞`
              : `${memberUsage.members.used} / ${memberUsage.members.limit}`}
          </Badge>
        </div>
      )}
    </div>
  );
}
