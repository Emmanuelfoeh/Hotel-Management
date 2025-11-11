import { prisma } from '@/lib/db';
import { analyticsService } from './analytics.service';

export interface DailyReportData {
  date: string;
  occupancyRate: number;
  totalRevenue: number;
  totalBookings: number;
  checkIns: number;
  checkOuts: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  occupancyRate: number;
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  totalExpenses?: number;
  netProfit?: number;
  roomTypeBreakdown: Array<{ type: string; bookings: number; revenue: number }>;
  bookingSourceBreakdown: Array<{ source: string; count: number }>;
}

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  reportType: 'daily' | 'monthly' | 'custom';
  includeExpenses?: boolean;
}

export class ReportService {
  /**
   * Generate daily report
   */
  async generateDailyReport(date: Date): Promise<DailyReportData> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Get room statistics
    const totalRooms = await prisma.room.count();
    const availableRooms = await prisma.room.count({
      where: { status: 'AVAILABLE' },
    });
    const occupiedRooms = await prisma.room.count({
      where: { status: 'OCCUPIED' },
    });
    const maintenanceRooms = await prisma.room.count({
      where: { status: 'MAINTENANCE' },
    });

    const occupancyRate =
      totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Get bookings for the day
    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
        bookingStatus: {
          not: 'CANCELLED',
        },
      },
      select: {
        totalAmount: true,
        paymentStatus: true,
      },
    });

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'PAID')
      .reduce((sum, b) => sum + Number(b.totalAmount), 0);

    // Get check-ins
    const checkIns = await prisma.booking.count({
      where: {
        checkInDate: {
          gte: dayStart,
          lt: dayEnd,
        },
        bookingStatus: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },
      },
    });

    // Get check-outs
    const checkOuts = await prisma.booking.count({
      where: {
        checkOutDate: {
          gte: dayStart,
          lt: dayEnd,
        },
        bookingStatus: {
          in: ['CHECKED_IN', 'CHECKED_OUT'],
        },
      },
    });

    return {
      date: date.toISOString().split('T')[0],
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalBookings: bookings.length,
      checkIns,
      checkOuts,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
    };
  }

  /**
   * Generate monthly report
   */
  async generateMonthlyReport(
    year: number,
    month: number
  ): Promise<MonthlyReportData> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get basic statistics
    const occupancyRate = await analyticsService.getMonthlyOccupancyRate(
      year,
      month
    );
    const totalRevenue = await analyticsService.getMonthlyRevenue(year, month);
    const totalBookings = await analyticsService.getMonthlyBookingsCount(
      year,
      month
    );
    const averageBookingValue = await analyticsService.getAverageBookingValue({
      startDate,
      endDate,
    });

    // Get room type breakdown
    const bookingsByRoomType = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        bookingStatus: {
          not: 'CANCELLED',
        },
      },
      include: {
        room: {
          select: {
            type: true,
          },
        },
      },
    });

    const roomTypeMap = new Map<
      string,
      { bookings: number; revenue: number }
    >();
    bookingsByRoomType.forEach((booking) => {
      const type = booking.room.type;
      const current = roomTypeMap.get(type) || { bookings: 0, revenue: 0 };
      roomTypeMap.set(type, {
        bookings: current.bookings + 1,
        revenue:
          current.revenue +
          (booking.paymentStatus === 'PAID' ? Number(booking.totalAmount) : 0),
      });
    });

    const roomTypeBreakdown = Array.from(roomTypeMap.entries()).map(
      ([type, data]) => ({
        type,
        bookings: data.bookings,
        revenue: Math.round(data.revenue * 100) / 100,
      })
    );

    // Get booking source breakdown
    const bookingsBySource = await prisma.booking.groupBy({
      by: ['source'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        bookingStatus: {
          not: 'CANCELLED',
        },
      },
      _count: {
        id: true,
      },
    });

    const bookingSourceBreakdown = bookingsBySource.map((item) => ({
      source: item.source,
      count: item._count.id,
    }));

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return {
      month: monthNames[month - 1],
      year,
      occupancyRate,
      totalRevenue,
      totalBookings,
      averageBookingValue: Math.round(averageBookingValue * 100) / 100,
      roomTypeBreakdown,
      bookingSourceBreakdown,
    };
  }

  /**
   * Generate custom report for date range
   */
  async generateCustomReport(startDate: Date, endDate: Date) {
    const stats = await analyticsService.getDashboardStats({
      startDate,
      endDate,
    });
    const occupancyData = await analyticsService.getOccupancyChartData({
      startDate,
      endDate,
    });
    const revenueData = await analyticsService.getRevenueChartData({
      startDate,
      endDate,
    });
    const bookingsData = await analyticsService.getBookingsTrendData({
      startDate,
      endDate,
    });
    const topCustomers = await analyticsService.getTopCustomers(10, {
      startDate,
      endDate,
    });

    return {
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      stats,
      occupancyData,
      revenueData,
      bookingsData,
      topCustomers,
    };
  }

  /**
   * Export daily report to CSV
   */
  async exportDailyReportToCSV(date: Date): Promise<string> {
    const report = await this.generateDailyReport(date);

    const headers = [
      'Date',
      'Occupancy Rate (%)',
      'Total Revenue',
      'Total Bookings',
      'Check-ins',
      'Check-outs',
      'Available Rooms',
      'Occupied Rooms',
      'Maintenance Rooms',
    ];

    const row = [
      report.date,
      report.occupancyRate.toString(),
      report.totalRevenue.toString(),
      report.totalBookings.toString(),
      report.checkIns.toString(),
      report.checkOuts.toString(),
      report.availableRooms.toString(),
      report.occupiedRooms.toString(),
      report.maintenanceRooms.toString(),
    ];

    return [headers.join(','), row.join(',')].join('\n');
  }

  /**
   * Export monthly report to CSV
   */
  async exportMonthlyReportToCSV(year: number, month: number): Promise<string> {
    const report = await this.generateMonthlyReport(year, month);

    const lines: string[] = [];

    // Summary section
    lines.push('Monthly Report Summary');
    lines.push(`Month,${report.month} ${report.year}`);
    lines.push(`Occupancy Rate (%),${report.occupancyRate}`);
    lines.push(`Total Revenue,${report.totalRevenue}`);
    lines.push(`Total Bookings,${report.totalBookings}`);
    lines.push(`Average Booking Value,${report.averageBookingValue}`);
    lines.push('');

    // Room type breakdown
    lines.push('Room Type Breakdown');
    lines.push('Room Type,Bookings,Revenue');
    report.roomTypeBreakdown.forEach((item) => {
      lines.push(`${item.type},${item.bookings},${item.revenue}`);
    });
    lines.push('');

    // Booking source breakdown
    lines.push('Booking Source Breakdown');
    lines.push('Source,Count');
    report.bookingSourceBreakdown.forEach((item) => {
      lines.push(`${item.source},${item.count}`);
    });

    return lines.join('\n');
  }

  /**
   * Export custom report to CSV
   */
  async exportCustomReportToCSV(
    startDate: Date,
    endDate: Date
  ): Promise<string> {
    const report = await this.generateCustomReport(startDate, endDate);

    const lines: string[] = [];

    // Summary section
    lines.push('Custom Report');
    lines.push(`Period,${report.period.start} to ${report.period.end}`);
    lines.push(`Occupancy Rate (%),${report.stats.occupancyRate}`);
    lines.push(`Total Revenue,${report.stats.totalRevenue}`);
    lines.push(`Total Bookings,${report.stats.totalBookings}`);
    lines.push(`Available Rooms,${report.stats.availableRooms}`);
    lines.push('');

    // Daily occupancy data
    lines.push('Daily Occupancy Rate');
    lines.push('Date,Occupancy Rate (%)');
    report.occupancyData.forEach((item) => {
      lines.push(`${item.date},${item.value}`);
    });
    lines.push('');

    // Daily revenue data
    lines.push('Daily Revenue');
    lines.push('Date,Revenue');
    report.revenueData.forEach((item) => {
      lines.push(`${item.date},${item.value}`);
    });
    lines.push('');

    // Daily bookings data
    lines.push('Daily Bookings');
    lines.push('Date,Bookings');
    report.bookingsData.forEach((item) => {
      lines.push(`${item.date},${item.value}`);
    });
    lines.push('');

    // Top customers
    lines.push('Top Customers');
    lines.push('Name,Email,Total Revenue,Bookings Count');
    report.topCustomers.forEach((customer) => {
      lines.push(
        `${customer.name},${customer.email},${customer.totalRevenue},${customer.bookingsCount}`
      );
    });

    return lines.join('\n');
  }

  /**
   * Generate PDF report data (returns structured data for PDF generation)
   * The actual PDF generation will be handled by the API route using jsPDF or react-pdf
   */
  async generatePDFReportData(filters: ReportFilters) {
    if (filters.reportType === 'daily') {
      return {
        type: 'daily',
        data: await this.generateDailyReport(filters.startDate),
      };
    } else if (filters.reportType === 'monthly') {
      const date = filters.startDate;
      return {
        type: 'monthly',
        data: await this.generateMonthlyReport(
          date.getFullYear(),
          date.getMonth() + 1
        ),
      };
    } else {
      return {
        type: 'custom',
        data: await this.generateCustomReport(
          filters.startDate,
          filters.endDate
        ),
      };
    }
  }

  /**
   * Get bookings for export
   */
  async getBookingsForExport(startDate: Date, endDate: Date) {
    return await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        room: {
          select: {
            name: true,
            roomNumber: true,
            type: true,
          },
        },
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Export bookings to CSV
   */
  async exportBookingsToCSV(startDate: Date, endDate: Date): Promise<string> {
    const bookings = await this.getBookingsForExport(startDate, endDate);

    const headers = [
      'Booking Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Room Name',
      'Room Number',
      'Room Type',
      'Check-in Date',
      'Check-out Date',
      'Number of Guests',
      'Total Amount',
      'Payment Status',
      'Booking Status',
      'Source',
      'Created At',
    ];

    const rows = bookings.map((booking) => [
      booking.bookingNumber,
      `${booking.customer.firstName} ${booking.customer.lastName}`,
      booking.customer.email,
      booking.customer.phone,
      booking.room.name,
      booking.room.roomNumber,
      booking.room.type,
      booking.checkInDate.toISOString().split('T')[0],
      booking.checkOutDate.toISOString().split('T')[0],
      booking.numberOfGuests.toString(),
      booking.totalAmount.toString(),
      booking.paymentStatus,
      booking.bookingStatus,
      booking.source,
      booking.createdAt.toISOString(),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }
}

export const reportService = new ReportService();
