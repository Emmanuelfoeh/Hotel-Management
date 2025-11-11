# Final Integration Test Checklist

## Overview

This document provides a comprehensive checklist for testing the Hotel Management System. Each section corresponds to a sub-task from Task 25 and includes detailed test scenarios, expected results, and verification steps.

**Test Environment Setup:**

- Node.js version: >=20.9.0 (Current: 18.20.2 - **UPGRADE REQUIRED**)
- Database: PostgreSQL with Prisma
- Payment: Paystack (Test Mode)
- Email: Resend
- File Upload: Uploadthing

---

## 1. Complete Booking Flow (Public Portal to Admin)

### Test Scenario 1.1: Guest Booking Flow

**Steps:**

1. Navigate to public homepage (`/`)
2. Browse available rooms (`/rooms`)
3. Select a room and view details (`/rooms/[id]`)
4. Click "Book Now" and select dates
5. Fill in customer information
6. Proceed to payment (Paystack test mode)
7. Complete payment with test card
8. Verify booking confirmation page
9. Check email for confirmation

**Expected Results:**

- ✅ Room availability is checked correctly
- ✅ Price calculation is accurate
- ✅ Customer information is validated
- ✅ Payment redirects to Paystack
- ✅ Webhook updates booking status to PAID
- ✅ Confirmation email is sent
- ✅ Booking appears in admin dashboard

**Test Cards (Paystack):**

- Success: `4084084084084081` (CVV: 408, Expiry: any future date)
- Insufficient Funds: `5060666666666666666`
- Declined: `5143010522339965`

### Test Scenario 1.2: Admin Manual Booking

**Steps:**

1. Login as receptionist/manager
2. Navigate to `/admin/bookings/new`
3. Search for existing customer or create new
4. Select room and dates
5. Enter guest count and special requests
6. Submit booking
7. Verify booking appears in list

**Expected Results:**

- ✅ Customer search/autocomplete works
- ✅ Room availability is validated
- ✅ Date validation prevents past dates
- ✅ Booking is created with MANUAL source
- ✅ Activity log records creation

### Test Scenario 1.3: Check-in Process

**Steps:**

1. Login as receptionist/manager
2. Navigate to booking details
3. Click "Check In" button
4. Confirm check-in
5. Verify room status changes to OCCUPIED
6. Check email for welcome message

**Expected Results:**

- ✅ Booking status changes to CHECKED_IN
- ✅ Room status changes to OCCUPIED
- ✅ Welcome email is sent
- ✅ Dashboard stats update
- ✅ Activity log records check-in

### Test Scenario 1.4: Check-out Process

**Steps:**

1. Login as receptionist/manager
2. Navigate to checked-in booking
3. Click "Check Out" button
4. Confirm check-out
5. Verify room status changes to AVAILABLE

**Expected Results:**

- ✅ Booking status changes to CHECKED_OUT
- ✅ Room status changes to AVAILABLE
- ✅ Dashboard stats update
- ✅ Activity log records check-out

---

## 2. CRUD Operations Verification

### Test Scenario 2.1: Room Management

**Create:**

1. Login as manager
2. Navigate to `/admin/rooms/new`
3. Fill in all required fields
4. Upload room images
5. Submit form

**Read:**

1. View rooms list (`/admin/rooms`)
2. Search and filter rooms
3. View room details (`/admin/rooms/[id]`)

**Update:**

1. Navigate to room edit page
2. Modify room details
3. Update images
4. Save changes

**Delete:**

1. Attempt to delete room with active bookings (should fail)
2. Delete room without bookings (should succeed)

**Expected Results:**

- ✅ All form validations work
- ✅ Images upload successfully
- ✅ Search and filters work correctly
- ✅ Cannot delete rooms with active bookings
- ✅ Activity logs record all operations

### Test Scenario 2.2: Customer Management

**Create:**

1. Create customer via booking form
2. Create customer directly in admin

**Read:**

1. View customers list
2. Search by name, email, phone
3. View customer details with booking history

**Update:**

1. Edit customer information
2. Verify validation rules

**Expected Results:**

- ✅ Email validation works
- ✅ Phone number validation works
- ✅ Booking history displays correctly
- ✅ Search functionality works

### Test Scenario 2.3: Staff Management (Manager Only)

**Create:**

1. Login as manager
2. Navigate to `/admin/staff/new`
3. Create staff with different roles
4. Verify password is hashed

**Read:**

1. View staff list
2. View staff details

**Update:**

1. Edit staff information
2. Change staff role
3. Deactivate staff

**Expected Results:**

