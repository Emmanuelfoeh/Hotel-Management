import { NextRequest, NextResponse } from 'next/server';
import { reportService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    let reportData;
    let fileName;

    // Generate report based on type
    if (reportType === 'daily') {
      reportData = await reportService.generateDailyReport(start);
      fileName = `daily-report-${reportData.date}.pdf`;
    } else if (reportType === 'monthly') {
      reportData = await reportService.generateMonthlyReport(
        start.getFullYear(),
        start.getMonth() + 1
      );
      fileName = `monthly-report-${reportData.month}-${reportData.year}.pdf`;
    } else if (reportType === 'custom') {
      reportData = await reportService.generateCustomReport(start, end);
      fileName = `custom-report-${reportData.period.start}-to-${reportData.period.end}.pdf`;
    } else {
      return NextResponse.json(
        { error: 'Invalid report type' },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Add title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hotel Management System', pageWidth / 2, 20, {
      align: 'center',
    });

    pdf.setFontSize(16);
    pdf.text(
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    // Add report content based on type
    if (reportType === 'daily') {
      generateDailyPDF(pdf, reportData);
    } else if (reportType === 'monthly') {
      generateMonthlyPDF(pdf, reportData);
    } else {
      generateCustomPDF(pdf, reportData);
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to generate PDF',
      },
      { status: 500 }
    );
  }
}

function generateDailyPDF(pdf: jsPDF, data: any) {
  const startY = 45;

  // Summary section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Daily Summary', 14, startY);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${data.date}`, 14, startY + 10);

  // Statistics table
  autoTable(pdf, {
    startY: startY + 15,
    head: [['Metric', 'Value']],
    body: [
      ['Occupancy Rate', `${data.occupancyRate}%`],
      ['Total Revenue', `$${data.totalRevenue.toFixed(2)}`],
      ['Total Bookings', data.totalBookings.toString()],
      ['Check-ins', data.checkIns.toString()],
      ['Check-outs', data.checkOuts.toString()],
      ['Available Rooms', data.availableRooms.toString()],
      ['Occupied Rooms', data.occupiedRooms.toString()],
      ['Maintenance Rooms', data.maintenanceRooms.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] },
  });

  // Footer
  const pageCount = pdf.getNumberOfPages();
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.text(
      `Generated on ${new Date().toLocaleString()}`,
      14,
      pdf.internal.pageSize.getHeight() - 10
    );
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pdf.internal.pageSize.getWidth() - 30,
      pdf.internal.pageSize.getHeight() - 10
    );
  }
}

function generateMonthlyPDF(pdf: jsPDF, data: any) {
  const startY = 45;

  // Summary section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Monthly Summary', 14, startY);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Period: ${data.month} ${data.year}`, 14, startY + 10);

  // Main statistics
  autoTable(pdf, {
    startY: startY + 15,
    head: [['Metric', 'Value']],
    body: [
      ['Occupancy Rate', `${data.occupancyRate}%`],
      ['Total Revenue', `$${data.totalRevenue.toFixed(2)}`],
      ['Total Bookings', data.totalBookings.toString()],
      ['Average Booking Value', `$${data.averageBookingValue.toFixed(2)}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] },
  });

  // Room type breakdown
  const roomTypeY = (pdf as any).lastAutoTable.finalY + 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Room Type Breakdown', 14, roomTypeY);

  autoTable(pdf, {
    startY: roomTypeY + 5,
    head: [['Room Type', 'Bookings', 'Revenue']],
    body: data.roomTypeBreakdown.map((item: any) => [
      item.type,
      item.bookings.toString(),
      `$${item.revenue.toFixed(2)}`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] },
  });

  // Booking source breakdown
  const sourceY = (pdf as any).lastAutoTable.finalY + 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Booking Source Breakdown', 14, sourceY);

  autoTable(pdf, {
    startY: sourceY + 5,
    head: [['Source', 'Count']],
    body: data.bookingSourceBreakdown.map((item: any) => [
      item.source,
      item.count.toString(),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] },
  });

  // Footer
  const pageCount = pdf.getNumberOfPages();
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.text(
      `Generated on ${new Date().toLocaleString()}`,
      14,
      pdf.internal.pageSize.getHeight() - 10
    );
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pdf.internal.pageSize.getWidth() - 30,
      pdf.internal.pageSize.getHeight() - 10
    );
  }
}

function generateCustomPDF(pdf: jsPDF, data: any) {
  const startY = 45;

  // Summary section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Custom Report Summary', 14, startY);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    `Period: ${data.period.start} to ${data.period.end}`,
    14,
    startY + 10
  );

  // Main statistics
  autoTable(pdf, {
    startY: startY + 15,
    head: [['Metric', 'Value']],
    body: [
      ['Occupancy Rate', `${data.stats.occupancyRate}%`],
      ['Total Revenue', `$${data.stats.totalRevenue.toFixed(2)}`],
      ['Total Bookings', data.stats.totalBookings.toString()],
      ['Available Rooms', data.stats.availableRooms.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] },
  });

  // Top customers
  if (data.topCustomers && data.topCustomers.length > 0) {
    const customersY = (pdf as any).lastAutoTable.finalY + 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Top Customers', 14, customersY);

    autoTable(pdf, {
      startY: customersY + 5,
      head: [['Name', 'Email', 'Total Revenue', 'Bookings']],
      body: data.topCustomers
        .slice(0, 10)
        .map((customer: any) => [
          customer.name,
          customer.email,
          `$${customer.totalRevenue.toFixed(2)}`,
          customer.bookingsCount.toString(),
        ]),
      theme: 'grid',
      headStyles: { fillColor: [20, 184, 166] },
    });
  }

  // Footer
  const pageCount = pdf.getNumberOfPages();
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.text(
      `Generated on ${new Date().toLocaleString()}`,
      14,
      pdf.internal.pageSize.getHeight() - 10
    );
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pdf.internal.pageSize.getWidth() - 30,
      pdf.internal.pageSize.getHeight() - 10
    );
  }
}
