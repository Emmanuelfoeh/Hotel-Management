# Requirements Document

## Introduction

This document defines the requirements for a Hotel Management System web application built with Next.js and TailwindCSS 4. The system consists of two main sections: a public-facing hotel website where users can browse galleries, view rooms, and make bookings; and an admin dashboard for managing hotel operations including rooms, bookings, customers, staff, and reports. The system aims to streamline hotel operations while providing a modern, responsive user experience with dark mode support.

## Glossary

- **HMS**: Hotel Management System - the complete web application
- **Public Portal**: The customer-facing website section for browsing and booking
- **Admin Dashboard**: The management interface for hotel operations
- **Booking Entity**: A reservation record linking a customer to a room for specific dates
- **Room Entity**: A physical hotel room with type, amenities, and availability status
- **Customer Entity**: A registered user or guest with contact information and booking history
- **Staff Entity**: An employee with assigned role and access permissions
- **Occupancy Rate**: Percentage of rooms occupied during a time period
- **Check-in Process**: The procedure of registering a guest's arrival
- **Check-out Process**: The procedure of processing a guest's departure
- **Payment Status**: The state of payment (paid, pending, refunded)
- **Room Status**: The availability state (available, occupied, maintenance)
- **Paystack**: Payment gateway integration for online transactions

## Requirements

### Requirement 1: Public Portal - Room Browsing

**User Story:** As a potential guest, I want to browse the hotel gallery and available rooms, so that I can decide which room to book.

#### Acceptance Criteria

1. THE HMS SHALL display a gallery section with hotel photos on the public portal
2. THE HMS SHALL display a list of room types with photos, descriptions, prices, capacity, and amenities
3. THE HMS SHALL provide filtering options for room types, price range, and capacity
4. THE HMS SHALL display room availability status for selected date ranges
5. THE HMS SHALL render all public portal pages with responsive design for mobile, tablet, and desktop devices

### Requirement 2: Public Portal - Online Booking

**User Story:** As a potential guest, I want to book a room online through the website, so that I can secure my reservation without calling the hotel.

#### Acceptance Criteria

1. WHEN a user selects a room and date range, THE HMS SHALL display the total price calculation
2. THE HMS SHALL collect customer information including name, email, phone number, and special requests
3. WHEN a user submits a booking request, THE HMS SHALL create a Booking Entity with pending payment status
4. WHERE Paystack integration is enabled, THE HMS SHALL redirect the user to Paystack payment gateway
5. WHEN payment is completed successfully, THE HMS SHALL update the Booking Entity status to paid and send confirmation email to the customer

### Requirement 3: Admin Dashboard - Overview and Analytics

**User Story:** As a hotel manager, I want to view key performance metrics on the dashboard, so that I can monitor hotel operations at a glance.

#### Acceptance Criteria

1. THE HMS SHALL display current occupancy rate calculated from occupied rooms versus total rooms
2. THE HMS SHALL display total bookings count for the current day, week, and month
3. THE HMS SHALL display total revenue for the current day, week, and month
4. THE HMS SHALL display quick stats showing available rooms count, today's check-ins count, and today's check-outs count
5. THE HMS SHALL render charts showing daily and monthly booking trends using visual data representations

### Requirement 4: Admin Dashboard - Room Management

**User Story:** As a hotel manager, I want to manage room inventory and details, so that I can keep room information accurate and up-to-date.

#### Acceptance Criteria

1. THE HMS SHALL provide functionality to create new Room Entity records with type, price, capacity, and amenities
2. THE HMS SHALL provide functionality to edit existing Room Entity records
3. THE HMS SHALL provide functionality to delete Room Entity records that have no active bookings
4. THE HMS SHALL allow uploading multiple photos for each Room Entity
5. THE HMS SHALL allow setting Room Status to available, occupied, or maintenance for each Room Entity

### Requirement 5: Admin Dashboard - Booking Management

**User Story:** As a hotel receptionist, I want to manage bookings and process check-ins and check-outs, so that I can efficiently handle guest arrivals and departures.

#### Acceptance Criteria

