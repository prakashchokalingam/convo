"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shared/ui/dialog';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Plus } from 'lucide-react';

interface CreateWorkspaceDialogProps {
  trigger?: React.ReactNode;
  usage?: {
    workspaces: {
      used: number;
      limit: number;
      unlimited: boolean;
    };
    planLimits: any;
  };
  onSuccess?: (workspace: any) => void;
}

export function CreateWorkspaceDialog({ 
  trigger, 
  usage, 
  onSuccess 
}: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const canCreateWorkspace = usage?.workspaces.unlimited || 
    (usage && usage.workspaces.used < usage.workspaces.limit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !canCreateWorkspace) return;

    setLoading(true);
    try {
      // TODO: Implement workspace creation API call
      const newWorkspace = {
        id: Date.now().toString(),
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        type: 'team' as const,
      };
      
      setOpen(false);
      setName('');
      onSuccess?.(newWorkspace);
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" disabled={!canCreateWorkspace}>
      <Plus className="h-4 w-4 mr-2" />
      Create Workspace
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your forms and collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              placeholder="My Workspace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || !canCreateWorkspace}>
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
