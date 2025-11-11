'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogInIcon, LogOutIcon, XCircleIcon } from 'lucide-react';
import {
  checkInBooking,
  checkOutBooking,
  cancelBooking,
} from '@/actions/booking.actions';
import { toast } from 'sonner';

interface BookingActionsProps {
  bookingId: string;
  canCheckIn: boolean;
  canCheckOut: boolean;
  canCancel: boolean;
  customerName: string;
  roomNumber: string;
}

export function BookingActions({
  bookingId,
  canCheckIn,
  canCheckOut,
  canCancel,
  customerName,
  roomNumber,
}: BookingActionsProps) {
  const router = useRouter();
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckIn = async () => {
    setIsProcessing(true);
    const result = await checkInBooking(bookingId);

    if (result.success) {
      toast.success('Guest checked in successfully');
      setCheckInDialogOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to check in');
    }
    setIsProcessing(false);
  };

  const handleCheckOut = async () => {
    setIsProcessing(true);
    const result = await checkOutBooking(bookingId);

    if (result.success) {
      toast.success('Guest checked out successfully');
      setCheckOutDialogOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to check out');
    }
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    const result = await cancelBooking(bookingId);

    if (result.success) {
      toast.success('Booking cancelled successfully');
      setCancelDialogOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to cancel booking');
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="flex gap-2">
        {canCheckIn && (
          <Button onClick={() => setCheckInDialogOpen(true)}>
            <LogInIcon />
            Check In
          </Button>
        )}
        {canCheckOut && (
          <Button onClick={() => setCheckOutDialogOpen(true)}>
            <LogOutIcon />
            Check Out
          </Button>
        )}
        {canCancel && (
          <Button
            variant="destructive"
            onClick={() => setCancelDialogOpen(true)}
          >
            <XCircleIcon />
            Cancel Booking
          </Button>
        )}
      </div>

      {/* Check-In Confirmation Dialog */}
      <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In Guest</DialogTitle>
            <DialogDescription>
              Are you sure you want to check in {customerName} for room{' '}
              {roomNumber}?
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
              Are you sure you want to check out {customerName} from room{' '}
              {roomNumber}?
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

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking for {customerName}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={isProcessing}
            >
              No, Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isProcessing}
            >
              {isProcessing ? 'Cancelling...' : 'Yes, Cancel Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
