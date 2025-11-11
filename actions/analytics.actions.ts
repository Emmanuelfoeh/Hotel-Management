'use server';

import { analyticsService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(dateRange?: {
  startDate: Date;
  endDate: Date;
}) {
  try {
    await requireAuth();

    const stats = await analyticsService.getDashboardStats(dateRange);

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get dashboard stats',
    };
  }
}

/**
 * Get occupancy chart data
 */
export async function getOccupancyChartData(dateRange: {
  startDate: Date;
  endDate: Date;
}) {
  try {
    await requireAuth();

    const data = await analyticsService.getOccupancyChartData(dateRange);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to get occupancy chart data:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get occupancy chart data',
    };
  }
}

/**
 * Get revenue chart data
 */
export async function getRevenueChartData(dateRange: {
  startDate: Date;
  endDate: Date;
}) {
  try {
    await requireAuth();

    const data = await analyticsService.getRevenueChartData(dateRange);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to get revenue chart data:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get revenue chart data',
    };
  }
}

/**
 * Get bookings trend data
 */
export async function getBookingsTrendData(dateRange: {
  startDate: Date;
  endDate: Date;
}) {
  try {
    await requireAuth();

    const data = await analyticsService.getBookingsTrendData(dateRange);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to get bookings trend data:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get bookings trend data',
    };
  }
}
