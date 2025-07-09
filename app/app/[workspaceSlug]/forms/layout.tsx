export function generateMetadata({ params }: { params: { workspaceSlug: string } }) {
  return {
    title: `Forms - ${params.workspaceSlug}`,
    description: 'Manage your forms and create new ones',
  };
}

import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <div className='flex h-screen w-screen items-center justify-center'>{children}</div>;
}
