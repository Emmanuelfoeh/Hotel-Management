# Hotel Management System - Design Document

## Overview

The Hotel Management System (HMS) is a full-stack web application built with Next.js 14+ (App Router), TailwindCSS 4, and shadcn/ui. The system is divided into two main sections: a public-facing portal for guests to browse and book rooms, and an admin dashboard for hotel staff to manage operations. The application uses a modern tech stack with server-side rendering, API routes, and a PostgreSQL database with Prisma ORM.

### Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: TailwindCSS 4, shadcn/ui components
- **Animation**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Payment**: Paystack integration
- **Email**: Resend or Nodemailer
- **Charts**: Recharts
- **PDF Generation**: react-pdf or jsPDF
- **File Upload**: uploadthing or cloudinary
- **State Management**: React Context + Server Components
- **Form Handling**: React Hook Form + Zod validation

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Public Portal]
        B[Admin Dashboard]
    end

    subgraph "Next.js App Router"
        C[Public Routes /]
        D[Admin Routes /admin]
        E[API Routes /api]
        F[Server Actions]
    end

    subgraph "Business Logic"
        G[Services Layer]
        H[Validation Layer]
    end

    subgraph "Data Layer"
        I[Prisma Client]
        J[PostgreSQL Database]
    end

    subgraph "External Services"
        K[Paystack API]
        L[Email Service]
        M[File Storage]
    end

    A --> C
    B --> D
    C --> F
    D --> F
    D --> E
    F --> G
    E --> G
    G --> H
    H --> I
    I --> J
    G --> K
    G --> L
    G --> M
```

### Directory Structure

```
hotel-management-system/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                 # Home page
│   │   │   ├── rooms/
│   │   │   │   ├── page.tsx             # Rooms listing
│   │   │   │   └── [id]/page.tsx        # Room details
│   │   │   ├── gallery/page.tsx         # Hotel gallery
│   │   │   ├── booking/
│   │   │   │   ├── page.tsx             # Booking form
│   │   │   │   └── confirmation/page.tsx
│   │   │   └── layout.tsx               # Public layout
│   │   ├── admin/
│   │   │   ├── layout.tsx               # Admin layout
│   │   │   ├── dashboard/page.tsx       # Dashboard
│   │   │   ├── rooms/
│   │   │   │   ├── page.tsx             # Rooms management
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx             # Bookings list
│   │   │   │   ├── calendar/page.tsx    # Calendar view
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── staff/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── logs/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── error/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── webhooks/paystack/route.ts
│   │   │   └── reports/export/route.ts
│   │   ├── layout.tsx                   # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   ├── public/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── room-card.tsx
│   │   │   ├── booking-form.tsx
│   │   │   └── gallery-grid.tsx
│   │   ├── admin/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── stats-card.tsx
│   │   │   ├── charts/
│   │   │   │   ├── occupancy-chart.tsx
│   │   │   │   ├── revenue-chart.tsx
│   │   │   │   └── bookings-chart.tsx
│   │   │   ├── tables/
│   │   │   │   ├── rooms-table.tsx
│   │   │   │   ├── bookings-table.tsx
│   │   │   │   ├── customers-table.tsx
│   │   │   │   └── staff-table.tsx
│   │   │   ├── forms/
│   │   │   │   ├── room-form.tsx
│   │   │   │   ├── booking-form.tsx
│   │   │   │   ├── customer-form.tsx
│   │   │   │   └── staff-form.tsx
│   │   │   ├── calendar-view.tsx
│   │   │   └── activity-log.tsx
│   │   ├── shared/
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── error-boundary.tsx
│   │   └── providers/
│   │       ├── theme-provider.tsx
│   │       └── session-provider.tsx
│   ├── lib/
│   │   ├── db.ts                        # Prisma client
│   │   ├── auth.ts                      # NextAuth config
│   │   ├── validations/
│   │   │   ├── room.ts
│   │   │   ├── booking.ts
│   │   │   ├── customer.ts
│   │   │   └── staff.ts
│   │   ├── services/
│   │   │   ├── room.service.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── customer.service.ts
│   │   │   ├── staff.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── report.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   ├── currency.ts
│   │   │   ├── pdf.ts
│   │   │   └── csv.ts
│   │   └── constants.ts
│   ├── actions/
│   │   ├── room.actions.ts
│   │   ├── booking.actions.ts
│   │   ├── customer.actions.ts
│   │   ├── staff.actions.ts
│   │   └── auth.actions.ts
│   └── types/
│       ├── index.ts
│       ├── room.ts
│       ├── booking.ts
│       ├── customer.ts
│       └── staff.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── images/
│   └── icons/
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Components and Interfaces

