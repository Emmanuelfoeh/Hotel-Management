import { prisma } from '@/lib/db';
import { BookingStatus, PaymentStatus, BookingSource } from '@/types';
import { Prisma } from '@prisma/client';
import { roomService } from './room.service';

export interface CreateBookingInput {
  roomId: string;
  customerId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalAmount: number;
  specialRequests?: string;
  source?: BookingSource;
  createdById?: string;
}

export interface UpdateBookingInput {
  roomId?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  numberOfGuests?: number;
  totalAmount?: number;
  specialRequests?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export interface BookingSearchFilters {
  query?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  roomId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomNumber: string;
  customerName: string;
  status: BookingStatus;
}

export class BookingService {
  /**
   * Generate unique booking number
   */
  private async generateBookingNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const count = await prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `BK${year}${month}${day}${sequence}`;
  }

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingInput) {
    // Check room availability
    const isAvailable = await roomService.checkAvailability(
      data.roomId,
      data.checkInDate,
      data.checkOutDate
    );

    if (!isAvailable) {
      throw new Error('Room is not available for the selected dates');
    }

    // Validate dates
    if (data.checkInDate >= data.checkOutDate) {
      throw new Error('Check-out date must be after check-in date');
    }

    if (data.checkInDate < new Date()) {
      throw new Error('Check-in date cannot be in the past');
    }

    // Generate booking number
    const bookingNumber = await this.generateBookingNumber();

    return await prisma.booking.create({
      data: {
        bookingNumber,
        roomId: data.roomId,
        customerId: data.customerId,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        numberOfGuests: data.numberOfGuests,
        totalAmount: new Prisma.Decimal(data.totalAmount),
        specialRequests: data.specialRequests,
        source: data.source || 'ONLINE',
        createdById: data.createdById,
      },
      include: {
        room: true,
        customer: true,
        createdBy: true,
      },
    });
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string) {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        customer: true,
        createdBy: true,
        payments: true,
      },
    });
  }

  /**
   * Get booking by booking number
   */
  async getBookingByNumber(bookingNumber: string) {
    return await prisma.booking.findUnique({
      where: { bookingNumber },
      include: {
        room: true,
        customer: true,
        createdBy: true,
        payments: true,
      },
    });
  }

  /**
   * Get all bookings with optional filters
   */
  async getBookings(filters?: BookingSearchFilters) {
    const where: Prisma.BookingWhereInput = {};

    if (filters?.query) {
      where.OR = [
        { bookingNumber: { contains: filters.query, mode: 'insensitive' } },
        {
          customer: {
            firstName: { contains: filters.query, mode: 'insensitive' },
          },
        },
        {
          customer: {
            lastName: { contains: filters.query, mode: 'insensitive' },
          },
        },
        {
          customer: { email: { contains: filters.query, mode: 'insensitive' } },
        },
        {
          room: {
            roomNumber: { contains: filters.query, mode: 'insensitive' },
          },
        },
      ];
    }

    if (filters?.bookingStatus) {
      where.bookingStatus = filters.bookingStatus;
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.roomId) {
      where.roomId = filters.roomId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.AND = [];
      if (filters.startDate) {
        where.AND.push({ checkInDate: { gte: filters.startDate } });
      }
      if (filters.endDate) {
        where.AND.push({ checkOutDate: { lte: filters.endDate } });
      }
    }

    return await prisma.booking.findMany({
      where,
      include: {
        room: true,
        customer: true,
        createdBy: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update booking
   */
  async updateBooking(id: string, data: UpdateBookingInput) {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // If updating dates or room, check availability
    if (data.roomId || data.checkInDate || data.checkOutDate) {
      const roomId = data.roomId || booking.roomId;
      const checkIn = data.checkInDate || booking.checkInDate;
      const checkOut = data.checkOutDate || booking.checkOutDate;

      // Check availability excluding current booking
      const conflictingBookings = await prisma.booking.count({
        where: {
          id: { not: id },
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

      if (conflictingBookings > 0) {
        throw new Error('Room is not available for the selected dates');
      }
    }

    const updateData: Prisma.BookingUpdateInput = {};

    if (data.roomId !== undefined) {
      updateData.room = { connect: { id: data.roomId } };
    }
    if (data.checkInDate !== undefined)
      updateData.checkInDate = data.checkInDate;
    if (data.checkOutDate !== undefined)
      updateData.checkOutDate = data.checkOutDate;
    if (data.numberOfGuests !== undefined)
      updateData.numberOfGuests = data.numberOfGuests;
    if (data.totalAmount !== undefined)
      updateData.totalAmount = new Prisma.Decimal(data.totalAmount);
    if (data.specialRequests !== undefined)
      updateData.specialRequests = data.specialRequests;
    if (data.bookingStatus !== undefined)
      updateData.bookingStatus = data.bookingStatus;
    if (data.paymentStatus !== undefined)
      updateData.paymentStatus = data.paymentStatus;

    return await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        room: true,
        customer: true,
        payments: true,
      },
    });
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        customer: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.bookingStatus === 'CHECKED_OUT') {
      throw new Error('Cannot cancel a checked-out booking');
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: 'CANCELLED',
      },
      include: {
        room: true,
        customer: true,
      },
    });

    // Send cancellation email
    try {
      const { sendBookingCancellationEmail } = await import('./email.service');
      await sendBookingCancellationEmail('foehemmanuel@gmail.com', {
        bookingNumber: cancelledBooking.bookingNumber,
        customerName: `${cancelledBooking.customer.firstName} ${cancelledBooking.customer.lastName}`,
        roomName: cancelledBooking.room.name,
        checkInDate: cancelledBooking.checkInDate.toLocaleDateString(),
        checkOutDate: cancelledBooking.checkOutDate.toLocaleDateString(),
        cancellationDate: new Date().toLocaleDateString(),
      });
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't throw error - cancellation should succeed even if email fails
    }

    return cancelledBooking;
  }

  /**
   * Check-in booking
   */
  async checkIn(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true, customer: true },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.bookingStatus !== 'CONFIRMED') {
      throw new Error('Only confirmed bookings can be checked in');
    }

    // Update booking and room status in a transaction
    const checkedInBooking = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          bookingStatus: 'CHECKED_IN',
        },
        include: {
          room: true,
          customer: true,
        },
      });

      await tx.room.update({
        where: { id: booking.roomId },
        data: {
          status: 'OCCUPIED',
        },
      });

      return updatedBooking;
    });

    // Send check-in welcome email
    try {
      const { sendCheckInWelcomeEmail } = await import('./email.service');
      await sendCheckInWelcomeEmail(checkedInBooking.customer.email, {
        bookingNumber: checkedInBooking.bookingNumber,
        customerName: `${checkedInBooking.customer.firstName} ${checkedInBooking.customer.lastName}`,
        roomName: checkedInBooking.room.name,
        roomNumber: checkedInBooking.room.roomNumber,
        checkInDate: checkedInBooking.checkInDate.toLocaleDateString(),
        checkOutDate: checkedInBooking.checkOutDate.toLocaleDateString(),
        wifiPassword: 'GuestWiFi2024', // You can make this configurable
      });
    } catch (emailError) {
      console.error('Failed to send check-in welcome email:', emailError);
      // Don't throw error - check-in should succeed even if email fails
    }

    return checkedInBooking;
  }

  /**
   * Check-out booking
   */
  async checkOut(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.bookingStatus !== 'CHECKED_IN') {
      throw new Error('Only checked-in bookings can be checked out');
    }

    // Update booking and room status in a transaction
    return await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          bookingStatus: 'CHECKED_OUT',
        },
        include: {
          room: true,
          customer: true,
        },
      });

      await tx.room.update({
        where: { id: booking.roomId },
        data: {
          status: 'AVAILABLE',
        },
      });

      return updatedBooking;
    });
  }

  /**
   * Get calendar events for bookings
   */
  async getCalendarEvents(
    startDate?: Date,
    endDate?: Date
  ): Promise<BookingCalendarEvent[]> {
    const where: Prisma.BookingWhereInput = {
      bookingStatus: {
        in: ['CONFIRMED', 'CHECKED_IN'],
      },
    };

    if (startDate || endDate) {
      where.OR = [
        {
          checkInDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          checkOutDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          AND: [
            { checkInDate: { lte: startDate } },
            { checkOutDate: { gte: endDate } },
          ],
        },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: true,
        customer: true,
      },
      orderBy: {
        checkInDate: 'asc',
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.customer.firstName} ${booking.customer.lastName} - ${booking.room.name}`,
      start: booking.checkInDate,
      end: booking.checkOutDate,
      roomNumber: booking.room.roomNumber,
      customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
      status: booking.bookingStatus,
    }));
  }

  /**
   * Get today's check-ins
   */
  async getTodayCheckIns() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.booking.findMany({
      where: {
        checkInDate: {
          gte: today,
          lt: tomorrow,
        },
        bookingStatus: 'CONFIRMED',
      },
      include: {
        room: true,
        customer: true,
      },
    });
  }

  /**
   * Get today's check-outs
   */
  async getTodayCheckOuts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.booking.findMany({
      where: {
        checkOutDate: {
          gte: today,
          lt: tomorrow,
        },
        bookingStatus: 'CHECKED_IN',
      },
      include: {
        room: true,
        customer: true,
      },
    });
  }
}

export const bookingService = new BookingService();
