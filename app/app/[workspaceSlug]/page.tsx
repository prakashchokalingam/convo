import { redirect } from 'next/navigation';

interface WorkspaceRootProps {
  params: {
    workspaceSlug: string;
  };
  searchParams: {
    welcome?: string;
  };
}

export default async function WorkspaceRoot({ 
  params, 
  searchParams 
}: WorkspaceRootProps) {
  const dashboardUrl = `/app/${params.workspaceSlug}/dashboard`;
  const searchParamsString = new URLSearchParams(searchParams).toString();
  const redirectUrl = searchParamsString ? `${dashboardUrl}?${searchParamsString}` : dashboardUrl;
  
  redirect(redirectUrl);
}
