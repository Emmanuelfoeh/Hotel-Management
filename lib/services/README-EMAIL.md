# Email Service Documentation

## Overview

The email service provides functionality for sending transactional emails to customers using Resend. It includes pre-built templates for booking confirmations, cancellations, and check-in welcome messages.

## Setup

### 1. Install Dependencies

The `resend` package is already installed. If you need to reinstall:

```bash
npm install resend
```

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="Hotel Management <noreply@yourdomain.com>"
```

**Getting a Resend API Key:**

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Generate an API key from the dashboard
4. Add it to your environment variables

## Usage

### Import the Service

```typescript
import {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendCheckInWelcomeEmail,
  sendEmail,
} from '@/lib/services/email.service';
```

### Send Booking Confirmation Email

```typescript
const result = await sendBookingConfirmationEmail('customer@example.com', {
  customerName: 'John Doe',
  bookingNumber: 'BK-2024-001',
  roomName: 'Deluxe Suite',
  checkInDate: 'January 15, 2024',
  checkOutDate: 'January 20, 2024',
  numberOfGuests: 2,
  totalAmount: '$500.00',
  specialRequests: 'Late check-in requested',
});

if (result.success) {
  console.log('Email sent successfully');
} else {
  console.error('Email failed:', result.error);
}
```

### Send Booking Cancellation Email

```typescript
const result = await sendBookingCancellationEmail('customer@example.com', {
  customerName: 'John Doe',
  bookingNumber: 'BK-2024-001',
  roomName: 'Deluxe Suite',
  checkInDate: 'January 15, 2024',
  checkOutDate: 'January 20, 2024',
  cancellationDate: 'January 10, 2024',
});
```

### Send Check-in Welcome Email

```typescript
const result = await sendCheckInWelcomeEmail('customer@example.com', {
  customerName: 'John Doe',
  bookingNumber: 'BK-2024-001',
  roomName: 'Deluxe Suite',
  roomNumber: '305',
  checkInDate: 'January 15, 2024',
  checkOutDate: 'January 20, 2024',
  wifiPassword: 'Hotel2024!', // Optional
});
```

### Send Custom Email

```typescript
const result = await sendEmail({
  to: 'customer@example.com',
  subject: 'Custom Subject',
  html: '<h1>Custom HTML Content</h1>',
});
```

## Email Templates

### Booking Confirmation Template

Features:

- Professional header with teal branding
- Booking details in a highlighted box
- Total amount prominently displayed
- Responsive design
- Mobile-friendly layout

### Booking Cancellation Template

Features:

- Red-themed header for cancellation
- Cancelled booking details
- Refund information box
- Professional and empathetic tone

### Check-in Welcome Template

Features:

- Welcoming banner with gradient
- Room information and details
- WiFi credentials (if provided)
- Hotel amenities list
- Contact information for assistance

## Error Handling

All email functions return a result object:

```typescript
{
  success: boolean;
  data?: any;      // Resend response data (if successful)
  error?: string;  // Error message (if failed)
}
```

Example error handling:

```typescript
const result = await sendBookingConfirmationEmail(email, data);

if (!result.success) {
  // Log error for debugging
  console.error('Failed to send email:', result.error);

  // Don't block the main operation
  // Email failures should be logged but not prevent booking creation

  // Optionally: Queue for retry or notify admin
}
```

## Best Practices

1. **Don't Block Operations**: Email sending should not prevent critical operations (like creating bookings). Always handle email failures gracefully.

2. **Use Try-Catch**: Wrap email calls in try-catch blocks in server actions:

   ```typescript
   try {
     await sendBookingConfirmationEmail(email, data);
   } catch (error) {
     console.error('Email error:', error);
     // Continue with the operation
   }
   ```

3. **Test Mode**: Use Resend's test mode during development to avoid sending real emails.

4. **Rate Limits**: Be aware of Resend's rate limits on your plan.

5. **Email Validation**: Always validate email addresses before sending.

6. **Logging**: Log all email attempts for debugging and audit purposes.

## Integration Examples

### In Booking Creation (Server Action)

```typescript
// actions/booking.actions.ts
export async function createBooking(data: BookingFormData) {
  try {
    // Create booking in database
    const booking = await db.booking.create({ ... });

    // Send confirmation email (non-blocking)
    sendBookingConfirmationEmail(
      data.customerEmail,
      {
        customerName: data.customerName,
        bookingNumber: booking.bookingNumber,
        // ... other data
      }
    ).catch(error => {
      console.error('Email failed:', error);
      // Log to monitoring service
    });

    return { success: true, booking };
  } catch (error) {
    return { success: false, error: 'Failed to create booking' };
  }
}
```

### In Check-in Process

```typescript
// actions/booking.actions.ts
export async function checkInBooking(bookingId: string) {
  try {
    // Update booking status
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { bookingStatus: 'CHECKED_IN' },
      include: { customer: true, room: true },
    });

    // Send welcome email
    await sendCheckInWelcomeEmail(booking.customer.email, {
      customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
      bookingNumber: booking.bookingNumber,
      roomName: booking.room.name,
      roomNumber: booking.room.roomNumber,
      checkInDate: format(booking.checkInDate, 'MMMM dd, yyyy'),
      checkOutDate: format(booking.checkOutDate, 'MMMM dd, yyyy'),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Check-in failed' };
  }
}
```

## Testing

### Development Testing

Use Resend's test mode or a service like [Mailtrap](https://mailtrap.io) for testing emails without sending to real addresses.

### Test Email Addresses

Resend provides test email addresses that won't actually send emails:

- `delivered@resend.dev` - Simulates successful delivery
- `bounced@resend.dev` - Simulates bounce
- `complained@resend.dev` - Simulates spam complaint

## Troubleshooting

### Email Not Sending

1. Check API key is correct in `.env.local`
2. Verify domain is verified in Resend dashboard
3. Check Resend dashboard for error logs
4. Ensure `EMAIL_FROM` matches verified domain

### Template Not Rendering

1. Check HTML syntax in template functions
2. Verify all data fields are provided
3. Test with simple HTML first

### Rate Limit Errors

1. Check your Resend plan limits
2. Implement queuing for bulk emails
3. Add delays between emails if needed

## Future Enhancements

Potential improvements:

- Email queue system for retry logic
- Template customization via admin panel
- Email analytics and tracking
- Bulk email functionality
- Email preferences management
- Attachment support
- Multi-language templates