### Data Models (Prisma Schema)

```prisma
// Core Models

model Room {
  id          String   @id @default(cuid())
  name        String
  type        RoomType
  description String?  @db.Text
  price       Decimal  @db.Decimal(10, 2)
  capacity    Int
  amenities   String[] // Array of amenity strings
  images      String[] // Array of image URLs
  status      RoomStatus @default(AVAILABLE)
  floor       Int?
  roomNumber  String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  bookings    Booking[]

  @@index([status])
  @@index([type])
}

model Booking {
  id              String        @id @default(cuid())
  bookingNumber   String        @unique
  roomId          String
  customerId      String
  checkInDate     DateTime
  checkOutDate    DateTime
  numberOfGuests  Int
  totalAmount     Decimal       @db.Decimal(10, 2)
  paymentStatus   PaymentStatus @default(PENDING)
  bookingStatus   BookingStatus @default(CONFIRMED)
  specialRequests String?       @db.Text
  source          BookingSource @default(ONLINE)
  createdById     String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  room            Room          @relation(fields: [roomId], references: [id])
  customer        Customer      @relation(fields: [customerId], references: [id])
  createdBy       Staff?        @relation(fields: [createdById], references: [id])
  payments        Payment[]
  activityLogs    ActivityLog[]

  @@index([checkInDate, checkOutDate])
  @@index([bookingStatus])
  @@index([customerId])
}

model Customer {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String   @unique
  phone       String
  address     String?
  city        String?
  country     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  bookings    Booking[]

  @@index([email])
}

model Staff {
  id          String     @id @default(cuid())
  firstName   String
  lastName    String
  email       String     @unique
  phone       String
  role        StaffRole
  password    String     // Hashed
  isActive    Boolean    @default(true)
  hireDate    DateTime?
  notes       String?    @db.Text
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  bookings    Booking[]
  activityLogs ActivityLog[]

  @@index([email])
  @@index([role])
}

model Payment {
  id              String        @id @default(cuid())
  bookingId       String
  amount          Decimal       @db.Decimal(10, 2)
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus
  transactionId   String?       @unique
  paystackRef     String?
  paidAt          DateTime?
  createdAt       DateTime      @default(now())

  booking         Booking       @relation(fields: [bookingId], references: [id])

  @@index([bookingId])
}

model ActivityLog {
  id          String       @id @default(cuid())
  entityType  EntityType
  entityId    String
  action      ActionType
  userId      String
  details     Json?
  ipAddress   String?
  createdAt   DateTime     @default(now())

  user        Staff        @relation(fields: [userId], references: [id])
  booking     Booking?     @relation(fields: [entityId], references: [id])

  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
}

// Enums

enum RoomType {
  SINGLE
  DOUBLE
  SUITE
  DELUXE
  PRESIDENTIAL
}

enum RoomStatus {
  AVAILABLE
  OCCUPIED
  MAINTENANCE
}

enum BookingStatus {
  CONFIRMED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

enum BookingSource {
  ONLINE
  MANUAL
  PHONE
  WALKIN
}

enum StaffRole {
  MANAGER
  RECEPTIONIST
  CLEANER
}

enum PaymentMethod {
  CASH
  CARD
  PAYSTACK
  BANK_TRANSFER
}

enum EntityType {
  ROOM
  BOOKING
  CUSTOMER
  STAFF
}

enum ActionType {
  CREATE
  UPDATE
  DELETE
  CHECK_IN
  CHECK_OUT
}
```

### TypeScript Interfaces

```typescript
// Core Types

export interface DashboardStats {
  occupancyRate: number;
  totalBookings: number;
  totalRevenue: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomNumber: string;
  customerName: string;
  status: BookingStatus;
}

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  reportType: 'daily' | 'monthly' | 'custom';
  includeExpenses?: boolean;
}

export interface ReportData {
  period: string;
  occupancyRate: number;
  totalRevenue: number;
  totalBookings: number;
  averageRoomRate: number;
  expenses?: number;
  netProfit?: number;
}

export interface SearchFilters {
  query?: string;
  roomType?: RoomType;
  priceRange?: { min: number; max: number };
  capacity?: number;
  checkIn?: Date;
  checkOut?: Date;
}

export interface BookingFormData {
  roomId: string;
  customerId?: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface PaymentIntent {
  bookingId: string;
  amount: number;
  email: string;
  reference: string;
}
```

### Key Components

