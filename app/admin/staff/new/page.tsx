import { StaffForm } from '@/components/admin/forms/staff-form';
import { requireRole } from '@/lib/utils/auth-helpers';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function NewStaffPage() {
  // Only managers can create staff
  await requireRole(['MANAGER']);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Staff Member</h1>
        <p className="text-muted-foreground">
          Create a new staff member account
        </p>
      </div>

      <StaffForm mode="create" />
    </div>
  );
}
