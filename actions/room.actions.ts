'use server';

import { roomService } from '@/lib/services';
import { requirePermission } from '@/lib/utils/auth-helpers';
import { revalidatePath } from 'next/cache';
import {
  loggedCreate,
  loggedUpdate,
  loggedDelete,
} from '@/lib/utils/service-with-logging';
import { CreateRoomInput, UpdateRoomInput } from '@/lib/services/room.service';

/**
 * Create a new room with activity logging
 */
export async function createRoom(data: CreateRoomInput) {
  try {
    const session = await requirePermission('rooms:create');

    const room = await loggedCreate(
      'ROOM',
      session.user.id,
      async () => await roomService.createRoom(data),
      {
        roomNumber: data.roomNumber,
        type: data.type,
        price: data.price,
      }
    );

    revalidatePath('/admin/rooms');

    return {
      success: true,
      data: room,
    };
  } catch (error) {
    console.error('Failed to create room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create room',
    };
  }
}

/**
 * Update a room with activity logging
 */
export async function updateRoom(id: string, data: UpdateRoomInput) {
  try {
    const session = await requirePermission('rooms:update');

    const room = await loggedUpdate(
      'ROOM',
      id,
      session.user.id,
      async () => await roomService.updateRoom(id, data),
      {
        updatedFields: Object.keys(data),
      }
    );

    revalidatePath('/admin/rooms');
    revalidatePath(`/admin/rooms/${id}`);

    return {
      success: true,
      data: room,
    };
  } catch (error) {
    console.error('Failed to update room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update room',
    };
  }
}

/**
 * Delete a room with activity logging
 */
export async function deleteRoom(id: string) {
  try {
    const session = await requirePermission('rooms:delete');

    // Get room details before deletion for logging
    const room = await roomService.getRoomById(id);
    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    await loggedDelete(
      'ROOM',
      id,
      session.user.id,
      async () => await roomService.deleteRoom(id),
      {
        roomNumber: room.roomNumber,
        name: room.name,
      }
    );

    revalidatePath('/admin/rooms');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to delete room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete room',
    };
  }
}

/**
 * Update room status with activity logging
 */
export async function updateRoomStatus(
  id: string,
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE'
) {
  try {
    const session = await requirePermission('rooms:update');

    const room = await loggedUpdate(
      'ROOM',
      id,
      session.user.id,
      async () => await roomService.updateRoomStatus(id, status),
      {
        newStatus: status,
      }
    );

    revalidatePath('/admin/rooms');
    revalidatePath(`/admin/rooms/${id}`);

    return {
      success: true,
      data: room,
    };
  } catch (error) {
    console.error('Failed to update room status:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update room status',
    };
  }
}
