import { prisma } from '@/lib/db';
import { RoomType, RoomStatus } from '@/types';
import { Prisma } from '@prisma/client';

export interface CreateRoomInput {
  name: string;
  type: RoomType;
  description?: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  floor?: number;
  roomNumber: string;
  status?: RoomStatus;
}

export interface UpdateRoomInput {
  name?: string;
  type?: RoomType;
  description?: string;
  price?: number;
  capacity?: number;
  amenities?: string[];
  images?: string[];
  floor?: number;
  roomNumber?: string;
  status?: RoomStatus;
}

export interface RoomSearchFilters {
  query?: string;
  type?: RoomType;
  status?: RoomStatus;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  checkIn?: Date;
  checkOut?: Date;
}

export class RoomService {
  /**
   * Create a new room
   */
  async createRoom(data: CreateRoomInput) {
    return await prisma.room.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        capacity: data.capacity,
        amenities: data.amenities,
        images: data.images,
        floor: data.floor,
        roomNumber: data.roomNumber,
        status: data.status || 'AVAILABLE',
      },
    });
  }

  /**
   * Get room by ID
   */
  async getRoomById(id: string) {
    return await prisma.room.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            bookingStatus: {
              in: ['CONFIRMED', 'CHECKED_IN'],
            },
          },
          orderBy: {
            checkInDate: 'asc',
          },
        },
      },
    });
  }

  /**
   * Get all rooms with optional filters
   */
  async getRooms(filters?: RoomSearchFilters) {
    const where: Prisma.RoomWhereInput = {};

    if (filters?.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { roomNumber: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    if (filters?.capacity) {
      where.capacity = { gte: filters.capacity };
    }

    return await prisma.room.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update room by ID
   */
  async updateRoom(id: string, data: UpdateRoomInput) {
    const updateData: Prisma.RoomUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.price !== undefined)
      updateData.price = new Prisma.Decimal(data.price);
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.amenities !== undefined) updateData.amenities = data.amenities;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.floor !== undefined) updateData.floor = data.floor;
    if (data.roomNumber !== undefined) updateData.roomNumber = data.roomNumber;
    if (data.status !== undefined) updateData.status = data.status;

    return await prisma.room.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete room by ID
   */
  async deleteRoom(id: string) {
    // Check if room has active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        roomId: id,
        bookingStatus: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },
      },
    });

    if (activeBookings > 0) {
      throw new Error('Cannot delete room with active bookings');
    }

    return await prisma.room.delete({
      where: { id },
    });
  }

  /**
   * Check room availability for a date range
   */
  async checkAvailability(roomId: string, checkIn: Date, checkOut: Date) {
    const conflictingBookings = await prisma.booking.count({
      where: {
        roomId,
        bookingStatus: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [
              { checkInDate: { lte: checkIn } },
              { checkOutDate: { gt: checkIn } },
            ],
          },
          {
            AND: [
              { checkInDate: { lt: checkOut } },
              { checkOutDate: { gte: checkOut } },
            ],
          },
          {
            AND: [
              { checkInDate: { gte: checkIn } },
              { checkOutDate: { lte: checkOut } },
            ],
          },
        ],
      },
    });

    return conflictingBookings === 0;
  }

  /**
   * Get available rooms for a date range
   */
  async getAvailableRooms(
    checkIn: Date,
    checkOut: Date,
    filters?: RoomSearchFilters
  ) {
    const allRooms = await this.getRooms(filters);

    const availableRooms = [];
    for (const room of allRooms) {
      const isAvailable = await this.checkAvailability(
        room.id,
        checkIn,
        checkOut
      );
      if (isAvailable && room.status === 'AVAILABLE') {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }

  /**
   * Add images to room
   */
  async addImages(roomId: string, imageUrls: string[]) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { images: true },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    return await prisma.room.update({
      where: { id: roomId },
      data: {
        images: [...room.images, ...imageUrls],
      },
    });
  }

  /**
   * Remove image from room
   */
  async removeImage(roomId: string, imageUrl: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { images: true },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    return await prisma.room.update({
      where: { id: roomId },
      data: {
        images: room.images.filter((img) => img !== imageUrl),
      },
    });
  }

  /**
   * Update room status
   */
  async updateRoomStatus(roomId: string, status: RoomStatus) {
    return await prisma.room.update({
      where: { id: roomId },
      data: { status },
    });
  }
}

export const roomService = new RoomService();
