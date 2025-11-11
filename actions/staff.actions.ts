'use server';

import { staffService } from '@/lib/services';
import { requireRole } from '@/lib/utils/auth-helpers';
import { revalidatePath } from 'next/cache';
import { loggedCreate, loggedUpdate } from '@/lib/utils/service-with-logging';
import {
  CreateStaffInput,
  UpdateStaffInput,
} from '@/lib/services/staff.service';

/**
 * Create a new staff member with activity logging
 * Only managers can create staff
 */
export async function createStaff(data: CreateStaffInput) {
  try {
    const session = await requireRole(['MANAGER']);

    const staff = await loggedCreate(
      'STAFF',
      session.user.id,
      async () => await staffService.createStaff(data),
      {
        email: data.email,
        role: data.role,
        name: `${data.firstName} ${data.lastName}`,
      }
    );

    revalidatePath('/admin/staff');

    return {
      success: true,
      data: staff,
    };
  } catch (error) {
    console.error('Failed to create staff:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create staff',
    };
  }
}

/**
 * Update a staff member with activity logging
 * Only managers can update staff
 */
export async function updateStaff(id: string, data: UpdateStaffInput) {
  try {
    const session = await requireRole(['MANAGER']);

    const staff = await loggedUpdate(
      'STAFF',
      id,
      session.user.id,
      async () => await staffService.updateStaff(id, data),
      {
        updatedFields: Object.keys(data),
      }
    );

    revalidatePath('/admin/staff');
    revalidatePath(`/admin/staff/${id}`);

    return {
      success: true,
      data: staff,
    };
  } catch (error) {
    console.error('Failed to update staff:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update staff',
    };
  }
}

/**
 * Deactivate a staff member with activity logging
 * Only managers can deactivate staff
 */
export async function deactivateStaff(id: string) {
  try {
    const session = await requireRole(['MANAGER']);

    const staff = await loggedUpdate(
      'STAFF',
      id,
      session.user.id,
      async () => await staffService.updateStaff(id, { isActive: false }),
      {
        action: 'deactivated',
      }
    );

    revalidatePath('/admin/staff');
    revalidatePath(`/admin/staff/${id}`);

    return {
      success: true,
      data: staff,
    };
  } catch (error) {
    console.error('Failed to deactivate staff:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to deactivate staff',
    };
  }
}

/**
 * Activate a staff member with activity logging
 * Only managers can activate staff
 */
export async function activateStaff(id: string) {
  try {
    const session = await requireRole(['MANAGER']);

    const staff = await loggedUpdate(
      'STAFF',
      id,
      session.user.id,
      async () => await staffService.updateStaff(id, { isActive: true }),
      {
        action: 'activated',
      }
    );

    revalidatePath('/admin/staff');
    revalidatePath(`/admin/staff/${id}`);

    return {
      success: true,
      data: staff,
    };
  } catch (error) {
    console.error('Failed to activate staff:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to activate staff',
    };
  }
}
