import paystack from 'paystack';
import { prisma } from '@/lib/db';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { env } from '@/lib/env';

// Initialize Paystack with secret key
const paystackClient = paystack(env.PAYSTACK_SECRET_KEY);

export interface PaymentInitializationData {
  email: string;
  amount: number; // Amount in kobo (smallest currency unit)
  bookingId: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerificationResult {
  success: boolean;
  data?: {
    reference: string;
    amount: number;
    status: string;
    paidAt: Date;
    channel: string;
    currency: string;
    transactionId: string;
  };
  message?: string;
}

/**
 * Initialize a payment with Paystack
 * Creates a payment intent and returns authorization URL
 */
export async function initializePayment(data: PaymentInitializationData) {
  try {
    const { email, amount, bookingId, reference, metadata } = data;

    // Generate unique reference if not provided
    const paymentReference = reference || `HMS-${bookingId}-${Date.now()}`;

    // Initialize transaction with Paystack
    const response = await paystackClient.transaction.initialize({
      email,
      amount, // Amount in kobo
      reference: paymentReference,
      metadata: {
        bookingId,
        ...metadata,
      },
      callback_url: `${env.NEXT_PUBLIC_APP_URL}/booking/confirmation`,
    });

    if (!response.status) {
      throw new Error(response.message || 'Failed to initialize payment');
    }

    // Create payment record in database
    await prisma.payment.create({
      data: {
        bookingId,
        amount: amount / 100, // Convert kobo to naira for storage
        paymentMethod: PaymentMethod.PAYSTACK,
        paymentStatus: PaymentStatus.PENDING,
        paystackRef: paymentReference,
      },
    });

    return {
      success: true,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      reference: paymentReference,
    };
  } catch (error) {
    console.error('Payment initialization error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Payment initialization failed',
    };
  }
}

/**
 * Verify a payment with Paystack
 * Checks if payment was successful and returns transaction details
 */
export async function verifyPayment(
  reference: string
): Promise<PaymentVerificationResult> {
  try {
    // Verify transaction with Paystack
    const response = await paystackClient.transaction.verify(reference);

    if (!response.status) {
      return {
        success: false,
        message: response.message || 'Payment verification failed',
      };
    }

    const transaction = response.data;

    // Check if payment was successful
    if (transaction.status !== 'success') {
      return {
        success: false,
        message: `Payment status: ${transaction.status}`,
      };
    }

    return {
      success: true,
      data: {
        reference: transaction.reference,
        amount: transaction.amount / 100, // Convert kobo to naira
        status: transaction.status,
        paidAt: new Date(transaction.paid_at),
        channel: transaction.channel,
        currency: transaction.currency,
        transactionId: transaction.id.toString(),
      },
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

/**
 * Update payment status in database
 * Updates both payment and booking records
 */
export async function updatePaymentStatus(
  reference: string,
  status: PaymentStatus,
  transactionId?: string,
  paidAt?: Date
) {
  try {
    // Find payment by reference
    const payment = await prisma.payment.findFirst({
      where: { paystackRef: reference },
      include: { booking: true },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update payment record
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: status,
        transactionId,
        paidAt,
      },
    });

    // Update booking payment status
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: status,
      },
    });

    return {
      success: true,
      payment: updatedPayment,
    };
  } catch (error) {
    console.error('Payment status update error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update payment status',
    };
  }
}

/**
 * Handle successful payment
 * Verifies payment and updates records
 */
export async function handlePaymentSuccess(reference: string) {
  try {
    // Verify payment with Paystack
    const verification = await verifyPayment(reference);

    if (!verification.success || !verification.data) {
      throw new Error(verification.message || 'Payment verification failed');
    }

    // Update payment status
    const result = await updatePaymentStatus(
      reference,
      PaymentStatus.PAID,
      verification.data.transactionId,
      verification.data.paidAt
    );

    if (!result.success) {
      throw new Error(result.error || 'Failed to update payment status');
    }

    return {
      success: true,
      payment: result.payment,
      transactionData: verification.data,
    };
  } catch (error) {
    console.error('Payment success handler error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to process payment',
    };
  }
}

/**
 * Handle failed payment
 * Updates payment status to failed
 */
export async function handlePaymentFailure(reference: string, reason?: string) {
  try {
    const result = await updatePaymentStatus(reference, PaymentStatus.FAILED);

    if (!result.success) {
      throw new Error(result.error || 'Failed to update payment status');
    }

    return {
      success: true,
      message: 'Payment marked as failed',
      reason,
    };
  } catch (error) {
    console.error('Payment failure handler error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to process payment failure',
    };
  }
}

/**
 * Get payment by booking ID
 */
export async function getPaymentByBookingId(bookingId: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { bookingId },
      include: {
        booking: {
          include: {
            room: true,
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      payment,
    };
  } catch (error) {
    console.error('Get payment error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to retrieve payment',
    };
  }
}

/**
 * Get payment by reference
 */
export async function getPaymentByReference(reference: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { paystackRef: reference },
      include: {
        booking: {
          include: {
            room: true,
            customer: true,
          },
        },
      },
    });

    return {
      success: true,
      payment,
    };
  } catch (error) {
    console.error('Get payment error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to retrieve payment',
    };
  }
}
