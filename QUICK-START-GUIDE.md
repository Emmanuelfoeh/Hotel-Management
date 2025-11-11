# Quick Start Guide - Run the Hotel Management System

## Option 1: Quick View (Minimal Setup - See UI Only)

If you just want to see the UI without full functionality, follow these steps:

### Step 1: Generate a Strong Secret

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### Step 2: Update .env.local with Minimal Config

Replace the placeholder values in `.env.local` with these minimal working values:

```bash
# Database (SQLite for quick testing - no PostgreSQL needed)
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<paste-the-generated-secret-here>"

# Paystack (dummy test keys - won't work but app will start)
PAYSTACK_SECRET_KEY="sk_test_dummy_key_for_development_only"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_dummy_key_for_development_only"

# Email Service (dummy key - won't send emails but app will start)
RESEND_API_KEY="re_dummy_key_for_development_only"
EMAIL_FROM="noreply@localhost.com"

# File Upload (dummy keys - won't upload but app will start)
UPLOADTHING_SECRET="sk_dummy_key_for_development_only"
UPLOADTHING_APP_ID="dummy_app_id"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Hotel Management System"
```

### Step 3: Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates SQLite file)
npm run db:push

# Seed initial data (creates admin user and sample rooms)
npm run db:seed
```

### Step 4: Run the Development Server

```bash
npm run dev
```

### Step 5: Access the Application

**Public Portal:**

- Homepage: http://localhost:3000
- Rooms: http://localhost:3000/rooms
- Gallery: http://localhost:3000/gallery

**Admin Dashboard:**

- Login: http://localhost:3000/auth/login
- Default credentials (from seed):
  - Email: `admin@hotel.com`
  - Password: `admin123`

### What Will Work:

- ✅ Browse public pages
- ✅ View rooms and details
- ✅ Login to admin dashboard
- ✅ View all admin pages
- ✅ Create/edit rooms, bookings, customers
- ✅ Dark mode toggle
- ✅ Responsive design

### What Won't Work (with dummy keys):

- ❌ Payment processing (Paystack)
- ❌ Email sending (Resend)
- ❌ File uploads (Uploadthing)

---

## Option 2: Full Setup (All Features Working)

For full functionality including payments, emails, and file uploads:

### Step 1: Set Up PostgreSQL Database

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb hotel_db

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://your_username@localhost:5432/hotel_db"
```

**Option B: Cloud Database (Recommended)**

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (Free tier)
- [Supabase](https://supabase.com/) (Free tier)
- [Railway](https://railway.app/) (Free tier)

### Step 2: Get Real API Keys

**Paystack (Payment Gateway)**

1. Sign up at https://paystack.com/
2. Go to Settings → API Keys & Webhooks
3. Copy your test keys:
   - Secret Key (sk_test_xxx)
   - Public Key (pk_test_xxx)
4. Update in .env.local

**Resend (Email Service)**

1. Sign up at https://resend.com/
2. Go to API Keys
3. Create a new API key
4. Update RESEND_API_KEY in .env.local
5. Verify your domain or use onboarding@resend.dev for testing

**Uploadthing (File Upload)**

1. Sign up at https://uploadthing.com/
2. Create a new app
3. Copy your credentials:
   - Secret (sk_xxx)
   - App ID (xxx)
4. Update in .env.local

### Step 3: Generate Strong Secret

```bash
openssl rand -base64 32
```

Update NEXTAUTH_SECRET in .env.local

### Step 4: Set Up Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### Step 5: Run Development Server

```bash
npm run dev
```

### Step 6: Test Full Features

**Test Payment:**

1. Create a booking
2. Use Paystack test card: `4084084084084081`
3. CVV: `408`, Expiry: any future date
4. Complete payment

**Test Email:**

1. Complete a booking
2. Check your email for confirmation
3. Check-in a booking
4. Check email for welcome message

**Test File Upload:**

1. Go to Admin → Rooms → New Room
2. Upload room images
3. Verify images are stored

---

## Troubleshooting

### Issue: "Invalid environment variables"

**Solution:** Make sure all required variables in .env.local have values (not "xxx" or empty)

### Issue: "Database connection failed"

**Solution:**

- For SQLite: Make sure you ran `npm run db:push`
- For PostgreSQL: Check your DATABASE_URL is correct and database exists

### Issue: "NEXTAUTH_SECRET must be at least 32 characters"

**Solution:** Generate a proper secret with `openssl rand -base64 32`

### Issue: Node.js version warning

**Solution:** Upgrade to Node.js 20+

```bash
# Using nvm
nvm install 20
nvm use 20

# Or download from https://nodejs.org/
```

### Issue: Port 3000 already in use

**Solution:**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

---

## Default Login Credentials (After Seeding)

**Manager Account:**

- Email: `admin@hotel.com`
- Password: `admin123`
- Access: Full access to all features

**Receptionist Account:**

- Email: `receptionist@hotel.com`
- Password: `receptionist123`
- Access: Bookings, customers, limited reports

**Cleaner Account:**

- Email: `cleaner@hotel.com`
- Password: `cleaner123`
- Access: Read-only access

---

## Next Steps After Running

1. **Explore the Public Portal**
   - Browse rooms
   - View gallery
   - Try the booking form (won't complete without payment setup)

2. **Explore the Admin Dashboard**
   - Login with admin credentials
   - View dashboard statistics
   - Create/edit rooms
   - Manage bookings
   - View reports
   - Check activity logs

3. **Test Dark Mode**
   - Click the sun/moon icon in the navbar
   - Verify all pages look good in both themes

4. **Test Responsive Design**
   - Resize browser window
   - Test on mobile device
   - Verify layout adapts properly

5. **Test Role-Based Access**
   - Login as different users
   - Verify access restrictions work
   - Try accessing restricted pages

---

## Recommended: Use Option 1 First

I recommend starting with **Option 1 (Minimal Setup)** to quickly see the UI and explore the features. You can always upgrade to Option 2 later when you want to test payments, emails, and file uploads.

The minimal setup uses SQLite (no PostgreSQL needed) and dummy API keys, which is perfect for UI exploration and development.

---

## Need Help?

- Check `INTEGRATION-TEST-RESULTS.md` for detailed feature documentation
- Check `TROUBLESHOOTING.md` in the docs folder
- Check `.env.example` for all available environment variables
- Check `SETUP.md` for detailed setup instructions
