# Start the Hotel Management System NOW (2 Minutes)

## Fastest Way to See the UI

Your `.env.local` is already configured with a strong secret! You just need a database.

### Option A: Free Cloud Database (EASIEST - 2 minutes)

**Use Vercel Postgres (Free):**

1. Go to https://vercel.com/signup
2. Sign up (free account)
3. Create a new project
4. Go to Storage → Create Database → Postgres
5. Copy the `DATABASE_URL` from the `.env.local` tab
6. Replace the DATABASE_URL in your `.env.local` file

**OR Use Supabase (Free):**

1. Go to https://supabase.com/
2. Sign up (free account)
3. Create a new project
4. Go to Settings → Database
5. Copy the "Connection string" (URI format)
6. Replace the DATABASE_URL in your `.env.local` file

### Option B: Local PostgreSQL (If you have it installed)

If you already have PostgreSQL installed:

```bash
# Create database
createdb hotel_db

# Update .env.local with:
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/hotel_db"
```

---

## After Setting Up Database

Run these commands:

```bash
# 1. Push database schema
npm run db:push

# 2. Seed initial data (creates admin user and sample rooms)
npm run db:seed

# 3. Start the app
npm run dev
```

---

## Access the Application

**Public Portal:**

- http://localhost:3000

**Admin Login:**

- http://localhost:3000/auth/login
- Email: `admin@hotel.com`
- Password: `admin123`

---

## What Will Work Right Away

✅ **Full UI Experience:**

- Browse all public pages
- View rooms and gallery
- Login to admin dashboard
- Create/edit rooms, bookings, customers
- View reports and analytics
- Dark mode toggle
- Responsive design
- All CRUD operations

⚠️ **What Won't Work (with dummy API keys):**

- Payment processing (need real Paystack keys)
- Email sending (need real Resend key)
- File uploads (need real Uploadthing keys)

But you can still **see and test the entire UI** including the booking form, payment page, etc. They just won't actually process payments or send emails.

---

## Current Status of Your .env.local

✅ **Already Configured:**

- NEXTAUTH_SECRET (strong secret generated)
- NEXTAUTH_URL (localhost:3000)
- All app URLs
- Dummy API keys (app will start)

❌ **Needs Real Value:**

- DATABASE_URL (get from Vercel/Supabase or use local PostgreSQL)

---

## Recommendation

**For just seeing the UI:** Use Vercel Postgres or Supabase (free, 2 minutes setup)

**For full functionality later:** Get real API keys from:

- Paystack: https://paystack.com/ (for payments)
- Resend: https://resend.com/ (for emails)
- Uploadthing: https://uploadthing.com/ (for file uploads)

But you don't need these to see and explore the UI!

---

## Need Help?

If you get stuck, let me know and I can help you set up the database or troubleshoot any issues.