#### Public Portal Components (Based on Reference Design)

1. **Hero Section**:
   - Full-width background image with overlay
   - Large heading: "Your Dream Stay Awaits - Book the Perfect Hotel Today"
   - Integrated search bar with check-in/check-out dates, guests, and search button
   - Prominent call-to-action button

2. **Search Bar Component**:
   - Inline form with 4 fields: Check-in date, Check-out date, Guests count, Search button
   - Floating/sticky variant that appears on scroll
   - Teal/turquoise accent color for search button
   - Date picker integration

3. **Amenities/Features Section**:
   - Icon grid showing hotel features (WiFi, Parking, Pool, Gym, Restaurant, etc.)
   - "Luxury & Comfort Choices" heading
   - Clean icon-based layout with labels

4. **Premium Stays Section**:
   - Horizontal scrollable card carousel
   - Large image cards with overlay text
   - Property name and location
   - "View All" button with teal accent
   - Cards show featured/premium properties

5. **Property Grid Section**:
   - "Check Out Premium Stays" and "Explore All Our Hotels" sections
   - Grid layout (4 columns on desktop, responsive on mobile)
   - Property cards with:
     - Large property image
     - Property name and location
     - Price per night
     - Rating stars
     - "View Details" or quick info
   - Filter tabs/buttons at top (All, Hotels, Resorts, Villas, etc.)

6. **Statistics Section**:
   - Teal background banner
   - 4 key metrics displayed: "100+ Happy Customers", "15+ Years Experience", "800+ Properties", "12+ Awards Won"
   - Large numbers with descriptive text below

7. **Testimonials Section**:
   - "Customer Say About Our Services" heading
   - Card-based testimonial with customer photo
   - Customer name and title
   - Quote/review text
   - Navigation arrows for carousel

8. **Newsletter Section**:
   - "The Best Location for a Relaxing Vacation" heading
   - Email subscription form
   - Teal call-to-action button

9. **Footer**:
   - Dark background (charcoal/black)
   - Multi-column layout with:
     - About section with logo and description
     - Quick links (Home, About, Services, Contact)
     - Resources links
     - Contact information
   - Social media icons
   - Copyright text

10. **Navbar**:
    - Transparent/white background
    - Logo on left
    - Navigation links (Home, About, Services, Contact)
    - Login/Sign Up buttons on right
    - Hamburger menu for mobile

11. **RoomCard**: Property card with image, name, location, price, rating
12. **BookingForm**: Multi-step form for room booking with date selection, guest info, and payment
13. **RoomFilter**: Filter tabs/buttons for property types

#### Admin Dashboard Components

1. **StatsCard**: Displays key metrics with icon, value, and trend indicator
2. **OccupancyChart**: Line/area chart showing occupancy trends
3. **RevenueChart**: Bar chart showing revenue by period
4. **BookingsChart**: Mixed chart showing booking trends
5. **RoomsTable**: Data table with sorting, filtering, and actions
6. **BookingsTable**: Data table with status badges and quick actions
7. **CalendarView**: Full calendar view of bookings with drag-and-drop
8. **RoomForm**: Form for creating/editing rooms with image upload
9. **BookingForm**: Admin booking form with customer search
10. **ActivityLog**: Timeline view of system activities
11. **Sidebar**: Collapsible navigation sidebar with role-based menu items
12. **Header**: Admin header with user menu and notifications

## Data Flow

### Booking Flow (Public Portal)

```mermaid
sequenceDiagram
    participant User
    participant RoomPage
    participant BookingForm
    participant ServerAction
    participant PaymentService
    participant Paystack
    participant EmailService
    participant Database

    User->>RoomPage: Select room and dates
    RoomPage->>BookingForm: Navigate with params
    User->>BookingForm: Fill customer info
    BookingForm->>ServerAction: Submit booking
    ServerAction->>Database: Create booking (PENDING)
    ServerAction->>PaymentService: Initialize payment
    PaymentService->>Paystack: Create payment intent
    Paystack-->>PaymentService: Return payment URL
    PaymentService-->>User: Redirect to Paystack
    User->>Paystack: Complete payment
    Paystack->>ServerAction: Webhook callback
    ServerAction->>Database: Update booking (PAID)
    ServerAction->>EmailService: Send confirmation
    EmailService-->>User: Email confirmation
    ServerAction-->>User: Redirect to confirmation page
```

### Check-in Flow (Admin Dashboard)

