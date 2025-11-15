import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ListIcon } from 'lucide-react';
import Link from 'next/link';
import { CalendarView } from '@/components/admin/calendar-view';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { bookingService } from '@/lib/services/booking.service';

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic';

async function getCalendarEvents() {
  const events = await bookingService.getCalendarEvents();
  return events;
}

export default async function BookingsCalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bookings Calendar
          </h1>
          <p className="text-muted-foreground">
            View all bookings in calendar format
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/bookings">
            <ListIcon />
            List View
          </Link>
        </Button>
      </div>

      {/* Calendar */}
      <Suspense fallback={<LoadingSpinner />}>
        <CalendarView events={events} />
      </Suspense>
    </div>
  );
}
