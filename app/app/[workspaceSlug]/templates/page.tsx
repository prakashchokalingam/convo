"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/hooks/use-workspace';
import { Button } from '@/components/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Plus, Layout, Globe, Building } from 'lucide-react';
import { GlobalTemplatesTab } from './GlobalTemplatesTab';
import { UserTemplatesTab } from './UserTemplatesTab';
import { TemplateCreateDialog } from './TemplateCreateDialog';

/**
 * Templates Page - Main page for template management
 * 
 * This page provides access to both global templates and workspace templates
 * with proper permission-based controls and tab navigation.
 */
export default function TemplatesPage() {
  const { workspace, userRole, hasPermission } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'global' | 'workspace'>('global');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-500">Loading workspace...</div>
        </div>
      </div>
    );
  }

  // Check if user can create templates (owner or admin)
  const canCreateTemplates = hasPermission('admin'); // Assuming admin includes template creation

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Layout className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
              <p className="text-gray-600">
                Create forms quickly using pre-built templates or create your own
              </p>
            </div>
          </div>
        </div>

        {/* Create Template Button */}
        {canCreateTemplates && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        )}
      </div>

      {/* Templates Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'global' | 'workspace')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Templates
          </TabsTrigger>
          <TabsTrigger value="workspace" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            My Templates
          </TabsTrigger>
        </TabsList>

        {/* Global Templates Tab */}
        <TabsContent value="global" className="mt-6">
          <GlobalTemplatesTab 
            workspaceId={workspace.id}
            userRole={userRole}
            canCreateTemplates={canCreateTemplates}
          />
        </TabsContent>

        {/* Workspace Templates Tab */}
        <TabsContent value="workspace" className="mt-6">
          <UserTemplatesTab 
            workspaceId={workspace.id}
            userRole={userRole}
            canCreateTemplates={canCreateTemplates}
            onCreateTemplate={() => setShowCreateDialog(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Template Creation Dialog */}
      <TemplateCreateDialog 
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        workspaceId={workspace.id}
        onSuccess={() => {
          setShowCreateDialog(false);
          // Switch to workspace tab to show the new template
          setActiveTab('workspace');
        }}
      />
    </div>
  );
}
