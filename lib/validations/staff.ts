import { z } from 'zod';

// Enums
export const StaffRoleSchema = z.enum(['MANAGER', 'RECEPTIONIST', 'CLEANER']);

// Staff validation schemas
export const createStaffSchema = z.object({
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
  role: StaffRoleSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  isActive: z.boolean(),
  hireDate: z.date().or(z.string().datetime()).optional().nullable(),
  notes: z.string().max(2000, 'Notes are too long').optional(),
});

export const updateStaffSchema = z.object({
  id: z.string().cuid('Invalid staff ID'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(100, 'Email is too long')
    .toLowerCase()
    .optional(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number is too long')
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format')
    .optional(),
  role: StaffRoleSchema.optional(),
  isActive: z.boolean().optional(),
  hireDate: z.date().or(z.string().datetime()).optional().nullable(),
  notes: z.string().max(2000, 'Notes are too long').optional(),
});

export const updateStaffPasswordSchema = z
  .object({
    id: z.string().cuid('Invalid staff ID'),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const staffIdSchema = z.object({
  id: z.string().cuid('Invalid staff ID'),
});

export const staffLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const staffSearchSchema = z.object({
  query: z.string().optional(),
  role: StaffRoleSchema.optional(),
  isActive: z.boolean().optional(),
  email: z.string().email('Invalid email address').optional(),
});

// Type exports
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type UpdateStaffPasswordInput = z.infer<
  typeof updateStaffPasswordSchema
>;
export type StaffLoginInput = z.infer<typeof staffLoginSchema>;
export type StaffSearchInput = z.infer<typeof staffSearchSchema>;
export type StaffRole = z.infer<typeof StaffRoleSchema>;
