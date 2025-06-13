'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  UserMinus, 
  Shield, 
  Crown, 
  User, 
  Eye,
  Loader2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { showSuccess, showError, showWarning, handleApiError, workspaceToasts } from '@/lib/toast-utils';

// Types
interface Member {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  lastSeenAt?: string;
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
    username?: string;
    avatarUrl?: string;
    displayName: string;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: string;
  expiresAt: string;
  createdAt: string;
  inviterName?: string;
}

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: User,
  viewer: Eye,
};

const roleColors = {
  owner: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  member: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function MembersHeader({ 
  workspace, 
  onSearchChange,
  onRoleFilterChange 
}: { 
  workspace: any; 
  onSearchChange?: (search: string) => void;
  onRoleFilterChange?: (role: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    onRoleFilterChange?.(value);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search members by name or email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owners</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="viewer">Viewers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MembersList({ workspaceId, currentUserRole }: { 
  workspaceId: string; 
  currentUserRole: string;
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Fetch members and invitations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, invitationsRes] = await Promise.all([
          fetch(`/api/workspaces/by-id/${workspaceId}/members`),
          fetch(`/api/workspaces/by-id/${workspaceId}/invite`)
        ]);

        const [membersData, invitationsData] = await Promise.all([
          membersRes.json(),
          invitationsRes.json()
        ]);

        if (membersData.success) {
          setMembers(membersData.members);
        }

        if (invitationsData.success) {
          setInvitations(invitationsData.invitations.filter((inv: Invitation) => inv.status === 'pending'));
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleRoleUpdate = async (memberId: string, newRole: string) => {
    try {
      const memberToUpdate = members.find(m => m.id === memberId);
      if (!memberToUpdate) return;

      const response = await fetch(`/api/workspaces/by-id/${workspaceId}/members/${memberToUpdate.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update member role');
      }

      // Update local state
      setMembers(members.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole as any }
          : member
      ));

      // Show success toast
      workspaceToasts.roleUpdated(memberToUpdate.user.displayName, newRole);
    } catch (error) {
      console.error('Error updating member role:', error);
      handleApiError(error, 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const memberToRemove = members.find(m => m.id === memberId);
      if (!memberToRemove) return;

      const response = await fetch(`/api/workspaces/by-id/${workspaceId}/members/${memberToRemove.userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove member');
      }

      // Update local state
      setMembers(members.filter(member => member.id !== memberId));

      // Show success toast
      workspaceToasts.memberRemoved(memberToRemove.user.displayName);
    } catch (error) {
      console.error('Error removing member:', error);
      handleApiError(error, 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Search and filter skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>

        {/* Members list skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <MembersHeader 
        workspace={null}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Members List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Team Members</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage team members and their roles in this workspace.
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredMembers.map((member) => {
              const RoleIcon = roleIcons[member.role];
              const canManage = (currentUserRole === 'owner' || currentUserRole === 'admin') && 
                              member.role !== 'owner';
              
              return (
                <div key={member.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-muted">
                      <AvatarImage src={member.user.avatarUrl} alt={member.user.displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {member.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{member.user.displayName}</div>
                      <div className="text-sm text-muted-foreground">{member.user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`${roleColors[member.role]} border font-medium`}
                    >
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {member.role}
                    </Badge>
                    
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={() => handleRoleUpdate(member.id, 'admin')}
                            disabled={member.role === 'admin'}
                            className="cursor-pointer"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRoleUpdate(member.id, 'member')}
                            disabled={member.role === 'member'}
                            className="cursor-pointer"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Make Member
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRoleUpdate(member.id, 'viewer')}
                            disabled={member.role === 'viewer'}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Make Viewer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-destructive cursor-pointer focus:text-destructive"
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pending Invitations</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Invitations sent to potential team members who haven't joined yet.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="divide-y">
              {invitations.map((invitation) => {
                const RoleIcon = roleIcons[invitation.role];
                
                return (
                  <div key={invitation.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center ring-2 ring-muted">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{invitation.email}</div>
                        <div className="text-sm text-muted-foreground">
                          Invited {new Date(invitation.createdAt).toLocaleDateString()}
                          {invitation.inviterName && ` by ${invitation.inviterName}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`${roleColors[invitation.role]} border font-medium`}
                      >
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {invitation.role}
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function InviteMemberButton({ workspace }: { workspace: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    role: 'member' as 'admin' | 'member' | 'viewer'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/workspaces/by-id/${workspace.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      // Show success toast
      if (data.success) {
        workspaceToasts.inviteSent(formData.email);
      } else {
        // Email failed but invitation created
        showWarning(`Invitation created for ${formData.email} but email delivery failed. They can still join using the invitation link.`);
      }

      // Reset form and close dialog
      setFormData({ email: '', role: 'member' });
      setOpen(false);
      
      // Refresh the page to show the new invitation
      window.location.reload();
      
    } catch (err) {
      console.error('Error sending invitation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation';
      setError(errorMessage);
      
      // Check if it's a plan limit error
      if (errorMessage.includes('plan limit') || errorMessage.includes('seat limit')) {
        workspaceToasts.planLimitReached('team members');
      } else {
        workspaceToasts.inviteError(formData.email, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!loading) {
      setOpen(isOpen);
      if (!isOpen) {
        setFormData({ email: '', role: 'member' });
        setError('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Invite Team Member</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            Send an invitation to join your workspace. They'll receive an email with instructions to join.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={loading}
              className="text-base"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              We'll send them an invitation email with a link to join your workspace.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-medium">Role & Permissions</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'member' | 'viewer') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-1 bg-gray-100 rounded">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">Viewer</div>
                      <div className="text-xs text-muted-foreground">Can view forms and responses</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="member">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-1 bg-green-100 rounded">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Member</div>
                      <div className="text-xs text-muted-foreground">Can create and edit forms</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-1 bg-blue-100 rounded">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-xs text-muted-foreground">Can manage members and workspace</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.email.trim()}
              className="min-w-[140px]"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
