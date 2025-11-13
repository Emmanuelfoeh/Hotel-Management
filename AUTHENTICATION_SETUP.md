# 🔐 Authentication Setup Guide

## Overview

Your hotel management system now has a complete authentication flow with TanStack Query integration.

---

## 🎯 What's Been Set Up

### ✅ **Stage 1: TanStack Query Installation**

- Installed `@tanstack/react-query` and `@tanstack/react-query-devtools`
- Created `QueryProvider` component
- Integrated into app layout

### ✅ **Stage 2: API Client**

- Created `lib/api-client.ts` with type-safe HTTP methods
- Error handling with custom `ApiError` class
- Methods: GET, POST, PUT, PATCH, DELETE

### ✅ **Stage 3: Customer Hooks**

- Created `hooks/use-customer.ts` with TanStack Query
- `useCreateCustomer()` - Create new customer accounts
- `useCustomer(id)` - Fetch customer by ID
- `useCustomerByEmail(email)` - Fetch customer by email

### ✅ **Stage 4: Auth Hooks**

- Created `hooks/use-auth.ts` for staff authentication
- Wraps NextAuth with TanStack Query mutations
- Provides: `login`, `logout`, `session`, `user`, loading states

### ✅ **Stage 5: Updated Pages**

- **Signup Page**: Uses `useCreateCustomer()` hook
- **Login Page**: Uses `useAuth()` hook
- Both have proper loading states and error handling

---

## 📊 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   CUSTOMER   │         │    STAFF     │         │   SYSTEM     │
│   (Guest)    │         │  (Admin)     │         │              │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. Sign Up             │                        │
       ├────────────────────────┼───────────────────────>│
       │    (No Password)       │                        │
       │                        │                        │
       │ 2. Create Customer     │                        │
       │    Record in DB        │                        │
       │<───────────────────────┼────────────────────────┤
       │                        │                        │
       │ 3. Redirect to         │                        │
       │    /rooms              │                        │
       │                        │                        │
       │                        │ 4. Sign In             │
       │                        ├───────────────────────>│
       │                        │    (Email + Password)  │
       │                        │                        │
       │                        │ 5. Verify Credentials  │
       │                        │    via NextAuth        │
       │                        │<───────────────────────┤
       │                        │                        │
       │                        │ 6. Create JWT Session  │
       │                        │<───────────────────────┤
       │                        │                        │
       │                        │ 7. Redirect to         │
       │                        │    /admin/dashboard    │
       │                        │                        │
