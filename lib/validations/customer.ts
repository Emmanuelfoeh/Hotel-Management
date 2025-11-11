import { z } from 'zod';

// Customer validation schemas
export const createCustomerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(100, 'Email is too long')
    .toLowerCase(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number is too long')
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format'),
  address: z.string().max(200, 'Address is too long').optional(),
  city: z.string().max(100, 'City name is too long').optional(),
  country: z.string().max(100, 'Country name is too long').optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  id: z.string().cuid('Invalid customer ID'),
});

export const customerIdSchema = z.object({
  id: z.string().cuid('Invalid customer ID'),
});

export const customerSearchSchema = z.object({
  query: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

// Type exports
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerSearchInput = z.infer<typeof customerSearchSchema>;
