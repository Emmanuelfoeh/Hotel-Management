'use server';

import { reportService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';

/**
 * Generate daily report
 */
export async function generateDailyReport(date: Date) {
  try {
    await requireAuth();

    const report = await reportService.generateDailyReport(date);

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    console.error('Failed to generate daily report:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate daily report',
    };
  }
}

/**
 * Generate monthly report
 */
export async function generateMonthlyReport(year: number, month: number) {
  try {
    await requireAuth();

    const report = await reportService.generateMonthlyReport(year, month);

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    console.error('Failed to generate monthly report:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate monthly report',
    };
  }
}

/**
 * Generate custom report
 */
export async function generateCustomReport(startDate: Date, endDate: Date) {
  try {
    await requireAuth();

    const report = await reportService.generateCustomReport(startDate, endDate);

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    console.error('Failed to generate custom report:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate custom report',
    };
  }
}
