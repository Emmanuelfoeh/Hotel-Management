// Core application types

export type RoomType =
  | 'SINGLE'
  | 'DOUBLE'
  | 'SUITE'
  | 'DELUXE'
  | 'PRESIDENTIAL';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
export type BookingStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
export type StaffRole = 'MANAGER' | 'RECEPTIONIST' | 'CLEANER';
export type BookingSource = 'ONLINE' | 'MANUAL' | 'PHONE' | 'WALKIN';
export type PaymentMethod = 'CASH' | 'CARD' | 'PAYSTACK' | 'BANK_TRANSFER';
export type EntityType = 'ROOM' | 'BOOKING' | 'CUSTOMER' | 'STAFF';
export type ActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'CHECK_IN'
  | 'CHECK_OUT';
