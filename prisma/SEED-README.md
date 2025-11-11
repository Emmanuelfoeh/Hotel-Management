# Database Seed Script

This seed script populates the database with sample data for development and testing purposes.

## What Gets Seeded

### Staff Members (5 total)

- **1 Manager**: John Manager (admin@hotel.com)
- **2 Receptionists**: Sarah Johnson, Michael Brown
- **2 Cleaners**: Maria Garcia, James Wilson

All staff accounts use the password: `password123`

### Rooms (12 total)

- **3 Single Rooms**: $69.99 - $99.99/night
- **3 Double Rooms**: $129.99 - $169.99/night
- **3 Suites**: $279.99 - $349.99/night
- **2 Deluxe Rooms**: $399.99 - $449.99/night
- **1 Presidential Suite**: $999.99/night

Room statuses include:

- Available (most rooms)
- Occupied (2 rooms with active bookings)
- Maintenance (1 room)

### Customers (8 total)

Sample customers from various countries with complete contact information.

### Bookings (8 total)

Bookings with various statuses:

- **2 Checked-in**: Currently active bookings
- **3 Confirmed**: Upcoming bookings (1 with pending payment)
- **2 Checked-out**: Past completed bookings
- **1 Cancelled**: Cancelled booking with refund

### Payments (7 total)

Payment records for bookings with various payment methods:

- Paystack
- Card
- Cash
- Bank Transfer

### Activity Logs (6 total)

Sample activity logs showing:

- Check-ins and check-outs
- Booking creation
- Room status updates
- Staff creation

## Prerequisites

Before running the seed script, ensure:

1. PostgreSQL database is running
2. `.env` or `.env.local` file exists with `DATABASE_URL` configured
3. Database migrations have been run: `npm run db:migrate`

## How to Run

### Option 1: Using npm script (recommended)

```bash
npm run db:seed
```

### Option 2: Using Prisma CLI

```bash
npx prisma db seed
```

### Option 3: Direct execution

```bash
npx tsx prisma/seed.ts
```

## After Seeding

### Admin Login Credentials

- **Email**: admin@hotel.com
- **Password**: password123

### Other Staff Accounts

All staff members can log in with their email and password `password123`:

- sarah@hotel.com
- michael@hotel.com
- maria@hotel.com
- james@hotel.com

## Resetting the Database

To clear all data and reseed:

```bash
# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# This will automatically run the seed script after reset
```

Or manually:

```bash
# Push schema without migrations
npm run db:push

# Run seed script
npm run db:seed
```

## Customizing Seed Data

To modify the seed data:

1. Edit `prisma/seed.ts`
2. Adjust the data in the respective sections (staff, rooms, customers, bookings)
3. Run the seed script again

Note: The script clears existing data before seeding, so it's safe to run multiple times.

## Troubleshooting

### Error: "User was denied access on the database"

- Check your `DATABASE_URL` in `.env` or `.env.local`
- Ensure PostgreSQL is running
- Verify database credentials are correct

### Error: "Unique constraint failed"

- The seed script clears data before seeding
- If you see this error, manually clear the database or run `npx prisma migrate reset`

### Error: "Cannot find module 'tsx'"

- Run `npm install` to ensure all dependencies are installed
- tsx should be installed as a dev dependency

## Data Summary

After successful seeding, you'll have:

- ✅ 5 Staff members (1 Manager, 2 Receptionists, 2 Cleaners)
- ✅ 12 Rooms (various types and statuses)
- ✅ 8 Customers
- ✅ 8 Bookings (various statuses)
- ✅ 7 Payment records
- ✅ 6 Activity log entries

This provides a realistic dataset for testing all features of the Hotel Management System.
