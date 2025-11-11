'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ReportDisplayProps {
  reportType: 'daily' | 'monthly' | 'custom';
  data: any;
  startDate?: Date;
  endDate?: Date;
}

export function ReportDisplay({
  reportType,
  data,
  startDate,
  endDate,
}: ReportDisplayProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const response = await fetch('/api/reports/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      const response = await fetch('/api/reports/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export CSV');
    } finally {
      setIsExportingCSV(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Report
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExportingPDF}
              >
                {isExportingPDF ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={isExportingCSV}
              >
                {isExportingCSV ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Content */}
      {reportType === 'daily' && <DailyReportDisplay data={data} />}
      {reportType === 'monthly' && <MonthlyReportDisplay data={data} />}
      {reportType === 'custom' && <CustomReportDisplay data={data} />}
    </div>
  );
}

function DailyReportDisplay({ data }: { data: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Report - {data.date}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Occupancy Rate"
            value={`${data.occupancyRate}%`}
            variant="default"
          />
          <StatCard
            title="Total Revenue"
            value={`$${data.totalRevenue.toFixed(2)}`}
            variant="success"
          />
          <StatCard
            title="Total Bookings"
            value={data.totalBookings}
            variant="default"
          />
          <StatCard title="Check-ins" value={data.checkIns} variant="default" />
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold">Room Status</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Available Rooms</TableCell>
                <TableCell className="text-right">
                  {data.availableRooms}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Occupied Rooms</TableCell>
                <TableCell className="text-right">
                  {data.occupiedRooms}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Maintenance Rooms</TableCell>
                <TableCell className="text-right">
                  {data.maintenanceRooms}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Check-outs</TableCell>
                <TableCell className="text-right">{data.checkOuts}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyReportDisplay({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Monthly Report - {data.month} {data.year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Occupancy Rate"
              value={`${data.occupancyRate}%`}
              variant="default"
            />
            <StatCard
              title="Total Revenue"
              value={`$${data.totalRevenue.toFixed(2)}`}
              variant="success"
            />
            <StatCard
              title="Total Bookings"
              value={data.totalBookings}
              variant="default"
            />
            <StatCard
              title="Avg Booking Value"
              value={`$${data.averageBookingValue.toFixed(2)}`}
              variant="default"
            />
          </div>
        </CardContent>
      </Card>

      {/* Room Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Room Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Type</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.roomTypeBreakdown.map((item: any) => (
                <TableRow key={item.type}>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.bookings}</TableCell>
                  <TableCell className="text-right">
                    ${item.revenue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Source Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Source Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.bookingSourceBreakdown.map((item: any) => (
                <TableRow key={item.source}>
                  <TableCell>
                    <Badge variant="secondary">{item.source}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomReportDisplay({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Custom Report - {data.period.start} to {data.period.end}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Occupancy Rate"
              value={`${data.stats.occupancyRate}%`}
              variant="default"
            />
            <StatCard
              title="Total Revenue"
              value={`$${data.stats.totalRevenue.toFixed(2)}`}
              variant="success"
            />
            <StatCard
              title="Total Bookings"
              value={data.stats.totalBookings}
              variant="default"
            />
            <StatCard
              title="Available Rooms"
              value={data.stats.availableRooms}
              variant="default"
            />
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      {data.topCustomers && data.topCustomers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Bookings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topCustomers.slice(0, 10).map((customer: any) => (
                  <TableRow key={customer.email}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-right">
                      ${customer.totalRevenue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.bookingsCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  variant?: 'default' | 'success';
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p
        className={`mt-2 text-2xl font-bold ${
          variant === 'success' ? 'text-green-600 dark:text-green-400' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}
