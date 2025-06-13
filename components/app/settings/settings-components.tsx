// Enhanced settings components with shadcn/ui integration

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings, Users, CreditCard, Plug, AlertCircle } from 'lucide-react'
import { getWorkspaceSettingsUrl } from '@/lib/workspace'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function SettingsNavigation({ workspace, activeTab }: { workspace: any; activeTab: string }) {
  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Plug },
  ];

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-lg">Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
                asChild
              >
                <Link href={`${getWorkspaceSettingsUrl(workspace.slug)}?tab=${tab.id}`}>
                  <Icon className="mr-3 h-4 w-4" />
                  {tab.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}

export function WorkspaceSettings({ workspace, activeTab }: { workspace: any; activeTab: string }) {
  if (activeTab === 'general') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">General Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your workspace settings and preferences.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name" className="text-sm font-medium">
                    Workspace Name
                  </Label>
                  <Input
                    id="workspace-name"
                    defaultValue={workspace.name}
                    placeholder="Enter workspace name"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the display name for your workspace.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workspace-slug" className="text-sm font-medium">
                    Workspace URL
                  </Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">app.convo.ai/</span>
                    <Input
                      id="workspace-slug"
                      defaultValue={workspace.slug}
                      placeholder="workspace-url"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will be the URL for your workspace.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workspace-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="workspace-description"
                  defaultValue={workspace.description || ''}
                  placeholder="Describe your workspace purpose and goals..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Help your team understand what this workspace is for.
                </p>
              </div>

              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Workspace ID</p>
                  <p className="text-xs text-muted-foreground font-mono">{workspace.id}</p>
                </div>
                <Badge variant="outline">ID</Badge>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            <p className="text-sm text-muted-foreground">
              Irreversible and destructive actions.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Deleting your workspace will permanently remove all forms, responses, and team member access. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Other tabs
  const tabTitles = {
    members: 'Members',
    billing: 'Billing',
    integrations: 'Integrations'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {tabTitles[activeTab as keyof typeof tabTitles]} Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your {activeTab} settings and preferences.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {tabTitles[activeTab as keyof typeof tabTitles]} Settings
          </h3>
          <p className="text-muted-foreground mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings are coming soon.
          </p>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
