import { NextResponse } from 'next/server';

import { getCurrentWorkspace } from '@/lib/workspace-server';

export async function GET(request: Request, { params }: { params: { workspaceSlug: string } }) {
  try {
    const { workspaceSlug } = params;
    const workspace = await getCurrentWorkspace(workspaceSlug);

    if (workspace) {
      return NextResponse.json(workspace, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching current workspace:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