- ✅ Only managers can access
- ✅ Password is hashed (bcrypt)
- ✅ Role changes work correctly
- ✅ Deactivated staff cannot login

### Test Scenario 2.4: Booking Management

**Create:** (Covered in section 1)

**Read:**

1. View bookings list with filters
2. View calendar view
3. View booking details

**Update:**

1. Modify booking dates
2. Change room
3. Update guest count

**Cancel:**

1. Cancel booking
2. Verify cancellation email
3. Check refund status

**Expected Results:**

- ✅ All filters work correctly
- ✅ Calendar displays bookings accurately
- ✅ Date changes validate availability
- ✅ Cancellation email is sent

---

## 3. Authentication and Authorization

### Test Scenario 3.1: Login Flow

**Steps:**

1. Navigate to `/auth/login`
2. Enter invalid credentials (should fail)
3. Enter valid credentials (should succeed)
4. Verify redirect to dashboard
5. Check session persistence

**Expected Results:**

- ✅ Invalid credentials show error
- ✅ Valid credentials redirect to dashboard
- ✅ Session persists across page refreshes
- ✅ Already logged-in users redirect from login page

### Test Scenario 3.2: Logout Flow

**Steps:**

1. Login as any user
2. Click logout
3. Verify redirect to public portal
4. Attempt to access admin routes (should redirect to login)

**Expected Results:**

- ✅ Session is cleared
- ✅ Redirects to public portal
- ✅ Cannot access admin routes after logout

### Test Scenario 3.3: Role-Based Access Control

**Manager Role:**

- ✅ Can access all admin routes
- ✅ Can manage staff
- ✅ Can view activity logs
- ✅ Can generate reports

**Receptionist Role:**

- ✅ Can manage bookings
- ✅ Can manage customers
- ✅ Can view rooms (read-only)
- ✅ Cannot access staff management
- ✅ Cannot view activity logs
- ✅ Can view reports (limited)

**Cleaner Role:**

- ✅ Can view rooms (read-only)
- ✅ Can view bookings (read-only)
- ✅ Cannot access any management features

**Test Steps:**

1. Create users with each role
2. Login as each user
3. Attempt to access restricted routes
4. Verify proper redirects to `/admin/unauthorized`

### Test Scenario 3.4: Middleware Protection

**Steps:**

1. Logout completely
2. Attempt to access `/admin/dashboard` (should redirect to login)
3. Attempt to access `/admin/staff` as receptionist (should redirect to unauthorized)
4. Verify public routes are accessible without login

**Expected Results:**

- ✅ Unauthenticated users redirected to login
- ✅ Unauthorized users redirected to unauthorized page
- ✅ Public routes accessible to all
- ✅ Callback URL preserved in login redirect

---

## 4. Payment Integration (Test Mode)

### Test Scenario 4.1: Payment Initialization

**Steps:**

1. Create a booking
2. Verify payment record is created with PENDING status
3. Verify Paystack authorization URL is generated
4. Verify redirect to Paystack

**Expected Results:**

- ✅ Payment record created in database
- ✅ Unique reference generated
- ✅ Metadata includes booking ID
- ✅ Callback URL is correct

### Test Scenario 4.2: Successful Payment

**Steps:**

1. Use test card: `4084084084084081`
2. Complete payment on Paystack
3. Verify webhook is received
4. Verify signature validation
5. Check payment status update
6. Check booking status update
7. Verify confirmation email

**Expected Results:**

- ✅ Webhook signature validates
- ✅ Payment status changes to PAID
- ✅ Booking payment status changes to PAID
- ✅ Transaction ID is stored
- ✅ Paid date is recorded
- ✅ Confirmation email is sent

### Test Scenario 4.3: Failed Payment

**Steps:**

1. Use declined test card: `5143010522339965`
2. Attempt payment
3. Verify webhook is received
4. Check payment status update

**Expected Results:**

- ✅ Payment status changes to FAILED
- ✅ Booking payment status changes to FAILED
- ✅ Failure reason is recorded

### Test Scenario 4.4: Webhook Security

**Steps:**

1. Send webhook with invalid signature (should reject)
2. Send webhook with valid signature (should accept)
3. Verify webhook idempotency

**Expected Results:**

- ✅ Invalid signatures are rejected (401)
- ✅ Valid signatures are accepted (200)
- ✅ Duplicate webhooks don't cause issues

---

## 5. Email Notifications

### Test Scenario 5.1: Booking Confirmation Email

**Trigger:** Successful payment completion

**Verify:**

- ✅ Email is sent to customer email
- ✅ Contains booking number
- ✅ Contains room details
- ✅ Contains check-in/check-out dates
- ✅ Contains total amount
- ✅ Contains special requests (if any)
- ✅ HTML template renders correctly
- ✅ Dark mode friendly design

