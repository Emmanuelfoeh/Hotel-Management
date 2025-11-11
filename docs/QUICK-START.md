# Quick Start Guide

Get the Hotel Management System up and running in minutes.

## Prerequisites

- Node.js 18.17+ installed
- PostgreSQL 14+ installed
- Git installed
- A code editor (VS Code recommended)

## 5-Minute Setup

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/hotel-management-system.git
cd hotel-management-system

# Install dependencies
npm install
```

### 2. Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
# Minimum required for local development:
DATABASE_URL="postgresql://postgres:password@localhost:5432/hotel_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Set Up Database (1 minute)

```bash
# Create database
createdb hotel_db

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server (1 minute)

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## Default Login Credentials

After seeding, use these credentials to login:

```
Email: admin@hotel.com
Password: admin123
```

**⚠️ Change these in production!**

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
```

## Project Structure

```
hotel-management-system/
├── app/                 # Next.js App Router
│   ├── (public)/        # Public portal
│   ├── admin/           # Admin dashboard
│   ├── auth/            # Authentication
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Utilities and services
├── actions/             # Server actions
├── prisma/              # Database schema
└── docs/                # Documentation
```

## Key Features

### Public Portal

- Browse rooms and gallery
- Make online bookings
- Secure payment with Paystack
- Responsive design

### Admin Dashboard

- Dashboard with analytics
- Room management
- Booking management
- Customer management
- Staff management
- Reports and exports

## Next Steps

### For Development

1. **Explore the codebase**:
   - Check `app/` for routes
   - Review `components/` for UI
   - Look at `lib/services/` for business logic

2. **Read the documentation**:
   - [API Documentation](./API.md)
   - [Deployment Guide](./DEPLOYMENT.md)
   - [Contributing Guide](../CONTRIBUTING.md)

3. **Set up external services** (optional for local dev):
   - Paystack for payments
   - Resend for emails
   - Uploadthing for file uploads

### For Production

1. **Set up production database**:
   - Vercel Postgres
   - Supabase
   - Railway
   - Or your own PostgreSQL server

2. **Configure external services**:
   - Get production API keys
   - Set up webhook URLs
   - Verify email domains

3. **Deploy**:
   - See [Deployment Guide](./DEPLOYMENT.md)
   - Recommended: Vercel

## Common Tasks

### Add a New Room

1. Login to admin dashboard
2. Go to Rooms > Add New Room
3. Fill in details and upload images
4. Click Save

### Create a Booking

**Public Portal**:

1. Browse rooms
2. Select dates and room
3. Fill in guest information
4. Complete payment

**Admin Dashboard**:

1. Go to Bookings > New Booking
2. Select customer and room
3. Choose dates
4. Save booking

### Generate a Report

1. Go to Reports
2. Select report type (daily/monthly)
3. Choose date range
4. Click Generate
5. Export as PDF or CSV

### View Activity Logs

1. Go to Activity Logs
2. Filter by date, entity, or user
3. View detailed log entries

## Troubleshooting

### Can't connect to database?

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql "postgresql://postgres:password@localhost:5432/hotel_db"
```

### Port 3000 already in use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Build fails?

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Need more help?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [Full Documentation](../README.md)
- Open an issue on GitHub

## Development Tips

### Hot Reload

Next.js automatically reloads when you save files. If it doesn't:

```bash
# Restart dev server
# Press Ctrl+C, then:
npm run dev
```

### Database Changes

After modifying `prisma/schema.prisma`:

```bash
# Create migration
npm run db:migrate

# Or push changes directly (dev only)
npm run db:push
```

### View Database

```bash
# Open Prisma Studio
npm run db:studio
```

Browse to `http://localhost:5555`

### Debug Mode

Add to your code:

```typescript
console.log('Debug:', { variable });
```

Check terminal or browser console.

### VS Code Extensions

Install these for better DX:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- Error Lens

## API Quick Reference

### Server Actions

```typescript
// Import actions
import { getRooms, createBooking } from '@/actions';

// Use in Server Component
const rooms = await getRooms();

// Use in Client Component
('use client');
const handleSubmit = async (data) => {
  const result = await createBooking(data);
  if (result.success) {
    // Handle success
  }
};
```

### API Routes

```typescript
// GET request
const response = await fetch('/api/rooms');
const rooms = await response.json();

// POST request
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

## Testing

### Manual Testing Checklist

- [ ] Public portal loads
- [ ] Can browse rooms
- [ ] Can create booking
- [ ] Admin login works
- [ ] Dashboard displays data
- [ ] Can manage rooms
- [ ] Can manage bookings
- [ ] Dark mode works
- [ ] Responsive on mobile

### Test Accounts

After seeding:

**Admin**:

- Email: admin@hotel.com
- Password: admin123
- Role: Manager (full access)

**Receptionist**:

- Email: receptionist@hotel.com
- Password: receptionist123
- Role: Receptionist (limited access)

## Resources

### Documentation

- [README](../README.md) - Project overview
- [API Docs](./API.md) - API reference
- [Deployment](./DEPLOYMENT.md) - Deploy guide
- [Contributing](../CONTRIBUTING.md) - Contribution guide
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues

### External Docs

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Community

- GitHub Issues
- GitHub Discussions
- Email: support@hotel.com

## What's Next?

Now that you're set up:

1. **Explore the features**: Try creating rooms, bookings, and generating reports
2. **Customize**: Modify colors, add features, or change layouts
3. **Deploy**: Get your app live with Vercel
4. **Contribute**: Help improve the project

Happy coding! 🚀
