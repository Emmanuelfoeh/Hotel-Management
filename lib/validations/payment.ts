import { z } from 'zod';

// Enums
export const PaymentMethodSchema = z.enum([
  'CASH',
  'CARD',
  'PAYSTACK',
  'BANK_TRANSFER',
]);

export const PaymentStatusSchema = z.enum([
  'PENDING',
  'PAID',
  'REFUNDED',
  'FAILED',
]);

// Payment initialization schema
export const initializePaymentSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
  email: z.string().email('Invalid email address'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(99999999, 'Amount is too high'),
  reference: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Payment verification schema
export const verifyPaymentSchema = z.object({
  reference: z.string().min(1, 'Payment reference is required'),
});

// Payment update schema
export const updatePaymentStatusSchema = z.object({
  reference: z.string().min(1, 'Payment reference is required'),
  status: PaymentStatusSchema,
  transactionId: z.string().optional(),
  paidAt: z.date().or(z.string().datetime()).optional(),
});

// Payment query schema
export const getPaymentByBookingSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
});

export const getPaymentByReferenceSchema = z.object({
  reference: z.string().min(1, 'Payment reference is required'),
});

// Webhook event schema
export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    reference: z.string(),
    amount: z.number().optional(),
    status: z.string().optional(),
    paid_at: z.string().optional(),
    channel: z.string().optional(),
    currency: z.string().optional(),
    id: z.number().optional(),
    gateway_response: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

// Type exports
export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;
export type GetPaymentByBookingInput = z.infer<
  typeof getPaymentByBookingSchema
>;
export type GetPaymentByReferenceInput = z.infer<
  typeof getPaymentByReferenceSchema
>;
export type PaystackWebhookEvent = z.infer<typeof paystackWebhookSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