```mermaid
sequenceDiagram
    participant Staff
    participant BookingPage
    participant ServerAction
    participant Database
    participant EmailService

    Staff->>BookingPage: Click check-in
    BookingPage->>ServerAction: Process check-in
    ServerAction->>Database: Update booking status (CHECKED_IN)
    ServerAction->>Database: Update room status (OCCUPIED)
    ServerAction->>Database: Create activity log
    ServerAction->>EmailService: Send welcome email
    EmailService-->>Database: Log email sent
    ServerAction-->>BookingPage: Return success
    BookingPage-->>Staff: Show confirmation
```

## Error Handling

### Error Handling Strategy

1. **Client-Side Validation**: Use Zod schemas with React Hook Form for immediate feedback
2. **Server-Side Validation**: Validate all inputs in server actions before database operations
3. **Database Errors**: Catch Prisma errors and return user-friendly messages
4. **API Errors**: Use try-catch blocks with proper error logging
5. **Payment Errors**: Handle Paystack failures with retry logic and user notifications
6. **Email Errors**: Queue failed emails for retry, don't block main operations

### Error Types and Handling

```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

export const errorHandler = {
  validation: (error: ZodError) => ({
    success: false,
    error: 'Validation failed',
    details: error.errors,
  }),

  database: (error: PrismaClientKnownRequestError) => {
    if (error.code === 'P2002') {
      return { success: false, error: 'Record already exists' };
    }
    if (error.code === 'P2025') {
      return { success: false, error: 'Record not found' };
    }
    return { success: false, error: 'Database error occurred' };
  },

  payment: (error: any) => ({
    success: false,
    error: 'Payment processing failed',
    details: error.message,
  }),

  unauthorized: () => ({
    success: false,
    error: 'Unauthorized access',
    statusCode: 401,
  }),

  forbidden: () => ({
    success: false,
    error: 'Insufficient permissions',
    statusCode: 403,
  }),
};
```

### Error Boundaries

- Root error boundary for catastrophic failures
- Route-specific error boundaries for graceful degradation
- Component-level error boundaries for isolated failures
- Toast notifications for user-facing errors
- Sentry or similar for error tracking in production

## Testing Strategy

### Testing Approach

Given the requirement to exclude test files from implementation, the testing strategy focuses on manual testing procedures and quality assurance checkpoints:

1. **Manual Testing Checklist**: Document test scenarios for each feature
2. **Browser Testing**: Test on Chrome, Firefox, Safari, and Edge
3. **Responsive Testing**: Test on mobile (320px), tablet (768px), and desktop (1920px)
4. **Dark Mode Testing**: Verify all components in both themes
5. **Performance Testing**: Check page load times and Core Web Vitals
6. **Accessibility Testing**: Use browser dev tools and screen readers
7. **Payment Testing**: Use Paystack test mode with test cards
8. **Email Testing**: Use email testing service (Mailtrap, etc.)

### Quality Assurance Checkpoints

- All forms validate correctly with proper error messages
- All CRUD operations work as expected
- Authentication and authorization work correctly
- Role-based access control is enforced
- Payment flow completes successfully
- Emails are sent for all required events
- Activity logs capture all operations
- Reports generate and export correctly
- Charts display accurate data
- Calendar view shows bookings correctly
- Image uploads work and display properly
- Dark mode toggle persists across sessions
- Mobile navigation works smoothly
- All links and buttons are functional

## Performance Considerations

### Optimization Strategies

1. **Server Components**: Use React Server Components by default for better performance
2. **Image Optimization**: Use Next.js Image component with proper sizing and lazy loading
3. **Database Queries**: Use Prisma's select and include strategically to avoid over-fetching
4. **Caching**: Implement Next.js caching for static pages and revalidation for dynamic data
5. **Code Splitting**: Leverage Next.js automatic code splitting
6. **Bundle Size**: Use dynamic imports for heavy components (charts, calendar)
7. **Database Indexing**: Add indexes on frequently queried fields
8. **API Rate Limiting**: Implement rate limiting for API routes
9. **CDN**: Serve static assets from CDN
10. **Compression**: Enable gzip/brotli compression

### Database Optimization

- Index on foreign keys and frequently filtered fields
- Use database-level constraints for data integrity
- Implement pagination for large datasets
- Use database transactions for multi-step operations
- Consider read replicas for reporting queries
- Archive old bookings to separate table

## Security Considerations

### Security Measures

