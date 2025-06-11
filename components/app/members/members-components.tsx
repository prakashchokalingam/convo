'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/shared/ui/input';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shared/ui/dialog';
import { Label } from '@/components/shared/ui/label';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
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
    <div className="flex items-center justify-between mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 w-64"
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
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
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredMembers.map((member) => {
            const RoleIcon = roleIcons[member.role];
            const canManage = (currentUserRole === 'owner' || currentUserRole === 'admin') && 
                            member.role !== 'owner';
            
            return (
              <div key={member.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.avatarUrl} alt={member.user.displayName} />
                    <AvatarFallback>
                      {member.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{member.user.displayName}</div>
                    <div className="text-sm text-gray-600">{member.user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={roleColors[member.role]}>
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {member.role}
                  </Badge>
                  
                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleRoleUpdate(member.id, 'admin')}
                          disabled={member.role === 'admin'}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleUpdate(member.id, 'member')}
                          disabled={member.role === 'member'}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Make Member
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRoleUpdate(member.id, 'viewer')}
                          disabled={member.role === 'viewer'}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Make Viewer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600"
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
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Pending Invitations</h3>
            <p className="text-sm text-gray-600 mt-1">
              {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {invitations.map((invitation) => {
              const RoleIcon = roleIcons[invitation.role];
              
              return (
                <div key={invitation.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{invitation.email}</div>
                      <div className="text-sm text-gray-600">
                        Invited {new Date(invitation.createdAt).toLocaleDateString()}
                        {invitation.inviterName && ` by ${invitation.inviterName}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={roleColors[invitation.role]}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {invitation.role}
                    </Badge>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your workspace. They'll receive an email with instructions to join.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
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
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <div>
                      <div>Viewer</div>
                      <div className="text-xs text-muted-foreground">Can view forms and responses</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="member">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div>Member</div>
                      <div className="text-xs text-muted-foreground">Can create and edit forms</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <div>
                      <div>Admin</div>
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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
