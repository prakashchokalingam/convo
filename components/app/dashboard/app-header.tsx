'use client';

import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Command } from 'lucide-react';
import { useAppStore } from '@/lib/store/appStore';

// Removed WorkspaceWithRole import as it's not directly used by props anymore
// import type { WorkspaceWithRole } from '@/lib/types/workspace';

// No more props needed for AppHeader after refactor
// interface AppHeaderProps {
// }

export function AppHeader() {
  const { currentWorkspace, isInitialized } = useAppStore();

  // Handle loading state or if no workspace is active
  // This also covers the case where the store is not yet initialized
  if (!isInitialized || !currentWorkspace) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Show basic logo and UserButton even in loading/no workspace state */}
          <h1 className="text-xl font-semibold text-foreground">ConvoForms</h1>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        {/* Left: Logo/Brand */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">ConvoForms</h1>
          {currentWorkspace && <Badge variant="outline">{currentWorkspace.name}</Badge>}
        </div>

        {/* Center: Enhanced Search */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search forms..."
                className="h-9 w-full bg-background pl-10 pr-4 md:w-[300px] lg:w-[400px]"
              />
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <Command className="h-3 w-3" />
                <span className="text-xs">K</span>
              </kbd>
            </div>
          </div>
          
          {/* Right: Notifications + User */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                3
              </Badge>
            </Button>
            
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
