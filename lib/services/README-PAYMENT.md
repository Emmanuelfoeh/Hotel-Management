# Payment Integration Guide

This document explains how the Paystack payment integration works in the Hotel Management System.

## Overview

The payment system uses Paystack as the payment gateway to process online bookings. It includes:

1. **Payment Service** (`payment.service.ts`) - Core payment logic
2. **Webhook Handler** (`app/api/webhooks/paystack/route.ts`) - Handles Paystack callbacks
3. **Payment Actions** (`actions/payment.actions.ts`) - Server actions for frontend
4. **Payment Validations** (`validations/payment.ts`) - Input validation schemas

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
PAYSTACK_SECRET_KEY="sk_test_your_secret_key"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_public_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Get your API keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer).

### 2. Webhook Configuration

Configure the webhook URL in your Paystack dashboard:

**Webhook URL:** `https://yourdomain.com/api/webhooks/paystack`

**Events to subscribe to:**

- `charge.success` - Payment successful
- `charge.failed` - Payment failed

The webhook handler automatically verifies the signature to ensure requests are from Paystack.

## Usage

### Initialize Payment

```typescript
import { initializePaymentAction } from '@/actions/payment.actions';

const result = await initializePaymentAction({
  bookingId: 'booking_id',
  email: 'customer@example.com',
  amount: 50000, // Amount in Naira (will be converted to kobo)
  metadata: {
    customerName: 'John Doe',
    roomNumber: '101',
  },
});

if (result.success) {
  // Redirect user to payment page
  window.location.href = result.authorizationUrl;
}
```

### Verify Payment

After payment, Paystack redirects to your callback URL with a reference parameter:

```typescript
import { verifyPaymentAction } from '@/actions/payment.actions';

const result = await verifyPaymentAction(reference);

if (result.success) {
  // Payment verified and booking updated
  console.log('Payment successful:', result.payment);
}
```

### Get Payment Details

```typescript
import { getPaymentByBookingAction } from '@/actions/payment.actions';

const result = await getPaymentByBookingAction(bookingId);

if (result.success && result.payment) {
  console.log('Payment status:', result.payment.paymentStatus);
}
```

## Payment Flow

1. **Customer initiates booking** → Creates booking with PENDING payment status
2. **Initialize payment** → Calls Paystack API to create payment intent
3. **Redirect to Paystack** → Customer completes payment on Paystack's secure page
4. **Paystack processes payment** → Sends webhook to our API
5. **Webhook handler** → Verifies signature and updates payment/booking status
6. **Customer redirected back** → Shows confirmation page

## Webhook Events

### charge.success

Triggered when payment is successful:

- Updates payment status to PAID
- Updates booking payment status to PAID
- Records transaction ID and payment date
- TODO: Sends confirmation email (Task 8)

### charge.failed

Triggered when payment fails:

- Updates payment status to FAILED
- Updates booking payment status to FAILED
- Records failure reason
- TODO: Sends failure notification (Task 8)

## Security

1. **Signature Verification**: All webhook requests are verified using HMAC SHA512
2. **Environment Variables**: Secret keys are stored securely in environment variables
3. **HTTPS Only**: Webhooks only work over HTTPS in production
4. **Idempotency**: Payment operations are idempotent to prevent duplicate processing

## Testing

### Test Mode

Use Paystack test keys for development:

- Test Secret Key: `sk_test_...`
- Test Public Key: `pk_test_...`

### Test Cards

Use these test cards in test mode:

**Successful Payment:**

- Card: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Payment:**

- Card: `5060666666666666666`
- CVV: Any 3 digits
- Expiry: Any future date

### Testing Webhooks Locally

Use a tool like [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 3000
```

Then configure the ngrok URL in Paystack dashboard:

```
https://your-ngrok-url.ngrok.io/api/webhooks/paystack
```

## Error Handling

All payment functions return a consistent response format:

```typescript
{
  success: boolean;
  error?: string;
  // ... additional data
}
```

Errors are logged to the console and can be integrated with error tracking services like Sentry.

## Database Schema

### Payment Model

```prisma
model Payment {
  id            String        @id @default(cuid())
  bookingId     String
  amount        Decimal       @db.Decimal(10, 2)
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus
  transactionId String?       @unique
  paystackRef   String?
  paidAt        DateTime?
  createdAt     DateTime      @default(now())

  booking Booking @relation(fields: [bookingId], references: [id])
}
```

## Future Enhancements

- Refund processing
- Partial payments
- Payment plans/installments
- Multiple payment methods
- Payment analytics dashboard
- Automated reconciliation

## Support

For Paystack-specific issues, refer to:

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api)
- [Paystack Support](https://paystack.com/support)
