'use server';

import { roomService } from '@/lib/services';
import { RoomType } from '@/types';

/**
 * Get all available rooms for public viewing
 */
export async function getPublicRooms(filters?: {
  type?: RoomType;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
}) {
  try {
    const rooms = await roomService.getRooms({
      ...filters,
      status: 'AVAILABLE', // Only show available rooms to public
    });

    // Convert Decimal to number for client-side usage
    const serializedRooms = rooms.map((room) => ({
      ...room,
      price: Number(room.price),
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: serializedRooms,
    };
  } catch (error) {
    console.error('Failed to fetch public rooms:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch rooms',
      data: [],
    };
  }
}

/**
 * Get a single room by ID for public viewing
 */
export async function getPublicRoomById(id: string) {
  try {
    const room = await roomService.getRoomById(id);

    if (!room) {
      return {
        success: false,
        error: 'Room not found',
      };
    }

    // Convert Decimal to number for client-side usage
    const serializedRoom = {
      ...room,
      price: Number(room.price),
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
      bookings: room.bookings.map((booking) => ({
        ...booking,
        totalAmount: Number(booking.totalAmount),
        checkInDate: booking.checkInDate.toISOString(),
        checkOutDate: booking.checkOutDate.toISOString(),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      })),
    };

    return {
      success: true,
      data: serializedRoom,
    };
  } catch (error) {
    console.error('Failed to fetch public room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch room',
    };
  }
}
