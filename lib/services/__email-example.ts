/**
 * Email Service Usage Examples
 *
 * This file demonstrates how to use the email service in your application.
 * DO NOT import this file in production code - it's for reference only.
 */

import { format } from 'date-fns';
import {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendCheckInWelcomeEmail,
} from './email.service';

/**
 * Example 1: Send booking confirmation after successful booking creation
 */
export async function exampleBookingConfirmation() {
  const booking = {
    id: 'booking-123',
    bookingNumber: 'BK-2024-001',
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    room: {
      name: 'Deluxe Suite',
    },
    checkInDate: new Date('2024-01-15'),
    checkOutDate: new Date('2024-01-20'),
    numberOfGuests: 2,
    totalAmount: 500.0,
    specialRequests: 'Late check-in requested',
  };

  const result = await sendBookingConfirmationEmail(booking.customer.email, {
    customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
    bookingNumber: booking.bookingNumber,
    roomName: booking.room.name,
    checkInDate: format(booking.checkInDate, 'MMMM dd, yyyy'),
    checkOutDate: format(booking.checkOutDate, 'MMMM dd, yyyy'),
    numberOfGuests: booking.numberOfGuests,
    totalAmount: `$${booking.totalAmount.toFixed(2)}`,
    specialRequests: booking.specialRequests,
  });

  if (result.success) {
    console.log('✓ Booking confirmation email sent successfully');
  } else {
    console.error('✗ Failed to send booking confirmation:', result.error);
  }

  return result;
}

/**
 * Example 2: Send cancellation email when booking is cancelled
 */
export async function exampleBookingCancellation() {
  const booking = {
    bookingNumber: 'BK-2024-001',
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    room: {
      name: 'Deluxe Suite',
    },
    checkInDate: new Date('2024-01-15'),
    checkOutDate: new Date('2024-01-20'),
  };

  const result = await sendBookingCancellationEmail(booking.customer.email, {
    customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
    bookingNumber: booking.bookingNumber,
    roomName: booking.room.name,
    checkInDate: format(booking.checkInDate, 'MMMM dd, yyyy'),
    checkOutDate: format(booking.checkOutDate, 'MMMM dd, yyyy'),
    cancellationDate: format(new Date(), 'MMMM dd, yyyy'),
  });

  if (result.success) {
    console.log('✓ Cancellation email sent successfully');
  } else {
    console.error('✗ Failed to send cancellation email:', result.error);
  }

  return result;
}

/**
 * Example 3: Send welcome email during check-in process
 */
export async function exampleCheckInWelcome() {
  const booking = {
    bookingNumber: 'BK-2024-001',
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    room: {
      name: 'Deluxe Suite',
      roomNumber: '305',
    },
    checkInDate: new Date('2024-01-15'),
    checkOutDate: new Date('2024-01-20'),
  };

  const result = await sendCheckInWelcomeEmail(booking.customer.email, {
    customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
    bookingNumber: booking.bookingNumber,
    roomName: booking.room.name,
    roomNumber: booking.room.roomNumber,
    checkInDate: format(booking.checkInDate, 'MMMM dd, yyyy'),
    checkOutDate: format(booking.checkOutDate, 'MMMM dd, yyyy'),
    wifiPassword: 'Hotel2024!', // Optional - can be omitted
  });

  if (result.success) {
    console.log('✓ Check-in welcome email sent successfully');
  } else {
    console.error('✗ Failed to send welcome email:', result.error);
  }

  return result;
}

/**
 * Example 4: Integration in a server action (booking creation)
 */
export async function createBookingWithEmail(bookingData: any) {
  try {
    // 1. Create booking in database
    // const booking = await db.booking.create({ ... });

    // 2. Send confirmation email (non-blocking)
    // Don't await - let it run in background
    sendBookingConfirmationEmail(bookingData.customerEmail, {
      customerName: bookingData.customerName,
      bookingNumber: 'BK-2024-001', // booking.bookingNumber
      roomName: bookingData.roomName,
      checkInDate: format(bookingData.checkInDate, 'MMMM dd, yyyy'),
      checkOutDate: format(bookingData.checkOutDate, 'MMMM dd, yyyy'),
      numberOfGuests: bookingData.numberOfGuests,
      totalAmount: `$${bookingData.totalAmount.toFixed(2)}`,
      specialRequests: bookingData.specialRequests,
    }).catch((error) => {
      // Log error but don't fail the booking
      console.error('Email sending failed:', error);
      // Optionally: Log to monitoring service (Sentry, etc.)
    });

    return { success: true, message: 'Booking created successfully' };
  } catch (error) {
    console.error('Booking creation failed:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}

/**
 * Example 5: Integration in check-in server action
 */
export async function checkInBookingWithEmail(bookingId: string) {
  try {
    // 1. Update booking status to CHECKED_IN
    // const booking = await db.booking.update({ ... });

    // 2. Update room status to OCCUPIED
    // await db.room.update({ ... });

    // 3. Send welcome email
    // await sendCheckInWelcomeEmail(booking.customer.email, { ... });

    return { success: true, message: 'Check-in completed successfully' };
  } catch (error) {
    console.error('Check-in failed:', error);
    return { success: false, error: 'Failed to complete check-in' };
  }
}

/**
 * Example 6: Error handling best practices
 */
export async function sendEmailWithProperErrorHandling() {
  try {
    const result = await sendBookingConfirmationEmail('customer@example.com', {
      customerName: 'John Doe',
      bookingNumber: 'BK-2024-001',
      roomName: 'Deluxe Suite',
      checkInDate: 'January 15, 2024',
      checkOutDate: 'January 20, 2024',
      numberOfGuests: 2,
      totalAmount: '$500.00',
    });

    if (!result.success) {
      // Log the error
      console.error('Email failed:', result.error);

      // Optionally: Store failed email in database for retry
      // await db.failedEmail.create({ ... });

      // Optionally: Send to monitoring service
      // Sentry.captureException(new Error(result.error));

      // Don't throw - email failure shouldn't break the main flow
      return { emailSent: false, error: result.error };
    }

    return { emailSent: true };
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected email error:', error);
    return { emailSent: false, error: 'Unexpected error' };
  }
}
