import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarIcon,
  UserIcon,
  BedIcon,
  CreditCardIcon,
  FileTextIcon,
  LogInIcon,
  LogOutIcon,
  XCircleIcon,
} from 'lucide-react';
import { bookingService } from '@/lib/services/booking.service';
import { format } from 'date-fns';
import { BookingStatus, PaymentStatus } from '@/types';
import Link from 'next/link';
import { BookingActions } from '@/components/admin/booking-actions';

async function getBooking(id: string) {
  const booking = await bookingService.getBookingById(id);
  if (!booking) {
    notFound();
  }
  return booking;
}

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = await getBooking(params.id);

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

  const canCheckIn = booking.bookingStatus === 'CONFIRMED';
  const canCheckOut = booking.bookingStatus === 'CHECKED_IN';
  const canCancel =
    booking.bookingStatus === 'CONFIRMED' ||
    booking.bookingStatus === 'CHECKED_IN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Booking #{booking.bookingNumber}
          </h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(booking.createdAt), 'PPP')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/bookings">Back to Bookings</Link>
          </Button>
        </div>
      </div>

      {/* Status and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Booking Status</p>
                <div className="mt-1">
                  {getBookingStatusBadge(booking.bookingStatus)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <div className="mt-1">
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </div>
              </div>
            </div>
            <BookingActions
              bookingId={booking.id}
              canCheckIn={canCheckIn}
              canCheckOut={canCheckOut}
              canCancel={canCancel}
              customerName={`${booking.customer.firstName} ${booking.customer.lastName}`}
              roomNumber={booking.room.roomNumber}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="size-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {booking.customer.firstName} {booking.customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{booking.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{booking.customer.phone}</p>
            </div>
            {booking.customer.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{booking.customer.address}</p>
              </div>
            )}
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/admin/customers/${booking.customer.id}`}>
                View Customer Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Room Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedIcon className="size-5" />
              Room Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Room Name</p>
              <p className="font-medium">{booking.room.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="font-medium">{booking.room.roomNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Type</p>
              <p className="font-medium">{booking.room.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-medium">{booking.room.capacity} guests</p>
            </div>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/admin/rooms/${booking.room.id}`}>
                View Room Details
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="size-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-In Date</p>
              <p className="font-medium">
                {format(new Date(booking.checkInDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-Out Date</p>
              <p className="font-medium">
                {format(new Date(booking.checkOutDate), 'PPP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Number of Guests</p>
              <p className="font-medium">{booking.numberOfGuests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booking Source</p>
              <p className="font-medium">{booking.source}</p>
            </div>
            {booking.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Special Requests
                </p>
                <p className="font-medium">{booking.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="size-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                ₦{Number(booking.totalAmount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <div className="mt-1">
                {getPaymentStatusBadge(booking.paymentStatus)}
              </div>
            </div>
            {booking.payments && booking.payments.length > 0 && (
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Payment History
                </p>
                <div className="space-y-2">
                  {booking.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          ₦{Number(payment.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.paymentMethod}
                          {payment.paidAt &&
                            ` - ${format(new Date(payment.paidAt), 'PPP')}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          payment.paymentStatus === 'PAID'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {payment.paymentStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Created By */}
      {booking.createdBy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="size-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-medium">
                {booking.createdBy.firstName} {booking.createdBy.lastName} (
                {booking.createdBy.role})
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
