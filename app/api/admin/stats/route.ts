import { NextRequest, NextResponse } from 'next/server';
import { withAdminApiAuth } from '@/lib/admin-api-auth';
import { db } from '@/drizzle/db';
import { users, workspaces, subscriptions as dbSubscriptions } from '@/drizzle/schema'; // Renamed to avoid conflict
import { sql } from 'drizzle-orm';

// Mock data fetching for now, can be replaced with actual queries
async function getApplicationStats() {
  // These are example queries.
  // Ensure your 'users' table is correctly populated or synced by Clerk if you query it directly.
  // Clerk itself is the source of truth for user counts.
  // For this example, we'll use placeholder values for user count.

  const totalWorkspacesResult = await db.select({ count: sql<number>`count(*)` }).from(workspaces);
  const totalWorkspaces = totalWorkspacesResult[0]?.count || 0;

  // Example: Count active subscriptions (adjust based on your subscription status values)
  const activeSubscriptionsResult = await db.select({ count: sql<number>`count(*)` })
    .from(dbSubscriptions)
    .where(sql`${dbSubscriptions.status} = 'active'`); // Assuming 'active' is a status
  const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0;

  // Total users count is best obtained from Clerk directly if possible,
  // or if you have a user sync mechanism. For this example, a mock value.
  // const totalUsers = await clerkClient.users.getCount(); // This would be the ideal way if run on server
  const mockTotalUsers = 150; // Placeholder

  return {
    totalUsers: mockTotalUsers, // Replace with actual Clerk user count if feasible
    totalWorkspaces,
    activeSubscriptions,
  };
}

export const GET = withAdminApiAuth(async (req, { authResult }) => {
  // authResult contains { authorized: true, userId: '...' } if successful
  // The wrapper already handles unauthorized cases.

  try {
    const stats = await getApplicationStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return NextResponse.json({ error: 'Failed to fetch application statistics.' }, { status: 500 });
  }
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Retrieve application statistics for admins
 *     description: |
 *       Provides key statistics about the application, such as total users,
 *       total workspaces, and active subscriptions.
 *       Requires admin privileges.
 *     tags:
 *       - Admin
 *     security:
 *       - clerkAuth: []
 *         # Add a specific admin scope if you define one in Clerk/Swagger config
 *     responses:
 *       200:
 *         description: Successfully retrieved application statistics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStatsResponse'
 *       401:
 *         description: Unauthorized - User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - User not an authorized admin or admin access not configured.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error - Failed to fetch statistics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