### Test Scenario 5.2: Booking Cancellation Email

**Trigger:** Booking cancellation

**Verify:**

- ✅ Email is sent to customer email
- ✅ Contains booking number
- ✅ Contains cancellation date
- ✅ Contains refund information
- ✅ HTML template renders correctly

### Test Scenario 5.3: Check-in Welcome Email

**Trigger:** Check-in process

**Verify:**

- ✅ Email is sent to customer email
- ✅ Contains room number
- ✅ Contains WiFi information (if available)
- ✅ Contains hotel amenities
- ✅ Contains check-out date
- ✅ HTML template renders correctly

### Test Scenario 5.4: Email Service Error Handling

**Steps:**

1. Configure invalid Resend API key
2. Trigger email send
3. Verify error is logged
4. Verify operation doesn't fail

**Expected Results:**

- ✅ Email errors are caught
- ✅ Errors are logged to console
- ✅ Main operation continues
- ✅ User sees success message

---

## 6. Form Validations

### Test Scenario 6.1: Room Form Validation

**Test Cases:**

- ❌ Empty room name → "Room name is required"
- ❌ Room name > 100 chars → "Room name is too long"
- ❌ Negative price → "Price must be positive"
- ❌ Invalid price format → "Invalid price format"
- ❌ Capacity > 20 → "Capacity cannot exceed 20"
- ❌ Invalid room number format → "Room number can only contain letters, numbers, and hyphens"
- ❌ Duplicate room number → "Room number already exists"
- ✅ Valid data → Form submits successfully

### Test Scenario 6.2: Booking Form Validation

**Test Cases:**

- ❌ Check-out before check-in → "Check-out date must be after check-in date"
- ❌ Check-in in the past → "Check-in date cannot be in the past"
- ❌ Number of guests > 20 → "Number of guests cannot exceed 20"
- ❌ Number of guests < 1 → "Number of guests must be positive"
- ❌ Special requests > 2000 chars → "Special requests are too long"
- ✅ Valid data → Form submits successfully

### Test Scenario 6.3: Customer Form Validation

**Test Cases:**

- ❌ Empty first name → "First name is required"
- ❌ Invalid email format → "Invalid email address"
- ❌ Invalid phone format → "Invalid phone number format"
- ❌ First name with numbers → "First name can only contain letters..."
- ❌ Duplicate email → "Email already exists"
- ✅ Valid data → Form submits successfully

### Test Scenario 6.4: Staff Form Validation

**Test Cases:**

- ❌ Empty email → "Email is required"
- ❌ Weak password → "Password must be at least 8 characters"
- ❌ Invalid role → "Invalid role selected"
- ❌ Duplicate email → "Email already exists"
- ✅ Valid data → Form submits successfully

### Test Scenario 6.5: Client-Side vs Server-Side Validation

**Steps:**

1. Disable JavaScript in browser
2. Submit forms with invalid data
3. Verify server-side validation catches errors

**Expected Results:**

- ✅ Server-side validation works without JavaScript
- ✅ Error messages are displayed
- ✅ No data corruption occurs

---

## 7. Dark Mode

### Test Scenario 7.1: Theme Toggle

**Steps:**

1. Navigate to any page
2. Click theme toggle button
3. Verify theme changes
4. Refresh page
5. Verify theme persists

**Expected Results:**

- ✅ Theme toggle button is visible
- ✅ Theme changes immediately
- ✅ Theme persists across page refreshes
- ✅ Theme persists across sessions (localStorage)

### Test Scenario 7.2: Dark Mode Across All Pages

**Test Each Page:**

**Public Portal:**

- ✅ Homepage (`/`)
- ✅ Rooms listing (`/rooms`)
- ✅ Room details (`/rooms/[id]`)
- ✅ Gallery (`/gallery`)
- ✅ Booking form (`/booking`)
- ✅ Booking confirmation (`/booking/confirmation`)

**Admin Dashboard:**

- ✅ Dashboard (`/admin/dashboard`)
- ✅ Rooms management (`/admin/rooms`)
- ✅ Bookings management (`/admin/bookings`)
- ✅ Calendar view (`/admin/bookings/calendar`)
- ✅ Customers management (`/admin/customers`)
- ✅ Staff management (`/admin/staff`)
- ✅ Reports (`/admin/reports`)
- ✅ Activity logs (`/admin/logs`)

**Auth Pages:**

- ✅ Login (`/auth/login`)
- ✅ Error (`/auth/error`)

**Verify for Each Page:**

