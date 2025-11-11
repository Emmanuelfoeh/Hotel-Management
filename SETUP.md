# Hotel Management System - Setup Guide

This guide provides detailed instructions for setting up the Hotel Management System for development and production environments.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Service Configuration](#service-configuration)
4. [Database Setup](#database-setup)
5. [Testing the Setup](#testing-the-setup)
6. [Common Issues](#common-issues)

## Quick Start

For experienced developers who want to get started quickly:

```bash
# Clone and install
git clone <repository-url>
cd hotel-management-system
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

Visit http://localhost:3000 and login with:

- Email: `admin@hotel.com`
- Password: `admin123`

## Detailed Setup

### Step 1: System Requirements

Ensure you have the following installed:

- **Node.js 22 or higher**

  ```bash
  node --version  # Should be v22.x.x or higher
  ```

  If you need to install or upgrade Node.js:
  - Using nvm (recommended): `nvm install 22 && nvm use 22`
  - Download from: https://nodejs.org/

- **PostgreSQL 14 or higher**

  ```bash
  psql --version  # Should be 14.x or higher
  ```

  Installation options:
  - macOS: `brew install postgresql@16`
  - Ubuntu: `sudo apt install postgresql postgresql-contrib`
  - Windows: Download from https://www.postgresql.org/download/windows/
  - Cloud: Use Vercel Postgres, Supabase, or Railway

- **Git**
  ```bash
  git --version
  ```

### Step 2: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd hotel-management-system

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Database Configuration

#### Option A: Local PostgreSQL

1. **Start PostgreSQL service:**

   ```bash
   # macOS
   brew services start postgresql@16

   # Ubuntu
   sudo systemctl start postgresql

   # Windows
   # Start from Services or pgAdmin
   ```

2. **Create database:**

   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database and user
   CREATE DATABASE hotel_db;
   CREATE USER hotel_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE hotel_db TO hotel_user;
   \q
   ```

3. **Set DATABASE_URL in .env.local:**
   ```env
   DATABASE_URL="postgresql://hotel_user:your_password@localhost:5432/hotel_db"
   ```

#### Option B: Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string
4. Add to `.env.local`

#### Option C: Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection pooler URL (transaction mode)
5. Add to `.env.local`

#### Option D: Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Create a new PostgreSQL database
3. Copy the DATABASE_URL
4. Add to `.env.local`

### Step 4: Environment Variables Configuration

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure each service:

#### 4.1 Authentication (NextAuth.js)

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<your-secret-here>"
```

Generate a secure secret:

```bash
openssl rand -base64 32
```

#### 4.2 Payment Gateway (Paystack)

1. **Sign up for Paystack:**
   - Go to https://paystack.com
   - Create an account
   - Complete business verification (for live mode)

2. **Get API keys:**
   - Go to https://dashboard.paystack.com/#/settings/developers
   - Copy your test keys for development
   - Copy your live keys for production

3. **Add to .env.local:**

   ```env
   PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxx"
   ```

4. **Test cards for development:**
   - Success: 4084084084084081
   - Decline: 4084080000000408
   - See more: https://paystack.com/docs/payments/test-payments

#### 4.3 Email Service (Resend)

1. **Sign up for Resend:**
   - Go to https://resend.com
   - Create an account

2. **Get API key:**
   - Go to https://resend.com/api-keys
   - Create a new API key
   - Copy the key

3. **Verify domain (optional for production):**
   - Go to https://resend.com/domains
   - Add your domain
   - Add DNS records
   - For development, you can use the test domain

4. **Add to .env.local:**

   ```env
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

   For development, you can use:

   ```env
   EMAIL_FROM="onboarding@resend.dev"
   ```

#### 4.4 File Upload (Uploadthing)

1. **Sign up for Uploadthing:**
   - Go to https://uploadthing.com
   - Create an account

2. **Create an app:**
   - Go to https://uploadthing.com/dashboard
   - Click "Create App"
   - Copy the App ID and Secret

3. **Add to .env.local:**
   ```env
   UPLOADTHING_SECRET="sk_xxxxxxxxxxxxx"
   UPLOADTHING_APP_ID="xxxxxxxxxxxxx"
   ```

#### 4.5 Application Settings

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Hotel Management System"
```

For production, change to your actual domain:

```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 5: Database Migration and Seeding

1. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

2. **Run migrations:**

   ```bash
   npx prisma migrate dev
   ```

   This will:
   - Create all database tables
   - Set up relationships and constraints
   - Apply indexes

3. **Seed the database:**

   ```bash
   npx prisma db seed
   ```

   This creates:
   - Admin user (admin@hotel.com / admin123)
   - 10 sample rooms with different types
   - 5 sample customers
   - 10 sample bookings
   - 3 sample staff members

4. **Verify database setup:**

   ```bash
   npx prisma studio
   ```

   This opens a GUI at http://localhost:5555 to browse your data.

### Step 6: Run the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

**Default login credentials:**

- Email: `admin@hotel.com`
- Password: `admin123`

## Service Configuration

### Paystack Webhook Setup

For payment notifications to work, you need to configure webhooks:

1. **Development (using ngrok or similar):**

   ```bash
   # Install ngrok
   npm install -g ngrok

   # Start ngrok tunnel
   ngrok http 3000

   # Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
   ```

2. **Configure webhook in Paystack:**
   - Go to https://dashboard.paystack.com/#/settings/developers
   - Add webhook URL: `https://your-domain.com/api/webhooks/paystack`
   - For development: `https://abc123.ngrok.io/api/webhooks/paystack`

3. **Test webhook:**
   - Make a test payment
   - Check the webhook logs in Paystack dashboard
   - Verify payment status updates in your app

### Email Testing

For development, you can use email testing services:

1. **Resend Test Mode:**
   - Use `onboarding@resend.dev` as sender
   - Emails will be sent to your verified email

2. **Mailtrap (alternative):**
   - Sign up at https://mailtrap.io
   - Use SMTP credentials for testing
   - All emails are caught and displayed in Mailtrap inbox

## Database Setup

### Database Schema Overview

The application uses the following main tables:

- **Room**: Hotel rooms with types, prices, and amenities
- **Booking**: Reservations linking customers to rooms
- **Customer**: Guest information and contact details
- **Staff**: Employee accounts with roles and permissions
- **Payment**: Payment records and transaction details
- **ActivityLog**: Audit trail of all system operations

### Database Maintenance

**View database:**

```bash
npx prisma studio
```

**Reset database (WARNING: deletes all data):**

```bash
npx prisma migrate reset
```

**Create new migration:**

```bash
npx prisma migrate dev --name description_of_changes
```

**Apply migrations in production:**

```bash
npx prisma migrate deploy
```

## Testing the Setup

### 1. Test Authentication

1. Go to http://localhost:3000/auth/login
2. Login with admin@hotel.com / admin123
3. Verify you're redirected to the admin dashboard

### 2. Test Room Management

1. Go to Admin > Rooms
2. Click "Add New Room"
3. Fill in room details
4. Upload an image
5. Save and verify the room appears in the list

### 3. Test Booking Flow

1. Go to the public portal (http://localhost:3000)
2. Browse available rooms
3. Select a room and dates
4. Fill in customer information
5. Proceed to payment (use test card: 4084084084084081)
6. Verify booking confirmation

### 4. Test Email Notifications

1. Create a new booking
2. Check your email for confirmation
3. Check Resend dashboard for sent emails

### 5. Test File Uploads

1. Go to Admin > Rooms > Edit
2. Upload a room image
3. Verify the image appears
4. Check Uploadthing dashboard for uploaded files

## Common Issues

### Issue: Database connection failed

**Error:** `Can't reach database server`

**Solutions:**

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL is correct
- Ensure database exists: `psql -l`
- Check firewall settings
- For cloud databases, verify IP whitelist

### Issue: Environment variable validation errors

**Error:** `Invalid environment variables`

**Solutions:**

- Check all required variables are set in `.env.local`
- Verify no typos in variable names
- Ensure values are in correct format (URLs, emails, etc.)
- Restart development server after changes

### Issue: Prisma client not generated

**Error:** `Cannot find module '@prisma/client'`

**Solutions:**

```bash
npx prisma generate
npm install
```

### Issue: Migration failed

**Error:** `Migration failed to apply`

**Solutions:**

- Check database connection
- Verify database user has sufficient permissions
- Reset database if in development: `npx prisma migrate reset`
- Check for conflicting migrations

### Issue: Port 3000 already in use

**Error:** `Port 3000 is already in use`

**Solutions:**

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Issue: Payment webhook not working

**Error:** Payments not updating after completion

**Solutions:**

- Verify webhook URL is correct in Paystack dashboard
- Check webhook URL is publicly accessible (use ngrok for local)
- Verify PAYSTACK_SECRET_KEY is correct
- Check webhook logs in Paystack dashboard
- Ensure webhook endpoint is not protected by auth middleware

### Issue: Emails not sending

**Error:** Email sending fails

**Solutions:**

- Verify RESEND_API_KEY is correct
- Check EMAIL_FROM is verified in Resend
- For development, use `onboarding@resend.dev`
- Check Resend dashboard for error logs
- Verify email service is not rate limited

### Issue: File upload fails

**Error:** Image upload not working

**Solutions:**

- Verify UPLOADTHING_SECRET and UPLOADTHING_APP_ID are correct
- Check file size limits (default: 4MB)
- Verify file type is allowed (images only)
- Check Uploadthing dashboard for errors
- Ensure proper CORS configuration

## Next Steps

After successful setup:

1. **Change default admin password**
2. **Configure production environment variables**
3. **Set up monitoring and error tracking (Sentry)**
4. **Configure backup strategy for database**
5. **Review security settings**
6. **Test all features thoroughly**
7. **Deploy to production** (see README.md for deployment guide)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Paystack Documentation](https://paystack.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Uploadthing Documentation](https://docs.uploadthing.com)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](link-to-issues)
2. Review the [Requirements](.kiro/specs/hotel-management-system/requirements.md)
3. Check the [Design Document](.kiro/specs/hotel-management-system/design.md)
4. Open a new issue with detailed error messages and steps to reproduce
