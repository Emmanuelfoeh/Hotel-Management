import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaffTable } from '@/components/admin/tables/staff-table';
import { staffService } from '@/lib/services';
import { requireRole } from '@/lib/utils/auth-helpers';

interface StaffPageProps {
  searchParams: {
    query?: string;
    role?: 'MANAGER' | 'RECEPTIONIST' | 'CLEANER';
    status?: 'active' | 'inactive';
  };
}

export default async function StaffPage({ searchParams }: StaffPageProps) {
  // Only managers can access staff management
  await requireRole(['MANAGER']);

  const staff = await staffService.getStaff({
    query: searchParams.query,
    role: searchParams.role,
    isActive:
      searchParams.status === 'active'
        ? true
        : searchParams.status === 'inactive'
          ? false
          : undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage staff members and their roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffTable staff={staff} />
        </CardContent>
      </Card>
    </div>
  );
}
