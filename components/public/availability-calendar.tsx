'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AvailabilityCalendarProps {
  onDateSelect?: (dates: { from: Date; to: Date } | undefined) => void;
}

export function AvailabilityCalendar({ onDateSelect }: AvailabilityCalendarProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

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
          disabled={(date) => date < new Date()}
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
      </CardContent>
    </Card>
  );
}
