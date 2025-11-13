import { StatsCard } from '@/components/admin/stats-card';
import { getDashboardStats } from '@/actions/analytics.actions';
import { DashboardCharts } from '@/components/admin/charts';

export default async function DashboardPage() {
  const result = await getDashboardStats();

  const stats =
    result.success && result.data
      ? result.data
      : {
          occupancyRate: 0,
          totalBookings: 0,
          totalRevenue: 0,
          availableRooms: 0,
          todayCheckIns: 0,
          todayCheckOuts: 0,
        };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Hotel Management System admin dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate.toFixed(1)}%`}
          description="Current occupancy"
          icon="Percent"
          index={0}
        />

        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="This month"
          icon="Calendar"
          index={1}
        />

        <StatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()}`}
          description="This month"
          icon="DollarSign"
          index={2}
        />

        <StatsCard
          title="Available Rooms"
          value={stats.availableRooms}
          description="Ready for booking"
          icon="DoorOpen"
          index={3}
        />

        <StatsCard
          title="Today's Check-ins"
          value={stats.todayCheckIns}
          description="Expected arrivals"
          icon="LogIn"
          index={4}
        />

        <StatsCard
          title="Today's Check-outs"
          value={stats.todayCheckOuts}
          description="Expected departures"
          icon="LogOut"
          index={5}
        />
      </div>

      <DashboardCharts />
    </div>
  );
}
