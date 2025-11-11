import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { BookingsTable } from '@/components/admin/tables/bookings-table';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { bookingService } from '@/lib/services/booking.service';
import { BookingStatus, PaymentStatus } from '@/types';

interface SearchParams {
  query?: string;
  status?: BookingStatus;
  payment?: PaymentStatus;
}

async function getBookings(searchParams: SearchParams) {
  const filters = {
    query: searchParams.query,
    bookingStatus: searchParams.status,
    paymentStatus: searchParams.payment,
  };

  const bookings = await bookingService.getBookings(filters);
  return bookings;
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const bookings = await getBookings(searchParams);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage hotel bookings and reservations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/bookings/calendar">
              <CalendarIcon />
              Calendar View
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/bookings/new">
              <PlusIcon />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <Suspense fallback={<LoadingSpinner />}>
        <BookingsTable bookings={bookings} />
      </Suspense>
    </div>
  );
}
