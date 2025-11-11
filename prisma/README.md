# Prisma Database Setup

This directory contains the Prisma schema and migrations for the Hotel Management System.

## Database Schema

The schema includes the following models:

- **Room**: Hotel rooms with type, pricing, amenities, and availability status
- **Booking**: Reservations linking customers to rooms with dates and payment info
- **Customer**: Guest information and contact details
- **Staff**: Employee records with roles and authentication
- **Payment**: Payment transactions linked to bookings
- **ActivityLog**: Audit trail for all system operations

## Setup Instructions

### 1. Configure Database Connection

Update the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db"
```

### 2. Run Migrations

To apply the database schema to your PostgreSQL database:

```bash
npm run db:migrate
```

Or using Prisma CLI directly:

```bash
npx prisma migrate dev
```

### 3. Generate Prisma Client

The Prisma Client is automatically generated after migrations, but you can regenerate it manually:

```bash
npm run db:generate
```

### 4. Seed the Database

Populate the database with sample data for development and testing:

```bash
npm run db:seed
```

Or using Prisma CLI:

```bash
npx prisma db seed
```

This will create:

- 5 staff members (1 Manager, 2 Receptionists, 2 Cleaners)
- 12 rooms with various types and statuses
- 8 customers
- 8 bookings with different statuses
- 7 payment records
- 6 activity log entries

**Admin Login Credentials:**

- Email: `admin@hotel.com`
- Password: `password123`

For more details, see [SEED-README.md](./SEED-README.md)

## Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes without creating migrations (dev only)
- `npm run db:migrate` - Create and apply migrations
- `npm run db:migrate:deploy` - Apply migrations in production
- `npm run db:seed` - Seed the database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Using Prisma Client

Import the Prisma client instance from `lib/db.ts`:

```typescript
import { prisma } from '@/lib/db';

// Example: Fetch all rooms
const rooms = await prisma.room.findMany();

// Example: Create a booking
const booking = await prisma.booking.create({
  data: {
    bookingNumber: 'BK-001',
    roomId: 'room-id',
    customerId: 'customer-id',
    checkInDate: new Date('2024-12-01'),
    checkOutDate: new Date('2024-12-05'),
    numberOfGuests: 2,
    totalAmount: 500.0,
  },
});
```

## Database Indexes

The schema includes optimized indexes for:

- Room status and type lookups
- Booking date range queries
- Customer and staff email searches
- Activity log filtering by entity and date

## Enums

The following enums are defined:

- **RoomType**: SINGLE, DOUBLE, SUITE, DELUXE, PRESIDENTIAL
- **RoomStatus**: AVAILABLE, OCCUPIED, MAINTENANCE
- **BookingStatus**: CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED
- **PaymentStatus**: PENDING, PAID, REFUNDED, FAILED
- **BookingSource**: ONLINE, MANUAL, PHONE, WALKIN
- **StaffRole**: MANAGER, RECEPTIONIST, CLEANER
- **PaymentMethod**: CASH, CARD, PAYSTACK, BANK_TRANSFER
- **EntityType**: ROOM, BOOKING, CUSTOMER, STAFF
- **ActionType**: CREATE, UPDATE, DELETE, CHECK_IN, CHECK_OUT

## Troubleshooting

### Migration Issues

If you encounter migration issues, you can reset the database (⚠️ this will delete all data):

```bash
npx prisma migrate reset
```

### Prisma Client Out of Sync

If the Prisma Client is out of sync with your schema:

```bash
npm run db:generate
```

### View Database in GUI

Open Prisma Studio to view and edit data:

```bash
npm run db:studio
```

## Production Deployment

1. Set the `DATABASE_URL` environment variable in your production environment
2. Run migrations: `npm run db:migrate:deploy`
3. Ensure the Prisma Client is generated during the build process

The `postinstall` script in package.json can be configured to automatically generate the Prisma Client:

```json
"postinstall": "prisma generate"
```
