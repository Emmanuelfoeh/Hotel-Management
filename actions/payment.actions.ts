'use server';

import { revalidatePath } from 'next/cache';
import {
  initializePayment,
  verifyPayment,
  handlePaymentSuccess,
  getPaymentByBookingId,
  getPaymentByReference,
} from '@/lib/services/payment.service';
import {
  initializePaymentSchema,
  verifyPaymentSchema,
  getPaymentByBookingSchema,
  getPaymentByReferenceSchema,
} from '@/lib/validations/payment';

/**
 * Initialize a payment for a booking
 */
export async function initializePaymentAction(data: {
  bookingId: string;
  email: string;
  amount: number;
  metadata?: Record<string, unknown>;
}) {
  try {
    // Validate input
    const validated = initializePaymentSchema.parse(data);

    // Convert amount to kobo (Paystack uses smallest currency unit)
    const amountInKobo = Math.round(validated.amount * 100);

    // Initialize payment
    const result = await initializePayment({
      ...validated,
      amount: amountInKobo,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to initialize payment',
      };
    }

    return {
      success: true,
      authorizationUrl: result.authorizationUrl,
      reference: result.reference,
    };
  } catch (error) {
    console.error('Initialize payment action error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to initialize payment',
    };
  }
}

/**
 * Verify a payment after redirect from Paystack
 */
export async function verifyPaymentAction(reference: string) {
  try {
    // Validate input
    const validated = verifyPaymentSchema.parse({ reference });

    // Verify payment
    const result = await verifyPayment(validated.reference);

    if (!result.success) {
      return {
        success: false,
        error: result.message || 'Payment verification failed',
      };
    }

    // Handle successful payment
    const successResult = await handlePaymentSuccess(validated.reference);

    if (!successResult.success) {
      return {
        success: false,
        error: successResult.error || 'Failed to process payment',
      };
    }

    // Revalidate relevant paths
    revalidatePath('/admin/bookings');
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      payment: successResult.payment,
      transactionData: successResult.transactionData,
    };
  } catch (error) {
    console.error('Verify payment action error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

/**
 * Get payment details by booking ID
 */
export async function getPaymentByBookingAction(bookingId: string) {
  try {
    // Validate input
    const validated = getPaymentByBookingSchema.parse({ bookingId });

    // Get payment
    const result = await getPaymentByBookingId(validated.bookingId);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to retrieve payment',
      };
    }

    return {
      success: true,
      payment: result.payment,
    };
  } catch (error) {
    console.error('Get payment by booking action error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to retrieve payment',
    };
  }
}

/**
 * Get payment details by reference
 */
export async function getPaymentByReferenceAction(reference: string) {
  try {
    // Validate input
    const validated = getPaymentByReferenceSchema.parse({ reference });

    // Get payment
    const result = await getPaymentByReference(validated.reference);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to retrieve payment',
      };
    }

    return {
      success: true,
      payment: result.payment,
    };
  } catch (error) {
    console.error('Get payment by reference action error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to retrieve payment',
    };
  }
}
