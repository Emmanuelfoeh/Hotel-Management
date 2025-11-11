import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  handlePaymentSuccess,
  handlePaymentFailure,
  getPaymentByReference,
} from '@/lib/services/payment.service';

/**
 * Verify Paystack webhook signature
 * Ensures the webhook request is from Paystack
 */
function verifyPaystackSignature(payload: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';
  const hash = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

/**
 * POST /api/webhooks/paystack
 * Handle Paystack webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text for signature verification
    const payload = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    if (!signature) {
      console.error('Missing Paystack signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const isValid = verifyPaystackSignature(payload, signature);

    if (!isValid) {
      console.error('Invalid Paystack signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the webhook event
    const event = JSON.parse(payload);

    console.log('Paystack webhook event:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data);
        break;

      case 'transfer.success':
        // Handle refund success if needed
        console.log('Transfer success:', event.data);
        break;

      case 'transfer.failed':
        // Handle refund failure if needed
        console.log('Transfer failed:', event.data);
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 even on error to prevent Paystack from retrying
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 200 }
    );
  }
}

/**
 * Handle successful charge event
 */
async function handleChargeSuccess(data: any) {
  try {
    const reference = data.reference;

    console.log('Processing successful charge:', reference);

    // Verify payment exists in our database
    const paymentResult = await getPaymentByReference(reference);

    if (!paymentResult.success || !paymentResult.payment) {
      console.error('Payment not found for reference:', reference);
      return;
    }

    // Handle payment success
    const result = await handlePaymentSuccess(reference);

    if (!result.success) {
      console.error('Failed to process payment success:', result.error);
      return;
    }

    console.log('Payment processed successfully:', reference);

    // TODO: Send confirmation email to customer
    // This will be implemented in task 8 (Email notification system)
    const booking = paymentResult.payment.booking;
    if (booking && booking.customer) {
      console.log(
        'TODO: Send booking confirmation email to:',
        booking.customer.email
      );
    }
  } catch (error) {
    console.error('Error handling charge success:', error);
  }
}

/**
 * Handle failed charge event
 */
async function handleChargeFailed(data: any) {
  try {
    const reference = data.reference;
    const reason = data.gateway_response || 'Payment failed';

    console.log('Processing failed charge:', reference, reason);

    // Verify payment exists in our database
    const paymentResult = await getPaymentByReference(reference);

    if (!paymentResult.success || !paymentResult.payment) {
      console.error('Payment not found for reference:', reference);
      return;
    }

    // Handle payment failure
    const result = await handlePaymentFailure(reference, reason);

    if (!result.success) {
      console.error('Failed to process payment failure:', result.error);
      return;
    }

    console.log('Payment failure processed:', reference);

    // TODO: Send payment failure notification to customer
    // This will be implemented in task 8 (Email notification system)
    const booking = paymentResult.payment.booking;
    if (booking && booking.customer) {
      console.log(
        'TODO: Send payment failure notification to:',
        booking.customer.email
      );
    }
  } catch (error) {
    console.error('Error handling charge failure:', error);
  }
}

/**
 * GET /api/webhooks/paystack
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Paystack webhook endpoint is active',
  });
}
