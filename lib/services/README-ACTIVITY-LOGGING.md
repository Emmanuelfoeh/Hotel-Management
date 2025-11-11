# Activity Logging System

This document explains how to use the activity logging system in the Hotel Management System.

## Overview

The activity logging system automatically tracks all CRUD operations (Create, Read, Update, Delete) and special actions (Check-in, Check-out) performed by staff members. All logs include:

- Entity type (ROOM, BOOKING, CUSTOMER, STAFF)
- Action type (CREATE, UPDATE, DELETE, CHECK_IN, CHECK_OUT)
- User who performed the action
- Timestamp
- IP address (when available)
- Additional details (optional JSON data)

## Components

### 1. Activity Log Service (`lib/services/activity-log.service.ts`)

The core service for managing activity logs.

**Methods:**

- `createLog(data)` - Create a new activity log entry
- `getLogs(filters?)` - Get activity logs with optional filters
- `getEntityLogs(entityType, entityId)` - Get logs for a specific entity
- `getUserLogs(userId)` - Get logs for a specific user
- `getRecentLogs(limit)` - Get recent activity logs
- `deleteOldLogs(olderThanDays)` - Delete old logs for cleanup

### 2. Activity Logger Utility (`lib/utils/activity-logger.ts`)

Helper functions for logging activities.

**Functions:**

- `logActivity(entityType, entityId, action, userId, details?)` - Log a single activity
- `withActivityLog(...)` - Wrapper function to execute operation with logging
- `getClientIp()` - Get client IP address from headers

### 3. Service Logging Wrappers (`lib/utils/service-with-logging.ts`)

Convenient wrapper functions for common operations.

**Functions:**

- `loggedCreate(entityType, userId, operation, details?)` - Wrap CREATE operations
- `loggedUpdate(entityType, entityId, userId, operation, details?)` - Wrap UPDATE operations
- `loggedDelete(entityType, entityId, userId, operation, details?)` - Wrap DELETE operations
- `loggedCheckIn(entityId, userId, operation, details?)` - Wrap CHECK_IN operations
- `loggedCheckOut(entityId, userId, operation, details?)` - Wrap CHECK_OUT operations
- `loggedAction(entityType, entityId, action, userId, operation, details?)` - Generic wrapper

### 4. Server Actions (`actions/activity-log.actions.ts`)

Server actions for retrieving activity logs in the UI.

**Actions:**

- `getActivityLogs(filters?)` - Get logs with filters
- `getEntityActivityLogs(entityType, entityId)` - Get logs for specific entity
- `getRecentActivityLogs(limit)` - Get recent logs
- `deleteOldActivityLogs(olderThanDays)` - Delete old logs (managers only)

### 5. Activity Log Component (`components/admin/activity-log.tsx`)

React component for displaying activity logs with filtering.

**Props:**

- `entityType?` - Filter by entity type
- `entityId?` - Filter by entity ID
- `limit?` - Limit number of logs displayed

## Usage Examples

### Example 1: Basic Activity Logging in Server Actions

```typescript
'use server';

import { roomService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';
import { loggedCreate } from '@/lib/utils/service-with-logging';

export async function createRoom(data: CreateRoomInput) {
  const session = await requireAuth();

  const room = await loggedCreate(
    'ROOM',
    session.user.id,
    async () => await roomService.createRoom(data),
    {
      roomNumber: data.roomNumber,
      type: data.type,
      price: data.price,
    }
  );

  return { success: true, data: room };
}
```

### Example 2: Update with Activity Logging

```typescript
export async function updateBooking(id: string, data: UpdateBookingInput) {
  const session = await requireAuth();

  const booking = await loggedUpdate(
    'BOOKING',
    id,
    session.user.id,
    async () => await bookingService.updateBooking(id, data),
    {
      updatedFields: Object.keys(data),
    }
  );

  return { success: true, data: booking };
}
```

### Example 3: Check-in with Activity Logging

