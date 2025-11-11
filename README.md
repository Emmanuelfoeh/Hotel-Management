# Hotel Management System

A modern, full-stack hotel management system built with Next.js 14+, TypeScript, and TailwindCSS 4. This application provides a comprehensive solution for managing hotel operations with a public-facing booking portal and a powerful admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Routes & Server Actions](#-api-routes--server-actions)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Public Portal

- **Modern Landing Page**: Beautiful hero section with integrated search functionality
- **Room Browsing**: Browse available rooms with filtering by type, price, and capacity
- **Gallery**: Responsive image gallery with lightbox functionality
- **Online Booking**: Complete booking flow with date selection and guest information
- **Payment Integration**: Secure online payments via Paystack
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Full dark mode support with theme persistence

### Admin Dashboard

- **Dashboard Analytics**: Real-time occupancy rates, revenue tracking, and booking trends
- **Room Management**: Complete CRUD operations for rooms with image uploads
- **Booking Management**:
  - List view with advanced filtering and search
  - Calendar view for visual booking overview
  - Manual booking creation
  - Check-in/check-out processing
- **Customer Management**: Customer profiles with booking history
- **Staff Management**: Role-based access control (Manager, Receptionist, Cleaner)
- **Reports & Analytics**:
  - Daily and monthly reports
  - Revenue and occupancy charts
  - PDF and CSV export functionality
- **Activity Logging**: Comprehensive audit trail of all system operations
- **Email Notifications**: Automated emails for bookings, cancellations, and check-ins

### Technical Features

- **Authentication**: Secure authentication with NextAuth.js v5
- **Authorization**: Role-based access control with granular permissions
- **Form Validation**: Client and server-side validation with Zod
- **Animations**: Smooth transitions and animations with Framer Motion
- **Type Safety**: Full TypeScript coverage
- **Database**: PostgreSQL with Prisma ORM
- **File Uploads**: Image upload with Uploadthing
- **Email Service**: Transactional emails with Resend

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma 6
- **Authentication**: NextAuth.js v5
- **Payment**: Paystack
- **Email**: Resend
- **File Upload**: Uploadthing
- **PDF Generation**: jsPDF + jsPDF-AutoTable

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17 or higher
- **npm**: v9 or higher (comes with Node.js)
- **PostgreSQL**: v14 or higher
- **Git**: For version control

You'll also need accounts for:

- **Paystack**: For payment processing ([Sign up](https://paystack.com))
- **Resend**: For email service ([Sign up](https://resend.com))
- **Uploadthing**: For file uploads ([Sign up](https://uploadthing.com))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hotel-management-system.git
cd hotel-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values. See [Environment Variables](#-environment-variables) section for details.

### 4. Set Up the Database

See the [Database Setup](#-database-setup) section for detailed instructions.

### 5. Run Database Migrations

```bash
npm run db:migrate
```

### 6. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

This creates:

- An admin user (email: `admin@hotel.com`, password: `admin123`)
- Sample rooms
- Sample customers
- Sample bookings
- Sample staff members

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Alternative: Automated Setup

Use the setup script for a guided installation:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:

- Check prerequisites
- Install dependencies
- Create .env.local with generated secrets
- Create database
- Run migrations
- Seed sample data

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"

# Paystack
PAYSTACK_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxx"

# Email (Resend)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@hotel.com"

# File Upload (Uploadthing)
UPLOADTHING_SECRET="sk_xxx"
UPLOADTHING_APP_ID="xxx"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generating Secrets

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Getting API Keys

1. **Paystack**:
   - Sign up at [paystack.com](https://paystack.com)
   - Go to Settings > API Keys & Webhooks
   - Copy your test keys for development

2. **Resend**:
   - Sign up at [resend.com](https://resend.com)
   - Go to API Keys
   - Create a new API key
   - Verify your sender domain or email

3. **Uploadthing**:
   - Sign up at [uploadthing.com](https://uploadthing.com)
   - Create a new app
   - Copy your App ID and Secret

See `.env.example` for detailed documentation of all environment variables.

## 🗄 Database Setup

### Local Development (PostgreSQL)

#### Option 1: Install PostgreSQL Locally

1. **Install PostgreSQL**:
   - macOS: `brew install postgresql@14`
   - Ubuntu: `sudo apt-get install postgresql-14`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Start PostgreSQL**:

   ```bash
   # macOS
   brew services start postgresql@14

   # Ubuntu
   sudo service postgresql start
   ```

3. **Create Database**:

   ```bash
   psql postgres
   CREATE DATABASE hotel_db;
   CREATE USER hotel_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE hotel_db TO hotel_user;
   \q
   ```

4. **Update DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://hotel_user:your_password@localhost:5432/hotel_db"
   ```

#### Option 2: Use Docker

```bash
docker run --name hotel-postgres \
  -e POSTGRES_DB=hotel_db \
  -e POSTGRES_USER=hotel_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

### Cloud Database (Production)

#### Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to Storage > Create Database > Postgres
3. Copy the connection string to your environment variables

#### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > Database
3. Copy the connection pooler URL (recommended for serverless)
4. Use the connection string in your environment variables

#### Railway

1. Create a project at [railway.app](https://railway.app)
2. Add a PostgreSQL database
3. Copy the DATABASE_URL from the database settings

### Running Migrations

After setting up your database:

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Or push schema directly (for development)
npm run db:push
```

### Database Management

```bash
# Open Prisma Studio (GUI for database)
npm run db:studio

# Create a new migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Seed database with sample data
npm run db:seed
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Access the application:

- Public Portal: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`
- Login Page: `http://localhost:3000/auth/login`

### Default Admin Credentials (After Seeding)

```
Email: admin@hotel.com
Password: admin123
```

**⚠️ Important**: Change these credentials in production!

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Other Commands

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Open Prisma Studio
npm run db:studio
```

## 📁 Project Structure

```
hotel-management-system/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public portal routes
│   │   ├── page.tsx              # Home page
│   │   ├── rooms/                # Room browsing
│   │   ├── gallery/              # Gallery page
│   │   ├── booking/              # Booking flow
│   │   └── layout.tsx            # Public layout
│   ├── admin/                    # Admin dashboard routes
│   │   ├── dashboard/            # Dashboard page
│   │   ├── rooms/                # Room management
│   │   ├── bookings/             # Booking management
│   │   ├── customers/            # Customer management
│   │   ├── staff/                # Staff management
│   │   ├── reports/              # Reports & analytics
│   │   ├── logs/                 # Activity logs
│   │   └── layout.tsx            # Admin layout
│   ├── auth/                     # Authentication pages
│   │   └── login/                # Login page
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth.js
│   │   ├── webhooks/             # Payment webhooks
│   │   └── reports/              # Report exports
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── public/                   # Public portal components
│   ├── admin/                    # Admin dashboard components
│   ├── shared/                   # Shared components
│   └── providers/                # Context providers
├── lib/                          # Utility libraries
│   ├── services/                 # Business logic services
│   ├── validations/              # Zod schemas
│   ├── utils/                    # Helper functions
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # NextAuth config
│   └── constants.ts              # App constants
├── actions/                      # Server actions
│   ├── room.actions.ts
│   ├── booking.actions.ts
│   ├── customer.actions.ts
│   └── staff.actions.ts
├── types/                        # TypeScript types
├── prisma/                       # Prisma schema & migrations
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Migration files
├── public/                       # Static assets
├── .env.example                  # Environment template
├── .env.local                    # Local environment (gitignored)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🔌 API Routes & Server Actions

### API Routes

#### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session

#### Webhooks

- `POST /api/webhooks/paystack` - Paystack payment webhook

#### Reports

- `GET /api/reports/export/pdf` - Export report as PDF
- `GET /api/reports/export/csv` - Export report as CSV

#### File Upload

- `POST /api/uploadthing` - Handle file uploads

### Server Actions

Server actions are located in the `actions/` directory and provide type-safe server-side operations:

#### Room Actions (`actions/room.actions.ts`)

- `getRooms()` - Get all rooms with filters
- `getRoomById(id)` - Get single room
- `createRoom(data)` - Create new room
- `updateRoom(id, data)` - Update room
- `deleteRoom(id)` - Delete room
- `updateRoomStatus(id, status)` - Update room status

#### Booking Actions (`actions/booking.actions.ts`)

- `getBookings(filters)` - Get bookings with filters
- `getBookingById(id)` - Get single booking
- `createBooking(data)` - Create new booking
- `updateBooking(id, data)` - Update booking
- `cancelBooking(id)` - Cancel booking
- `checkInBooking(id)` - Process check-in
- `checkOutBooking(id)` - Process check-out
- `getBookingCalendarData(start, end)` - Get calendar events

#### Customer Actions (`actions/customer.actions.ts`)

- `getCustomers(query)` - Search customers
- `getCustomerById(id)` - Get customer details
- `createCustomer(data)` - Create customer
- `updateCustomer(id, data)` - Update customer
- `getCustomerBookings(id)` - Get customer booking history

#### Staff Actions (`actions/staff.actions.ts`)

- `getStaff()` - Get all staff
- `getStaffById(id)` - Get staff member
- `createStaff(data)` - Create staff member
- `updateStaff(id, data)` - Update staff member
- `deactivateStaff(id)` - Deactivate staff member

#### Payment Actions (`actions/payment.actions.ts`)

- `initializePayment(bookingId)` - Initialize Paystack payment
- `verifyPayment(reference)` - Verify payment status

#### Report Actions (`actions/report.actions.ts`)

- `generateDailyReport(date)` - Generate daily report
- `generateMonthlyReport(month, year)` - Generate monthly report
- `generateCustomReport(startDate, endDate)` - Generate custom report

#### Analytics Actions (`actions/analytics.actions.ts`)

- `getDashboardStats()` - Get dashboard statistics
- `getOccupancyChartData(range)` - Get occupancy chart data
- `getRevenueChartData(range)` - Get revenue chart data
- `getBookingsChartData(range)` - Get bookings chart data

#### Activity Log Actions (`actions/activity-log.actions.ts`)

- `getActivityLogs(filters)` - Get activity logs with filters
- `logActivity(data)` - Create activity log entry

### Usage Example

```typescript
// In a Server Component
import { getRooms } from '@/actions/room.actions';

export default async function RoomsPage() {
  const rooms = await getRooms({ status: 'AVAILABLE' });

  return (
    <div>
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

// In a Client Component with Server Action
'use client';

import { createBooking } from '@/actions/booking.actions';
import { useTransition } from 'react';

export function BookingForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: BookingFormData) => {
    startTransition(async () => {
      const result = await createBooking(data);
      if (result.success) {
        // Handle success
      }
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Quick Start Guide](docs/QUICK-START.md)** - Get up and running in 5 minutes
- **[API Documentation](docs/API.md)** - Complete API reference with examples
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to production (Vercel, Railway, Docker, VPS)
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Solutions to common issues
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

For a complete documentation index, see [docs/README.md](docs/README.md).

## 🚢 Deployment

### Vercel (Recommended)

Vercel provides the best experience for Next.js applications:

1. **Push to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/hotel-management-system.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (copy from `.env.local`)
   - Click "Deploy"

3. **Set Up Database**:
   - In Vercel dashboard, go to Storage > Create Database > Postgres
   - Copy the connection string
   - Add to environment variables as `DATABASE_URL`

4. **Run Migrations**:

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Run migrations
   vercel env pull .env.local
   npm run db:migrate:deploy
   ```

5. **Configure Webhooks**:
   - Update Paystack webhook URL to: `https://yourdomain.vercel.app/api/webhooks/paystack`

### Other Platforms

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

#### Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build image
docker build -t hotel-management-system .

# Run container
docker run -p 3000:3000 --env-file .env.local hotel-management-system
```

### Post-Deployment Checklist

- [ ] All environment variables are set
- [ ] Database migrations are run
- [ ] Database is seeded with initial admin user
- [ ] Paystack webhook URL is configured
- [ ] Email sender domain is verified
- [ ] File upload service is configured
- [ ] HTTPS is enabled
- [ ] Custom domain is configured (optional)
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Analytics is configured (optional)
- [ ] Default admin password is changed
- [ ] Backup strategy is in place

## 📸 Screenshots

### Public Portal

#### Home Page

![Home Page](docs/screenshots/home.png)
_Modern landing page with hero section and integrated search_

#### Rooms Listing

![Rooms Listing](docs/screenshots/rooms.png)
_Browse available rooms with filtering options_

#### Room Details

![Room Details](docs/screenshots/room-details.png)
_Detailed room information with image carousel_

#### Booking Flow

![Booking Flow](docs/screenshots/booking.png)
_Seamless booking process with payment integration_

### Admin Dashboard

#### Dashboard

![Dashboard](docs/screenshots/dashboard.png)
_Real-time analytics and key metrics_

#### Room Management

![Room Management](docs/screenshots/admin-rooms.png)
_Complete room inventory management_

#### Booking Calendar

![Booking Calendar](docs/screenshots/calendar.png)
_Visual calendar view of all bookings_

#### Reports

![Reports](docs/screenshots/reports.png)
_Comprehensive reports with export functionality_

### Dark Mode

![Dark Mode](docs/screenshots/dark-mode.png)
_Full dark mode support across all pages_

> **Note**: Screenshots are for demonstration purposes. Your actual implementation may vary.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Ensure all TypeScript types are correct
- Run linting and formatting before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Paystack](https://paystack.com/) - Payment infrastructure
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For support, email support@hotel.com or open an issue on GitHub.

## 🗺 Roadmap

- [ ] Multi-property support for hotel chains
- [ ] Housekeeping management module
- [ ] Maintenance request tracking
- [ ] Guest messaging system
- [ ] Loyalty program integration
- [ ] Dynamic pricing based on demand
- [ ] Integration with OTA platforms
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML predictions

---

Built with ❤️ using Next.js and TypeScript
