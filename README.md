# Hotel Management System

A modern, full-stack hotel management system built with Next.js 16, TypeScript, and TailwindCSS 4. This application provides a comprehensive solution for managing hotel operations with a public-facing booking portal and a powerful admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Routes & Server Actions](#-api-routes--server-actions)
- [Deployment](#-deployment)
- [Documentation](#-documentation)

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

### 4. Set Up the Database

See the [Database Setup](#-database-setup) section for detailed instructions.

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

## 🗄 Database Setup

### Local Development (PostgreSQL)

#### Option 1: Install PostgreSQL Locally

1. **Install PostgreSQL**:
   - macOS: `brew install postgresql@14`
   - Ubuntu: `sudo apt-get install postgresql-14`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

### Cloud Database (Production)

#### Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to Storage > Create Database > Postgres
3. Copy the connection string to your environment variables

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
