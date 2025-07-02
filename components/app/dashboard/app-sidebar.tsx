'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  Users,
  Plus,
  Layout,
  ChevronDown,
  Building,
  User as UserIcon,
  Crown,
  Shield,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateWorkspaceDialog } from '@/components/app/workspace/workspace-creation-dialog';

// Import client-safe types and URL helpers
import type { WorkspaceWithRole } from '@/lib/types/workspace';
import { hasPermission } from '@/lib/types/workspace';
import { 
  getWorkspaceUrl, 
  getFormsUrl, 
  getMembersUrl, 
  getWorkspaceSettingsUrl,
  getTemplatesUrl
} from '@/lib/urls/workspace-urls';

interface AppSidebarProps {
  workspace: WorkspaceWithRole;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresRole?: 'owner' | 'admin' | 'member' | 'viewer';
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: UserIcon,
  viewer: Eye,
};

export function AppSidebar({ workspace }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [availableWorkspaces, setAvailableWorkspaces] = useState<WorkspaceWithRole[]>([]);
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always start with current workspace to prevent loading states
        setAvailableWorkspaces([workspace]);
        
        // Fetch all workspaces and usage data
        const [workspacesRes, usageRes] = await Promise.all([
          fetch('/api/workspaces'),
          fetch('/api/usage/workspaces')
        ]);

        const [workspacesData, usageData] = await Promise.all([
          workspacesRes.json(),
          usageRes.json()
        ]);

        if (workspacesData.success && Array.isArray(workspacesData.workspaces)) {
          setAvailableWorkspaces(workspacesData.workspaces);
        } else {
          // Fallback to current workspace only
          setAvailableWorkspaces([workspace]);
        }

        if (usageData.success) {
          setUsage(usageData.data);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
        // Fallback to current workspace only
        setAvailableWorkspaces([workspace]);
      }
    };

    if (workspace) {
      fetchData();
    }
  }, [workspace]);

  const handleWorkspaceSwitch = (workspaceSlug: string) => {
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

  const handleWorkspaceCreated = () => {
    // Refresh workspaces and usage data
    window.location.reload();
  };
  
  const navItems: NavItem[] = [
    {
      href: getWorkspaceUrl(workspace.slug),
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: getFormsUrl(workspace.slug),
      label: 'Forms',
      icon: FileText,
    },
    {
      href: getTemplatesUrl(workspace.slug),
      label: 'Templates',
      icon: Layout,
      requiresRole: 'member', // Templates require at least member role to view
    },
    {
      href: getWorkspaceUrl(workspace.slug, '/responses'),
      label: 'Responses',
      icon: BarChart3,
    },
    {
      href: getMembersUrl(workspace.slug),
      label: 'Members',
      icon: Users,
      requiresRole: 'admin',
    },
    {
      href: getWorkspaceSettingsUrl(workspace.slug),
      label: 'Settings',
      icon: Settings,
    },
  ];

  const canAccessItem = (item: NavItem) => {
    if (!item.requiresRole) return true;
    return hasPermission(workspace.role, item.requiresRole);
  };

  const dashboardBasePath = getWorkspaceUrl(workspace.slug);

  const isActiveLink = (href: string) => {
    const cleanCurrentPath = pathname.split('?')[0];
    const cleanHref = href.split('?')[0];

    if (cleanHref === dashboardBasePath) {
      // Exact match for the dashboard path
      return cleanCurrentPath === dashboardBasePath;
    }
    
    // For other pages, check if the current path starts with the link's href.
    return cleanCurrentPath.startsWith(cleanHref);
  };

  return (
    <aside className="w-64 border-r bg-muted/10 h-[calc(100vh-64px)]">
      <div className="flex h-full flex-col gap-2 p-4">
        {/* Navigation */}
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            if (!canAccessItem(item)) return null;
            
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);
            
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.label === 'Forms' && (
                    <Badge variant="secondary" className="ml-auto">
                      12
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Workspace Switcher */}
        <div className="mt-auto">
          <Separator className="mb-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between h-auto p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={workspace.avatarUrl || undefined} 
                      alt={workspace.name} 
                    />
                    <AvatarFallback className="text-xs">
                      {getWorkspaceInitials(workspace.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate max-w-[120px]">
                        {workspace.name}
                      </span>
                      {workspace.type === 'default' && (
                        <UserIcon className="h-3 w-3 text-muted-foreground" />
                      )}
                      {workspace.type === 'team' && (
                        <Building className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    
                    <Badge variant="outline" className="text-xs h-5">
                      Pro Plan
                    </Badge>
                  </div>
                </div>
                
                <ChevronDown className="h-4 w-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-64" align="start" side="top">
              <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {availableWorkspaces.map((ws) => {
                const isCurrentWorkspace = ws.id === workspace.id;
                
                return (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => !isCurrentWorkspace && handleWorkspaceSwitch(ws.slug)}
                    className={`flex items-center gap-3 p-3 ${
                      isCurrentWorkspace ? 'bg-accent' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={ws.avatarUrl || undefined} 
                        alt={ws.name} 
                      />
                      <AvatarFallback className="text-xs">
                        {getWorkspaceInitials(ws.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {ws.name}
                        </span>
                        {ws.type === 'default' && (
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                        )}
                        {ws.type === 'team' && (
                          <Building className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      
                      <Badge variant="outline" className="text-xs h-5 w-fit">
                        Pro Plan
                      </Badge>
                    </div>
                    
                    {isCurrentWorkspace && (
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    )}
                  </DropdownMenuItem>
                );
              })}
              
              <DropdownMenuSeparator />
              
              <CreateWorkspaceDialog 
                usage={usage}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workspace
                    {usage && !usage.workspaces.unlimited && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {usage.workspaces.used}/{usage.workspaces.limit}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                }
                onSuccess={(workspace) => {
                  handleWorkspaceCreated();
                  // Workspace will auto-redirect via the dialog
                }}
              />
              
              <DropdownMenuItem 
                onClick={() => {
                  const url = getWorkspaceSettingsUrl(workspace.slug);
                  router.push(url);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Workspace Settings
              </DropdownMenuItem>
              
              {(workspace.role === 'owner' || workspace.role === 'admin') && (
                <DropdownMenuItem 
                  onClick={() => {
                    const url = getMembersUrl(workspace.slug);
                    router.push(url);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Members
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