```

---

## 🔄 How It Works

### **Customer Signup (No Authentication)**

1. **User fills signup form** → `app/auth/signup/page.tsx`
2. **Form submits** → `useCreateCustomer()` hook
3. **API call** → `POST /api/customers`
4. **Server action** → `actions/customer.actions.ts`
5. **Database** → Creates Customer record (no password)
6. **Success** → Redirects to `/rooms` to browse and book

**Key Point**: Customers don't log in. They just provide info when booking.

---

### **Staff Login (With Authentication)**

1. **Staff enters credentials** → `app/auth/login/page.tsx`
2. **Form submits** → `useAuth()` hook → `login()` mutation
3. **NextAuth** → `lib/auth.ts` → Credentials provider
4. **Database** → Verifies Staff email + hashed password
5. **JWT created** → Session with role, name, etc.
6. **Success** → Redirects to `/admin/dashboard`

**Key Point**: Only Staff authenticate. Middleware protects `/admin/*` routes.

---

## 🛠️ Usage Examples

### **1. Customer Signup**

```tsx
import { useCreateCustomer } from '@/hooks/use-customer';

function SignupForm() {
  const createCustomer = useCreateCustomer();

  const handleSubmit = (data) => {
    createCustomer.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success('Account created!');
          router.push('/rooms');
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button disabled={createCustomer.isPending}>
        {createCustomer.isPending ? 'Creating...' : 'Sign Up'}
      </Button>
    </form>
  );
}
```

### **2. Staff Login**

```tsx
import { useAuth } from '@/hooks/use-auth';

function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = (data) => {
    login(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success('Signed in!');
          router.push('/admin/dashboard');
        } else {
          toast.error(response.error);
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button disabled={isLoggingIn}>
        {isLoggingIn ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

### **3. Logout Button**

```tsx
import { useAuth } from '@/hooks/use-auth';

function LogoutButton() {
  const { logout, isLoggingOut } = useAuth();

  return (
    <Button onClick={() => logout()} disabled={isLoggingOut}>
      {isLoggingOut ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}
```

### **4. Check Authentication Status**

```tsx
import { useAuth } from '@/hooks/use-auth';

function ProfileMenu() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) {
    return <Link href="/auth/login">Sign In</Link>;
  }

  return (
    <div>
      Welcome, {user.firstName} {user.lastName}
      <span>Role: {user.role}</span>
    </div>
  );
}
```

### **5. Fetch Customer Data**

```tsx
import { useCustomer } from '@/hooks/use-customer';

function CustomerProfile({ customerId }) {
  const { data: customer, isLoading, error } = useCustomer(customerId);

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <h2>
        {customer.firstName} {customer.lastName}
      </h2>
      <p>{customer.email}</p>
      <p>{customer.phone}</p>
    </div>
  );
}
```

---

## 🔒 Security Features

### **1. Password Hashing**

- Staff passwords hashed with `bcryptjs` (10 rounds)
- Never stored in plain text

### **2. JWT Sessions**

- Secure, stateless authentication
- 30-day expiration
- Contains: user ID, role, name

### **3. Middleware Protection**

- `/admin/*` routes require authentication
- Role-based access control (MANAGER, RECEPTIONIST, CLEANER)
- Automatic redirects for unauthorized access

### **4. Permission System**

- Granular permissions per role
- Server-side: `requirePermission()`, `requireRole()`
- Client-side: `usePermissions()`, `<Can>` component

---

## 📝 Next Steps

### **1. Create Staff Seed Data**

You need at least one staff member to test login:

```typescript
// scripts/seed-staff.ts
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function seedStaff() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.staff.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@hotel.com',
      phone: '+1234567890',
      role: 'MANAGER',
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log('✅ Staff seeded');
}

seedStaff();
```

Run: `npx tsx scripts/seed-staff.ts`

### **2. Test the Flow**

1. **Customer Signup**:
   - Go to `/auth/signup`
   - Fill form (no password needed)
   - Should redirect to `/rooms`

2. **Staff Login**:
   - Go to `/auth/login`
   - Use: `admin@hotel.com` / `Admin123!`
   - Should redirect to `/admin/dashboard`

3. **Protected Routes**:
   - Try accessing `/admin/dashboard` without login
   - Should redirect to `/auth/login`

### **3. Add More API Hooks**

Create hooks for other entities:

```typescript
// hooks/use-rooms.ts
export function useRooms() { ... }
export function useCreateRoom() { ... }

// hooks/use-bookings.ts
export function useBookings() { ... }
export function useCreateBooking() { ... }
```

---

## 🐛 Troubleshooting

### **Issue: "Invalid email or password"**

- Check if staff exists in database
- Verify password is hashed correctly
- Check `isActive` is `true`

### **Issue: "Session not found"**

- Verify `NEXTAUTH_SECRET` in `.env`
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### **Issue: TanStack Query not working**

- Ensure `QueryProvider` wraps your app
- Check browser console for errors
- Verify API routes return correct JSON format

---

## 📚 File Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   └── customers/route.ts           # Customer API
│   ├── auth/
│   │   ├── login/page.tsx               # Staff login
│   │   ├── signup/page.tsx              # Customer signup
│   │   └── error/page.tsx               # Auth errors
│   └── layout.tsx                       # Root layout with providers
├── lib/
│   ├── auth.ts                          # NextAuth config
│   ├── api-client.ts                    # HTTP client
│   └── db.ts                            # Prisma client
├── hooks/
│   ├── use-auth.ts                      # Auth hook
│   ├── use-customer.ts                  # Customer hooks
│   └── use-permissions.ts               # Permission hooks
├── actions/
│   ├── auth.actions.ts                  # Auth server actions
│   └── customer.actions.ts              # Customer server actions
├── components/
│   └── providers/
│       ├── session-provider.tsx         # NextAuth provider
│       └── query-provider.tsx           # TanStack Query provider
└── middleware.ts                        # Route protection
```

---

## ✅ Summary

You now have:

- ✅ Customer signup (no authentication)
- ✅ Staff login (with NextAuth)
- ✅ TanStack Query for all API calls
- ✅ Type-safe hooks for auth and customers
- ✅ Proper loading and error states
- ✅ Role-based access control
- ✅ Protected admin routes

**Ready to use!** Just seed a staff member and test the flows.
