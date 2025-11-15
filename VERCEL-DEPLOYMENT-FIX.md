# Vercel Deployment Fix

## Problem

The build was failing on Vercel because admin pages were trying to query the database during the build process (static generation), but the database tables didn't exist yet since migrations hadn't been run.

## Solution

Added `export const dynamic = 'force-dynamic'` to all admin pages that query the database. This tells Next.js to render these pages dynamically at request time instead of trying to pre-render them during the build.

## Files Updated

- `app/admin/dashboard/page.tsx`
- `app/admin/bookings/page.tsx`
- `app/admin/bookings/calendar/page.tsx`
- `app/admin/rooms/page.tsx`
- `app/admin/customers/page.tsx`
- `app/admin/staff/page.tsx`

## Next Steps After Deployment

1. **Run Database Migrations**:

   ```bash
   # Install Vercel CLI if you haven't
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link to your project
   vercel link

   # Pull environment variables
   vercel env pull .env.local

   # Run migrations
   npx prisma migrate deploy

   # Seed the database
   npm run db:seed
   ```

2. **Verify Deployment**:
   - Visit your app URL
   - Try logging in with seeded admin credentials
   - Test the booking flow
   - Check admin dashboard

3. **Configure Webhooks**:
   - Update Paystack webhook URL to: `https://your-domain.vercel.app/api/webhooks/paystack`

## Why This Works

- Admin pages require authentication and database access
- They should never be statically generated
- Dynamic rendering ensures they're only rendered when a user requests them
- This also ensures fresh data on every request
- The database only needs to exist when users actually visit the pages, not during build time

## Build Status

✅ Build now completes successfully
✅ TypeScript compilation passes
✅ All admin pages configured for dynamic rendering
✅ Public pages remain static for optimal performance
