'use server';

import { prisma } from '@/lib/db';
import { z } from 'zod';

const createCustomerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

/**
 * Public customer creation (for signup - no authentication required)
 */
export async function createPublicCustomer(
  data: z.infer<typeof createCustomerSchema>
) {
  try {
    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }

    // Create customer (no password - customers don't authenticate)
    const customer = await prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
      },
    });

    return {
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: 'Failed to create account. Please try again.',
    };
  }
}