1. **Authentication**: Use NextAuth.js with secure session management
2. **Authorization**: Implement role-based access control (RBAC)
3. **Password Hashing**: Use bcrypt with appropriate salt rounds
4. **CSRF Protection**: NextAuth.js provides built-in CSRF protection
5. **SQL Injection**: Prisma provides parameterized queries by default
6. **XSS Protection**: React escapes output by default, validate user inputs
7. **Environment Variables**: Store secrets in .env.local, never commit
8. **API Security**: Validate all inputs, implement rate limiting
9. **Payment Security**: Never store card details, use Paystack tokenization
10. **HTTPS**: Enforce HTTPS in production
11. **Content Security Policy**: Implement CSP headers
12. **Audit Logging**: Log all sensitive operations

### Role-Based Access Control

```typescript
export const permissions = {
  MANAGER: {
    rooms: ['create', 'read', 'update', 'delete'],
    bookings: ['create', 'read', 'update', 'delete', 'checkin', 'checkout'],
    customers: ['create', 'read', 'update', 'delete'],
    staff: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    logs: ['read'],
  },
  RECEPTIONIST: {
    rooms: ['read'],
    bookings: ['create', 'read', 'update', 'checkin', 'checkout'],
    customers: ['create', 'read', 'update'],
    staff: [],
    reports: ['read'],
    logs: [],
  },
  CLEANER: {
    rooms: ['read'],
    bookings: ['read'],
    customers: [],
    staff: [],
    reports: [],
    logs: [],
  },
};
```

## Deployment and Environment Setup

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Paystack
PAYSTACK_SECRET_KEY="sk_test_xxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxx"

# Email
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@hotel.com"

# File Upload
UPLOADTHING_SECRET="sk_xxx"
UPLOADTHING_APP_ID="xxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Deployment Checklist

1. Set up PostgreSQL database (Vercel Postgres, Supabase, or Railway)
2. Configure environment variables in hosting platform
3. Run database migrations
4. Seed initial data (admin user, sample rooms)
5. Configure Paystack webhook URL
6. Set up email service (Resend)
7. Configure file upload service
8. Enable HTTPS
9. Set up monitoring and error tracking
10. Configure backup strategy

### Recommended Hosting

- **Frontend & API**: Vercel (optimal for Next.js)
- **Database**: Vercel Postgres or Supabase
- **File Storage**: Uploadthing or Cloudinary
- **Email**: Resend
- **Monitoring**: Vercel Analytics + Sentry

## Design System

### Color Palette (Based on Reference Design)

```typescript
// Tailwind config colors
export const colors = {
  primary: {
    50: '#f0fdfa', // Light teal
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main teal/turquoise
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  dark: {
    bg: '#1a1a1a', // Footer background
    card: '#2a2a2a',
    text: '#e5e5e5',
  },
};
```

### Typography

- **Headings**: Font family: Inter or Geist Sans
- **Body**: Font family: Inter or Geist Sans
- **Scale**: text-xs to text-4xl following Tailwind defaults

### Spacing

- Use Tailwind spacing scale (4px base unit)
- Consistent padding: p-4, p-6, p-8 for cards and containers
- Consistent gaps: gap-4, gap-6 for grids and flex layouts

### Component Patterns

- Cards: rounded-lg border bg-card shadow-sm
- Buttons: Primary (bg-primary), Secondary (border), Destructive (bg-destructive)
- Forms: Consistent label, input, error message styling
- Tables: Striped rows, hover states, sticky headers
- Modals: Centered overlay with backdrop blur
- Toasts: Bottom-right position with auto-dismiss

### Animation Guidelines

- Page transitions: 200-300ms ease-in-out
- Hover effects: 150ms ease
- Modal/drawer: 300ms spring animation
- Loading states: Skeleton loaders or spinners
- Chart animations: 500ms ease-out on mount
- Use Framer Motion variants for consistent animations

## Accessibility

### WCAG 2.1 AA Compliance

- Semantic HTML elements
- Proper heading hierarchy
- Alt text for all images
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible indicators
- Color contrast ratios (4.5:1 for text)
- Form labels and error messages
- Skip to main content link
- Screen reader friendly tables

### Keyboard Navigation

- Tab order follows visual flow
- Enter/Space for button activation
- Escape to close modals/dropdowns
- Arrow keys for calendar navigation
- Focus trap in modals

## Future Enhancements

Potential features for future iterations:

1. Multi-property support for hotel chains
2. Housekeeping management module
3. Maintenance request tracking
4. Inventory management for amenities
5. Guest messaging system
6. Loyalty program integration
7. Dynamic pricing based on demand
8. Integration with OTA platforms (Booking.com, Airbnb)
9. Mobile app (React Native)
10. Advanced analytics with ML predictions
