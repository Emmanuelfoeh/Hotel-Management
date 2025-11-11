import { notFound } from 'next/navigation';
import { staffService } from '@/lib/services';
import { requireRole } from '@/lib/utils/auth-helpers';
import { StaffForm } from '@/components/admin/forms/staff-form';

interface EditStaffPageProps {
  params: {
    id: string;
  };
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  // Only managers can edit staff
  await requireRole(['MANAGER']);

  const staff = await staffService.getStaffById(params.id);

  if (!staff) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Staff Member: {staff.firstName} {staff.lastName}
        </h1>
        <p className="text-muted-foreground">Update staff member information</p>
      </div>

      <StaffForm
        mode="edit"
        staff={{
          id: staff.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          phone: staff.phone,
          role: staff.role,
          isActive: staff.isActive,
          hireDate: staff.hireDate,
          notes: staff.notes,
        }}
      />
    </div>
  );
}
