'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EyeIcon,
  SearchIcon,
  LogInIcon,
  LogOutIcon,
  CalendarIcon,
} from 'lucide-react';
import Link from 'next/link';
import { BookingStatus, PaymentStatus } from '@/types';
import { format } from 'date-fns';
import { checkInBooking, checkOutBooking } from '@/actions/booking.actions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Booking {
  id: string;
  bookingNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: any;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    name: string;
    roomNumber: string;
  };
}

interface BookingsTableProps {
  bookings: Booking[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('query') || ''
  );
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }
    startTransition(() => {
      router.push(`/admin/bookings?${params.toString()}`);
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/admin/bookings?${params.toString()}`);
    });
  };

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    setIsProcessing(true);
    const result = await checkInBooking(selectedBooking.id);

    if (result.success) {
      toast.success('Guest checked in successfully');
      setCheckInDialogOpen(false);
      setSelectedBooking(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to check in');
    }
    setIsProcessing(false);
  };

  const handleCheckOut = async () => {
    if (!selectedBooking) return;

    setIsProcessing(true);
    const result = await checkOutBooking(selectedBooking.id);

    if (result.success) {
      toast.success('Guest checked out successfully');
      setCheckOutDialogOpen(false);
      setSelectedBooking(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to check out');
    }
    setIsProcessing(false);
  };

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

  const canCheckIn = (booking: Booking) => {
    return booking.bookingStatus === 'CONFIRMED';
  };

  const canCheckOut = (booking: Booking) => {
    return booking.bookingStatus === 'CHECKED_IN';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by booking number, customer name, email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={searchParams.get('status') || 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CHECKED_IN">Checked In</SelectItem>
              <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={searchParams.get('payment') || 'all'}
            onValueChange={(value) => handleFilterChange('payment', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Booking #</TableHead>
              <TableHead className="min-w-[180px]">Customer</TableHead>
              <TableHead className="min-w-[150px]">Room</TableHead>
              <TableHead className="min-w-[120px]">Check-In</TableHead>
              <TableHead className="min-w-[120px]">Check-Out</TableHead>
              <TableHead className="min-w-[100px]">Amount</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[100px]">Payment</TableHead>
              <TableHead className="text-right min-w-[120px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.bookingNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {booking.customer.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.room.name}</span>
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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="View details"
                      >
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <EyeIcon />
                        </Link>
                      </Button>
                      {canCheckIn(booking) && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setCheckInDialogOpen(true);
                          }}
                          title="Check in"
                        >
                          <LogInIcon className="text-green-600" />
                        </Button>
                      )}
                      {canCheckOut(booking) && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setCheckOutDialogOpen(true);
                          }}
                          title="Check out"
                        >
                          <LogOutIcon className="text-blue-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{booking.bookingNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.customer.firstName} {booking.customer.lastName}
                  </p>
                </div>
                <div className="flex gap-1">
                  {getBookingStatusBadge(booking.bookingStatus)}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room:</span>
                  <span className="font-medium">
                    {booking.room.name} ({booking.room.roomNumber})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-In:</span>
                  <span>
                    {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-Out:</span>
                  <span>
                    {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">
                    ₦{Number(booking.totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment:</span>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                {canCheckIn(booking) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setCheckInDialogOpen(true);
                    }}
                  >
                    <LogInIcon className="mr-2 h-4 w-4 text-green-600" />
                    Check In
                  </Button>
                )}
                {canCheckOut(booking) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setCheckOutDialogOpen(true);
                    }}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4 text-blue-600" />
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Check-In Confirmation Dialog */}
      <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In Guest</DialogTitle>
            <DialogDescription>
              Are you sure you want to check in{' '}
              {selectedBooking?.customer.firstName}{' '}
              {selectedBooking?.customer.lastName} for room{' '}
              {selectedBooking?.room.roomNumber}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckInDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleCheckIn} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Check In'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-Out Confirmation Dialog */}
      <Dialog open={checkOutDialogOpen} onOpenChange={setCheckOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check Out Guest</DialogTitle>
            <DialogDescription>
              Are you sure you want to check out{' '}
              {selectedBooking?.customer.firstName}{' '}
              {selectedBooking?.customer.lastName} from room{' '}
              {selectedBooking?.room.roomNumber}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckOutDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleCheckOut} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Check Out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
