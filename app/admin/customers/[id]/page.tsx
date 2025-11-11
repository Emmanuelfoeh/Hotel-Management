import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  FileTextIcon,
  ReceiptIcon,
  EditIcon,
} from 'lucide-react';
import { customerService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { format } from 'date-fns';
import { BookingStatus, PaymentStatus } from '@/types';
import Link from 'next/link';

async function getCustomer(id: string) {
  const customer = await customerService.getCustomerById(id);
  if (!customer) {
    notFound();
  }
  return customer;
}

async function getCustomerStats(id: string) {
  return await customerService.getCustomerStats(id);
}

export default async function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAuth();

  const customer = await getCustomer(params.id);
  const stats = await getCustomerStats(params.id);

  const getBookingStatusBadge = (status: BookingStatus) => {
    const variants: Record<
      BookingStatus,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      CONFIRMED: 'default',
      CHECKED_IN: 'secondary',
      CHECKED_OUT: 'outline',
      CANCELLED: 'destructive',
    };

    const labels: Record<BookingStatus, string> = {
      CONFIRMED: 'Confirmed',
      CHECKED_IN: 'Checked In',
      CHECKED_OUT: 'Checked Out',
      CANCELLED: 'Cancelled',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const variants: Record<
      PaymentStatus,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      PAID: 'default',
      PENDING: 'secondary',
      REFUNDED: 'outline',
      FAILED: 'destructive',
    };

    const labels: Record<PaymentStatus, string> = {
      PAID: 'Paid',
      PENDING: 'Pending',
      REFUNDED: 'Refunded',
      FAILED: 'Failed',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-muted-foreground">
            Customer since {format(new Date(customer.createdAt), 'PPP')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/customers">Back to Customers</Link>
          </Button>
        </div>
      </div>

      {/* Customer Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Completed Stays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Cancelled Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelledBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.totalSpent.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="size-5" />
              Customer Information
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/customers/${customer.id}/edit`}>
                <EditIcon className="mr-2 size-4" />
                Edit
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">
                {customer.firstName} {customer.lastName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            {(customer.address || customer.city || customer.country) && (
              <div className="flex items-start gap-2">
                <MapPinIcon className="mt-1 size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {customer.address && <span>{customer.address}</span>}
                    {customer.city && (
                      <span>
                        {customer.address && ', '}
                        {customer.city}
                      </span>
                    )}
                    {customer.country && (
                      <span>
                        {(customer.address || customer.city) && ', '}
                        {customer.country}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/admin/bookings/new?customerId=${customer.id}`}>
                <CalendarIcon className="mr-2 size-4" />
                Create New Booking
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
              title="Invoice generation coming soon"
            >
              <FileTextIcon className="mr-2 size-4" />
              Generate Invoice
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled
              title="Receipt generation coming soon"
            >
              <ReceiptIcon className="mr-2 size-4" />
              Generate Receipt
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.bookings.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No bookings found for this customer
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Check-Out</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.bookingNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {booking.room.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Room {booking.room.roomNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        ₦{Number(booking.totalAmount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getBookingStatusBadge(booking.bookingStatus)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/bookings/${booking.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