```typescript
export async function checkInBooking(id: string) {
  const session = await requireAuth();

  const booking = await loggedCheckIn(
    id,
    session.user.id,
    async () => await bookingService.checkIn(id),
    {
      roomNumber: booking.room.roomNumber,
      customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
    }
  );

  return { success: true, data: booking };
}
```

### Example 4: Manual Activity Logging

If you need more control, you can use the `logActivity` function directly:

```typescript
import { logActivity } from '@/lib/utils/activity-logger';

// In your server action or API route
await logActivity('BOOKING', bookingId, 'UPDATE', session.user.id, {
  field: 'paymentStatus',
  oldValue: 'PENDING',
  newValue: 'PAID',
});
```

### Example 5: Display Activity Logs in UI

```tsx
import { ActivityLog } from '@/components/admin/activity-log';

// Display all activity logs with filters
export default function ActivityLogsPage() {
  return (
    <div>
      <h1>Activity Logs</h1>
      <ActivityLog />
    </div>
  );
}

// Display logs for a specific entity
export default function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Booking Details</h1>
      {/* ... booking details ... */}

      <h2>Activity History</h2>
      <ActivityLog entityType="BOOKING" entityId={params.id} />
    </div>
  );
}

// Display recent logs with limit
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* ... dashboard content ... */}

      <h2>Recent Activity</h2>
      <ActivityLog limit={10} />
    </div>
  );
}
```

## Best Practices

1. **Always log CRUD operations**: Use the wrapper functions for all create, update, and delete operations.

2. **Include meaningful details**: Add relevant information to the `details` parameter to make logs more useful:

   ```typescript
   {
     roomNumber: data.roomNumber,
     type: data.type,
     price: data.price,
   }
   ```

3. **Don't block operations**: Activity logging is designed to be non-blocking. If logging fails, it won't affect the main operation.

4. **Use appropriate entity types**: Always use the correct entity type from the `EntityType` enum.

5. **Log special actions**: Use `loggedCheckIn` and `loggedCheckOut` for booking-specific actions.

6. **Filter logs appropriately**: When displaying logs, use filters to show only relevant information.

7. **Clean up old logs**: Periodically delete old logs to keep the database size manageable:
   ```typescript
   // Delete logs older than 90 days
   await deleteOldActivityLogs(90);
   ```

## Database Schema

The `ActivityLog` model in Prisma:

```prisma
model ActivityLog {
  id         String     @id @default(cuid())
  entityType EntityType
  entityId   String
  action     ActionType
  userId     String
  details    Json?
  ipAddress  String?
  createdAt  DateTime   @default(now())

  user Staff @relation(fields: [userId], references: [id])

  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

## Filtering Activity Logs

The activity log component and actions support various filters:

- **Entity Type**: Filter by ROOM, BOOKING, CUSTOMER, or STAFF
- **Entity ID**: Filter by specific entity
- **Action**: Filter by CREATE, UPDATE, DELETE, CHECK_IN, or CHECK_OUT
- **User ID**: Filter by specific user
- **Date Range**: Filter by start and end dates
- **Search**: Search by user name or email

## Security Considerations

1. **Authentication Required**: All activity log endpoints require authentication.
2. **Role-Based Access**: Only managers can delete activity logs.
3. **IP Address Logging**: Client IP addresses are logged when available for security auditing.
4. **Immutable Logs**: Activity logs should not be modified after creation.

## Troubleshooting

### Logs not appearing

1. Check that the user is authenticated
2. Verify the entity ID is correct
3. Check console for any logging errors
4. Ensure the database connection is working

### Performance issues

1. Use appropriate filters to limit the number of logs retrieved
2. Consider implementing pagination for large datasets
3. Regularly clean up old logs
4. Ensure database indexes are in place

## Future Enhancements

Potential improvements to the activity logging system:

1. Real-time log streaming with WebSockets
2. Advanced search and filtering capabilities
3. Export logs to CSV or PDF
4. Log aggregation and analytics
5. Automated alerts for suspicious activities
6. Log retention policies with automatic archival
