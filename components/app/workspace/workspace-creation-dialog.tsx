'use client';

import { Plus, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workspace } from '@/lib/db/schema';
import { PlanLimits } from '@/lib/plans';

interface CreateWorkspaceDialogProps {
  trigger?: React.ReactNode;
  usage?: {
    workspaces: {
      used: number;
      limit: number;
      unlimited: boolean;
    };
    planLimits: PlanLimits;
  };
  onSuccess?: (workspace: Workspace) => void;
}

export function CreateWorkspaceDialog({ trigger, usage, onSuccess }: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canCreateWorkspace =
    usage?.workspaces.unlimited || (usage && usage.workspaces.used < usage.workspaces.limit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !canCreateWorkspace) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement workspace creation API call
      const newWorkspace: Workspace = {
        id: Date.now().toString(),
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        type: 'team' as const,
        ownerId: '', // Will be populated by API
        description: null,
        avatarUrl: null,
        settings: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setOpen(false);
      setName('');
      setError('');
      onSuccess?.(newWorkspace);
    } catch (error) {
      console.error('Failed to create workspace:', error);
      setError('Failed to create workspace. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!loading) {
      setOpen(isOpen);
      if (!isOpen) {
        setName('');
        setError('');
      }
    }
  };

  const defaultTrigger = (
    <Button
      variant='outline'
      size='sm'
      disabled={!canCreateWorkspace}
      className='hover:bg-primary/5 transition-colors'
    >
      <Plus className='h-4 w-4 mr-2' />
      Create Workspace
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader className='text-left'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <Sparkles className='h-5 w-5 text-primary' />
            </div>
            <DialogTitle className='text-xl'>Create New Workspace</DialogTitle>
          </div>
          <DialogDescription className='text-base leading-relaxed'>
            Create a new workspace to organize your forms and collaborate with your team.
            You&apos;ll be able to invite members and manage permissions.
          </DialogDescription>
        </DialogHeader>

        {/* Usage Information */}
        {usage && !usage.workspaces.unlimited && (
          <Card className='bg-muted/50'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Workspace Usage</p>
                  <p className='text-xs text-muted-foreground'>
                    {usage.workspaces.used} of {usage.workspaces.limit} workspaces used
                  </p>
                </div>
                <Badge variant={canCreateWorkspace ? 'default' : 'destructive'} className='text-xs'>
                  {canCreateWorkspace ? 'Available' : 'Limit Reached'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-sm font-medium'>
              Workspace Name
            </Label>
            <Input
              id='name'
              placeholder='e.g., Marketing Team, HR Department'
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={loading || !canCreateWorkspace}
              required
              className='text-base'
            />
            <p className='text-xs text-muted-foreground'>
              This will be used to identify your workspace and can be changed later.
            </p>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!canCreateWorkspace && (
            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                You&apos;ve reached your plan&apos;s workspace limit.
                <Button variant='link' className='h-auto p-0 ml-1' asChild>
                  <a href='/billing'>Upgrade your plan</a>
                </Button>{' '}
                to create more workspaces.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className='gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={loading || !name.trim() || !canCreateWorkspace}
              className='min-w-[120px]'
            >
              {loading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
