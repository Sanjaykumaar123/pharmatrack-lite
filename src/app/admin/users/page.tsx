
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, MoreHorizontal, Users, Loader2, UserCheck, Factory, ShieldCheck, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import type { Role } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';
import { getUsers, updateUserRole, type AppUser } from '@/lib/firebase/users';
import { useToast } from '@/hooks/use-toast';

const roleConfig: Record<Role, { icon: React.ElementType; color: string; label: string }> = {
  customer: { icon: User, color: 'bg-blue-500/20 text-blue-600', label: 'Customer' },
  manufacturer: { icon: Factory, color: 'bg-purple-500/20 text-purple-600', label: 'Manufacturer' },
  admin: { icon: ShieldCheck, color: 'bg-red-500/20 text-red-600', label: 'Admin' },
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load users',
          description: 'There was a problem fetching the user list. Please try again later.',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (uid: string, newRole: Role) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.uid === uid ? { ...user, role: newRole } : user))
      );
      toast({
        title: 'Role Updated',
        description: `User's role has been successfully changed to ${newRole}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update role',
        description: 'There was a problem updating the user role. Please try again.',
      });
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline flex items-center gap-2">
            <Users className="h-8 w-8" /> User Management
          </h1>
          <p className="text-muted-foreground mt-1">View and manage user roles and permissions.</p>
        </div>
        <Link href="/admin/dashboard" passHref>
          <Button variant="outline">
            <Home className="mr-2 h-5 w-5" />
            Admin Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All System Users</CardTitle>
          <CardDescription>A list of all users registered in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-lg">Loading Users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const config = roleConfig[user.role];
                  const Icon = config.icon;
                  return (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('font-medium', config.color)}>
                          <Icon className="h-3 w-3 mr-1.5" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.keys(roleConfig).map((role) => (
                              <DropdownMenuItem
                                key={role}
                                disabled={user.role === role}
                                onClick={() => handleRoleChange(user.uid, role as Role)}
                              >
                                {roleConfig[role as Role].label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