1. THE HMS SHALL provide functionality to create manual Booking Entity records with customer details, room selection, and date range
2. THE HMS SHALL display a calendar view showing all Booking Entity records with visual indicators for booking status
3. THE HMS SHALL provide check-in functionality that updates Booking Entity status and Room Status to occupied
4. THE HMS SHALL provide check-out functionality that updates Booking Entity status and Room Status to available
5. THE HMS SHALL display and allow updating Payment Status for each Booking Entity with options for paid, pending, or refunded
6. THE HMS SHALL provide search and filter functionality for Booking Entity records by date, customer name, room number, and status

### Requirement 6: Admin Dashboard - Customer Management

**User Story:** As a hotel receptionist, I want to manage customer profiles and view their booking history, so that I can provide personalized service and track customer relationships.

#### Acceptance Criteria

1. THE HMS SHALL store Customer Entity records with name, email, phone number, and address
2. THE HMS SHALL display booking history for each Customer Entity showing all past and future bookings
3. THE HMS SHALL provide search functionality to find Customer Entity records by name, email, or phone number
4. THE HMS SHALL generate invoices in PDF format for completed bookings linked to Customer Entity records
5. THE HMS SHALL generate receipts in PDF format for payments linked to Customer Entity records

### Requirement 7: Admin Dashboard - Staff Management

**User Story:** As a hotel manager, I want to manage staff members and their roles, so that I can control access and track employee information.

#### Acceptance Criteria

1. THE HMS SHALL provide functionality to create Staff Entity records with name, role, contact information, and credentials
2. THE HMS SHALL support role types including receptionist, cleaner, and manager for Staff Entity records
3. THE HMS SHALL provide functionality to edit Staff Entity records including role changes
4. THE HMS SHALL provide functionality to deactivate Staff Entity records
5. THE HMS SHALL allow adding performance notes and shift information to Staff Entity records

### Requirement 8: Admin Dashboard - Reports and Analytics

**User Story:** As a hotel manager, I want to generate and export reports, so that I can analyze performance and make data-driven decisions.

#### Acceptance Criteria

1. THE HMS SHALL generate daily reports showing occupancy rate, revenue, and booking count for the selected date
2. THE HMS SHALL generate monthly reports showing occupancy rate, revenue, expenses, and booking count for the selected month
3. THE HMS SHALL provide export functionality to download reports in PDF format
4. THE HMS SHALL provide export functionality to download reports in CSV format
5. THE HMS SHALL display visual charts for revenue trends, occupancy trends, and booking trends over time

### Requirement 9: Notifications and Activity Logging

**User Story:** As a hotel manager, I want to receive notifications for important events and view activity logs, so that I can stay informed and maintain audit trails.

#### Acceptance Criteria

1. WHEN a new Booking Entity is created, THE HMS SHALL send an email notification to the customer with booking details
2. WHEN a Booking Entity is cancelled, THE HMS SHALL send an email notification to the customer with cancellation confirmation
3. WHEN a check-in is processed, THE HMS SHALL send an email notification to the customer with welcome message
4. THE HMS SHALL log all create, update, and delete operations on Room Entity, Booking Entity, Customer Entity, and Staff Entity records with timestamp and user information
5. THE HMS SHALL provide an activity log viewer in the admin dashboard with filtering by date, entity type, and user

### Requirement 10: UI/UX and Design System

**User Story:** As a user of the system, I want a modern, consistent, and accessible interface, so that I can efficiently complete tasks with a pleasant experience.

#### Acceptance Criteria

1. THE HMS SHALL implement all UI components using shadcn/ui component library with TailwindCSS 4 styling
2. THE HMS SHALL provide a dark mode toggle that persists user preference across sessions
3. THE HMS SHALL implement smooth page transitions and component animations using Framer Motion
4. THE HMS SHALL render all pages with mobile-first responsive design supporting viewport widths from 320px to 2560px
5. THE HMS SHALL maintain consistent spacing, typography, and color schemes across all pages following a defined design system

### Requirement 11: Authentication and Authorization

**User Story:** As a hotel manager, I want secure access control for the admin dashboard, so that only authorized staff can access management features.

#### Acceptance Criteria

1. THE HMS SHALL require authentication for all admin dashboard routes
2. THE HMS SHALL implement role-based access control where manager role has full access, receptionist role has limited access to bookings and customers, and cleaner role has read-only access to room status
3. WHEN an unauthenticated user attempts to access admin routes, THE HMS SHALL redirect to the login page
4. THE HMS SHALL provide secure login functionality with email and password validation
5. THE HMS SHALL provide logout functionality that clears session data and redirects to the public portal
