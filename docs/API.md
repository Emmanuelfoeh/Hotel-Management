# API Documentation

This document provides detailed information about the API routes and server actions available in the Hotel Management System.

## Table of Contents

- [Authentication](#authentication)
- [Server Actions](#server-actions)
- [API Routes](#api-routes)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

All admin routes and actions require authentication. The system uses NextAuth.js v5 for session management.

### Session Structure

```typescript
interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'MANAGER' | 'RECEPTIONIST' | 'CLEANER';
  };
  expires: string;
}
```

### Getting the Current Session

```typescript
import { auth } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return <div>Welcome {session.user.name}</div>;
}
```

## Server Actions

Server actions provide type-safe, server-side operations. They automatically handle authentication and validation.

### Room Actions

#### `getRooms(filters?: RoomFilters)`

Get all rooms with optional filtering.

**Parameters:**

```typescript
interface RoomFilters {
  type?: RoomType;
  status?: RoomStatus;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  checkIn?: Date;
  checkOut?: Date;
}
```

**Returns:**

```typescript
Promise<Room[]>;
```

**Example:**

```typescript
const rooms = await getRooms({
  type: 'DELUXE',
  status: 'AVAILABLE',
  minPrice: 100,
  maxPrice: 500,
});
```

#### `getRoomById(id: string)`

Get a single room by ID.

**Returns:**

```typescript
Promise<Room | null>;
```

#### `createRoom(data: CreateRoomInput)`

Create a new room. Requires MANAGER role.

**Parameters:**

```typescript
interface CreateRoomInput {
  name: string;
  type: RoomType;
  description?: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  floor?: number;
  roomNumber: string;
}
```

**Returns:**

```typescript
Promise<{ success: boolean; room?: Room; error?: string }>;
```

#### `updateRoom(id: string, data: UpdateRoomInput)`

Update an existing room. Requires MANAGER role.

**Returns:**

```typescript
Promise<{ success: boolean; room?: Room; error?: string }>;
```

#### `deleteRoom(id: string)`

Delete a room. Requires MANAGER role. Cannot delete rooms with active bookings.

**Returns:**

```typescript
Promise<{ success: boolean; error?: string }>;
```

#### `updateRoomStatus(id: string, status: RoomStatus)`

Update room status (AVAILABLE, OCCUPIED, MAINTENANCE).

**Returns:**

```typescript
Promise<{ success: boolean; error?: string }>;
```

### Booking Actions

#### `getBookings(filters?: BookingFilters)`

Get all bookings with optional filtering.

**Parameters:**

```typescript
interface BookingFilters {
  status?: BookingStatus;
  customerId?: string;
  roomId?: string;
  startDate?: Date;
  endDate?: Date;
  paymentStatus?: PaymentStatus;
  source?: BookingSource;
}
```

**Returns:**

```typescript
Promise<Booking[]>;
```

#### `getBookingById(id: string)`

Get a single booking with related data (room, customer, payments).

**Returns:**

```typescript
Promise<BookingWithRelations | null>;
```

#### `createBooking(data: CreateBookingInput)`

Create a new booking.

**Parameters:**

```typescript
interface CreateBookingInput {
  roomId: string;
  customerId?: string; // Optional if creating new customer
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  };
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
  source?: BookingSource;
}
```

**Returns:**

```typescript
Promise<{
  success: boolean;
  booking?: Booking;
  error?: string;
  paymentUrl?: string; // If payment initialization is successful
}>;
```

**Example:**

```typescript
const result = await createBooking({
  roomId: 'room_123',
  customerInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  },
  checkInDate: new Date('2024-12-01'),
  checkOutDate: new Date('2024-12-05'),
  numberOfGuests: 2,
  specialRequests: 'Late check-in',
});

if (result.success && result.paymentUrl) {
  // Redirect to payment page
  window.location.href = result.paymentUrl;
}
```

#### `updateBooking(id: string, data: UpdateBookingInput)`

Update an existing booking.

**Returns:**

```typescript
Promise<{ success: boolean; booking?: Booking; error?: string }>;
```

#### `cancelBooking(id: string, reason?: string)`

Cancel a booking. Sends cancellation email to customer.

**Returns:**

```typescript
Promise<{ success: boolean; error?: string }>;
```

#### `checkInBooking(id: string)`

Process check-in for a booking. Updates booking status to CHECKED_IN and room status to OCCUPIED.

**Returns:**

```typescript
Promise<{ success: boolean; error?: string }>;
```

#### `checkOutBooking(id: string)`

Process check-out for a booking. Updates booking status to CHECKED_OUT and room status to AVAILABLE.

**Returns:**

```typescript
Promise<{ success: boolean; error?: string }>;
```

#### `getBookingCalendarData(startDate: Date, endDate: Date)`

Get booking data formatted for calendar display.

**Returns:**

```typescript
Promise<BookingCalendarEvent[]>;

interface BookingCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomNumber: string;
  customerName: string;
  status: BookingStatus;
}
```

### Customer Actions

#### `getCustomers(query?: string)`

Search customers by name, email, or phone.

**Returns:**

```typescript
Promise<Customer[]>;
```

#### `getCustomerById(id: string)`

Get customer details with booking history.

**Returns:**

```typescript
Promise<CustomerWithBookings | null>;
```

#### `createCustomer(data: CreateCustomerInput)`

Create a new customer.

**Parameters:**

```typescript
interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}
```

**Returns:**

```typescript
Promise<{ success: boolean; customer?: Customer; error?: string }>;
```

#### `updateCustomer(id: string, data: UpdateCustomerInput)`

Update customer information.

**Returns:**

```typescript
Promise<{ success: boolean; customer?: Customer; error?: string }>;
```

#### `getCustomerBookings(id: string)`

Get all bookings for a specific customer.

**Returns:**

```typescript
Promise<Booking[]>;
```

### Staff Actions

#### `getStaff()`

Get all staff members. Requires MANAGER role.

**Returns:**

```typescript
Promise<Staff[]>;
```

#### `getStaffById(id: string)`

Get staff member details. Requires MANAGER role.

**Returns:**

```typescript
Promise<Staff | null>;
```

#### `createStaff(data: CreateStaffInput)`

Create a new staff member. Requires MANAGER role.

**Parameters:**

```typescript
interface CreateStaffInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  password: string;
  hireDate?: Date;
  notes?: string;
}
```

**Returns:**

```typescript
Promise<{ success: boolean; staff?: Staff; error?: string }>;
```

#### `updateStaff(id: string, data: UpdateStaffInput)`

Update staff member. Requires MANAGER role.

**Returns:**

```typescript
Promise<{ success: boolean; staff?: Staff; error?: string }>;
```

#### `deactivateStaff(id: string)`

Deactivate a staff member. Requires MANAGER role.

**Returns:**

```typescript
Promise<{ success: boolean; error?: string }>;
```

### Payment Actions

#### `initializePayment(bookingId: string)`

Initialize a Paystack payment for a booking.

**Returns:**

```typescript
Promise<{
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}>;
```

**Example:**

```typescript
const result = await initializePayment('booking_123');

if (result.success && result.authorizationUrl) {
  window.location.href = result.authorizationUrl;
}
```

#### `verifyPayment(reference: string)`

Verify a payment with Paystack.

**Returns:**

```typescript
Promise<{
  success: boolean;
  status?: 'success' | 'failed';
  amount?: number;
  error?: string;
}>;
```

### Report Actions

#### `generateDailyReport(date: Date)`

Generate a daily report for a specific date.

**Returns:**

```typescript
Promise<DailyReport>;

interface DailyReport {
  date: string;
  occupancyRate: number;
  totalRevenue: number;
  totalBookings: number;
  checkIns: number;
  checkOuts: number;
  availableRooms: number;
}
```

#### `generateMonthlyReport(month: number, year: number)`

Generate a monthly report.

**Returns:**

```typescript
Promise<MonthlyReport>;

interface MonthlyReport {
  month: string;
  year: number;
  occupancyRate: number;
  totalRevenue: number;
  totalBookings: number;
  averageRoomRate: number;
  topRoomTypes: Array<{ type: string; bookings: number }>;
}
```

#### `generateCustomReport(startDate: Date, endDate: Date)`

Generate a custom report for a date range.

**Returns:**

```typescript
Promise<CustomReport>;
```

### Analytics Actions

#### `getDashboardStats()`

Get dashboard statistics for the current period.

**Returns:**

```typescript
Promise<DashboardStats>;

interface DashboardStats {
  occupancyRate: number;
  totalBookings: number;
  totalRevenue: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  revenueChange: number; // Percentage change from previous period
  bookingsChange: number;
}
```

#### `getOccupancyChartData(range: DateRange)`

Get occupancy data for charts.

**Parameters:**

```typescript
type DateRange = 'week' | 'month' | 'year';
```

**Returns:**

```typescript
Promise<ChartDataPoint[]>;

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}
```

#### `getRevenueChartData(range: DateRange)`

Get revenue data for charts.

**Returns:**

```typescript
Promise<ChartDataPoint[]>;
```

#### `getBookingsChartData(range: DateRange)`

Get bookings data for charts.

**Returns:**

```typescript
Promise<ChartDataPoint[]>;
```

### Activity Log Actions

#### `getActivityLogs(filters?: ActivityLogFilters)`

Get activity logs with filtering.

**Parameters:**

```typescript
interface ActivityLogFilters {
  entityType?: EntityType;
  action?: ActionType;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
```

**Returns:**

```typescript
Promise<ActivityLog[]>;
```

#### `logActivity(data: CreateActivityLogInput)`

Create an activity log entry. This is typically called automatically by other actions.

**Parameters:**

```typescript
interface CreateActivityLogInput {
  entityType: EntityType;
  entityId: string;
  action: ActionType;
  details?: Record<string, any>;
  ipAddress?: string;
}
```

## API Routes

### Authentication Routes

#### `POST /api/auth/signin`

Sign in a user.

**Request Body:**

```json
{
  "email": "admin@hotel.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "admin@hotel.com",
    "name": "Admin User",
    "role": "MANAGER"
  }
}
```

#### `POST /api/auth/signout`

Sign out the current user.

#### `GET /api/auth/session`

Get the current session.

**Response:**

```json
{
  "user": {
    "id": "user_123",
    "email": "admin@hotel.com",
    "name": "Admin User",
    "role": "MANAGER"
  },
  "expires": "2024-12-31T23:59:59.999Z"
}
```

### Report Export Routes

#### `GET /api/reports/export/pdf`

Export a report as PDF.

**Query Parameters:**

- `type`: 'daily' | 'monthly' | 'custom'
- `date`: ISO date string (for daily)
- `month`: 1-12 (for monthly)
- `year`: YYYY (for monthly)
- `startDate`: ISO date string (for custom)
- `endDate`: ISO date string (for custom)

**Example:**

```
GET /api/reports/export/pdf?type=monthly&month=12&year=2024
```

**Response:**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="report-2024-12.pdf"`

#### `GET /api/reports/export/csv`

Export a report as CSV.

**Query Parameters:** Same as PDF export

**Response:**

- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="report-2024-12.csv"`

### File Upload Routes

#### `POST /api/uploadthing`

Handle file uploads via Uploadthing.

This route is managed by Uploadthing and should not be called directly. Use the `UploadButton` or `UploadDropzone` components instead.

## Webhooks

### Paystack Webhook

#### `POST /api/webhooks/paystack`

Receive payment notifications from Paystack.

**Headers:**

- `x-paystack-signature`: HMAC SHA512 signature

**Request Body:**

```json
{
  "event": "charge.success",
  "data": {
    "reference": "ref_123",
    "amount": 50000,
    "status": "success",
    "customer": {
      "email": "customer@example.com"
    }
  }
}
```

**Response:**

```json
{
  "success": true
}
```

**Webhook Configuration:**

1. Go to Paystack Dashboard > Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/paystack`
3. The webhook secret is your `PAYSTACK_SECRET_KEY`

**Events Handled:**

- `charge.success`: Payment successful
- `charge.failed`: Payment failed

## Error Handling

All server actions and API routes return consistent error responses:

### Success Response

```typescript
{
  success: true,
  data?: any,
  message?: string
}
```

### Error Response

```typescript
{
  success: false,
  error: string,
  details?: any,
  code?: string
}
```

### Common Error Codes

- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks required permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `CONFLICT`: Resource conflict (e.g., duplicate email)
- `PAYMENT_ERROR`: Payment processing failed
- `DATABASE_ERROR`: Database operation failed

### Example Error Handling

```typescript
'use client';

import { createBooking } from '@/actions/booking.actions';
import { toast } from 'sonner';

export function BookingForm() {
  const handleSubmit = async (data: BookingFormData) => {
    const result = await createBooking(data);

    if (result.success) {
      toast.success('Booking created successfully!');
      // Redirect or update UI
    } else {
      toast.error(result.error || 'Failed to create booking');

      // Handle specific errors
      if (result.code === 'VALIDATION_ERROR') {
        // Show validation errors
      } else if (result.code === 'CONFLICT') {
        // Room not available
      }
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Rate Limiting

API routes implement rate limiting to prevent abuse:

- **Authentication routes**: 5 requests per minute per IP
- **Booking creation**: 10 requests per minute per user
- **Report generation**: 20 requests per minute per user
- **Other routes**: 100 requests per minute per user

Rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

When rate limit is exceeded:

```json
{
  "success": false,
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

## Best Practices

1. **Always handle errors**: Check the `success` field in responses
2. **Use TypeScript types**: Import types from `@/types` for type safety
3. **Validate inputs**: Use Zod schemas before calling actions
4. **Handle loading states**: Use `useTransition` for pending states
5. **Show user feedback**: Use toast notifications for success/error messages
6. **Implement optimistic updates**: Update UI before server response when appropriate
7. **Cache data**: Use React Query or SWR for client-side caching
8. **Secure sensitive operations**: Always verify permissions on the server

## Examples

### Complete Booking Flow

```typescript
'use client';

import { useState, useTransition } from 'react';
import { createBooking, initializePayment } from '@/actions/booking.actions';
import { toast } from 'sonner';

export function BookingFlow() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');

  const handleBooking = async (formData: BookingFormData) => {
    startTransition(async () => {
      // Step 1: Create booking
      const bookingResult = await createBooking(formData);

      if (!bookingResult.success) {
        toast.error(bookingResult.error);
        return;
      }

      // Step 2: Initialize payment
      const paymentResult = await initializePayment(bookingResult.booking!.id);

      if (!paymentResult.success) {
        toast.error('Failed to initialize payment');
        return;
      }

      // Step 3: Redirect to payment
      if (paymentResult.authorizationUrl) {
        window.location.href = paymentResult.authorizationUrl;
      }
    });
  };

  return (
    <div>
      {step === 'form' && (
        <BookingForm onSubmit={handleBooking} isPending={isPending} />
      )}
    </div>
  );
}
```

### Dashboard with Real-time Stats

```typescript
import { getDashboardStats, getRevenueChartData } from '@/actions/analytics.actions';
import { StatsCard } from '@/components/admin/stats-card';
import { RevenueChart } from '@/components/admin/charts/revenue-chart';

export default async function DashboardPage() {
  const [stats, chartData] = await Promise.all([
    getDashboardStats(),
    getRevenueChartData('month')
  ]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          change={stats.occupancyChange}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          change={stats.bookingsChange}
        />
      </div>

      <RevenueChart data={chartData} />
    </div>
  );
}
```
