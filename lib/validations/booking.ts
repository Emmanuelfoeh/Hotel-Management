import { z } from 'zod';

// Enums
export const BookingStatusSchema = z.enum([
  'CONFIRMED',
  'CHECKED_IN',
  'CHECKED_OUT',
  'CANCELLED',
]);

export const PaymentStatusSchema = z.enum([
  'PENDING',
  'PAID',
  'REFUNDED',
  'FAILED',
]);

export const BookingSourceSchema = z.enum([
  'ONLINE',
  'MANUAL',
  'PHONE',
  'WALKIN',
]);

// Booking validation schemas
export const createBookingSchema = z
  .object({
    roomId: z.string().cuid('Invalid room ID'),
    customerId: z.string().cuid('Invalid customer ID'),
    checkInDate: z.date().or(z.string().datetime()),
    checkOutDate: z.date().or(z.string().datetime()),
    numberOfGuests: z
      .number()
      .int('Number of guests must be a whole number')
      .positive('Number of guests must be positive')
      .max(20, 'Number of guests cannot exceed 20'),
    totalAmount: z
      .number()
      .positive('Total amount must be positive')
      .max(9999999.99, 'Total amount is too high')
      .or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format')),
    paymentStatus: PaymentStatusSchema.default('PENDING'),
    bookingStatus: BookingStatusSchema.default('CONFIRMED'),
    specialRequests: z
      .string()
      .max(2000, 'Special requests are too long')
      .optional(),
    source: BookingSourceSchema.default('ONLINE'),
    createdById: z.string().cuid('Invalid staff ID').optional().nullable(),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      return checkOut > checkIn;
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOutDate'],
    }
  )
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return checkIn >= today;
    },
    {
      message: 'Check-in date cannot be in the past',
      path: ['checkInDate'],
    }
  );

export const updateBookingSchema = z
  .object({
    id: z.string().cuid('Invalid booking ID'),
    roomId: z.string().cuid('Invalid room ID').optional(),
    customerId: z.string().cuid('Invalid customer ID').optional(),
    checkInDate: z.date().or(z.string().datetime()).optional(),
    checkOutDate: z.date().or(z.string().datetime()).optional(),
    numberOfGuests: z
      .number()
      .int('Number of guests must be a whole number')
      .positive('Number of guests must be positive')
      .max(20, 'Number of guests cannot exceed 20')
      .optional(),
    totalAmount: z
      .number()
      .positive('Total amount must be positive')
      .max(9999999.99, 'Total amount is too high')
      .or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'))
      .optional(),
    paymentStatus: PaymentStatusSchema.optional(),
    bookingStatus: BookingStatusSchema.optional(),
    specialRequests: z
      .string()
      .max(2000, 'Special requests are too long')
      .optional(),
    source: BookingSourceSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.checkInDate && data.checkOutDate) {
        const checkIn = new Date(data.checkInDate);
        const checkOut = new Date(data.checkOutDate);
        return checkOut > checkIn;
      }
      return true;
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOutDate'],
    }
  );

export const bookingIdSchema = z.object({
  id: z.string().cuid('Invalid booking ID'),
});

export const checkInSchema = z.object({
  id: z.string().cuid('Invalid booking ID'),
});

export const checkOutSchema = z.object({
  id: z.string().cuid('Invalid booking ID'),
});

export const cancelBookingSchema = z.object({
  id: z.string().cuid('Invalid booking ID'),
  reason: z.string().max(500, 'Cancellation reason is too long').optional(),
});

export const bookingSearchSchema = z.object({
  query: z.string().optional(),
  status: BookingStatusSchema.optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  roomId: z.string().cuid('Invalid room ID').optional(),
  customerId: z.string().cuid('Invalid customer ID').optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  source: BookingSourceSchema.optional(),
});

export const bookingCalendarSchema = z.object({
  startDate: z.date().or(z.string().datetime()),
  endDate: z.date().or(z.string().datetime()),
  roomId: z.string().cuid('Invalid room ID').optional(),
});

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingSearchInput = z.infer<typeof bookingSearchSchema>;
export type BookingCalendarInput = z.infer<typeof bookingCalendarSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type BookingSource = z.infer<typeof BookingSourceSchema>;
