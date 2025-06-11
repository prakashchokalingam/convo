import { notFound } from 'next/navigation';
// import { getPublicFormByTypeAndId } from '@/lib/forms'; // TODO: Implement
import { PublicFormRenderer, FormSubmissionWrapper } from '@/components/forms/form-components';

// Placeholder function - implement when building forms feature
const getPublicFormByTypeAndId = async (formType: string, formId: string) => {
  // TODO: Implement actual public form fetching
  return { 
    id: formId,
    type: formType,
    title: `Sample ${formType.charAt(0).toUpperCase() + formType.slice(1)} Form`,
    description: 'This is a sample form',
    isPublished: true 
  };
};

interface PublicFormPageProps {
  params: {
    workspaceSlug: string;
    formId: string;
  };
  searchParams: {
    preview?: string;
  };
}

export default async function PublicFormPage({ params, searchParams }: PublicFormPageProps) {
  // Context is guaranteed by path structure (/forms/*)
  // No need for context verification

  const form = await getPublicFormByTypeAndId(params.workspaceSlug, params.formId);
  
  if (!form || (!form.isPublished && searchParams.preview !== 'true')) {
    notFound();
  }

  const isPreview = searchParams.preview === 'true';

  return (
    <FormSubmissionWrapper form={form} isPreview={isPreview}>
      <PublicFormRenderer form={form} isPreview={isPreview} />
    </FormSubmissionWrapper>
  );
}

export async function generateMetadata({ 
  params 
}: { 
  params: { workspaceSlug: string; formId: string } 
}) {
  const form = await getPublicFormByTypeAndId(params.workspaceSlug, params.formId);
  
  if (!form) {
    return {
      title: 'Form Not Found',
      description: 'The requested form could not be found',
    };
  }
  
  return {
    title: form.title,
    description: form.description || `Complete this ${params.workspaceSlug} form`,
    openGraph: {
      title: form.title,
      description: form.description || `Complete this ${params.workspaceSlug} form`,
      type: 'website',
    },
  };
}
