import { format } from 'date-fns'; // For date formatting
import React from 'react';

import { getAllWorkspacesForAdmin, AdminWorkspaceInfo } from '@/lib/workspace-server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Assuming this is the correct path to your shadcn Table component

export default async function AdminWorkspacesPage() {
  const workspaces = await getAllWorkspacesForAdmin();
  const totalWorkspaces = workspaces.length;

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Workspaces Management</h1>
        <p className='text-muted-foreground'>Total Workspaces: {totalWorkspaces}</p>
      </div>

      {workspaces.length > 0 ? (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[150px]'>Workspace ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Owner Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className='text-right'>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((ws: AdminWorkspaceInfo) => (
                <TableRow key={ws.id}>
                  <TableCell className='font-mono text-xs'>{ws.id}</TableCell>
                  <TableCell className='font-medium'>{ws.name}</TableCell>
                  <TableCell>{ws.ownerName || 'N/A'}</TableCell>
                  <TableCell>{ws.ownerEmail || 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ws.plan === 'Free'
                          ? 'bg-gray-200 text-gray-700'
                          : ws.plan === 'pro' || ws.plan === 'Starter' || ws.plan === 'Professional'
                            ? 'bg-blue-200 text-blue-700'
                            : ws.plan === 'Enterprise'
                              ? 'bg-purple-200 text-purple-700'
                              : 'bg-yellow-200 text-yellow-700' // Default for other/error states
                      }`}
                    >
                      {ws.plan}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    {ws.createdAt
                      ? format(new Date(ws.createdAt), "MMM d, yyyy 'at' h:mm a")
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>No workspaces found.</p>
      )}
    </div>
  );
}
