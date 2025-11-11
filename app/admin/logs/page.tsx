import { ActivityLog } from '@/components/admin/activity-log';

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">
          View all system activities and track changes made by staff members.
        </p>
      </div>

      <ActivityLog />
    </div>
  );
}
