'use client';

import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BookingStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomNumber: string;
  customerName: string;
  status: BookingStatus;
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const router = useRouter();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    let backgroundColor = '#3b82f6'; // blue for confirmed
    let borderColor = '#2563eb';

    switch (event.status) {
      case 'CONFIRMED':
        backgroundColor = '#3b82f6'; // blue
        borderColor = '#2563eb';
        break;
      case 'CHECKED_IN':
        backgroundColor = '#10b981'; // green
        borderColor = '#059669';
        break;
      case 'CHECKED_OUT':
        backgroundColor = '#6b7280'; // gray
        borderColor = '#4b5563';
        break;
      case 'CANCELLED':
        backgroundColor = '#ef4444'; // red
        borderColor = '#dc2626';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '4px',
        color: 'white',
        fontSize: '0.875rem',
        padding: '2px 4px',
      },
    };
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const getStatusBadge = (status: BookingStatus) => {
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

  return (
    <>
      <div className="rounded-lg border bg-card p-4">
        <style jsx global>{`
          .rbc-calendar {
            font-family: inherit;
          }
          .rbc-header {
            padding: 12px 4px;
            font-weight: 600;
            border-bottom: 2px solid hsl(var(--border));
          }
          .rbc-today {
            background-color: hsl(var(--accent));
          }
          .rbc-off-range-bg {
            background-color: hsl(var(--muted));
          }
          .rbc-event {
            padding: 2px 4px;
          }
          .rbc-event-label {
            font-size: 0.75rem;
          }
          .rbc-toolbar {
            padding: 12px 0;
            margin-bottom: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            justify-content: space-between;
          }
          .rbc-toolbar button {
            padding: 6px 12px;
            border: 1px solid hsl(var(--border));
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .rbc-toolbar button:hover {
            background-color: hsl(var(--accent));
          }
          .rbc-toolbar button.rbc-active {
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            border-color: hsl(var(--primary));
          }
          .rbc-month-view,
          .rbc-time-view,
          .rbc-agenda-view {
            border: 1px solid hsl(var(--border));
            border-radius: 8px;
            overflow: hidden;
          }
          .rbc-time-slot {
            border-top: 1px solid hsl(var(--border));
          }
          .rbc-day-slot .rbc-time-slot {
            border-top: 1px solid hsl(var(--border));
          }
          .rbc-time-header-content {
            border-left: 1px solid hsl(var(--border));
          }
          .rbc-time-content {
            border-top: 2px solid hsl(var(--border));
          }
        `}</style>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          popup
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>

      {/* Event Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View booking information and manage the reservation
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer
                </p>
                <p className="text-lg font-semibold">
                  {selectedEvent.customerName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Room
                </p>
                <p className="text-lg font-semibold">
                  Room {selectedEvent.roomNumber}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Check-In
                  </p>
                  <p className="font-medium">
                    {format(selectedEvent.start, 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Check-Out
                  </p>
                  <p className="font-medium">
                    {format(selectedEvent.end, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div className="mt-1">
                  {getStatusBadge(selectedEvent.status)}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={`/admin/bookings/${selectedEvent.id}`}>
                    View Full Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
