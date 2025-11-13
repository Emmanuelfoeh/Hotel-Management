/**
 * Environment Variable Validation
 *
 * This module validates all required environment variables at build time
 * and provides type-safe access to environment variables throughout the app.
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_URL: z.string().url().min(1, 'NEXTAUTH_URL is required'),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  // Paystack
  PAYSTACK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string(),

  // Email
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),

  // File Upload
  UPLOADTHING_SECRET: z.string(),
  UPLOADTHING_APP_ID: z.string(),

  // Application
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .min(1, 'NEXT_PUBLIC_APP_URL is required'),
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .optional()
    .default('Hotel Management System'),

  // Optional: Error Tracking
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),

  // Optional: Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Optional: Development
  DEBUG: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

// Type for validated environment variables
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables and throws an error if any are invalid
 * This function is called at build time to catch configuration errors early
 */
function validateEnv(): Env {
  try {
    const env = envSchema.parse({
      // Database
      DATABASE_URL: process.env.DATABASE_URL,

      // NextAuth
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

      // // Paystack
      PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:
        process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,

      // // Email
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      EMAIL_FROM: process.env.EMAIL_FROM,

      // // File Upload
      UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
      UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,

      // // Application
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,

      // // Optional
      // NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      // SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
      // SENTRY_ORG: process.env.SENTRY_ORG,
      // SENTRY_PROJECT: process.env.SENTRY_PROJECT,
      // NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      // DEBUG: process.env.DEBUG,
      // NODE_ENV: process.env.NODE_ENV,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => {
        return `  ❌ ${err.path.join('.')}: ${err.message}`;
      });

      console.error('\n❌ Invalid environment variables:\n');
      console.error(missingVars.join('\n'));
      console.error(
        '\n💡 Please check your .env.local file and ensure all required variables are set.'
      );
      console.error('📖 See .env.example for reference.\n');

      throw new Error('Invalid environment variables');
    }
    throw error;
  }
}

// Validate environment variables on module load
export const env = validateEnv();

/**
 * Helper function to check if we're in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper function to check if we're in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper function to check if debug mode is enabled
 */
export const isDebugEnabled = env.DEBUG === 'true';
