'use client';

import { useState, useEffect } from 'react';
import { OccupancyChart } from './occupancy-chart';
import { RevenueChart } from './revenue-chart';
import { BookingsChart } from './bookings-chart';
import { DateRangeSelector, DateRangePreset } from './date-range-selector';
import {
  getOccupancyChartData,
  getRevenueChartData,
  getBookingsTrendData,
} from '@/actions/analytics.actions';
import { Card, CardContent } from '@/components/ui/card';

interface ChartData {
  date: string;
  value: number;
  label?: string;
}

function getDateRange(preset: DateRangePreset) {
  const endDate = new Date();
  const startDate = new Date();

  switch (preset) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
  }

  return { startDate, endDate };
}

export function DashboardCharts() {
  const [dateRange, setDateRange] = useState<DateRangePreset>('7d');
  const [occupancyData, setOccupancyData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [bookingsData, setBookingsData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      setLoading(true);
      const range = getDateRange(dateRange);

      try {
        const [occupancyResult, revenueResult, bookingsResult] =
          await Promise.all([
            getOccupancyChartData(range),
            getRevenueChartData(range),
            getBookingsTrendData(range),
          ]);

        if (occupancyResult.success && occupancyResult.data) {
          setOccupancyData(occupancyResult.data);
        }
        if (revenueResult.success && revenueResult.data) {
          setRevenueData(revenueResult.data);
        }
        if (bookingsResult.success && bookingsResult.data) {
          setBookingsData(bookingsResult.data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <DateRangeSelector selected={dateRange} onSelect={setDateRange} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="h-[350px] flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                  Loading...
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <DateRangeSelector selected={dateRange} onSelect={setDateRange} />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <OccupancyChart data={occupancyData} />
        <RevenueChart data={revenueData} />
        <BookingsChart data={bookingsData} />
      </div>
    </div>
  );
}
