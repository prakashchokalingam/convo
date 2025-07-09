'use client';

import { useUser } from '@clerk/nextjs';
import {
  Building,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/card';
import { getWorkspaceUrl } from '@/lib/urls/workspace-urls';

interface InvitationData {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  workspace: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    avatarUrl?: string;
  };
  inviter: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  expiresAt: string;
}

const roleDescriptions = {
  admin: 'Can manage workspace settings, members, and all forms',
  member: 'Can create, edit, and manage forms and responses',
  viewer: 'Can view forms and responses but cannot make changes',
};

const roleIcons = {
  admin: '🛡️',
  member: '👤',
  viewer: '👁️',
};

export default function InvitePage() {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const token = searchParams.get('token');

  // Fetch invitation details
  useEffect(() => {
    if (!token) {
      setError('No invitation token provided');
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const response = await fetch(`/api/invitations?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load invitation');
        }

        setInvitation(data.invitation);
      } catch (err) {
        console.error('Error fetching invitation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!user || !invitation) {
      return;
    }

    setAccepting(true);
    setError('');

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userDetails: {
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            avatarUrl: user.imageUrl,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept invitation');
      }

      setSuccess(true);

      // Redirect to workspace after a brief delay
      setTimeout(() => {
        const workspaceUrl = getWorkspaceUrl(invitation.workspace.slug);
        router.push(workspaceUrl);
      }, 2000);
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
          <p className='text-gray-600'>Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <XCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <CardTitle className='text-red-900'>Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className='w-full' variant='outline'>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
            <CardTitle className='text-green-900'>Welcome to the team!</CardTitle>
            <CardDescription>
              You&apos;ve successfully joined {invitation?.workspace.name}. Redirecting you to the
              workspace...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <XCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <CardTitle className='text-red-900'>Invitation Not Found</CardTitle>
            <CardDescription>This invitation may have expired or been revoked.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check if the invitation email matches the user's email
  const emailMatch =
    user?.emailAddresses[0]?.emailAddress.toLowerCase() === invitation.email.toLowerCase();

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <Mail className='h-12 w-12 text-blue-500 mx-auto mb-4' />
          <CardTitle>You&apos;re Invited!</CardTitle>
          <CardDescription>You&apos;ve been invited to join a workspace</CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Workspace Info */}
          <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
            <Avatar className='h-12 w-12'>
              <AvatarImage src={invitation.workspace.avatarUrl} alt={invitation.workspace.name} />
              <AvatarFallback>
                <Building className='h-6 w-6' />
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <h3 className='font-semibold'>{invitation.workspace.name}</h3>
              {invitation.workspace.description && (
                <p className='text-sm text-gray-600'>{invitation.workspace.description}</p>
              )}
            </div>
          </div>

          {/* Role Info */}
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <span className='text-2xl'>{roleIcons[invitation.role]}</span>
              <Badge variant='outline' className='text-sm'>
                {invitation.role}
              </Badge>
            </div>
            <p className='text-sm text-gray-600'>{roleDescriptions[invitation.role]}</p>
          </div>

          {/* Inviter Info */}
          <div className='text-center text-sm text-gray-600'>
            <User className='h-4 w-4 inline mr-1' />
            Invited by {invitation.inviter.firstName} {invitation.inviter.lastName}
            <span className='block'>({invitation.inviter.email})</span>
          </div>

          {/* Expiry Info */}
          <div className='text-center text-sm text-gray-500'>
            <Calendar className='h-4 w-4 inline mr-1' />
            Expires on {new Date(invitation.expiresAt).toLocaleDateString()}
          </div>

          {/* Email Warning */}
          {!emailMatch && (
            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                This invitation was sent to <strong>{invitation.email}</strong>, but you&apos;re signed
                in as <strong>{user?.emailAddresses[0]?.emailAddress}</strong>. You can still accept
                this invitation.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className='space-y-3'>
            <Button
              onClick={handleAcceptInvitation}
              disabled={accepting || !user}
              className='w-full'
            >
              {accepting && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
              Accept Invitation
            </Button>

            <Button onClick={() => router.push('/')} variant='outline' className='w-full'>
              Decline
            </Button>
          </div>

          {!user && (
            <p className='text-sm text-center text-gray-600'>
              Please sign in to accept this invitation
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
