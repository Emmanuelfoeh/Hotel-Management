'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EyeIcon,
  SearchIcon,
  EditIcon,
  UserXIcon,
  UserCheckIcon,
  PlusIcon,
} from 'lucide-react';
import Link from 'next/link';
import { deactivateStaff } from '@/actions/staff.actions';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'MANAGER' | 'RECEPTIONIST' | 'CLEANER';
  isActive: boolean;
  hireDate: Date | null;
}

interface StaffTableProps {
  staff: Staff[];
}

const roleColors = {
  MANAGER:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  RECEPTIONIST:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  CLEANER:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const roleLabels = {
  MANAGER: 'Manager',
  RECEPTIONIST: 'Receptionist',
  CLEANER: 'Cleaner',
};

export function StaffTable({ staff }: StaffTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('query') || ''
  );
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get('role') || 'all'
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateFilters({ query: value });
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    updateFilters({ role: value });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    updateFilters({ status: value });
  };

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/admin/staff?${params.toString()}`);
    });
  };

  const handleDeactivateClick = (staffId: string) => {
    setSelectedStaffId(staffId);
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedStaffId) return;

    setIsDeactivating(true);
    try {
      const result = await deactivateStaff(selectedStaffId);

      if (result.success) {
        toast.success('Staff member deactivated successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to deactivate staff member');
      }
    } catch (error) {
      console.error('Deactivation error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeactivating(false);
      setDeactivateDialogOpen(false);
      setSelectedStaffId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
            <SelectItem value="CLEANER">Cleaner</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button asChild>
          <Link href="/admin/staff/new">
            <PlusIcon />
            Add Staff
          </Link>
        </Button>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[130px]">Phone</TableHead>
              <TableHead className="min-w-[120px]">Role</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="text-right min-w-[120px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={roleColors[member.role]}
                    >
                      {roleLabels[member.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.isActive ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                      >
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="View details"
                      >
                        <Link href={`/admin/staff/${member.id}`}>
                          <EyeIcon />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="Edit staff"
                      >
                        <Link href={`/admin/staff/${member.id}/edit`}>
                          <EditIcon />
                        </Link>
                      </Button>
                      {member.isActive ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeactivateClick(member.id)}
                          title="Deactivate staff"
                        >
                          <UserXIcon />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled
                          title="Staff is inactive"
                        >
                          <UserCheckIcon />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-4">
        {staff.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No staff members found
          </div>
        ) : (
          staff.map((member) => (
            <div
              key={member.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge
                    variant="secondary"
                    className={roleColors[member.role]}
                  >
                    {roleLabels[member.role]}
                  </Badge>
                  {member.isActive ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                    >
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/staff/${member.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/staff/${member.id}/edit`}>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                {member.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeactivateClick(member.id)}
                  >
                    <UserXIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this staff member? They will
              no longer be able to access the system. You can reactivate them
              later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateConfirm}
              disabled={isDeactivating}
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
