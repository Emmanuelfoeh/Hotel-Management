import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export interface DashboardStats {
  occupancyRate: number;
  totalBookings: number;
  totalRevenue: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export class AnalyticsService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(
    dateRange?: DateRangeFilter
  ): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Calculate occupancy rate
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({
      where: { status: 'OCCUPIED' },
    });
    const occupancyRate =
      totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Get available rooms count
    const availableRooms = await prisma.room.count({
      where: { status: 'AVAILABLE' },
    });

    // Build date filter for bookings
    const bookingDateFilter: Prisma.BookingWhereInput = {};
    if (dateRange) {
      bookingDateFilter.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    } else {
      // Default to current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      bookingDateFilter.createdAt = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    // Get total bookings
    const totalBookings = await prisma.booking.count({
      where: {
        ...bookingDateFilter,
        bookingStatus: {
          not: 'CANCELLED',
        },
      },
    });

    // Calculate total revenue
    const bookings = await prisma.booking.findMany({
      where: {
        ...bookingDateFilter,
        paymentStatus: 'PAID',
      },
      select: {
        totalAmount: true,
      },
    });

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + Number(booking.totalAmount),
      0
    );

    // Get today's check-ins
    const todayCheckIns = await prisma.booking.count({
      where: {
        checkInDate: {
          gte: today,
          lt: tomorrow,
        },
        bookingStatus: 'CONFIRMED',
      },
    });

    // Get today's check-outs
    const todayCheckOuts = await prisma.booking.count({
      where: {
        checkOutDate: {
          gte: today,
          lt: tomorrow,
        },
        bookingStatus: 'CHECKED_IN',
      },
    });

    return {
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      totalBookings,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      availableRooms,
      todayCheckIns,
      todayCheckOuts,
    };
  }

  /**
   * Get occupancy rate chart data
   */
  async getOccupancyChartData(
    dateRange: DateRangeFilter
  ): Promise<ChartData[]> {
    const { startDate, endDate } = dateRange;
    const chartData: ChartData[] = [];

    // Get total rooms count
    const totalRooms = await prisma.room.count();

    if (totalRooms === 0) {
      return chartData;
    }

    // Generate dates between start and end
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Count occupied rooms for this date
      const occupiedRooms = await prisma.booking.count({
        where: {
          bookingStatus: {
            in: ['CONFIRMED', 'CHECKED_IN'],
          },
          checkInDate: { lte: dayEnd },
          checkOutDate: { gt: dayStart },
        },
      });

      const occupancyRate = (occupiedRooms / totalRooms) * 100;

      chartData.push({
        date: currentDate.toISOString().split('T')[0],
        value: Math.round(occupancyRate * 100) / 100,
        label: `${Math.round(occupancyRate)}%`,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return chartData;
  }

  /**
   * Get revenue chart data
   */
  async getRevenueChartData(dateRange: DateRangeFilter): Promise<ChartData[]> {
    const { startDate, endDate } = dateRange;
    const chartData: ChartData[] = [];

    // Generate dates between start and end
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Get revenue for this date
      const bookings = await prisma.booking.findMany({
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        select: {
          totalAmount: true,
        },
      });

      const dailyRevenue = bookings.reduce(
        (sum, booking) => sum + Number(booking.totalAmount),
        0
      );

      chartData.push({
        date: currentDate.toISOString().split('T')[0],
        value: Math.round(dailyRevenue * 100) / 100,
        label: `$${Math.round(dailyRevenue)}`,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return chartData;
  }

  /**
   * Get bookings trend chart data
   */
  async getBookingsTrendData(dateRange: DateRangeFilter): Promise<ChartData[]> {
    const { startDate, endDate } = dateRange;
    const chartData: ChartData[] = [];

    // Generate dates between start and end
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Count bookings for this date
      const bookingsCount = await prisma.booking.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
          bookingStatus: {
            not: 'CANCELLED',
          },
        },
      });

      chartData.push({
        date: currentDate.toISOString().split('T')[0],
        value: bookingsCount,
        label: `${bookingsCount} bookings`,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return chartData;
  }

  /**
   * Get monthly occupancy rate
   */
  async getMonthlyOccupancyRate(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const totalRooms = await prisma.room.count();
    if (totalRooms === 0) return 0;

    // Calculate total room-days in the month
    const daysInMonth = endDate.getDate();
    const totalRoomDays = totalRooms * daysInMonth;

    // Calculate occupied room-days
    const bookings = await prisma.booking.findMany({
      where: {
        bookingStatus: {
          in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'],
        },
        OR: [
          {
            AND: [
              { checkInDate: { lte: endDate } },
              { checkOutDate: { gte: startDate } },
            ],
          },
        ],
      },
      select: {
        checkInDate: true,
        checkOutDate: true,
      },
    });

    let occupiedRoomDays = 0;
    for (const booking of bookings) {
      const bookingStart =
        booking.checkInDate > startDate ? booking.checkInDate : startDate;
      const bookingEnd =
        booking.checkOutDate < endDate ? booking.checkOutDate : endDate;

      const days = Math.ceil(
        (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      occupiedRoomDays += Math.max(0, days);
    }

    const occupancyRate = (occupiedRoomDays / totalRoomDays) * 100;
    return Math.round(occupancyRate * 100) / 100;
  }

  /**
   * Get monthly revenue
   */
  async getMonthlyRevenue(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bookings = await prisma.booking.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalAmount: true,
      },
    });

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + Number(booking.totalAmount),
      0
    );

    return Math.round(totalRevenue * 100) / 100;
  }

  /**
   * Get monthly bookings count
   */
  async getMonthlyBookingsCount(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return await prisma.booking.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        bookingStatus: {
          not: 'CANCELLED',
        },
      },
    });
  }

  /**
   * Get room type distribution
   */
  async getRoomTypeDistribution() {
    const rooms = await prisma.room.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
    });

    return rooms.map((room) => ({
      type: room.type,
      count: room._count.id,
    }));
  }

  /**
   * Get booking status distribution
   */
  async getBookingStatusDistribution(dateRange?: DateRangeFilter) {
    const where: Prisma.BookingWhereInput = {};

    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const bookings = await prisma.booking.groupBy({
      by: ['bookingStatus'],
      where,
      _count: {
        id: true,
      },
    });

    return bookings.map((booking) => ({
      status: booking.bookingStatus,
      count: booking._count.id,
    }));
  }

  /**
   * Get payment status distribution
   */
  async getPaymentStatusDistribution(dateRange?: DateRangeFilter) {
    const where: Prisma.BookingWhereInput = {};

    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const bookings = await prisma.booking.groupBy({
      by: ['paymentStatus'],
      where,
      _count: {
        id: true,
      },
    });

    return bookings.map((booking) => ({
      status: booking.paymentStatus,
      count: booking._count.id,
    }));
  }

  /**
   * Get top customers by revenue
   */
  async getTopCustomers(limit: number = 10, dateRange?: DateRangeFilter) {
    const where: Prisma.BookingWhereInput = {
      paymentStatus: 'PAID',
    };

    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const customers = await prisma.customer.findMany({
      include: {
        bookings: {
          where,
          select: {
            totalAmount: true,
          },
        },
      },
    });

    const customersWithRevenue = customers
      .map((customer) => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        totalRevenue: customer.bookings.reduce(
          (sum, booking) => sum + Number(booking.totalAmount),
          0
        ),
        bookingsCount: customer.bookings.length,
      }))
      .filter((customer) => customer.totalRevenue > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);

    return customersWithRevenue;
  }

  /**
   * Get average booking value
   */
  async getAverageBookingValue(dateRange?: DateRangeFilter): Promise<number> {
    const where: Prisma.BookingWhereInput = {
      paymentStatus: 'PAID',
    };

    if (dateRange) {
      where.createdAt = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const result = await prisma.booking.aggregate({
      where,
      _avg: {
        totalAmount: true,
      },
    });

    return result._avg.totalAmount ? Number(result._avg.totalAmount) : 0;
  }
}

export const analyticsService = new AnalyticsService();
