import { z } from 'zod';

// Enums
export const RoomTypeSchema = z.enum([
  'SINGLE',
  'DOUBLE',
  'SUITE',
  'DELUXE',
  'PRESIDENTIAL',
]);

export const RoomStatusSchema = z.enum([
  'AVAILABLE',
  'OCCUPIED',
  'MAINTENANCE',
]);

// Room validation schemas
export const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Room name is required')
    .max(100, 'Room name is too long'),
  type: RoomTypeSchema,
  description: z.string().max(1000, 'Description is too long').optional(),
  price: z
    .number()
    .positive('Price must be positive')
    .max(999999.99, 'Price is too high')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .positive('Capacity must be positive')
    .max(20, 'Capacity cannot exceed 20'),
  amenities: z.array(z.string()),
  images: z.array(z.string().url('Invalid image URL')),
  status: RoomStatusSchema,
  floor: z
    .number()
    .int('Floor must be a whole number')
    .min(-5, 'Floor cannot be below -5')
    .max(200, 'Floor cannot exceed 200')
    .optional()
    .nullable(),
  roomNumber: z
    .string()
    .min(1, 'Room number is required')
    .max(20, 'Room number is too long')
    .regex(
      /^[A-Z0-9-]+$/i,
      'Room number can only contain letters, numbers, and hyphens'
    ),
});

export const updateRoomSchema = createRoomSchema.partial().extend({
  id: z.string().cuid('Invalid room ID'),
});

export const roomIdSchema = z.object({
  id: z.string().cuid('Invalid room ID'),
});

export const roomSearchSchema = z.object({
  query: z.string().optional(),
  type: RoomTypeSchema.optional(),
  status: RoomStatusSchema.optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minCapacity: z.number().int().positive().optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
});

// Type exports
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type RoomSearchInput = z.infer<typeof roomSearchSchema>;
export type RoomType = z.infer<typeof RoomTypeSchema>;
export type RoomStatus = z.infer<typeof RoomStatusSchema>;
