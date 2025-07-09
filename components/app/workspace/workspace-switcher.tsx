'use client';

import {
  ChevronDown,
  Plus,
  Settings,
  Users,
  Building,
  User,
  Crown,
  Shield,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { CreateWorkspaceDialog } from '@/components/app/workspace/workspace-creation-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu';
import type { WorkspaceWithRole } from '@/lib/types/workspace';
import { getWorkspaceUrl, getWorkspaceSettingsUrl, getMembersUrl } from '@/lib/urls/workspace-urls';

interface WorkspaceSwitcherProps {
  currentWorkspace: WorkspaceWithRole;
  availableWorkspaces?: WorkspaceWithRole[]; // Make optional
  onCreateWorkspace?: () => void;
  usage?: {
    workspaces: {
      used: number;
      limit: number;
      unlimited: boolean;
    };
    planLimits: any;
  };
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: User,
  viewer: Eye,
};

const roleColors = {
  owner: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  member: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function WorkspaceSwitcher({
  currentWorkspace,
  availableWorkspaces = [], // Add default empty array
  onCreateWorkspace,
  usage,
}: WorkspaceSwitcherProps) {
  const router = useRouter();

  const handleWorkspaceSwitch = (workspaceSlug: string) => {
    // Use new subdomain-based workspace URLs
    const url = getWorkspaceUrl(workspaceSlug);
    router.push(url);
  };

  const getWorkspaceInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const RoleIcon = roleIcons[currentWorkspace.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-full justify-between h-auto p-3'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={currentWorkspace.avatarUrl || undefined}
                alt={currentWorkspace.name}
              />
              <AvatarFallback className='text-xs'>
                {getWorkspaceInitials(currentWorkspace.name)}
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col items-start'>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-sm'>{currentWorkspace.name}</span>
                {currentWorkspace.type === 'default' && (
                  <User className='h-3 w-3 text-muted-foreground' />
                )}
                {currentWorkspace.type === 'team' && (
                  <Building className='h-3 w-3 text-muted-foreground' />
                )}
              </div>

              <Badge
                variant='outline'
                className={`text-xs h-5 ${roleColors[currentWorkspace.role]}`}
              >
                <RoleIcon className='h-3 w-3 mr-1' />
                {currentWorkspace.role}
              </Badge>
            </div>
          </div>

          <ChevronDown className='h-4 w-4 shrink-0' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-64' align='start'>
        <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {availableWorkspaces.map(workspace => {
          const WorkspaceRoleIcon = roleIcons[workspace.role];
          const isCurrentWorkspace = workspace.id === currentWorkspace.id;

          return (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => !isCurrentWorkspace && handleWorkspaceSwitch(workspace.slug)}
              className={`flex items-center gap-3 p-3 ${isCurrentWorkspace ? 'bg-accent' : ''}`}
            >
              <Avatar className='h-8 w-8'>
                <AvatarImage src={workspace.avatarUrl || undefined} alt={workspace.name} />
                <AvatarFallback className='text-xs'>
                  {getWorkspaceInitials(workspace.name)}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col flex-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-sm'>{workspace.name}</span>
                  {workspace.type === 'default' && (
                    <User className='h-3 w-3 text-muted-foreground' />
                  )}
                  {workspace.type === 'team' && (
                    <Building className='h-3 w-3 text-muted-foreground' />
                  )}
                </div>

                <Badge
                  variant='outline'
                  className={`text-xs h-5 w-fit ${roleColors[workspace.role]}`}
                >
                  <WorkspaceRoleIcon className='h-3 w-3 mr-1' />
                  {workspace.role}
                </Badge>
              </div>

              {isCurrentWorkspace && <div className='h-2 w-2 bg-primary rounded-full' />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <CreateWorkspaceDialog
          usage={usage}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Plus className='h-4 w-4 mr-2' />
              Create Workspace
              {usage && !usage.workspaces.unlimited && (
                <Badge variant='outline' className='ml-auto text-xs'>
                  {usage.workspaces.used}/{usage.workspaces.limit}
                </Badge>
              )}
            </DropdownMenuItem>
          }
          onSuccess={_workspace => {
            onCreateWorkspace?.();
            // Workspace will auto-redirect via the dialog
          }}
        />

        <DropdownMenuItem
          onClick={() => {
            const url = getWorkspaceSettingsUrl(currentWorkspace.slug);
            router.push(url);
          }}
        >
          <Settings className='h-4 w-4 mr-2' />
          Workspace Settings
        </DropdownMenuItem>

        {(currentWorkspace.role === 'owner' || currentWorkspace.role === 'admin') && (
          <DropdownMenuItem
            onClick={() => {
              const url = getMembersUrl(currentWorkspace.slug);
              router.push(url);
            }}
          >
            <Users className='h-4 w-4 mr-2' />
            Manage Members
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
