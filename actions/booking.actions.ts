'use server';

import { bookingService } from '@/lib/services';
import { requirePermission } from '@/lib/utils/auth-helpers';
import { revalidatePath } from 'next/cache';
import {
  loggedCreate,
  loggedUpdate,
  loggedCheckIn,
  loggedCheckOut,
} from '@/lib/utils/service-with-logging';
import {
  CreateBookingInput,
  UpdateBookingInput,
} from '@/lib/services/booking.service';

/**
 * Create a new booking with activity logging
 */
export async function createBooking(data: CreateBookingInput) {
  try {
    const session = await requirePermission('bookings:create');

    const bookingData = {
      ...data,
      createdById: session.user.id,
    };

    const booking = await loggedCreate(
      'BOOKING',
      session.user.id,
      async () => await bookingService.createBooking(bookingData),
      {
        roomId: data.roomId,
        customerId: data.customerId,
        checkInDate: data.checkInDate.toISOString(),
        checkOutDate: data.checkOutDate.toISOString(),
        totalAmount: data.totalAmount,
      }
    );

    revalidatePath('/admin/bookings');

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create booking',
    };
  }
}

/**
 * Update a booking with activity logging
 */
export async function updateBooking(id: string, data: UpdateBookingInput) {
  try {
    const session = await requirePermission('bookings:update');

    const booking = await loggedUpdate(
      'BOOKING',
      id,
      session.user.id,
      async () => await bookingService.updateBooking(id, data),
      {
        updatedFields: Object.keys(data),
      }
    );

    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${id}`);

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error('Failed to update booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update booking',
    };
  }
}

/**
 * Cancel a booking with activity logging
 */
export async function cancelBooking(id: string) {
  try {
    const session = await requirePermission('bookings:update');

    const booking = await loggedUpdate(
      'BOOKING',
      id,
      session.user.id,
      async () => await bookingService.cancelBooking(id),
      {
        action: 'cancelled',
      }
    );

    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${id}`);

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to cancel booking',
    };
  }
}

/**
 * Check-in a booking with activity logging
 */
export async function checkInBooking(id: string) {
  try {
    const session = await requirePermission('bookings:checkin');

    // Get booking details for logging
    const bookingDetails = await bookingService.getBookingById(id);
    if (!bookingDetails) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    const booking = await loggedCheckIn(
      id,
      session.user.id,
      async () => await bookingService.checkIn(id),
      {
        roomNumber: bookingDetails.room.roomNumber,
        customerName: `${bookingDetails.customer.firstName} ${bookingDetails.customer.lastName}`,
        checkInDate: bookingDetails.checkInDate.toISOString(),
      }
    );

    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error('Failed to check-in booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to check-in booking',
    };
  }
}

/**
 * Check-out a booking with activity logging
 */
export async function checkOutBooking(id: string) {
  try {
    const session = await requirePermission('bookings:checkout');

    // Get booking details for logging
    const bookingDetails = await bookingService.getBookingById(id);
    if (!bookingDetails) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    const booking = await loggedCheckOut(
      id,
      session.user.id,
      async () => await bookingService.checkOut(id),
      {
        roomNumber: bookingDetails.room.roomNumber,
        customerName: `${bookingDetails.customer.firstName} ${bookingDetails.customer.lastName}`,
        checkOutDate: bookingDetails.checkOutDate.toISOString(),
      }
    );

    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error('Failed to check-out booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to check-out booking',
    };
  }
}
