'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Booking {
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
}

interface AvailabilityCalendarProps {
  onDateSelect?: (dates: { from: Date; to: Date } | undefined) => void;
  bookings?: Booking[];
}

export function AvailabilityCalendar({
  onDateSelect,
  bookings = [],
}: AvailabilityCalendarProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Function to check if a date is within any confirmed or checked-in booking
  const isDateBooked = (date: Date): boolean => {
    return bookings.some((booking) => {
      // Only block dates for confirmed and checked-in bookings
      if (
        booking.bookingStatus !== 'CONFIRMED' &&
        booking.bookingStatus !== 'CHECKED_IN'
      ) {
        return false;
      }

      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);

      // Set time to midnight for accurate date comparison
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const checkInOnly = new Date(
        checkIn.getFullYear(),
        checkIn.getMonth(),
        checkIn.getDate()
      );
      const checkOutOnly = new Date(
        checkOut.getFullYear(),
        checkOut.getMonth(),
        checkOut.getDate()
      );

      // Check if date falls within the booking period (inclusive of check-in, exclusive of check-out)
      return dateOnly >= checkInOnly && dateOnly < checkOutOnly;
    });
  };

  const handleSelect = (range: any) => {
    setDateRange(range);
    if (range?.from && range?.to && onDateSelect) {
      onDateSelect({ from: range.from, to: range.to });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={1}
          disabled={(date) => {
            // Disable past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) return true;

            // Disable booked dates
            return isDateBooked(date);
          }}
          className="rounded-md border"
        />
        {dateRange.from && dateRange.to && (
          <div className="mt-4 rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">Selected Dates:</p>
            <p className="text-muted-foreground">
              {dateRange.from.toLocaleDateString()} -{' '}
              {dateRange.to.toLocaleDateString()}
            </p>
          </div>
        )}
        {bookings.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">
            <p>* Greyed out dates are already booked</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
