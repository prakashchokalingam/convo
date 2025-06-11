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
  Layout
} from 'lucide-react';
import { Button } from '@/components/shared/ui/button';

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

export function AppSidebar({ workspace }: AppSidebarProps) {
  const pathname = usePathname();
  
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

  const isActiveLink = (href: string) => {
    // Remove query parameters for comparison
    const cleanHref = href.split('?')[0];
    
    // For dashboard, exact match
    if (cleanHref === `/${workspace.slug}`) {
      return pathname === `/${workspace.slug}`;
    }
    
    // For other pages, check if pathname starts with href
    return pathname.startsWith(cleanHref);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-73px)]">
      <div className="p-4">
        {/* Quick Create Button */}
        <Button className="w-full mb-6" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            if (!canAccessItem(item)) return null;
            
            const Icon = item.icon;
            const isActive = isActiveLink(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  'mr-3 h-4 w-4',
                  isActive ? 'text-blue-700' : 'text-gray-400'
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Workspace Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Workspace
          </div>
          <div className="mt-2">
            <div className="text-sm font-medium text-gray-900">
              {workspace.name}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {workspace.role} • {workspace.type}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
