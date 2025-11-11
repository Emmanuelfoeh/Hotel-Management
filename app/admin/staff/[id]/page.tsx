import { notFound } from 'next/navigation';
import { staffService } from '@/lib/services';
import { requireRole } from '@/lib/utils/auth-helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { EditIcon } from 'lucide-react';
import { format } from 'date-fns';

interface StaffDetailsPageProps {
  params: {
    id: string;
  };
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

export default async function StaffDetailsPage({
  params,
}: StaffDetailsPageProps) {
  // Only managers can view staff details
  await requireRole(['MANAGER']);

  const staff = await staffService.getStaffById(params.id);

  if (!staff) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {staff.firstName} {staff.lastName}
          </h1>
          <p className="text-muted-foreground">Staff member details</p>
        </div>
        <Button asChild>
          <Link href={`/admin/staff/${staff.id}/edit`}>
            <EditIcon />
            Edit Staff
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">
                {staff.firstName} {staff.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{staff.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-base">{staff.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge
                variant="secondary"
                className={`mt-1 ${roleColors[staff.role]}`}
              >
                {roleLabels[staff.role]}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              {staff.isActive ? (
                <Badge
                  variant="secondary"
                  className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                >
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="mt-1 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                >
                  Inactive
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Hire Date
              </p>
              <p className="text-base">
                {staff.hireDate
                  ? format(new Date(staff.hireDate), 'PPP')
                  : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Member Since
              </p>
              <p className="text-base">
                {format(new Date(staff.createdAt), 'PPP')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {staff.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{staff.notes}</p>
          </CardContent>
        </Card>
      )}

      {staff.bookings && staff.bookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {staff.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{booking.bookingNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.createdAt), 'PPP')}
                    </p>
                  </div>
                  <Badge variant="secondary">{booking.bookingStatus}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
