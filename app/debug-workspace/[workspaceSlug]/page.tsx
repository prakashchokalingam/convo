import { auth } from '@clerk/nextjs';

import { getWorkspaceBySlug, getCurrentUserWorkspaces } from '@/lib/workspace-server';

/**
 * Debug page to check workspace access
 * DELETE THIS FILE AFTER DEBUGGING
 */
export default async function DebugWorkspacePage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  const { userId } = auth();

  let workspace = null;
  let allWorkspaces = [];
  let error = null;

  try {
    if (userId) {
      workspace = await getWorkspaceBySlug(params.workspaceSlug);
      allWorkspaces = await getCurrentUserWorkspaces();
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Workspace Access Debug</h1>

      <div className='space-y-4'>
        <div>
          <strong>Requested Workspace:</strong> {params.workspaceSlug}
        </div>

        <div>
          <strong>User Authenticated:</strong> {userId ? '✅ Yes' : '❌ No'}
        </div>

        {userId && (
          <div>
            <strong>User ID:</strong> {userId}
          </div>
        )}

        <div>
          <strong>Workspace Access:</strong> {workspace ? '✅ Has Access' : '❌ No Access'}
        </div>

        {workspace && (
          <div>
            <strong>Workspace Details:</strong>
            <pre className='bg-gray-100 p-2 mt-2 text-sm'>
              {JSON.stringify(
                {
                  id: workspace.id,
                  name: workspace.name,
                  slug: workspace.slug,
                  role: workspace.role,
                  type: workspace.type,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        <div>
          <strong>All User Workspaces ({allWorkspaces.length}):</strong>
          {allWorkspaces.length > 0 ? (
            <ul className='list-disc list-inside mt-2'>
              {allWorkspaces.map(ws => (
                <li key={ws.id}>
                  <strong>{ws.slug}</strong> - {ws.name} ({ws.role})
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-2 text-gray-500'>No workspaces found</p>
          )}
        </div>

        {error && (
          <div>
            <strong>Error:</strong>
            <pre className='bg-red-100 p-2 mt-2 text-sm text-red-800'>{error}</pre>
          </div>
        )}

        <div className='mt-8 p-4 bg-blue-50 border border-blue-200'>
          <h2 className='font-bold mb-2'>Next Steps:</h2>
          <ol className='list-decimal list-inside space-y-1'>
            <li>
              If not authenticated →{' '}
              <a href='/app/login' className='text-blue-600 underline'>
                Login
              </a>
            </li>
            <li>If no workspace access → Create workspace or get invited</li>
            <li>Delete this debug page after fixing</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
