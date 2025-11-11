'use server';

import { customerService } from '@/lib/services';
import { requirePermission } from '@/lib/utils/auth-helpers';
import { revalidatePath } from 'next/cache';
import { loggedCreate, loggedUpdate } from '@/lib/utils/service-with-logging';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '@/lib/services/customer.service';

/**
 * Create a new customer with activity logging
 */
export async function createCustomer(data: CreateCustomerInput) {
  try {
    const session = await requirePermission('customers:create');

    const customer = await loggedCreate(
      'CUSTOMER',
      session.user.id,
      async () => await customerService.createCustomer(data),
      {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      }
    );

    revalidatePath('/admin/customers');

    return {
      success: true,
      data: customer,
    };
  } catch (error) {
    console.error('Failed to create customer:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create customer',
    };
  }
}

/**
 * Update a customer with activity logging
 */
export async function updateCustomer(id: string, data: UpdateCustomerInput) {
  try {
    const session = await requirePermission('customers:update');

    const customer = await loggedUpdate(
      'CUSTOMER',
      id,
      session.user.id,
      async () => await customerService.updateCustomer(id, data),
      {
        updatedFields: Object.keys(data),
      }
    );

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${id}`);

    return {
      success: true,
      data: customer,
    };
  } catch (error) {
    console.error('Failed to update customer:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update customer',
    };
  }
}
