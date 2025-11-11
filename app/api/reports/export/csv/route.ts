import { NextRequest, NextResponse } from 'next/server';
import { reportService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { reportType, startDate, endDate } = body;

    if (!reportType || !startDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    let csvContent: string;
    let fileName: string;

    // Generate CSV based on report type
    if (reportType === 'daily') {
      csvContent = await reportService.exportDailyReportToCSV(start);
      fileName = `daily-report-${start.toISOString().split('T')[0]}.csv`;
    } else if (reportType === 'monthly') {
      csvContent = await reportService.exportMonthlyReportToCSV(
        start.getFullYear(),
        start.getMonth() + 1
      );
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
      fileName = `monthly-report-${monthNames[start.getMonth()]}-${start.getFullYear()}.csv`;
    } else if (reportType === 'custom') {
      csvContent = await reportService.exportCustomReportToCSV(start, end);
      fileName = `custom-report-${start.toISOString().split('T')[0]}-to-${end.toISOString().split('T')[0]}.csv`;
    } else {
      return NextResponse.json(
        { error: 'Invalid report type' },
        { status: 400 }
      );
    }

    // Return CSV as response
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Failed to generate CSV:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to generate CSV',
      },
      { status: 500 }
    );
  }
}
