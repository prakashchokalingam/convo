import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

interface AdminAuthResult {
  authorized: boolean;
  userId: string | null;
  error?: string;
  status?: number;
}

export async function checkAdminApiAuth(req: NextRequest): Promise<AdminAuthResult> {
  const { userId } = getAuth(req);

  if (!userId) {
    return {
      authorized: false,
      userId: null,
      error: 'Unauthorized: No user ID found.',
      status: 401,
    };
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return { authorized: false, userId, error: 'Unauthorized: User not found.', status: 401 };
    }

    const adminEmailsEnv = process.env.ADMIN_EMAILS;
    if (!adminEmailsEnv) {
      console.warn('ADMIN_EMAILS environment variable is not set. Denying API access.');
      return {
        authorized: false,
        userId,
        error: 'Forbidden: Admin access not configured.',
        status: 403,
      };
    }

    const allowedAdminEmails = adminEmailsEnv.split(',').map(email => email.trim().toLowerCase());
    const userEmails = user.emailAddresses.map(emailObj => emailObj.emailAddress.toLowerCase());

    const isAuthorized = userEmails.some(email => allowedAdminEmails.includes(email));

    if (!isAuthorized) {
      return {
        authorized: false,
        userId,
        error: 'Forbidden: User is not an authorized admin.',
        status: 403,
      };
    }

    return { authorized: true, userId };
  } catch (error) {
    console.error('Error during admin API authorization:', error);
    return {
      authorized: false,
      userId,
      error: 'Internal Server Error during authorization.',
      status: 500,
    };
  }
}

/**
 * Wrapper function for API route handlers to protect them.
 * Usage: export const GET = withAdminApiAuth(async (req, { params }) => { ... });
 */
export function withAdminApiAuth<T extends Record<string, unknown>>(
  handler: (
    req: NextRequest,
    context: { params: T; authResult: AdminAuthResult }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: T }): Promise<NextResponse> => {
    const authResult = await checkAdminApiAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    return handler(req, { ...context, authResult });
  };
}
