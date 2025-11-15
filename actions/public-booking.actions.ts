'use server';

import { prisma } from '@/lib/db';
import { bookingService } from '@/lib/services/booking.service';
import { initializePayment } from '@/lib/services/payment.service';
import { sendBookingConfirmationEmail } from '@/lib/services/email.service';
import { z } from 'zod';

const createPublicBookingSchema = z.object({
  roomId: z.string(),
  customerEmail: z.string().email(),
  customerFirstName: z.string().min(2),
  customerLastName: z.string().min(2),
  customerPhone: z.string().min(10),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  numberOfGuests: z.number().min(1),
  totalAmount: z.number().min(0),
  specialRequests: z.string().optional(),
});

/**
 * Create a booking for a public customer (no authentication required)
 */
export async function createPublicBooking(
  data: z.infer<typeof createPublicBookingSchema>
) {
  try {
    // Validate input
    const validated = createPublicBookingSchema.parse(data);

    // 1. Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: validated.customerEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: validated.customerFirstName,
          lastName: validated.customerLastName,
          email: validated.customerEmail,
          phone: validated.customerPhone,
        },
      });
    }

    // 2. Create booking
    const booking = await bookingService.createBooking({
      roomId: validated.roomId,
      customerId: customer.id,
      checkInDate: new Date(validated.checkInDate),
      checkOutDate: new Date(validated.checkOutDate),
      numberOfGuests: validated.numberOfGuests,
      totalAmount: validated.totalAmount,
      specialRequests: validated.specialRequests,
      source: 'ONLINE',
    });

    // 3. Initialize payment
    const payment = await initializePayment({
      email: customer.email,
      amount: Math.round(validated.totalAmount * 100), // Convert to kobo
      bookingId: booking.id,
      metadata: {
        customerName: `${customer.firstName} ${customer.lastName}`,
        roomId: validated.roomId,
        bookingNumber: booking.bookingNumber,
      },
    });

    if (!payment.success) {
      // Rollback: Cancel the booking if payment initialization fails
      await bookingService.cancelBooking(booking.id);
      return {
        success: false,
        error: payment.error || 'Failed to initialize payment',
      };
    }

    return {
      success: true,
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
      },
      payment: {
        authorizationUrl: payment.authorizationUrl,
        reference: payment.reference,
      },
    };
  } catch (error) {
    console.error('Error creating public booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create booking',
    };
  }
}

/**
 * Get booking by booking number and email (for lookup)
 */
export async function getBookingByNumberAndEmail(
  bookingNumber: string,
  email: string
) {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        bookingNumber: bookingNumber.toUpperCase(),
        customer: {
          email: email.toLowerCase(),
        },
      },
      include: {
        room: true,
        customer: true,
        payments: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found or email does not match',
      };
    }

    // Serialize Decimal fields to numbers
    const serializedBooking = {
      ...booking,
      totalAmount: Number(booking.totalAmount),
      room: {
        ...booking.room,
        price: Number(booking.room.price),
      },
      payments: booking.payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
    };

    return {
      success: true,
      booking: serializedBooking,
    };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return {
      success: false,
      error: 'Failed to retrieve booking',
    };
  }
}

/**
 * Get booking details after payment (for confirmation page)
 */
export async function getBookingByReference(reference: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { paystackRef: reference },
      include: {
        booking: {
          include: {
            room: true,
            customer: true,
            payments: true,
          },
        },
      },
    });

    if (!payment || !payment.booking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    // Serialize Decimal fields to numbers
    const serializedBooking = {
      ...payment.booking,
      totalAmount: Number(payment.booking.totalAmount),
      room: {
        ...payment.booking.room,
        price: Number(payment.booking.room.price),
      },
      payments: payment.booking.payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
    };

    const serializedPayment = {
      ...payment,
      amount: Number(payment.amount),
      booking: undefined, // Remove to avoid duplication
    };

    return {
      success: true,
      booking: serializedBooking,
      payment: serializedPayment,
    };
  } catch (error) {
    console.error('Error fetching booking by reference:', error);
    return {
      success: false,
      error: 'Failed to retrieve booking',
    };
  }
}

/**
 * Resend booking confirmation email
 */
export async function resendBookingConfirmation(bookingNumber: string) {
  try {
    const booking = await bookingService.getBookingByNumber(bookingNumber);

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    await sendBookingConfirmationEmail(booking.customer.email, {
      bookingNumber: booking.bookingNumber,
      customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
      roomName: booking.room.name,
      checkInDate: booking.checkInDate.toLocaleDateString(),
      checkOutDate: booking.checkOutDate.toLocaleDateString(),
      numberOfGuests: booking.numberOfGuests,
      totalAmount: `$${Number(booking.totalAmount).toFixed(2)}`,
      specialRequests: booking.specialRequests || '',
    });

    return {
      success: true,
      message: 'Confirmation email sent successfully',
    };
  } catch (error) {
    console.error('Error resending confirmation:', error);
    return {
      success: false,
      error: 'Failed to resend confirmation email',
    };
  }
}

/**
 * Cancel a booking by booking number and email (for public customers)
 */
export async function cancelPublicBooking(
  bookingNumber: string,
  email: string
) {
  try {
    // Find the booking
    const booking = await prisma.booking.findFirst({
      where: {
        bookingNumber: bookingNumber.toUpperCase(),
        customer: {
          email: email.toLowerCase(),
        },
      },
      include: {
        room: true,
        customer: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found or email does not match',
      };
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === 'CANCELLED') {
      return {
        success: false,
        error: 'This booking has already been cancelled',
      };
    }

    if (booking.bookingStatus === 'CHECKED_OUT') {
      return {
        success: false,
        error: 'Cannot cancel a completed booking',
      };
    }

    if (booking.bookingStatus === 'CHECKED_IN') {
      return {
        success: false,
        error:
          'Cannot cancel a booking that is currently checked in. Please contact the hotel.',
      };
    }

    // Cancel the booking
    await bookingService.cancelBooking(booking.id);

    return {
      success: true,
      message: 'Booking cancelled successfully',
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return {
      success: false,
      error: 'Failed to cancel booking',
    };
  }
}
