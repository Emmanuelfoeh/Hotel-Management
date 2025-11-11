// Application constants

export const APP_NAME = 'Hotel Management System';
export const APP_DESCRIPTION =
  'Modern hotel management system with booking and admin dashboard';

// Authentication
export const AUTH_COOKIE_NAME = 'next-auth.session-token';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Currency
export const DEFAULT_CURRENCY = 'USD';
export const CURRENCY_SYMBOL = '$';

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Booking
export const MIN_BOOKING_DAYS = 1;
export const MAX_BOOKING_DAYS = 30;
export const BOOKING_NUMBER_PREFIX = 'BK';

// Room
export const MAX_ROOM_IMAGES = 10;
export const MAX_ROOM_CAPACITY = 10;
