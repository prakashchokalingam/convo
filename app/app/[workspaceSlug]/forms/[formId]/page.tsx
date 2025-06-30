import { notFound } from 'next/navigation';
import { getCurrentWorkspace } from '@/lib/workspace-server';
import { EnhancedFormEditor, FormHeader } from '@/components/forms/enhanced-form-components';
import { db } from '@/lib/db';
import { forms } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Enhanced form fetching function
const getFormById = async (formId: string, workspaceId: string) => {
  try {
    const form = await db
      .select()
      .from(forms)
      .where(and(
        eq(forms.id, formId),
        eq(forms.workspaceId, workspaceId)
      ))
      .limit(1);

    return form[0] || null;
  } catch (error) {
    console.error('Error fetching form:', error);
    return null;
  }
};

interface FormEditorPageProps {
  params: {
    workspaceSlug: string;
    formId: string;
  };
  searchParams: {
    mode?: string;
    templateId?: string;
  };
}

export default async function FormEditorPage({ params, searchParams }: FormEditorPageProps) {
  const workspace = await getCurrentWorkspace(params.workspaceSlug);
  
  // Get form and verify it belongs to this workspace
  const form = await getFormById(params.formId, workspace.id);
  
  if (!form) {
    notFound();
  }

  const mode = searchParams.mode; // 'template' for template editing
  const templateId = searchParams.templateId;

  return (
    <div className="h-full flex flex-col">
      {/* Form Header with Actions */}
      <FormHeader form={form} workspace={workspace} mode={mode} />
      
      {/* Enhanced Form Editor */}
      <div className="flex-1 overflow-hidden">
        <EnhancedFormEditor 
          form={form} 
          workspace={workspace} 
          mode={mode}
          templateId={templateId}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: { workspaceSlug: string; formId: string };
  searchParams: { mode?: string };
}) {
  const workspace = await getCurrentWorkspace(params.workspaceSlug);
  const form = await getFormById(params.formId, workspace.id);
  
  const isTemplateMode = searchParams.mode === 'template';
  
  return {
    title: form 
      ? `${isTemplateMode ? 'Template: ' : ''}${form.title} - ${workspace.name}` 
      : 'Form Editor',
    description: form?.description || 'Edit your conversational form',
  };
}