- ✅ Background colors are appropriate
- ✅ Text is readable (contrast ratio)
- ✅ Borders and dividers are visible
- ✅ Cards and containers have proper styling
- ✅ Charts and graphs are visible
- ✅ Images have proper contrast
- ✅ Buttons and inputs are styled correctly
- ✅ No white flashes on page load

### Test Scenario 7.3: System Theme Preference

**Steps:**

1. Set theme to "System"
2. Change OS theme preference
3. Verify app theme follows OS

**Expected Results:**

- ✅ App respects OS theme preference
- ✅ Theme changes when OS theme changes
- ✅ No hydration errors

---

## 8. Role-Based Access Control (Detailed)

### Test Scenario 8.1: Manager Permissions

**Login as Manager:**

**Full Access:**

- ✅ Dashboard (`/admin/dashboard`)
- ✅ Rooms (CRUD) (`/admin/rooms`)
- ✅ Bookings (CRUD + Check-in/out) (`/admin/bookings`)
- ✅ Customers (CRUD) (`/admin/customers`)
- ✅ Staff (CRUD) (`/admin/staff`)
- ✅ Reports (View + Export) (`/admin/reports`)
- ✅ Activity Logs (View) (`/admin/logs`)

**Verify:**

- ✅ All menu items are visible
- ✅ All action buttons are enabled
- ✅ Can perform all operations
- ✅ No unauthorized errors

### Test Scenario 8.2: Receptionist Permissions

**Login as Receptionist:**

**Allowed:**

- ✅ Dashboard (View)
- ✅ Rooms (Read-only)
- ✅ Bookings (CRUD + Check-in/out)
- ✅ Customers (CRUD)
- ✅ Reports (View only)

**Denied:**

- ❌ Staff management → Redirects to `/admin/unauthorized`
- ❌ Activity logs → Redirects to `/admin/unauthorized`
- ❌ Room creation/editing → Buttons hidden or disabled

**Verify:**

- ✅ Staff menu item is hidden
- ✅ Activity logs menu item is hidden
- ✅ Room edit/delete buttons are hidden
- ✅ Attempting direct URL access redirects

### Test Scenario 8.3: Cleaner Permissions

**Login as Cleaner:**

**Allowed:**

- ✅ Dashboard (View)
- ✅ Rooms (Read-only)
- ✅ Bookings (Read-only)

**Denied:**

- ❌ All CRUD operations
- ❌ Check-in/check-out
- ❌ Customer management
- ❌ Staff management
- ❌ Reports
- ❌ Activity logs

**Verify:**

- ✅ Only view permissions work
- ✅ All action buttons are hidden
- ✅ Forms are read-only or inaccessible
- ✅ Attempting operations shows error

---

## 9. Error States

### Test Scenario 9.1: Network Errors

**Steps:**

1. Disconnect network
2. Attempt to submit forms
3. Attempt to load data

**Expected Results:**

- ✅ User-friendly error message displayed
- ✅ Toast notification shows error
- ✅ Form remains filled (data not lost)
- ✅ Retry option available

### Test Scenario 9.2: Validation Errors

**Steps:**

1. Submit forms with invalid data
2. Verify error messages

**Expected Results:**

- ✅ Field-level error messages
- ✅ Error messages are clear and helpful
- ✅ Form highlights invalid fields
- ✅ Focus moves to first error

### Test Scenario 9.3: Database Errors

**Steps:**

1. Attempt to create duplicate records
2. Attempt to delete records with dependencies
3. Attempt to access non-existent records

**Expected Results:**

- ✅ Duplicate key errors show friendly message
- ✅ Foreign key constraint errors show friendly message
- ✅ Not found errors show 404 page
- ✅ Errors are logged server-side

### Test Scenario 9.4: Payment Errors

**Steps:**

1. Use declined test card
2. Simulate network timeout
3. Simulate webhook failure

**Expected Results:**

- ✅ Payment failure message displayed
- ✅ User can retry payment
- ✅ Booking remains in PENDING state
- ✅ No duplicate charges

### Test Scenario 9.5: File Upload Errors

**Steps:**

1. Upload file > size limit
2. Upload invalid file type
3. Simulate upload failure

**Expected Results:**

- ✅ Size limit error message
- ✅ File type error message
- ✅ Upload failure shows retry option
- ✅ Progress indicator shows error state

### Test Scenario 9.6: Authentication Errors

**Steps:**

1. Session expires during operation
2. Attempt to access protected route
3. Invalid credentials

**Expected Results:**

- ✅ Session expiry redirects to login
- ✅ Callback URL preserved
- ✅ Invalid credentials show error
- ✅ No sensitive data exposed

