import { z, ZodError, ZodSchema } from 'zod';

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> };

/**
 * Validates data against a Zod schema and returns a structured result
 */
export function validateData<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        success: false,
        error: 'Validation failed',
        errors: fieldErrors,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred during validation',
    };
  }
}

/**
 * Validates data against a Zod schema and throws an error if validation fails
 */
export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validates data and returns the data or null if validation fails
 */
export function validateSafe<T>(schema: ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Formats Zod errors into a user-friendly error message
 */
export function formatZodError(error: ZodError): string {
  return error.issues
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
}

/**
 * Extracts field errors from a Zod error for form handling
 */
export function getFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = err.message;
    }
  });
  return fieldErrors;
}

/**
 * Validates multiple fields and returns all errors
 */
export function validateMultiple<T extends Record<string, ZodSchema>>(
  schemas: T,
  data: Record<string, unknown>
): ValidationResult<{ [K in keyof T]: z.infer<T[K]> }> {
  const errors: Record<string, string[]> = {};
  const validatedData: Record<string, unknown> = {};

  for (const [key, schema] of Object.entries(schemas)) {
    try {
      validatedData[key] = schema.parse(data[key]);
    } catch (error) {
      if (error instanceof ZodError) {
        errors[key] = error.issues.map((err) => err.message);
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: 'Validation failed for multiple fields',
      errors,
    };
  }

  return {
    success: true,
    data: validatedData as { [K in keyof T]: z.infer<T[K]> },
  };
}

/**
 * Creates a partial schema from an existing schema (makes all fields optional)
 */
export function createPartialSchema<T extends ZodSchema>(
  schema: T
): z.ZodOptional<T> {
  return schema.optional();
}

/**
 * Validates pagination parameters
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Validates date range parameters
 */
export const dateRangeSchema = z
  .object({
    startDate: z.date().or(z.string().datetime()),
    endDate: z.date().or(z.string().datetime()),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

/**
 * Validates ID parameter
 */
export const idSchema = z.string().cuid('Invalid ID format');

/**
 * Common validation patterns
 */
export const commonPatterns = {
  email: z.string().email('Invalid email address').toLowerCase(),
  phone: z.string().regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format'),
  url: z.string().url('Invalid URL format'),
  positiveNumber: z.number().positive('Must be a positive number'),
  positiveInteger: z.number().int().positive('Must be a positive integer'),
  percentage: z.number().min(0).max(100, 'Must be between 0 and 100'),
  currency: z
    .number()
    .positive('Amount must be positive')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid currency format')),
};

/**
 * Sanitizes string input by trimming whitespace
 */
export function sanitizeString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  return String(value);
}

/**
 * Converts string to number safely
 */
export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Converts string to date safely
 */
export function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}