---

## 10. Responsive Design

### Test Scenario 10.1: Mobile (320px - 767px)

**Test Devices:**

- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Samsung Galaxy S20 (360px)

**Verify:**

- ✅ Hamburger menu works
- ✅ Navigation is accessible
- ✅ Forms are usable
- ✅ Tables scroll horizontally or convert to cards
- ✅ Images scale properly
- ✅ Text is readable (no overflow)
- ✅ Buttons are tappable (min 44px)
- ✅ Modals fit screen
- ✅ Date pickers are mobile-friendly
- ✅ Charts are responsive

**Test Pages:**

- ✅ Homepage
- ✅ Rooms listing
- ✅ Room details
- ✅ Booking form
- ✅ Admin dashboard
- ✅ Admin tables

### Test Scenario 10.2: Tablet (768px - 1023px)

**Test Devices:**

- iPad (768px)
- iPad Pro (1024px)

**Verify:**

- ✅ Layout adapts to tablet size
- ✅ Sidebar behavior is appropriate
- ✅ Grid layouts use 2-3 columns
- ✅ Forms are well-spaced
- ✅ Touch targets are adequate

### Test Scenario 10.3: Desktop (1024px+)

**Test Resolutions:**

- 1280x720 (HD)
- 1920x1080 (Full HD)
- 2560x1440 (2K)

**Verify:**

- ✅ Full layout is displayed
- ✅ Sidebar is expanded
- ✅ Grid layouts use 3-4 columns
- ✅ No excessive whitespace
- ✅ Content is centered/contained
- ✅ Charts use full width

### Test Scenario 10.4: Touch Interactions

**Test on Touch Devices:**

- ✅ Buttons respond to touch
- ✅ Swipe gestures work (carousels)
- ✅ Dropdowns open on touch
- ✅ Date pickers are touch-friendly
- ✅ No hover-only interactions
- ✅ Long press doesn't cause issues

### Test Scenario 10.5: Orientation Changes

**Steps:**

1. Rotate device from portrait to landscape
2. Verify layout adapts
3. Verify no data loss

**Expected Results:**

- ✅ Layout adapts smoothly
- ✅ No content overflow
- ✅ Forms remain filled
- ✅ Modals reposition

---

## Additional Verification

### Performance Checks

- ✅ Page load time < 3 seconds
- ✅ Time to Interactive < 5 seconds
- ✅ First Contentful Paint < 1.5 seconds
- ✅ Largest Contentful Paint < 2.5 seconds
- ✅ Cumulative Layout Shift < 0.1
- ✅ No memory leaks
- ✅ Images are optimized
- ✅ Code splitting is effective

### Accessibility Checks

- ✅ Keyboard navigation works
- ✅ Screen reader compatible
- ✅ ARIA labels present
- ✅ Color contrast meets WCAG AA
- ✅ Focus indicators visible
- ✅ Alt text on images
- ✅ Form labels associated
- ✅ Error messages announced

### Security Checks

- ✅ Passwords are hashed
- ✅ SQL injection prevented (Prisma)
- ✅ XSS prevented (React escaping)
- ✅ CSRF protection enabled
- ✅ Environment variables not exposed
- ✅ API routes are protected
- ✅ Webhook signatures validated
- ✅ Rate limiting implemented (if applicable)

### Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## Known Issues and Limitations

### Node.js Version

- **Issue:** Current Node.js version is 18.20.2
- **Required:** >=20.9.0 for Next.js 16
- **Impact:** Build may fail or have warnings
- **Resolution:** Upgrade Node.js to version 20 or higher

### Test Mode Limitations

- Paystack test mode has rate limits
- Email service may have sending limits
- File upload may have storage limits

---

## Test Execution Summary

### Critical Tests (Must Pass)

1. ✅ Booking flow end-to-end
2. ✅ Payment integration
3. ✅ Authentication and authorization
4. ✅ Form validations
5. ✅ Email notifications

### Important Tests (Should Pass)

1. ✅ CRUD operations
2. ✅ Dark mode
3. ✅ Responsive design
4. ✅ Error handling
5. ✅ Role-based access control

### Nice-to-Have Tests (Can Be Deferred)

1. ✅ Performance optimization
2. ✅ Accessibility compliance
3. ✅ Browser compatibility
4. ✅ Touch interactions

---

## Sign-Off

**Tested By:** ********\_********
**Date:** ********\_********
**Environment:** ********\_********
**Node Version:** ********\_********
**Database:** ********\_********

**Overall Status:** ⬜ Pass | ⬜ Pass with Issues | ⬜ Fail

**Notes:**

---

---

---
